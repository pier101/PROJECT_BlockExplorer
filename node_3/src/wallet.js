//  [ 비밀키와 공개키를 관리. 지갑에서부터 비밀키를 가져오거나 공개키를 생성, ]
//  [ 새로운 비밀키를 생성하거나 있으면 기존 파일에서 읽어오는 기능 ]
// ===========================================================================
const cryptojs = require('crypto-js');
const fs = require('fs');
const ecdsa = require('elliptic')  // 타원 곡선 디지털 서명 알고리즘
const ec = new ecdsa.ec("secp256k1");

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
//비교를 password로 바꿈
// function getPublicKeyFromWallet(){
//     const privateKey = getPrivateKeyFromWallet();
//     return privateKey
// }

// function inputPrivateKey(password){
//     const key = ec.keyFromPrivate(privateKey, "hex");
//     return key.getPublic().encode("hex");
// }
function inputPassword(password){
    console.log("password",password)
    const key = cryptojs.SHA256(password).toString();
    return key
}
// function checkWallet(){
//     fs.readFileSync(privateKeyLocation + "/private_key.txt",'utf-8',(err,data)=>{
//     console.log("지갑 비밀키==",data)
//     })
// }




module.exports = {getPublicKeyFromWallet,initWallet,inputPassword,getPasswordFromWallet}