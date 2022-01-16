
// [ HTTP server 초기화 , P2P server 초기화 , 지갑 초기화 ]
// (사용자와 노드 간의 통신)
// ===========================================================================

const express = require('express')
const bodyParser =require('body-parser')
const { sequelize } = require('../models');

const BC = require('./blockchain')
const p2pserver = require('./network')
const {initWallet,getPublicKeyFromWallet} = require('./wallet');
const {importBlockDB} = require('./util')

const { version } = require('elliptic');

//env 설정하기 : export HTTP_PORT=3001
//env 설정확인 : env | grep HTTP_PORT
const http_port = 4000;
const p2p_port = 6000;




console.log("외부")
function initHttpServer(httpport){
    
    console.log("내부")
    const app = express()
    app.use(bodyParser.json())
        
    app.get("/peers",(req,res)=>{
        console.log("피어확인 요청")
        res.send(p2pserver.getSockets().map(s=> s._socket.remoteAddress + ':' + s._socket.remotePort));
    })

    app.post("/addPeers",(req,res)=>{
        console.log("피어추가")
        console.log(req.body.url)
        const data = req.body.url
        p2pserver.connectToPeers(data);
        p2pserver.getSockets().push(data)
        p2pserver.connectToPeers([data]);
        res.json({msg: "통신 포트에 추가하였습니다.",port:data})
    })
    

    app.listen(httpport,()=>{
        console.log("Listenign Http Port : " + httpport)
    })


}

initWallet();
importBlockDB()

initHttpServer(http_port)
p2pserver.initP2PServer(p2p_port)


/*
    <<사용한 커맨드 명령어>>
    node httpserver.js &
    curl -X POST http://localhost:3001/stop
    curl -X GET http://localhost:3001/blocks | python3 -m json.tool
    curl -H "Content-type:application/json" --data "{\"data\" : \"Anything1\"}" http://localhost:3001/mineBlock
    curl -H "Content-type:application/json" --data "{\"data\" : [\"ws://localhost:6001\"]}" http://localhost:3001/addPeers
    curl -X GET http://localhost:3001/sockets | python3 -m json.tool | grep socket._url
    curl -H "Content-type:application/json" --data "{\"data\" : 1}" http://localhost:3001/message
    등등..
    initp2pserver() 가져와서 여기서 열기

    sequelize db:migrate
    sequelize db:migrate:undo
*/
