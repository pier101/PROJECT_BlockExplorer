
// [ HTTP server 초기화 , P2P server 초기화 , 지갑 초기화 ]
// (사용자와 노드 간의 통신)
// ===========================================================================

const express = require('express')
const bodyParser =require('body-parser')
const { sequelize } = require('../models');
const cors = require('cors')

const BC = require('./blockchain')
const p2pserver = require('./network')
const {initWallet,getPublicKeyFromWallet,inputPassword,getPasswordFromWallet} = require('./wallet');
const {importBlockDB} = require('./util')
const BlockDB = require('../models/blocks')
const bs58 = require('bs58')
require("dotenv").config({ path: "../.env" });

//env 설정하기 : export HTTP_PORT=3001
//env 설정확인 : env | grep HTTP_PORT
const http_port = 3001;
const p2p_port = 6001;


sequelize.sync({ alter: false })
  .then(() => {
	  console.log('**mariadb 연결 성공**');
  })
  .catch((error) => {
      console.error(error);
})

console.log("외부")
function initHttpServer(httpport){
    
    console.log("내부")
    const app = express()
    app.use(cors())
    app.use(bodyParser.json())
        
    app.get("/peers",(req,res)=>{
        console.log("피어확인 요청")
        res.send(p2pserver.getSockets());
    })

    app.post("/addPeers",(req,res)=>{
        console.log("피어추가")
        console.log(req.body.port)
        const data = req.body.port
        p2pserver.getSockets().push(data)
        p2pserver.connectToPeers([data]);
        res.json({msg: "통신 포트에 추가하였습니다.",port:data})

    })
    app.post("/addPeer",(req,res)=>{
        console.log("피어추가")
        const data = `ws://localhost:${req.body.port}`
        console.log("데이터",data)
        p2pserver.connectToPeers([data]);
        res.json({msg: "통신 포트에 추가하였습니다.",port:data})
    })

    app.get("/blocks",(req,res)=>{ 
        console.log("블록 확인 요청옴")
        BlockDB.findAll({where:{},order: [["index", "DESC"]]}).then(data=>{
            res.send(data)
        })
    })
    app.post("/blocksReset",(req,res)=>{ 
        BC.getBlocks()=[BC.createGenesisBlock()]
    })
    
    // block 채굴(생성)
    app.post('/mineBlock',(req,res)=>{

        console.log("채굴 요청옴")
        const timeInterver = process.env.BLOCK_GENERATION_INTERVAL
        const blockInterver = process.env.DIFFICULTY_ADJUSTMENT_INTERVAL


        const data = [req.body.data] || []
        console.log(data)
        const block = BC.nextBlock(data)
        BC.addBlock(block)
        const miningResult = BC.addBlock(block)
        console.log(miningResult)
        res.send([BC.getBlocks(),miningResult,timeInterver,blockInterver])
        
    })
    
    // 버전 확인
    app.get("/version",(req,res)=>{
        console.log("버전 확인 요청옴")
        res.send(BC.getVersion())
    })

    //마이너 확인
    app.get("/miner",(req,res)=>{
        res.send(getPublicKeyFromWallet().toString())
    })
    //참여노드 확인
    app.get("/chenkOn",(req,res)=>{
            res.send("a")
    })

    // 지갑 생성확인
    app.post('/wallet',(req,res)=>{
        console.log(req.body.pwd)
        const inputKey = inputPassword(req.body.pwd);
        const myPasswordKey = getPasswordFromWallet()
        const myPublicKey = getPublicKeyFromWallet()
        console.log("입력한 비번 변환한거 : ",inputKey)
        if(inputKey == myPasswordKey){
            // const bytes = Buffer.from(myPrivateKey, 'hex')
            // const address = bs58.encode(bytes)
            // console.log(address)
            res.json({result : true ,addr:myPublicKey})
        }else{
            res.json({result:false, msg: "비밀번호가 일치하지 않습니다."})
        }
    })

    app.post('/createWallet',(req,res)=>{
        console.log("여기여기")
        console.log("req.body.pwd",req.body.pwd)
        const pwd = req.body.pwd
        if (initWallet(pwd)=="기존에 지갑이 있습니다.") {
            res.send("기존에 지갑이 있습니다.")
        } else {
            res.send("지갑을 생성하였습니다.")
        }
        initWallet(pwd);
    })
    
    // 작업 종료
    app.post("/stop",(req,res)=>{
        console.log("프로세스 종료 요청옴")
        res.send({"msg":"Stop Server!"})
        process.exit(0)
    })

    app.get('/address',(req,res)=>{
        initWallet()
        const address = getPublicKeyFromWallet().toString()
        if(address != ""){
            res.send({"address" : address });
        }
        else{
            res.send('empty address!');
        }
    })

    // app.post('/createWallet',(req,res)=>{
    //     /*
    //         1. 공개키 있으면 이미 지갑있다고 처리
    //         2. 없으면 initWallet 해서 public,address user db에 추가
    //     */
      
    //     initWallet()

    // })

    app.listen(httpport,()=>{
        console.log("Listenign Http Port : " + httpport)
    })


}

// initWallet();
importBlockDB()

// p2pserver.connectToPeers(["ws://localhost:6002","ws://localhost:6001"]);
initHttpServer(http_port)
p2pserver.initP2PServer(p2p_port)


/*
    <<사용한 커맨드 명령어>>
    node httpserver.js &
    curl -X POST http://localhost:3001/stop
    curl -X POST http://localhost:3001/blocksReset
    curl -X GET http://localhost:3001/blocks | python3 -m json.tool

    curl -H "Content-type:application/json" --data "{\"pwd\" : \"ehddnr\"}" http://localhost:3001/createWallet

    curl -H "Content-type:application/json" --data "{\"data\" : \"Anything1\"}" http://localhost:3001/mineBlock
    curl -H "Content-type:application/json" --data "{\"data\" : [\"ws://localhost:6001\"]}" http://localhost:3001/addPeers
    curl -X GET http://localhost:3001/sockets | python3 -m json.tool | grep socket._url
    curl -H "Content-type:application/json" --data "{\"data\" : 1}" http://localhost:3001/message
    등등..
    initp2pserver() 가져와서 여기서 열기

    sequelize db:migrate
    sequelize db:migrate:undo
*/
