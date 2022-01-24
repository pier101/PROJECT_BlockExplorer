//  [ 비밀키와 공개키를 관리. 지갑에서부터 비밀키를 가져오거나 공개키를 생성, ]
//  [ 새로운 비밀키를 생성하거나 있으면 기존 파일에서 읽어오는 기능 ]
// ===========================================================================
const cryptojs = require('crypto-js');
const fs = require('fs');
const ecdsa = require('elliptic')  // 타원 곡선 디지털 서명 알고리즘
const _ = require("lodash");
const ec = new ecdsa.ec("secp256k1");
const {getPublicKey,TxIn,getTransactionId,Transaction,signTxIn,TxOut} = require('./transaction')

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key.txt";

function initWallet(pwd){
   console.log(pwd)
    if(fs.existsSync(privateKeyFile)){
        console.log("기존 지갑 private key 경로 : " + privateKeyFile);
        const walletMsg= "기존에 지갑이 있습니다."
        return walletMsg;
    }
    
    if (!fs.existsSync("wallet/")) {
        fs.mkdirSync("wallet/")
    }
    if (!fs.existsSync(privateKeyLocation)) {   
        fs.mkdirSync(privateKeyLocation)
    }

    const newPrivateKey = generatePrivateKey(pwd);
    console.log("stringify 안한 것 : ",newPrivateKey)
    console.log("stringify 한거 : ",JSON.stringify(newPrivateKey))
    fs.writeFileSync(privateKeyFile, JSON.stringify(newPrivateKey));
    console.log("새로운 지갑 생성 private key 경로 : " + privateKeyFile)
    const walletMsg1= "새로운 지갑을 생성하였습니다."
    return walletMsg1
}

function generatePrivateKey(pwd){
    console.log("pwd",pwd)
    const password = cryptojs.SHA256(pwd).toString();
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return {
        privateKey :privateKey.toString(16),
        password : password
    }
}

function getPrivateKeyFromWallet(){
    const buffer = fs.readFileSync(privateKeyFile, "utf8");
    return buffer.toString()
}

function getPublicKeyFromWallet(){
    const privateKey = getPrivateKeyFromWallet();
    const key = ec.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex");
}

function getPasswordFromWallet(){
    const buffer = fs.readFileSync(privateKeyFile, "utf8");
    console.log("파일 읽어온 결과", buffer)
    const jsonBuffer = buffer.toString()
     const data = JSON.parse(jsonBuffer)
     console.log("그거를 파싱한거 :",data)
    return data.password
}

function inputPassword(password){
    console.log("password",password)
    const key = cryptojs.SHA256(password).toString();
    return key
}
//================================================

// 엔드유저 : 거래하련느 사람
const getBalance = (address, unspentTxOuts) => {
    return _(findUnspentTxOuts(address, unspentTxOuts))
        .map((uTxO) => uTxO.amount)
        .sum();
};


const findUnspentTxOuts = (ownerAddress, unspentTxOuts) => {
    return _.filter(unspentTxOuts, (uTxO) => uTxO.address === ownerAddress);
};


const findTxOutsForAmount = (amount, myUnspentTxOuts) => {
    /*

    */
   console.log(amount);
   console.log(myUnspentTxOuts);

    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount; //자기 자신한테 back할 금액
            return { includedUnspentTxOuts, leftOverAmount };
        }
    }
    const eMsg = 'Cannot create transaction from the available unspent transaction outputs.' +
        ' Required amount:' + amount + '. Available unspentTxOuts:' + JSON.stringify(myUnspentTxOuts);
    throw Error(eMsg);
};


const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount) => {
    const txOut1 = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    }
    else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};


const filterTxPoolTxs = (unspentTxOuts, transactionPool) => {
    console.log("unspentTxOuts========= \n",unspentTxOuts);
    console.log("transactionPool========= \n",transactionPool);
    console.log("transactionPool========= \n",transactionPool[0].id);
    console.log("transactionPool========= \n",transactionPool[0].txIns);
    console.log("****************")

    const txIns = _(transactionPool)
        .map((tx) => tx.txIns)
        .flatten()
        .value();
    const removable = [];
    for (const unspentTxOut of unspentTxOuts) {
        const txIn = _.find(txIns, (aTxIn) => {
            return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
        });
        if (txIn === undefined) {
        }
        else {
            removable.push(unspentTxOut);
        }
    }
    return _.without(unspentTxOuts, ...removable);
};


const createTransaction = (receiverAddress, amount, privateKey, unspentTxOuts, txPool) => {
    console.log('txPool: %s', JSON.stringify(txPool));
    const myAddress = getPublicKeyFromWallet();
    
    console.log("unspentTxOuts : =============",unspentTxOuts)
    
    // 전체 uxto 중 내 UXTO 찾기(내 지갑의 보유 잔액)
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO) => uTxO.address === myAddress);
    console.log("myUnspentTxOutsA",myUnspentTxOutsA)


    const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);
    console.log("====myUnspentTxOuts==== \n",myUnspentTxOuts)
    // filter from unspentOutputs such inputs that are referenced in pool
    const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(amount, myUnspentTxOuts);
    

    const toUnsignedTxIn = (unspentTxOut) => {
        const txIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };
    const unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);

    //트랜젝션 생성한다.
    const tx = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);
    tx.txIns = tx.txIns.map((txIn, index) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });
    return tx;
};

module.exports = {getPublicKeyFromWallet,initWallet,inputPassword,getPasswordFromWallet,
    getPrivateKeyFromWallet,
    createTransaction
}