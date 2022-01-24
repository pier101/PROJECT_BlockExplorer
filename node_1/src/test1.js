const cryptojs = require('crypto-js')
const _ = require('lodash')
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

const generateTransaction = ()=>{
    const trans = new Transaction(0,[],[]);
    trans.id =1
    
    for (let i = 0; i < 3; i++) {
        const txIn = new TxIn("Id : ",i+1,"");
        trans.txIns.push(txIn);
    }
    
    for (let i = 0; i < 3; i++) {
        const txOut = new TxOut("address : ",30+i);
        trans.txOuts.push(txOut);   
    }

    // const transArr = [];
    // transArr.push(trans)
    // transArr.push(trans)
    return trans;
}

const hasDuplicates = (txIns) => {
    console.log("txIns",txIns)
    // _.countBy(collection, [iteratee=_.identity]) : 배열 또는 객체에서 요소의 반복 횟수를 object 형식으로 반환
    const groups = _.countBy(txIns, (txIn) => txIn.txOutId + txIn.txOutIndex);
    console.log("groups",groups)
    return _(groups)
        .map((value, key) => {
            console.log(value)
            console.log(key)
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

console.log(hasDuplicates(generateTransaction().txIns));