const cryptojs = require('crypto-js')

class TxOut {
    // 코인 내보낼 떄
    constructor(address, amount){
        this.address = address;
        this.amount= amount;
    }
}

class TxIn {
    // 코인 받을 떄
    constructor(txOutId, txOutIndex, signature){
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.signature = signature;
    }
}

class Transaction {
    // TxIn 과 TxOut 들의 내용을 포함
    // TxIn 과 TxOut 으로 hash값 생성 -> id가 된다.
    constructor(id, txIns, txOuts){
        this.id = id;
        this.txIns = txIns; // TxIn : 배열
        this.txOuts = txOuts; // TxOut : 배열
    }
}

const getTransactionId = (transaction)=>{
    /* 
        Transaction.id 를 리턴하는 함수
        Transaction.txIns + Transaction.txOuts의 내용들을 모두 더한 후
        hashing한 값을 리턴한다.
    */
    const txInContent = transaction.txIns
    .map( txIn =>txIn.txOutId + txIn.txOutIndex)
    .reduce((a,b)=>  a+b , '' )
    
    const txOutContent = transaction.txOuts
    .map( txOut =>txOut.address + txOut.amount)
    .reduce((a,b)=>  a+b , '' )

    return cryptojs.SHA256(txInContent + txOutContent).toString();
}

// 위의 map과 reduce를 이해할 수 있는 예제코드를 짜보자.===========

const generateTransaction = ()=>{
    const trans = new Transaction(0,[],[]);
    trans.id =1
    
    for (let i = 0; i < 3; i++) {
        const txIn = new TxIn("Id : ",i+"\n","");
        trans.txIns.push(txIn);
    }
    
    for (let i = 0; i < 3; i++) {
        const txOut = new TxOut("address : ",30+i+'\n');
        trans.txOuts.push(txOut);   
    }

    const transArr = [];
    transArr.push(trans)
    transArr.push(trans)
    return transArr;
}
console.log("generateTransaction ========== \n",generateTransaction())

const newTransactions = generateTransaction()
// const {txInContent, txOutContent} = getTransactionId(newTransactions)
// console.log("transaction ID : ", getTransactionId(newTransactions))
//==============================================================

//
const signTxIn = (transaction, txInIndex, privateKey, aUnspentTxOuts)=>{
    const txIn = transaction.txIns[txInIndex];
    const dataToSign = transaction.id;
    const referencedUnspentTxOut = findUnspentTxOut(txIn.TxOutId,txIn.txOutIndex,aUnspentTxOuts);
    const referencedAddress = referencedUnspentTxOut.address;
    const key = ec.keyFromPrivate(privateKey,'hex');
    const signature = toHexString(key.sign(dataToSign).toDER());
    return signature;
}

// 해보기 (Updating unspent transaction outputs)===========================================

class UnspentTxOut{
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}

/*
    새로운 블록이 업데이트 될 때마다. 새 트랜젝션은 기존의 트랜젝션 output목룍에 영향을 주고
    새로운 output을 발생시킨다.
    => 그래서 새로 생성된 블록으로부터 new unspent transaction outputs를 순회하는 작업 진행
*/
const newUnspentTxOuts = newTransactions
.map(t=>{
    return t.txOuts.map((txOut,index)=> (
        new UnspentTxOut(t.id, index, txOut.address,txOut.amount)
    ))
})
.reduce((a,b)=>a.concat(b),[]);
console.log("newUnspentTxOuts ========== \n",newUnspentTxOuts)
// const updateUnspentTxOuts = (aTransactions, aUnspentTxOuts)=>{

//     const consumedTxOuts = aTransactions
//     .map((t) => t.txIns)
//     .reduce((a, b) => a.concat(b), [])
//     .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));
    
//     const resultingUnspentTxOuts = aUnspentTxOuts
//     .filter(((uTxO) => !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts)))
//     .concat(newUnspentTxOuts);
    
//     return resultingUnspentTxOuts;
// }
// ================================================================================

const validateTransaction = (transaction, aUnspentTxOuts) => {
    /*
        ## 트랜젝션 검증
        validateTransaction
        1. transaction id 검증
        2. transaction inputs 검증
        3. transaction inputs의 총합과 outputs의 총합이 같은지 비교
    */
    if (!isValidTransactionStructure(transaction)) {
        return false;
    }

    // Transaction.id와 hashing한 값 비교
    if (getTransactionId(transaction) !== transaction.id) {
        console.log('invalid tx id: ' + transaction.id);
        return false;
    }

    // Transaction.txIns 검증
    const hasValidTxIns = transaction.txIns
        .map((txIn) => validateTxIn(txIn, transaction, aUnspentTxOuts))
        .reduce((a, b) => a && b, true);
    if (!hasValidTxIns) {
        console.log('some of the txIns are invalid in tx: ' + transaction.id);
        return false;
    }

    // Transacsion 안의 txIns의 합과 txOuts의 합이 같은지 검증 
    const totalTxInValues = transaction.txIns
        .map((txIn) => getTxInAmount(txIn, aUnspentTxOuts))
        .reduce((a, b) => (a + b), 0);
    const totalTxOutValues = transaction.txOuts
        .map((txOut) => txOut.amount)
        .reduce((a, b) => (a + b), 0);
    if (totalTxOutValues !== totalTxInValues) {
        console.log('totalTxOutValues !== totalTxInValues in tx: ' + transaction.id);
        return false;
    }
    return true;
};

const validateBlockTransactions = (aTransactions, aUnspentTxOuts, blockIndex) => {
    /*
        ## 블록 내 트랜젝션 검증
    */

    // 첫 transaction이 coinbase transaction인지 검증
    const coinbaseTx = aTransactions[0];
    if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
        console.log('invalid coinbase transaction: ' + JSON.stringify(coinbaseTx));
        return false;
    }
    // 중복된 txIns가 있는지 검증
    const txIns = _(aTransactions)
        .map((tx) => tx.txIns)
        .flatten()
        .value();
    if (hasDuplicates(txIns)) {
        return false;
    }
    // coinbase를 제외한 나머지 transaction들 검증
    const normalTransactions = aTransactions.slice(1);
    return normalTransactions.map((tx) => validateTransaction(tx, aUnspentTxOuts))
        .reduce((a, b) => (a && b), true);
};

    const hasDuplicates = (txIns) => {
        // _.countBy(collection, [iteratee=_.identity]) : 배열 또는 객체에서 요소의 반복 횟수를 object 형식으로 반환
        const groups = _.countBy(txIns, (txIn) => txIn.txOutId + txIn.txOutIndex);
        return _(groups)
            .map((value, key) => {
            if (value > 1) {
                console.log('duplicate txIn: ' + key);
                return true;
            }
            else {
                return false;
            }
        })
            .includes(true);
    };

    const isValidTransactionStructure = (transaction) => {
        if (typeof transaction.id !== 'string') {
            console.log('transactionId missing');
            return false;
        }
        if (!(transaction.txIns instanceof Array)) {
            console.log('invalid txIns type in transaction');
            return false;
        }
        if (!transaction.txIns
            .map(isValidTxInStructure)
            .reduce((a, b) => (a && b), true)) {
            return false;
        }
        if (!(transaction.txOuts instanceof Array)) {
            console.log('invalid txIns type in transaction');
            return false;
        }
        if (!transaction.txOuts
            .map(isValidTxOutStructure)
            .reduce((a, b) => (a && b), true)) {
            return false;
        }
        return true;
    };