
    // 0
    const miningSuccess = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "채굴 실행",
            result : "성공",
            msg : "블록이 채굴되었습니다.",
            time : time
        } 
    }
    // 1
    const miningFail = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "채굴 실행",
            result : "실패",
            msg : "채굴하지 못했습니다.",
            time : time
        }
    }
    // 2
    const vailidationSuccess = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "유효성 검증",
            result : "성공",
            msg : "블록 검증 통과!",
            time : time
        }
    }
    //---------------------------------
    // 3
    const vailidationFail1 = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "유효성 검증",
            result : "실패",
            msg : "유효하지 않은 블럭입니다.",
            time : time
        }
    }

    // 4
    const vailidationFail2 = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "유효성 검증",
            result : "실패",
            msg : "인덱스값이 유효하지 않음.",
            time : time
    }
    }
    
    // 5
    const vailidationFail3 = (block,time)=>{
        return {
            blockIndex: block.header.index,    
            type : "유효성 검증",
            result : "실패",
            msg : "해시값이 유효하지 않음",
            time : time
    }
    }
    
    // 6
    const vailidationFail4 = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "유효성 검증",
            result : "실패",
            msg : "머클루트 값이 유효하지 않음",
            time : time
    }
    }

    // 7
    const vailidationFail5 = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "유효성 검증",
            result : "실패",
            msg : "타임스탬프 값이 유효하지 않음",
            time : time
        }
    }

    // 8
    const vailidationFail6 = (block,time)=>{
        return {
            blockIndex: block.header.index,
            type : "유효성 검증",
            result : "실패",
            msg : "해시값과 difficulty값이 매치되지 않음",
            time : time
    }
    }
    //----------------------
    
    // 9
    const replaceSuccess = (block,time)=>{
        return {
            blockIndex: block[block.length-1].header.index,
            type : "체인 교체",
            result : "성공",
            msg : "신뢰도가 높은 블록으로 교체 되었습니다.",
            time : time
    }
    }
    // 10
    const replaceFail = (block,time)=>{
        return {
            blockIndex: block[block.length-1].header.index,
            type : "체인 교체",
            result : "실패",
            msg : "교체할 체인이 유효하지 않음",
            time : time
    }
    }

module.exports = {
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
}

