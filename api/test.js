const Web3 = require('web3');
const axios = require('axios');

doTestTransfer();

function padByZero(value, finalLength) {
    while (value.length < finalLength) {
        value = "0" + value;
    }
    return value;
}

async function doTestTransfer() {
    try {
        let web3 = new Web3();
        let obj = {};
        obj.token = '0xab6bb09183f247b2f16fda5817bec80c3b849114';
        obj.sender = '0x5dd05f37028dfe1e3e0b9f6497d78eca184ea0fa';
        obj.receipient = '0xd5Cf09f65A7ebeF8E7140f5a2F32967db38DB3e5'.toLowerCase();
        obj.amount = '10000000000000000000000';
        let feesResponse = await axios.get('https://relayapi.sablecoin.co/fees?amount=' + obj.amount);
        obj.fees = feesResponse.data.value;
        let nonceResponse = await axios.get('https://relayapi.sablecoin.co/nonce?sender=' + obj.sender);
        obj.nonce = nonceResponse.data.value;
        obj.time = Math.trunc(new Date().getTime() / 1000);
        let message = '0x';
        message += padByZero(obj.token.substring(2), 40);
        message += padByZero(obj.sender.substring(2), 40);
        message += padByZero(obj.receipient.substring(2), 40);
        message += new web3.utils.BN(obj.amount).toString(16, 64);
        message += new web3.utils.BN(obj.fees).toString(16, 64);
        message += new web3.utils.BN(obj.nonce).toString(16, 8);
        message += new web3.utils.BN(obj.time).toString(16, 64);
        message = web3.utils.keccak256(message);
        let privateKey = '0x6ce5bb8f0e298e3a5f24207df526d03b979f31f0430ea1d5973072b4647bd2b5';
        let signature = web3.eth.accounts.sign(message, privateKey);
        obj.signature = signature.signature;
        console.log('Request:');
        console.log(obj);
        console.log('');
        let response = await axios.post('https://relayapi.sablecoin.co/transferEtherless', obj);
        let txHash = response.data;
        console.log('Response:');
        console.log(txHash);
    } catch (e) {
        console.log('Response:');
        console.log((e.response && e.response.data) ? e.response.data : e);
    }
}
