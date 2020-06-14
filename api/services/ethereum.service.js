const fs = require('fs');
const dateFormat = require('dateformat');
const utils = require('../utils');
const aes256 = require('aes256');
const Wallet = require('../models').Wallet;
const Transaction = require('../models').Transaction;
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_ENDPOINT));

exports.findByUserId = async function (userId) {
    let wallet = await Wallet.findOne({
        attributes: [
            '_id', 'userId', 'balanceETH', 'balanceSAC', 'fees'
        ], where: { userId: userId }
    });
    return wallet || null;
}

exports.findAndCountAllTransaction = async function (match) {
    let { count, rows } = await Transaction.findAndCountAll(match);
    return count;
}

exports.isActivated = async function (user) {
    if (!web3.eth.accounts.wallet['0']) return false;
    return true;
}

exports.activate = async function (obj, user) {
    if (web3.eth.accounts.wallet['0']) return;
    if (!obj.secretKey) throw Error();
    let wallet = await Wallet.findOne({ where: { userId: user._id } });
    if (!wallet) throw Error();
    let decryptedPrivateKey = aes256.decrypt(obj.secretKey, wallet.privateKey);
    if (!decryptedPrivateKey) throw Error();
    let account = await web3.eth.accounts.privateKeyToAccount(decryptedPrivateKey);
    if (!account) throw Error();
    if (account.address.toLowerCase() != wallet._id.toLowerCase()) throw Error();
    web3.eth.accounts.wallet.add(decryptedPrivateKey);
}

exports.balanceOf = async function (address) {
    if (!address) return 0;
    if (!web3.eth.accounts.wallet['0']) return 0;
    let token = new web3.eth.Contract(JSON.parse(fs.readFileSync('./contracts/SAC1.abi')), process.env.SAC1_ADDRESS);
    token.defaultChain = process.env.CHAIN;
    token.defaultHardfork = process.env.HARDFORK;
    let balanceSAC = await token.methods.balanceOf(address).call();
    balanceSAC = new web3.utils.BN(balanceSAC).div(new web3.utils.BN('10000000000000000')).toNumber() / 100;
    return balanceSAC;
}

exports.updateBalance = async function () {
    try {
        do {
            let wallet = await Wallet.findOne({});
            if (!wallet) break;
            try {
                let balanceETH = await web3.eth.getBalance(wallet._id);
                balanceETH = web3.utils.fromWei(balanceETH, 'ether');
                await Wallet.update({ balanceETH: balanceETH }, {
                    where: {
                        _id: wallet._id
                    }
                });
                let balanceSAC = await module.exports.balanceOf(wallet._id);
                await Wallet.update({ balanceSAC: balanceSAC }, {
                    where: {
                        _id: wallet._id
                    }
                });
            } catch (error) { }
        } while (false);
    } catch (error) { console.log(error) }
    setTimeout(module.exports.updateBalance, (10 * 1000));
}

exports.updateTransactionStatus = async function () {
    try {
        do {
            let transaction = await Transaction.findOne({ where: { status: 'Pending' } });
            if (!transaction) break;
            try {
                let transactionReceipt = await web3.eth.getTransactionReceipt(transaction._id);
                if (!transactionReceipt) break;
                let status = transactionReceipt.status ? 'Success' : 'Failed';
                await Transaction.update({ status: status }, {
                    where: {
                        _id: transaction._id
                    }
                });
            } catch (error) { }
        } while (false);
    } catch (error) { }
    setTimeout(module.exports.updateTransactionStatus, (10 * 1000));
}

