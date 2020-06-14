const EthereumService = require('../services/ethereum.service');

exports.isActivated = async function (req, res, next) {
    try {
        let isActivated = await EthereumService.isActivated(req.user);
        return res.status(200).send(isActivated ? true : false);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.activate = async function (req, res, next) {
    try {
        await EthereumService.activate(req.body, req.user);
        return res.status(200).send('Wallet activated successfully.');
    } catch (e) {
        return res.status(500).send('Unable to activate wallet.');
    }
}

exports.transferEtherless = async function (req, res, next) {
    try {
        let txHash = await EthereumService.transferEtherless(req.body);
        return res.status(200).send(txHash);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.search = async function (req, res, next) {
    try {
        let page = parseInt(req.body.page) || 0;
        let limit = parseInt(req.body.limit) || 100;
        let [transactions, totalTransactions] = await EthereumService.search(req.body.filter, page, limit, req.user);
        return res.status(200).json({
            transactions: transactions,
            page: page > 1 ? page : 1,
            totalTransactions: totalTransactions,
            pages: Math.ceil(totalTransactions / limit)
        });
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.downloadAsCsv = async function (req, res, next) {
    try {
        let csvData = await EthereumService.downloadAsCsv(req.body.filter, req.user);
        return res.status(200).json(csvData);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.transferOwnership = async function (req, res, next) {
    try {
        await EthereumService.transferOwnership(req.body, req.user);
        return res.status(200).send('Ownership transfered successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.withdraw = async function (req, res, next) {
    try {
        await EthereumService.withdraw(req.body, req.user);
        return res.status(200).send('Token withdrawn successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.setFees = async function (req, res, next) {
    try {
        await EthereumService.setFees(req.body, req.user);
        return res.status(200).send('Fees sets successfully.');
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

exports.getFees = async function (req, res, next) {
    try {
        let fees = await EthereumService.getFees();
        return res.status(200).send(fees + "");
    } catch (e) {
        return res.status(500).send(e.message);
    }
}