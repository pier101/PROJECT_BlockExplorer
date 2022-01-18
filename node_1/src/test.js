const p2p_port = process.env.P2P_PORT || 6001;
const WebSocket = require("ws");
const {
  checkAddBlock,
  replaceChain,
  getLastBlock,
  getBlocks,
  createHash,
} = require("./chainedBlock");

function initP2PServer() {
  const server = new WebSocket.Server({ port: p2p_port });
  server.on("connection", (ws) => {
    initConnection(ws);
  });
  console.log(p2p_port + "번 포트 대기중...");
}

initP2PServer();

let sockets = [];
function getSockets() {
  return sockets;
}
function initConnection(ws) {
  sockets.push(ws);
  initErrorHandler(ws);
  initMessageHandler(ws);

  write(ws, queryLatesmsg());
}

function write(ws, message) {
  ws.send(JSON.stringify(message));
}

function broadcast(message) {
  sockets.forEach((socket) => {
    write(socket, message);
  });
}

const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
};

function initMessageHandler(ws) {
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case MessageType.QUERY_LATEST:
        write(ws, responseLatestMsg());
        break;
      case MessageType.QUERY_ALL:
        write(ws, responseAllChainMsg());
        break;
        ``;
      case MessageType.RESPONSE_BLOCKCHAIN:
        handleBolckChainResponse(message);
        break;
    }
  });
}

function responseLatestMsg() {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify([getLastBlock()]),
  };
}
function responseAllChainMsg() {
  return {
    type: MessageType.RESPONSE_BLOCKCHAIN,
    data: JSON.stringify(getBlocks()),
  };
}

function handleBolckChainResponse(message) {
  const receiveBlocks = message.data;
  const latestReceiveBlock = receiveBlocks[receiveBlocks.length - 1];
  const latesMyBlock = getLastBlock();

  if (latestReceiveBlock.header.index > latesMyBlock.header.index) {
    console.log(
      "블록의 총갯수\n" +
        `전달받은 블록의 index값 ${latestReceiveBlock.header.index}\n` +
        `현재 보유중인 index값 ${latesMyBlock.header.index}\n`
    );

    if (createHash(latesMyBlock) === latestReceiveBlock.header.previousHash) {
      console.log(
        `내 최신 해시값=남 이전 해시값`
      );

      if (checkAddBlock(latestReceiveBlock)) {
        broadcast(responseLatestMsg());
        console.log("블록 추가\n");
      } else {
        console.log("유효하지 않은 블록입니다.");
      }
    } else if (receiveBlocks.length === 1) {
      console.log(`Peer로부터 연결 필요\n`);
      broadcast(queryAllmsg());
    } else {
      console.log(`Block renewal`);
      replaceChain(receiveBlocks);
    }
  } else {
    console.log("Block initialized...");
  }
}

function queryAllmsg() {
  return {
    type: MessageType.QUERY_ALL,
    data: null,
  };
}
function queryLatesmsg() {
  return {
    type: MessageType.QUERY_LATEST,
    data: null,
  };
}

function initErrorHandler(ws) {
  ws.on("close", () => {
    closeConnection(ws);
  });
  ws.on("error", () => {
    closeConnection(ws);
  });
}
function closeConnection(ws) {
  console.log(`connection close ${ws.url}`);
  sockets.splice(sockets.indexOf(ws), 1);
}

module.exports = {
  initConnection,
  write,
  getSockets,
  broadcast,
  responseLatestMsg,
  sockets,
  queryLatesmsg,
};

/////////////// p2pServer.js //////////////////////////////////


const fs = require("fs");
const merkle = require("merkle");
const cryptojs = require("crypto-js");
const { BlcokChainDB, CoinDB } = require("./models");
const random = require("random");

class Block {
  constructor(header, body) {
    this.header = header;
    this.body = body;
  }
}

class BlockHeader {
  constructor(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce,
    hash
  ) {
    this.version = version;
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.merkleRoot = merkleRoot;
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.hash = hash;
  }
}
function getVersion() {
  const package = fs.readFileSync("package.json");
  return JSON.parse(package).version;
}

