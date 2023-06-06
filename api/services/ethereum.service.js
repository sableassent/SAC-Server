const Env = require("../env.js");

const fs = require("fs");
const dateFormat = require("dateformat");
const utils = require("../utils");
const aes256 = require("aes256");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(Env.ALCHEMY_API_ENDPOINT)
);

exports.getWallet = async function () {
  let wallet = await Wallet.findOne();
  return wallet || null;
};

exports.findAndCountAllTransaction = async function (match) {
  let count = await Transaction.count(match);
  return count;
};

exports.isActivated = async function () {
  return web3.eth.accounts.wallet["0"];
};

exports.activate = async function (obj) {
  if (web3.eth.accounts.wallet["0"]) return;
  if (!obj.secretKey) throw Error();
  let wallet = await Wallet.findOne();
  if (!wallet) throw Error();
  let decryptedPrivateKey = aes256.decrypt(obj.secretKey, wallet.privateKey);
  if (!decryptedPrivateKey) throw Error();
  let account = await web3.eth.accounts.privateKeyToAccount(
    decryptedPrivateKey
  );
  if (!account) throw Error();
  if (account.address.toLowerCase() !== wallet._id.toLowerCase()) throw Error();
  web3.eth.accounts.wallet.add(decryptedPrivateKey);
};

exports.balanceOf = async function (address) {
  if (!address) return 0;
  if (!web3.eth.accounts.wallet["0"]) return 0;
  let token = new web3.eth.Contract(
    JSON.parse(fs.readFileSync("./contracts/SAC1.abi")),
    Env.SAC1_ADDRESS
  );
  token.defaultChain = Env.CHAIN;
  token.defaultHardfork = Env.HARDFORK;
  let balanceSAC = await token.methods.balanceOf(address).call();
  balanceSAC =
    new web3.utils.BN(balanceSAC)
      .div(new web3.utils.BN("10000000000000000"))
      .toNumber() / 100;
  return balanceSAC;
};

exports.updateBalance = async function () {
  try {
    do {
      let wallet = await Wallet.findOne();
      if (!wallet) break;
      try {
        let balanceETH = await web3.eth.getBalance(wallet._id);
        balanceETH = web3.utils.fromWei(balanceETH, "ether");
        wallet.balanceETH = balanceETH;
        let balanceSAC = await module.exports.balanceOf(wallet._id);
        wallet.balanceSAC = balanceSAC;
        await wallet.save();
      } catch (error) {}
    } while (false);
  } catch (error) {
    console.log(error);
  }
  setTimeout(module.exports.updateBalance, 10 * 1000);
};

exports.updateTransactionStatus = async function () {
  try {
    do {
      let transaction = await Transaction.findOne({ status: "Pending" });
      if (!transaction) break;
      try {
        let transactionReceipt = await web3.eth.getTransactionReceipt(
          transaction._id
        );
        if (!transactionReceipt) break;
        let status = transactionReceipt.status ? "Success" : "Failed";
        transaction.status = status;
        await transaction.save();
      } catch (error) {}
    } while (false);
  } catch (error) {}
  setTimeout(module.exports.updateTransactionStatus, 10 * 1000);
};

