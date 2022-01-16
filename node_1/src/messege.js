let today = new Date();
let hour = today.getHours();
let minutes = today.getMinutes();
let seconds = today.getSeconds();

const time = hour + ":" + minutes + ":" + seconds
    // 0
    const miningSuccess ={
        type : "채굴 실행",
        result : "성공",
        msg : "블록이 채굴되었습니다.",
        time : today
    } 
    // 1
    const miningFail = {
        type : "채굴 실행",
        result : "실패",
        msg : "채굴하지 못했습니다.",
        time : today
    }
    // 2
    const vailidationSuccess = {
        type : "유효성 검증",
        result : "성공",
        msg : "블록 검증 통과!",
        time : today
    }
    //---------------------------------
    // 3
    const vailidationFail1 = {
        type : "유효성 검증",
        result : "실패",
        msg : "유효하지 않은 블럭입니다.",
        time : today
    }

    // 4
    const vailidationFail2 = {
        type : "유효성 검증",
        result : "실패",
        msg : "인덱스값이 유효하지 않음.",
        time : today
    }
    
    // 5
    const vailidationFail3 = {
        type : "유효성 검증",
        result : "실패",
        msg : "해시값이 유효하지 않음",
        time : today
    }
    
    // 6
    const vailidationFail4 = {
        type : "유효성 검증",
        result : "실패",
        msg : "머클루트 값이 유효하지 않음",
        time : today
    }

    // 7
    const vailidationFail5 = {
        type : "유효성 검증",
        result : "실패",
        msg : "타임스탬프 값이 유효하지 않음",
        time : today
    }

    // 8
    const vailidationFail6 = {
        type : "유효성 검증",
        result : "실패",
        msg : "해시값과 difficulty값이 매치되지 않음",
        time : today
    }
    //-----------------------
    
    // 9
    const replaceSuccess = {
        type : "체인 교체",
        result : "성공",
        msg : "신뢰도가 높은 블록으로 교체 되었습니다.",
        time : today
    }

    // 10
    const replaceFail = {
        type : "체인 교체",
        result : "실패",
        msg : "교체할 체인이 유효하지 않음",
        time : today
    }

    const resultMsg = [
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
    ]
module.exports = {
    resultMsg
}