exports.transferEtherless = async (obj, user) => {
    let wallet = await Wallet.findOne({});
    if (!wallet) throw Error('This service is unavailable at the moment.');
    if (!web3.eth.accounts.wallet['0']) throw Error('This service is unavailable at the moment.');
    if (obj.token.toLowerCase() != process.env.SAC1_ADDRESS.toLowerCase()) throw Error('Token ' + obj.token + ' not supported.');
    let now = Math.trunc(new Date().getTime() / 1000);
    if ((obj.time - 300) > now) throw Error('Time cannot be in the future.');
    if ((obj.time + 2 * 24 * 3600) < now) throw Error('Transaction expired.');
    if (!web3.utils.isAddress(obj.sender)) throw Error('Invalid sender address.');
    if (!web3.utils.isAddress(obj.receipient)) throw Error('Invalid receipient address.');
    let message = '0x';
    message += utils.padByZero(obj.token.substring(2), 40);
    message += utils.padByZero(obj.sender.substring(2), 40);
    message += utils.padByZero(obj.receipient.substring(2), 40);
    message += new web3.utils.BN(obj.amount).toString(16, 64);
    message += new web3.utils.BN(obj.fees).toString(16, 64);
    message += new web3.utils.BN(obj.nonce).toString(16, 8);
    message += new web3.utils.BN(obj.time).toString(16, 64);
    message = web3.utils.keccak256(message);
    let signedBy = await web3.eth.accounts.recover(message, obj.signature);
    if (obj.sender.toLowerCase() != signedBy.toLowerCase()) throw Error('Incorrect signature.');
    let token = new web3.eth.Contract(JSON.parse(fs.readFileSync('./contracts/SAC1.abi')), process.env.SAC1_ADDRESS);
    token.defaultChain = process.env.CHAIN;
    token.defaultHardfork = process.env.HARDFORK;
    let fees = wallet.fees || 10;
    let feesBigInt = new web3.utils.BN(fees + '000000000000000000').toString();
    if (!new web3.utils.BN(feesBigInt).eq(new web3.utils.BN(obj.fees))) throw Error('Incorrect fees.');
    let nonce = await token.methods.nonces(obj.sender).call();
    nonce = new web3.utils.BN(nonce);
    if (!nonce.eq(new web3.utils.BN(obj.nonce))) throw Error('Incorrect nonce.');
    let requiredBalance = new web3.utils.BN(obj.amount).add(new web3.utils.BN(obj.fees));
    let balance = await token.methods.balanceOf(obj.sender).call();
    balance = new web3.utils.BN(balance);
    if (balance.lt(requiredBalance)) throw ('Insufficient balance.');
    let amountInFloat = new web3.utils.BN(obj.amount).div(new web3.utils.BN('10000000000000000')).toNumber() / 100;
    let txHash = await new Promise((resolve, reject) => {
        let resolved = false;
        token.methods.transferEtherless(obj.sender, obj.receipient, obj.amount, obj.fees, obj.nonce, obj.time, obj.signature).send({
            from: web3.eth.accounts.wallet['0'].address,
            gas: 200000
        })
            .once('transactionHash', hash => {
                console.log('Tx Hash: ' + hash);
                if (!resolved) {
                    resolved = true;
                    resolve(hash);
                }
            })
            .once('receipt', async receipt => {
                console.log(receipt);
                if (txHash) {
                    let status = 'Success';
                    if (!receipt.status) status = 'Failed';
                    await Transaction.update({ status: status }, {
                        where: {
                            _id: txHash
                        }
                    });
                }
            })
            .on('error', async error => {
                console.log(error);
                if (!resolved) {
                    resolved = true;
                    if (txHash) {
                        await Transaction.update({ status: 'Failed' }, {
                            where: {
                                _id: txHash
                            }
                        });
                    }
                    reject(error);
                }
            });
    });
    if (txHash) {
        await Transaction.create({
            _id: txHash,
            from: obj.sender.toLowerCase(),
            to: obj.receipient.toLowerCase(),
            amount: obj.amount,
            amountInFloat: amountInFloat,
            fees: fees,
            nonce: nonce,
            status: 'Pending',
            updatedAt: new Date(),
            createdAt: new Date()
        });
    }
    return txHash;
}

exports.search = async (obj, page, limit, user) => {
    let match = module.exports.prepareMatchByFilter(obj);
    page = page > 1 ? page - 1 : 0;
    let transactions = await Transaction.findAll({ where: match, offset: (page * limit), limit: limit, order: [['createdAt', 'DESC']] });
    let { count, rows } = await Transaction.findAndCountAll({ where: match });
    return [transactions, count];
}

exports.downloadAsCsv = async function (obj, user) {
    let csvData = [['Hash', 'From', 'To', 'Amount', 'Fees', 'Nonce', 'Status', 'Date']];
    let match = module.exports.prepareMatchByFilter(obj);
    let transactions = await Transaction.findAll({ where: match, order: [['createdAt', 'DESC']] });
    if (transactions.length) {
        for (let transaction of transactions) {
            let obj = [
                transaction._id,
                transaction.from,
                transaction.to,
                transaction.amountInFloat + ' SAC',
                transaction.fees + ' SAC',
                transaction.nonce,
                transaction.status,
                dateFormat(transaction.createdAt, 'mmmm-dd-yyyy')
            ];
            csvData.push(obj)
        }
    }
    return csvData;
}