exports.transferEtherless = async (obj) => {
  let wallet = await Wallet.findOne({});
  if (!wallet) throw Error("This service is unavailable at the moment.");
  if (!web3.eth.accounts.wallet["0"])
    throw Error("This service is unavailable at the moment.");
  if (obj.token.toLowerCase() != Env.SAC1_ADDRESS.toLowerCase())
    throw Error("Token " + obj.token + " not supported.");
  let now = Math.trunc(new Date().getTime() / 1000);
  if (obj.time - 300 > now) throw Error("Time cannot be in the future.");
  if (obj.time + 2 * 24 * 3600 < now) throw Error("Transaction expired.");
  if (!web3.utils.isAddress(obj.sender)) throw Error("Invalid sender address.");
  if (!web3.utils.isAddress(obj.receipient))
    throw Error("Invalid receipient address.");
  let message = "0x";
  message += utils.padByZero(obj.token.substring(2), 40);
  message += utils.padByZero(obj.sender.substring(2), 40);
  message += utils.padByZero(obj.receipient.substring(2), 40);
  message += new web3.utils.BN(obj.amount).toString(16, 64);
  message += new web3.utils.BN(obj.fees).toString(16, 64);
  message += new web3.utils.BN(obj.nonce).toString(16, 8);
  message += new web3.utils.BN(obj.time).toString(16, 64);
  message = web3.utils.keccak256(message);
  let signedBy = await web3.eth.accounts.recover(message, obj.signature);
  if (obj.sender.toLowerCase() != signedBy.toLowerCase())
    throw Error("Incorrect signature.");
  let token = new web3.eth.Contract(
    JSON.parse(fs.readFileSync("./contracts/SAC1.abi")),
    Env.SAC1_ADDRESS
  );
  token.defaultChain = Env.CHAIN;
  token.defaultHardfork = Env.HARDFORK;
  let fees = await module.exports.getTotalFees(obj.amount);
  if (fees != obj.fees) throw Error("Incorrect fees.");
  let nonce = await token.methods.nonces(obj.sender).call();
  nonce = new web3.utils.BN(nonce);
  if (!nonce.eq(new web3.utils.BN(obj.nonce))) throw Error("Incorrect nonce.");
  let requiredBalance = new web3.utils.BN(obj.amount).add(
    new web3.utils.BN(obj.fees)
  );
  let balance = await token.methods.balanceOf(obj.sender).call();
  balance = new web3.utils.BN(balance);
  if (balance.lt(requiredBalance)) throw Error("Insufficient balance.");
  let amountInFloat =
    new web3.utils.BN(obj.amount)
      .div(new web3.utils.BN("10000000000000000"))
      .toNumber() / 100;
  let feesInFloat =
    new web3.utils.BN(obj.fees)
      .div(new web3.utils.BN("10000000000000000"))
      .toNumber() / 100;
  let txHash = await new Promise((resolve, reject) => {
    let resolved = false;
    token.methods
      .transferEtherless(
        obj.sender,
        obj.receipient,
        obj.amount,
        obj.fees,
        obj.nonce,
        obj.time,
        obj.signature
      )
      .send({
        from: web3.eth.accounts.wallet["0"].address,
        gas: 200000,
      })
      .once("transactionHash", (hash) => {
        console.log("Tx Hash: " + hash);
        if (!resolved) {
          resolved = true;
          resolve(hash);
        }
      })
      .once("receipt", async (receipt) => {
        console.log(receipt);
        if (txHash) {
          let status = "Success";
          if (!receipt.status) status = "Failed";
          const transaction = Transaction.findOne({ _id: txHash });
          transaction.status = status;
          await transaction.save();
        }
      })
      .on("error", async (error) => {
        console.log(error);
        if (!resolved) {
          resolved = true;
          if (txHash) {
            const transaction = Transaction.findOne({ _id: txHash });
            transaction.status = "Failed";
            await transaction.save();
          }
          reject(error);
        }
      });
  });
  if (txHash) {
    const transaction = new Transaction({
      _id: txHash,
      from: obj.sender.toLowerCase(),
      to: obj.receipient.toLowerCase(),
      amount: obj.amount,
      amountInFloat: amountInFloat,
      fees: obj.fees,
      feesInFloat: feesInFloat,
      nonce: nonce,
      status: "Pending",
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    await transaction.save();
  }
  return txHash;
};

exports.getTransaction = async (txHash) => {
  let transaction = await Transaction.findOne({ _id: txHash });
  if (!transaction) throw Error("Transaction " + txHash + " not found.");
  delete transaction.updatedAt;
  delete transaction.createdAt;
  return {
    _id: transaction._id,
    from: transaction.from,
    to: transaction.to,
    amount: transaction.amount,
    fees: transaction.fees + "000000000000000000",
    nonce: transaction.nonce,
    status: transaction.status,
  };
};

exports.search = async (obj, page, limit) => {
  let match = module.exports.prepareMatchByFilter(obj);
  page = page > 1 ? page - 1 : 0;
  // let transactions = await Transaction.findAll({ where: match, offset: (page * limit), limit: limit, order: [['createdAt', 'DESC']] });
  let transactions = await Transaction.find(match)
    .skip(page * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  let count = await Transaction.count(match);
  return [transactions, count];
};

exports.downloadAsCsv = async function (obj) {
  let csvData = [
    ["Hash", "From", "To", "Amount", "Fees", "Nonce", "Status", "Date"],
  ];
  let match = module.exports.prepareMatchByFilter(obj);
  let transactions = await Transaction.find(match).sort({ createdAt: -1 });
  if (transactions.length) {
    for (let transaction of transactions) {
      let obj = [
        transaction._id,
        transaction.from,
        transaction.to,
        transaction.amountInFloat + " SAC",
        transaction.fees + " SAC",
        transaction.nonce,
        transaction.status,
        dateFormat(transaction.createdAt, "mmmm-dd-yyyy"),
      ];
      csvData.push(obj);
    }
  }
  return csvData;
};

exports.withdraw = async function (obj) {
  if (!obj.amount) throw Error("Amount is required.");
  if (!web3.eth.accounts.wallet["0"]) throw Error("Wallet not activated.");
  let wallet = await Wallet.findOne({});
  if (!wallet) throw Error("Wallet not found.");
  let token = new web3.eth.Contract(
    JSON.parse(fs.readFileSync("./contracts/SAC1.abi")),
    Env.SAC1_ADDRESS
  );
  token.defaultChain = Env.CHAIN;
  token.defaultHardfork = Env.HARDFORK;
  obj.amount = obj.amount + "000000000000000000";
  let amount = new web3.utils.BN(obj.amount);
  let balance = await token.methods.balanceOf(Env.SAC1_ADDRESS).call();
  balance = new web3.utils.BN(balance);
  if (balance.lt(amount)) throw Error("Insufficient balance.");
  let txHash = await new Promise((resolve, reject) => {
    let resolved = false;
    token.methods
      .withdrawSAC(obj.amount)
      .send({
        from: web3.eth.accounts.wallet["0"].address,
        gas: 200000,
      })
      .once("transactionHash", (hash) => {
        if (!resolved) {
          resolved = true;
          resolve(hash);
        }
      })
      .on("error", (error) => {
        if (!resolved) {
          resolved = true;
          reject(error);
        }
      });
  });
  return txHash;
};

exports.setFees = async function (obj) {
  if (!web3.eth.accounts.wallet["0"]) throw Error("Wallet not activated.");
  let wallet = await Wallet.findOne({ _id: obj.wallet._id });
  if (!wallet) throw Error("Wallet not found.");
  wallet.fixedFees = obj.fixedFees;
  wallet.percentFees = obj.percentFees;
  await wallet.save();
};

exports.getSeparateFees = async function () {
  let wallet = await Wallet.findOne({});
  if (!wallet) throw Error("Wallet not found.");
  return { fixed: wallet.fixedFees, percent: wallet.percentFees };
};

exports.getTotalFees = async function (amount) {
  let fees = await module.exports.getSeparateFees();
  let totalFees = new web3.utils.BN(
    Math.round(fees.fixed * 1000000) + "000000000000"
  );
  totalFees = totalFees.add(
    new web3.utils.BN(amount)
      .mul(new web3.utils.BN(Math.round(fees.percent * 100)))
      .div(new web3.utils.BN(10000))
  );
  return totalFees.toString(10);
};

exports.getNonce = async function (sender) {
  let token = new web3.eth.Contract(
    JSON.parse(fs.readFileSync("./contracts/SAC1.abi")),
    Env.SAC1_ADDRESS
  );
  token.defaultChain = Env.CHAIN;
  token.defaultHardfork = Env.HARDFORK;
  let nonce = await token.methods.nonces(sender).call();
  return nonce;
};

exports.prepareMatchByFilter = function (obj) {
  let match = {};
  if (obj.hasOwnProperty("address") && obj.address) {
    obj.address = obj.address.toLowerCase();
    Object.assign(match, { $or: [{ from: obj.address }, { to: obj.address }] });
  }
  if (obj.hasOwnProperty("amount") && obj.amount) {
    Object.assign(match, { amountInFloat: obj.amount });
  }
  if (obj.hasOwnProperty("status") && obj.status) {
    Object.assign(match, { status: obj.status });
  }
  if (
    obj.hasOwnProperty("fromDate") &&
    obj.fromDate &&
    (!obj.hasOwnProperty("toDate") || !obj.toDate)
  ) {
    Object.assign(match, {
      createdAt: {
        $gte: new Date(obj.fromDate),
      },
    });
  }
  if (
    (!obj.hasOwnProperty("fromDate") || !obj.fromDate) &&
    obj.hasOwnProperty("toDate") &&
    obj.toDate
  ) {
    Object.assign(match, {
      createdAt: {
        $lte: new Date(obj.toDate),
      },
    });
  }
  if (
    obj.hasOwnProperty("fromDate") &&
    obj.fromDate &&
    obj.hasOwnProperty("toDate") &&
    obj.toDate
  ) {
    Object.assign(match, {
      createdAt: {
        $gte: new Date(obj.fromDate),
        $lte: new Date(obj.toDate),
      },
    });
  }
  return match;
};
