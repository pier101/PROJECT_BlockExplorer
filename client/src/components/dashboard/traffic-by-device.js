import {Box, Grid, Card, CardContent, CardHeader, Divider, Typography, TextField,Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Loding from '../Loding'
import axios from 'axios';

export const TrafficByDevice = (props) => {
  const [toAddress,setToAddress] = useState('')
  const [toAmount,setToAmount] = useState('')
  const [balance,setBalance] = useState(100)
  const bits = props.currentdifficulty
  
  const timeInterver = props.interver1
  const blockInterver = props.interver2
  
  const miningTime = props.miningtime
  const prevTime = miningTime[1]
  const nowTime = miningTime[0]

  const handleToAddress = (e)=>{
    console.log(e.target.value)
    setToAddress(e.target.value)
  }
  const handleToAmount = (e)=>{
    setToAmount(e.target.value)
  }
  const mineTransaction = async()=>{
    console.log(toAddress)
      await axios.post("http://localhost:3001/mineTransaction",{addr:toAddress,amount:toAmount})
      .then(res=> console.log(res.data))
      .catch(err=>console.error(err))
  }
  const sendToAddress = async()=>{
    console.log(toAddress)
      await axios.post("http://localhost:3001/sendToAddress",{addr:toAddress,amount:toAmount})
      .then(res=> console.log(res.data))
      .catch(err=>console.error(err))
  }
  return (
    <Card {...props} sx={{backgroundColor:"#0B2840"}}>
      <CardHeader title="노드별 채굴양" sx={{color:"#fff"}}/>
      <Divider />
      <CardContent>
        <Grid sx={{display: 'flex',flexFlow:'column',alignItems:'center'}}>
            <Box sx={{color:"#fff",marginTop:4,fontSize:22,display: 'flex',justifyContent:'space-around'}}>
                <Box sx={{marginRight:19}}><b>현재 난이도 </b></Box>
                <Box><b> {bits}</b></Box>
            </Box>
            <Box>
              <Typography
                color="#fff"
                gutterBottom
                variant="h6" 
                fontWeight={600}
              >
                보낼 주소
              </Typography>
              <TextField id="outlined-basic" variant="outlined" size="small" label="보낼 주소 입력" style={{marginTop:3}} onChange={handleToAddress}/>
              <Typography
                color="#fff"
                gutterBottom
                variant="h6" 
                fontWeight={600}
              >
                보낼 금액
              </Typography>
              <TextField id="outlined-basic" variant="outlined" size="small" label="보낼 금액 입력" style={{marginTop:3}} onChange={handleToAmount}/>
              <Button  variant='contained' onClick={mineTransaction} style={{backgroundColor:"#fff",color:"#536D8B",width:20,marginTop:3, padding:5,border:"2px solid white"}}>트랜젝션 채굴</Button>
              <Button  variant='contained' onClick={sendToAddress} style={{backgroundColor:"#fff",color:"#536D8B",width:20,marginTop:3, padding:5,border:"2px solid white"}}>전송하기</Button>

            </Box>
            <Box>
              잔액 : {balance}
            </Box>
            {/* <Box sx={{marginTop:5,color:"#fff",fontSize:22,display: 'flex',justifyContent:'space-around'}}>
              <Box sx={{marginRight:11}}>
                <b>예상 시간</b>
              </Box >
              <Box>
                <b>{timeInterver*blockInterver}</b>
              </Box>
              <Box>
                <span>(sec)</span>
              </Box>
            </Box>
            <Box sx={{marginTop:4,color:"#fff",fontSize:22,display: 'flex',justifyContent:'space-around'}}>
              <Box sx={{marginRight:6}}>
                <b>난이도 변경 주기</b>
              </Box>
              <Box>
                <b>{blockInterver}</b>
              </Box>
              <Box>
                <span>(block)</span>
              </Box>
            </Box>
            <Divider sx={{color:"#fff",marginTop:5}}/>
            <Box sx={{marginTop:10  ,marginBottom:5,color:"#fff",fontSize:22,display: 'flex',justifyContent:'space-around'}}>
              <Box sx={{marginRight:12}}>
                <b>걸린 시간</b>
              </Box>
              <Box>
                <b>{(nowTime-prevTime)}</b>
              </Box>
              <Box>
                <span>(sec) </span>
              </Box>  
            </Box> */}
        </Grid>
        
      </CardContent>
    </Card>
  );
};
