
//  [ 블록의 생성, 검증, 합의 알고리즘을 포함 / 프로토콜을 변경하려면 여기서 수정 ]
// ===========================================================================
require("dotenv").config({ path: "../.env" });
const cryptojs = require('crypto-js')
const merkle = require('merkle')
const random = require('random');
const _ = require("lodash");
const {
	getTransactionPool,
    addToTransactionPool,
    updateTransactionPool,
} = require('./transactionPool');
const {
	processTransactions,
	getCoinbaseTransaction,
	isValidAddress,
	getTransactionId
} = require('./transaction');
const {
	getCurrentVersion,
    getCurrentTimestamp,
    // hexToBinary,
	replaceBlockDB,
	addBlockDB,
	addGenesisDB,
	setTime
} = require("./util")
const {getPublicKeyFromWallet,getPrivateKeyFromWallet,createTransaction} = require('./wallet')
const {
	resultMsg,
	miningSuccess,
	miningFail,
	vailidationSuccess,
	vailidationFail1,
	vailidationFail2,
	vailidationFail3,
	vailidationFail4,
	vailidationFail5,
	vailidationFail6,
	replaceSuccess,
	replaceFail

} = require('./messege')




// 현재 개발 편의상 임의값으로 설정해둔 상태
// const BLOCK_GENERATION_INTERVAL = 30 //블록이 생성되는 간격  
// const DIFFICULTY_ADJUSTMENT_INTERVAL = 3 //  난이도가 조정되는 간격

// 블록 구조 설정
class Block{
	constructor(hash, header, body, miner){
		this.hash = hash //직관적으로 보려고 블록해시값도 추가함
		this.header = header
		this.body = body
		this.miner = miner
	}
}

// 블록 헤더 구조 설정
class BlockHeader{
	constructor(version,index, previousHash, timestamp, merkleRoot,difficulty,nonce){
		this.version = version
		this.index = index
		this.previousHash = previousHash
		this.timestamp = timestamp
		this.merkleRoot = merkleRoot
		this.difficulty = difficulty
		this.nonce = nonce
	}
}
const genesisTransaction = {
    'txIns': [{ 'signature': '', 'txOutId': '045b097c35d2b38c3b3bf038c19da260334a1c3303e97ad69a317a198947580485e4f626095b146781b8b9593fb4446f1e5e3b1bcce5a3076302ebe1bea00b85ee', 'txOutIndex': 0 }],
    'txOuts': [{
            'address': '045b097c35d2b38c3b3bf038c19da260334a1c3303e97ad69a317a198947580485e4f626095b146781b8b9593fb4446f1e5e3b1bcce5a3076302ebe1bea00b85ee',
            'amount': 50
        }],
    'id': cryptojs.SHA256(( '045b097c35d2b38c3b3bf038c19da260334a1c3303e97ad69a317a198947580485e4f626095b146781b8b9593fb4446f1e5e3b1bcce5a3076302ebe1bea00b85ee'
							+ 0)
							+( '045b097c35d2b38c3b3bf038c19da260334a1c3303e97ad69a317a198947580485e4f626095b146781b8b9593fb4446f1e5e3b1bcce5a3076302ebe1bea00b85ee' 
							+ 50))
							.toString()
};

// 블럭 생성 함수) 제네시스 블럭 생성
function createGenesisBlock(){  //초기 블록 생성하는 함수
	const version = getCurrentVersion()
	const index = 0
	const previousHash = '0'.repeat(64) // #최초블록은 이전 해쉬 없어서 0으로 64자리 채워넣음
	const timestamp = 1641747654
	const body = [genesisTransaction]
	const tree = merkle('sha256').sync(body)
	const merkleRoot = tree.root() || '0'.repeat(64)
	const difficulty = 0;
	const nonce = 0
	
	const rebody = body[0]
	const header = new BlockHeader(version,index, previousHash, timestamp, merkleRoot,difficulty,nonce)
	const blockhash = calculateHash(version, previousHash,index, timestamp, merkleRoot,difficulty,nonce) 
	const miner = "04325070d786a196503191eb9830cb762631480302045e589fe7ef7a91ef7b7ec27dac123c75f41f4e57f6cf327dd981ff904a5c3322ffb18f964889d020518743"
	
	addGenesisDB(blockhash,version, previousHash,index, timestamp, merkleRoot,difficulty,nonce,rebody,miner)

	return new Block(blockhash,header, body,miner)
}


//블록체인 배열 선언 및 초기 제네시스블록 삽입.
let Blocks = [createGenesisBlock()]


// 호출용 함수) 블록체인 안의 모든 블록 불러오기
function getBlocks(){ 
	return Blocks
}

// 호출용 함수) 마지막 블록 불러오기
function getLastBlock(){
	return Blocks[Blocks.length - 1]
}


// 해시화 함수) 인자를 블록 형태로 받아 해시화 
function createHash(data){
	const {version, index, previousHash, timestamp, merkleRoot,difficulty,nonce} = data.header
	const blockString = version + index + previousHash + timestamp + merkleRoot + difficulty + nonce
	const hash = cryptojs.SHA256(blockString).toString()
	return hash
}