function creatGenesisBlock() {
  const version = getVersion();
  const index = 0;
  const previousHash = "0".repeat(64);
  const timestamp = 1231006505;
  const body = [
    "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
  ];
  const hash = findBlock();
  const tree = merkle("sha256").sync(body);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = 3;
  const nonce = 0;
  const header = new BlockHeader(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce,
    hash
  );
  return new Block(header, body);
}
let Blocks = [creatGenesisBlock()];

function getBlocks() {
  return Blocks;
}

function getLastBlock() {
  return Blocks[Blocks.length - 1];
}

function createHash(data) {
  const {
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce,
  } = data.header;
  const blockString =
    version +
    index +
    previousHash +
    timestamp +
    merkleRoot +
    difficulty +
    nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
}

function calculateHash(
  version,
  index,
  previousHash,
  timestamp,
  merkleRoot,
  difficulty,
  nonce
) {
  const blockString =
    version +
    index +
    previousHash +
    timestamp +
    merkleRoot +
    difficulty +
    nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
}

function nextBlock(bodyData) {
  const prevBlock = getLastBlock();
  const hash = findBlock();
  const version = getVersion();
  const index = prevBlock.header.index + 1;
  const previousHash = createHash(prevBlock);
  const timestamp = parseInt(Date.now() / 1000);
  const tree = merkle("sha256").sync(bodyData);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = getDifficulty(getBlocks());

  const header = findBlock(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    hash
  );
  return new Block(header, bodyData);
}

function addBlock(bodyData) {
  const newBlock = nextBlock(bodyData);
  Blocks.push(newBlock);
}

function hexToBinary(s) {
  const lookupTable = {
    0: "0000",
    1: "0001",
    2: "0010",
    3: "0011",
    4: "0100",
    5: "0101",
    6: "0110",
    7: "0111",
    8: "1000",
    9: "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111",
  };

  let ret = "";
  for (let i = 0; i < s.length; i++) {
    if (lookupTable[s[i]]) {
      ret += lookupTable[s[i]];
    } else {
      return null;
    }
  }
  return ret;
}

function hashMatchesDifficulty(hash, difficulty) {
  const hashBinary = hexToBinary(hash.toUpperCase());
  const requirePrefix = "0".repeat(difficulty);
  return hash.startsWith(requirePrefix);
}

function findBlock(
  currentVersion,
  nextIndex,
  previousHash,
  nextTimestamp,
  merkleRoot,
  difficulty
) {
  let nonce = 0;
  while (true) {
    let hash = calculateHash(
      currentVersion,
      nextIndex,
      previousHash,
      nextTimestamp,
      merkleRoot,
      difficulty,
      nonce
    );

    if (hashMatchesDifficulty(hash, difficulty)) {
      return new BlockHeader(
        currentVersion,
        nextIndex,
        previousHash,
        nextTimestamp,
        merkleRoot,
        difficulty,
        nonce,
        hash
      );
    }
    nonce++;
  }
}

const BLOCK_GENERATION_INTERVAL = 10;
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;

function getDifficulty(blocks) {
  const lastBlock = blocks[blocks.length - 1];
  if (
    lastBlock.header.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 &&
    lastBlock.header.index != 0
  ) {
    return getAdjustedDifficulty(lastBlock, blocks);
  }
  return lastBlock.header.difficulty;
}