exports.transferOwnership = async function (obj) {
    if (!obj.address) throw Error('Address is required.');
    if (!web3.eth.accounts.wallet['0']) throw Error('Wallet not activated.');
    obj.address = obj.address.toLowerCase();
    if (!web3.utils.isAddress(obj.address)) throw Error('Invalid owner address.');
    let token = new web3.eth.Contract(JSON.parse(fs.readFileSync('./contracts/SAC1.abi')), process.env.SAC1_ADDRESS);
    token.defaultChain = process.env.CHAIN;
    token.defaultHardfork = process.env.HARDFORK;
    let txHash = await new Promise((resolve, reject) => {
        let resolved = false;
        token.methods.transferOwnership(obj.address).send({
            from: web3.eth.accounts.wallet['0'].address,
            gas: 200000
        })
            .once('transactionHash', hash => {
                if (!resolved) {
                    resolved = true;
                    resolve(hash);
                }
            })
            .on('error', error => {
                if (!resolved) {
                    resolved = true;
                    reject(error);
                }
            });
    });
    return txHash;
}

exports.withdraw = async function (obj, user) {
    if (!obj.amount) throw Error('Amount is required.');
    if (!web3.eth.accounts.wallet['0']) throw Error('Wallet not activated.');
    let wallet = await Wallet.findOne({ where: { userId: user._id } });
    if (!wallet) throw Error('Wallet not found.');
    let token = new web3.eth.Contract(JSON.parse(fs.readFileSync('./contracts/SAC1.abi')), process.env.SAC1_ADDRESS);
    token.defaultChain = process.env.CHAIN;
    token.defaultHardfork = process.env.HARDFORK;
    obj.amount = obj.amount + '000000000000000000';
    let amount = new web3.utils.BN(obj.amount);
    let balance = await token.methods.balanceOf(process.env.SAC1_ADDRESS).call();
    balance = new web3.utils.BN(balance);
    if (balance.lt(amount)) throw Error('Insufficient balance.');
    let txHash = await new Promise((resolve, reject) => {
        let resolved = false;
        token.methods.withdrawSAC(obj.amount).send({
            from: web3.eth.accounts.wallet['0'].address,
            gas: 200000
        })
            .once('transactionHash', hash => {
                if (!resolved) {
                    resolved = true;
                    resolve(hash);
                }
            })
            .on('error', error => {
                if (!resolved) {
                    resolved = true;
                    reject(error);
                }
            });
    });
    return txHash;
}

exports.setFees = async function (obj, user) {
    if (!obj.fees) throw Error('Fees is required.');
    if (!web3.eth.accounts.wallet['0']) throw Error('Wallet not activated.');
    let wallet = await Wallet.findOne({ where: { userId: user._id } });
    if (!wallet) throw Error('Wallet not found.');
    await Wallet.update({ fees: obj.fees }, {
        where: {
            _id: wallet._id
        }
    });
}

exports.getFees = async function () {
    let wallet = await Wallet.findOne({});
    if (!wallet) throw Error('Wallet not found.');
    return wallet.fees || 10;
}

exports.prepareMatchByFilter = function (obj) {
    let match = {};
    if (obj.hasOwnProperty('address') && obj.address) {
        obj.address = obj.address.toLowerCase();
        Object.assign(match, { $or: [{ from: obj.address }, { to: obj.address }] });
    }
    if (obj.hasOwnProperty('amount') && obj.amount) {
        Object.assign(match, { amountInFloat: obj.amount });
    }
    if (obj.hasOwnProperty('status') && obj.status) {
        Object.assign(match, { status: obj.status });
    }
    if ((obj.hasOwnProperty('fromDate') && obj.fromDate && (!obj.hasOwnProperty('toDate') || !obj.toDate))) {
        Object.assign(match, {
            createdAt: {
                $gte: new Date(obj.fromDate)
            }
        });
    }
    if (((!obj.hasOwnProperty('fromDate') || !obj.fromDate) && obj.hasOwnProperty('toDate') && obj.toDate)) {
        Object.assign(match, {
            createdAt: {
                $lte: new Date(obj.toDate)
            }
        });
    }
    if ((obj.hasOwnProperty('fromDate') && obj.fromDate && obj.hasOwnProperty('toDate') && obj.toDate)) {
        Object.assign(match, {
            createdAt: {
                $gte: new Date(obj.fromDate),
                $lte: new Date(obj.toDate)
            }
        });
    }
    return match;
}