// 해시화 함수) 인자를 블록의 헤더data로 받아 해시화
function calculateHash(version, index, previousHash, timestamp, merkleRoot,difficulty,nonce){
	const blockString = version + index + previousHash + timestamp + merkleRoot + difficulty + nonce
	const hash = cryptojs.SHA256(blockString).toString()
	return hash
}


// 블럭 생성 함수) 새로운 블럭 생성
function nextBlock(bodyData){
	console.log("바디 데이터 : ",bodyData)
	const prevBlock = getLastBlock();
	const version = getCurrentVersion();
	const index = prevBlock.header.index + 1;
	const previousHash = createHash(prevBlock);
	const timestamp = parseInt(Date.now() / 1000);
	const tree = merkle('sha256').sync(bodyData);
	const merkleRoot = tree.root() || '0'.repeat(64);
	const difficulty = getDifficulty(getBlocks());
	let nonce = 0;
	const miner = getPublicKeyFromWallet().toString();
	const header = findBlock(version, index, previousHash, timestamp, merkleRoot,difficulty,nonce) 
	console.log(header)
	const blockhash = calculateHash(version, index, previousHash, timestamp, merkleRoot,difficulty,nonce = header.nonce)
	return new Block(blockhash, header, bodyData,miner)
}

// 블록 생성 함수) 생성한 블록을 체인에 연결시키는 함수
function addBlock(newBlock){
	const p2pserver = require('./network')
	let time = setTime()
	if (isValidNewBlock(newBlock, getLastBlock())) {
		Blocks.push(newBlock);

		console.log("=========== 메 세 지 1 ===============")

		console.log("결과일로 오나..?",p2pserver.broadcastLatest())
		console.log('블록 추가')
		
		addBlockDB(newBlock)
		return miningSuccess(newBlock,time);
	}
	return miningFail(newBlock,time);
}

//=====================유효성 검증 코드들========================

// 검증 함수) 신규 생성 블록 검증
function isValidNewBlock(newBlock, previousBlock){
	
	console.log("신규 블록 인덱스",newBlock.header.index);
	console.log("이전 블록 인덱스",previousBlock.header.index)
	let time = setTime()
		
    if (isValidBlockStructure(newBlock) == false) {
		return vailidationFail1(newBlock,time);
    }
    else if (newBlock.header.index !== previousBlock.header.index + 1) {
		return vailidationFail2(newBlock,time);
    }
    else if (createHash(previousBlock) !== newBlock.header.previousHash){
		return vailidationFail3(newBlock,time);
    }
    else if ((newBlock.body.length === 0 && ('0'.repeat(64) !== newBlock.header.merkleRoot) )
	||( newBlock.body.length !== 0 && (merkle("sha256").sync(newBlock.body).root() !== newBlock.header.merkleRoot))
	) {
		return vailidationFail4(newBlock,time);
    }
    else if (!isValidTimestamp(newBlock, previousBlock)) {
			    return vailidationFail5(newBlock,time);
		}
	else if (!hashMatchesDifficulty(createHash(newBlock), newBlock.header.difficulty)){
		return vailidationFail6(newBlock,time);
	}
	return vailidationSuccess(newBlock,time);
	}
	
	// 검증 함수) 블록 구조 검증
	function isValidBlockStructure(block){

		return typeof(block.header.version) === 'string'
		&& typeof(block.header.index) === 'number'
		&& typeof(block.header.previousHash) === 'string'
		&& typeof(block.header.timestamp) === 'number'
		&& typeof(block.header.merkleRoot) === 'string'
		&& typeof(block.header.difficulty) === 'number'
		&& typeof(block.header.nonce) === 'number'
		&& typeof(block.body) === 'object'
	}
	
	// 검증 함수) 다른 노드의 체인으로 교체시 체인 검증 
	function isValidChain(newBlocks) {	
		if (JSON.stringify(newBlocks[0]) !== JSON.stringify(Blocks[0])){
			console.log('dddd')
			return false;
		}
		
		var tempBlocks = [newBlocks[0]];
		for (var i = 1; i < newBlocks.length; i++) {
			console.log("뉴블록")
			console.log(newBlocks[1])
			console.log(i)
			if (isValidNewBlock(newBlocks[i],tempBlocks[i - 1])){
				tempBlocks.push(newBlocks[i])
			}
			else{
				return false;
			}
		}
		return true
	}
	
	// 검증 함수) 블록 생성 간격 조절(해킹방지) & 블록 검증 시간 카운트다운

	function isValidTimestamp(newBlock,prevBlock){
		return(prevBlock.timestamp - 60 < newBlock.timestamp)
        && newBlock.timestamp - 60 < getCurrentTimestamp();
	}
	
	// 검증 함수) 신규 블록의 해시값과 difficulty값 대입 시 해시 앞자리 일치 여부 검증
	function hashMatchesDifficulty(hash,difficulty){
		console.log("difficulty값", difficulty);
		// const hashBinary = hexToBinary(hash);
		const requirePrefix = '0'.repeat(difficulty);
		
		
		//startsWith : 시작부분이 같으면 true, 다르면 false 반환하는 함수
		return hash.startsWith(requirePrefix);
	}
	
	//========================================================
	
	// 체인 교체 함수
	const replaceChain = (newBlocks) => {
		// const p2pserver = require('./network')
		let time = setTime()
		if (isValidChain(newBlocks)){
			if ((newBlocks.length > Blocks.length) 
			||(newBlocks.length === Blocks.length) && random.boolean()) {
				Blocks = newBlocks;
				console.log("3001 메세지 분기점 - replace chain")
				// p2pserver.broadcastLatest()
				replaceBlockDB(newBlocks)
			}
			return replaceSuccess(newBlocks,time)
		} 
		else {
			return replaceFail(newBlocks,time)
		}
	};
	
	
	function findBlock(version, index, previousHash, timestamp, merkleRoot,difficulty,nonce){
		while(true){
			var hash = calculateHash(version, index, previousHash, timestamp, merkleRoot,difficulty,nonce)
			
			console.log("시도하는 hash : ",hash)
			// 정답일 경우
			if (hashMatchesDifficulty(hash,difficulty)) {
				console.log()
				console.log("매칭된 hash : ",hash)
				console.log("매칭된 nonce : ",nonce)
				console.log()
				
				return new BlockHeader(version, index, previousHash, timestamp, merkleRoot,difficulty,nonce)
			}
			// 정답이 아닐 경우
			nonce++;
		}
	}
	
	function getDifficulty(blocks){
		const lastBlock = blocks[blocks.length - 1];
		if(lastBlock.header.index !== 0 && (lastBlock.header.index % process.env.DIFFICULTY_ADJUSTMENT_INTERVAL === 0)){
			console.log("여기로 들오자")
			return	getAdjustDifficulty(lastBlock,blocks)
		} else{
			return lastBlock.header.difficulty;
		}
	}
	
	// 난이도 조정 함수
	function getAdjustDifficulty(lastBlock,blocks){
		const prevAdjustmentBlock = blocks[blocks.length - process.env.DIFFICULTY_ADJUSTMENT_INTERVAL];
		//실제 걸린 시간
		const elapsedTime = lastBlock.header.timestamp - prevAdjustmentBlock.header.timestamp
		console.log("걸린시간 : ",elapsedTime)
		//기대한시간
		const expectedTime = process.env.BLOCK_GENERATION_INTERVAL	* process.env.DIFFICULTY_ADJUSTMENT_INTERVAL;
		console.log("기대시간 : ",expectedTime)
		if (expectedTime / 2 > elapsedTime) {	
			console.log("난이도 upupup")
			return prevAdjustmentBlock.header.difficulty + 1;
		}
		else if (expectedTime * 2 < elapsedTime){
			console.log("난이도 downdowndown")
			return prevAdjustmentBlock.header.difficulty - 1;
		}
		else{
			return prevAdjustmentBlock.header.difficulty;
		}
	}