function getAdjustedDifficulty(lastBlock, blocks) {
  const preAdjustmentBlock =
    blocks[blocks.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
  const timeToken =
    lastBlock.header.timestamp - preAdjustmentBlock.header.timestamp;
  const timeExpected =
    DIFFICULTY_ADJUSTMENT_INTERVAL * BLOCK_GENERATION_INTERVAL;

  if (timeExpected / 2 > timeToken) {
    return preAdjustmentBlock.header.difficulty + 1;
  } else if (timeExpected * 2 < timeToken) {
    if (preAdjustmentBlock.header.difficulty > 0) {
      return preAdjustmentBlock.header.difficulty - 1;
    }
    return preAdjustmentBlock.header.difficulty;
  } else {
    return preAdjustmentBlock.header.difficulty;
  }
}

function getCurrentTimestamp() {
  return Math.round(new Date().getTime() / 1000);
}

function isValidTimestamp(newBlock, prevBlock) {
  if (newBlock.header.timestamp < prevBlock.header.timestamp - 5000) return true;
  if (getCurrentTimestamp() > newBlock.header.timestamp - 5000) return true;

  return false;
}

async function replaceChain(newBlocks) {
  if (isValidChain(newBlocks)) {
    if (
      newBlocks.length > Blocks.length ||
      (newBlocks.length === Blocks.length && random.boolean())
    ) {
      console.log(`블록을 새블록으로 교체.`);
      Blocks = newBlocks;
      const nw = require("./p2pServer");
      nw.broadcast(nw.responseLatestMsg());
      BlcokChainDB.destroy({ where: {}, truncate: true });

      for (let i = 0; i < newBlocks.length; i++) {
        await BlcokChainDB.create({ BlockChain: newBlocks[i] });
      }
    }
  } else {
    console.log("받은 블록에 문제 있음");
  }
}

function isValidChain(newBlocks) {
  console.log(JSON.stringify(newBlocks[0]));
  console.log(JSON.stringify(Blocks[0]));
  if (
    JSON.stringify(
      newBlocks[0].body &&
      newBlocks[0].header.version &&
      newBlocks[0].header.index &&
      newBlocks[0].header.timestamp &&
      newBlocks[0].header.merkleRoot &&
      newBlocks[0].header.previousHash &&
      newBlocks[0].header.hash
    ) !==
    JSON.stringify(
      Blocks[0].body &&
      Blocks[0].header.version &&
      Blocks[0].header.index &&
      Blocks[0].header.timestamp &&
      Blocks[0].header.merkleRoot &&
      Blocks[0].header.previousHash &&
      Blocks[0].header.hash
    )
  ) {
    return false;
  }

  var tempBlocks = [newBlocks[0]];
  const { isValidNewBlock } = require("./blockCheck");

  for (var i = 1; i < newBlocks.length; i++) {
    if (isValidNewBlock(newBlocks[i], tempBlocks[i - 1])) {
      tempBlocks.push(newBlocks[i]);
    } else {
      return false;
    }
  }
  return true;
}

function checkAddBlock(newBlock) {
  const { isValidNewBlock } = require("./blockCheck");
  if (isValidNewBlock(newBlock, getLastBlock())) {
    Blocks.push(newBlock);
    BlcokChainDB.create({
      BlockChain: newBlock,
      Coin: 50,
    });
    CoinDB.create({
      Coin: 50,
    });
    return true;
  }
  return false;
}

function dbBlockCheck(DBBC) {
  let bc = [];
  DBBC.forEach((blocks) => {
    bc.push(blocks.BlockChain);
  });

  if (bc.length === 0) {
    BlcokChainDB.create({ BlockChain: creatGenesisBlock() });
    bc.push(creatGenesisBlock());
  }
  const DBBlock = bc[bc.length - 1];
  const latesMyBlock = getLastBlock();

  if (DBBlock.header.index < latesMyBlock.header.index) {
    console.log(
      "DB 시작전  \n" +
      `DB 블록의 index 값 ${DBBlock.header.index}\n` +
      `현재 보유중인 index값 ${latesMyBlock.header.index}\n`
    );

    if (createHash(DBBlock) === latesMyBlock.header.previousHash) {
      console.log(`DB에 다음 블록 추가`);
      BlcokChainDB.create({
        BlockChain: latesMyBlock,
      }).catch((err) => {
        console.log(err);
        throw err;
      });
    } else {
      console.log(`DB 초기화중`);
      replaceChain(getBlocks());
    }
  } else {
    console.log("DB 초기화 완료");
    Blocks = bc;
  }
}

module.exports = {
  Block,
  checkAddBlock,
  dbBlockCheck,
  replaceChain,
  hashMatchesDifficulty,
  isValidTimestamp,
  getBlocks,
  createHash,
  Blocks,
  getLastBlock,
  nextBlock,
  addBlock,
  getVersion,
  creatGenesisBlock,
};


/////////////////////chainedBlock.js ////////////////////////////////////