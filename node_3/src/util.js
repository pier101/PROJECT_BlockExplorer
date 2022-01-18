
// [ 도구적인 기능을 하는 함수를 포함 ]
// ===========================================================================

const fs = require('fs')
const BlockDB = require('../models/blocks')

// 호출용 함수 ) 버전 불러오기
function getCurrentVersion(){
	const package = fs.readFileSync("../package.json");
	//console.log(JSON.parse(package).version);
	return JSON.parse(package).version;
}

// 호출용 함수 ) 현재시간 불러오기
function getCurrentTimestamp(){
	return Math.round(new Date().getTime() / 1000)
    // Math.round() :소수점이하 값 반올림하는 함수
}


// 유틸 함수) 16진수 -> 2진수 변경
function hexToBinary(s){
	const lookupTable = {
		'0': '0000', '1' : '0001', '2': '0010','3': '0011',
		'4': '0100', '5' : '0101', '6': '0110','7': '0111',
		'8': '1000', '9' : '1001', 'a': '1010','b': '1011',
		'c': '1100', 'd' : '1101', 'e': '1110','f': '1111',
	}
	var ret = "";
	for (var i = 0; i < s.length; i++) {
		if (lookupTable[s[i]]) {
			ret += lookupTable[s[i]];
		}
		else {return  null;}
	}
	return ret;
}

function setTime (){
	let time = new Date()
	let hour = time.getHours();
	let minutes = time.getMinutes();

	
	let year = time.getFullYear();
	let month = time.getMonth() + 1;
	let date = time.getDate();
	let currentTime =year + "/" + month + "/" + date + "\n" + hour + ":" + minutes
	return currentTime 
}

function importBlockDB() {
	const {Block,BlockHeader,Blocks} =require('./blockchain')
	BlockDB.findAll({where:{}})
	.then(res=>{
		console.log('저장된 db 불러오기');
		res.map(blocks=>{
			if (blocks.dataValues.index === 0) {
				return true
			} else{
				const {hash,version,index, previousHash, timestamp, merkleRoot,difficulty,nonce,body} = blocks.dataValues;
				const header =  new BlockHeader(version,index, previousHash, timestamp, merkleRoot,difficulty,nonce)
				console.log([body])
				const createdBlock = new Block(hash,header,[body])
				Blocks.push(createdBlock)
			}
		})
	})
}
					
function addGenesisDB(blockhash,version, previousHash,index, timestamp, merkleRoot,difficulty,nonce,rebody,miner) {
	
	BlockDB.findOne({where:{index:0}}).then(isGenesisDB =>{
		if (isGenesisDB) {
			console.log("이미 db에 있음")
		} else{
			console.log("없어서 생성함")
			BlockDB.create({
				hash: blockhash,
				version: version	,
				index: index,
				previousHash: previousHash,
				timestamp: timestamp,
				merkleRoot: merkleRoot,
				difficulty: difficulty,
				nonce:nonce,
				body: rebody,
				miner: miner
			}).then(()=>{
				console.log("블록 db 저장 성공!")
			}).catch(err=>{
				console.log("블록 db 저장 실패",err)
			})
		}
	})
}

function addBlockDB(newBlock) {
	
	const {version, index, previousHash, timestamp, merkleRoot,difficulty,nonce} = newBlock.header
	BlockDB.create({
		hash: newBlock.hash,
		version: version,
		index: index,
		previousHash: previousHash,
		timestamp: timestamp,
		merkleRoot: merkleRoot,
		difficulty: difficulty,
		nonce:nonce,
		body: newBlock.body[0],
		miner: newBlock.miner
	}).then(()=>{
		console.log("블록 db 저장 성공!")
	}).catch(err=>{
		console.log("블록 db 저장 실패",err)
	})
}


function replaceBlockDB(newBlocks) {
	const map = new Map();
	BlockDB.destroy({
		where: {},
		truncate: true
	})
	
	// 이 부분 복습하기 - 배열 내 중복 객체 제거
	for(const block of newBlocks){
		map.set(JSON.stringify(block),block);
	}
	const filterBlock = [...map.values()]

	filterBlock.map((block,j)=>{
		console.log("3001 리플레이스 db",block)
		let {version, index, previousHash, timestamp, merkleRoot,difficulty,nonce} = block.header
			BlockDB.create({
				hash: block.hash,
				version: version,
				index: index,
				previousHash: previousHash,
				timestamp: timestamp,
				merkleRoot: merkleRoot,
				difficulty: difficulty,
				nonce:nonce,
				body: block.body[0],
				miner: block.miner
			})
		})
	}
module.exports = {
	getCurrentVersion,
	getCurrentTimestamp,
	hexToBinary,
	importBlockDB,
	replaceBlockDB,
	addBlockDB,
	addGenesisDB,
	setTime
}