const generateNextBlock = () => {
	const coinbaseTx = getCoinbaseTransaction(getPublicKeyFromWallet(), getLastBlock().index + 1);
	console.log("coinbaseTx ======= \n",coinbaseTx)
	const blockData = [coinbaseTx].concat(getTransactionPool());
	console.log("blockData ======= \n",blockData)
	return nextBlock(blockData);
};

let unspentTxOuts = processTransactions(Blocks[0].body, [], 0);
const getUnspentTxOuts = () => _.cloneDeep(unspentTxOuts);

	//===================================
	const sendTransaction = (address, amount) => {
		const tx = createTransaction(address, amount, getPrivateKeyFromWallet(), getUnspentTxOuts(), getTransactionPool());
		console.log("getUnspentTxOuts \n",getUnspentTxOuts());
		addToTransactionPool(tx, getUnspentTxOuts());
		// p2p_1.broadCastTransactionPool();
		return tx;
	};

	
	const generatenextBlockWithTransaction = (receiverAddress, amount) => {
		console.log("어마운트",typeof amount)
		if (!isValidAddress(receiverAddress)) {
			throw Error('invalid address');
		}
		if (typeof amount !== 'number') {
			throw Error('invalid amount');
		}
		// coinbase transaction 생성 (퍼블릭키, 마지막블록의 index + 1)
		const coinbaseTx = getCoinbaseTransaction(getPublicKeyFromWallet(), getLastBlock().index + 1); 
		const tx = createTransaction(receiverAddress, amount, getPrivateKeyFromWallet(), getUnspentTxOuts(), getTransactionPool());
		const blockData = [coinbaseTx, tx];
		return nextBlock(blockData);
	};

	//===================================
	
	module.exports ={
		getBlocks,
		getLastBlock,
		createHash,
		getLastBlock,
		nextBlock,
		addBlock,
		replaceChain,
		hashMatchesDifficulty,
		isValidBlockStructure,
		createGenesisBlock,
		Block,
		BlockHeader,
		Blocks,
		sendTransaction,
		generateNextBlock,
		generatenextBlockWithTransaction
	}