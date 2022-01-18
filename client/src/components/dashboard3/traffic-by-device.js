import {Box, Grid, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import Loding from '../Loding'

export const TrafficByDevice = (props) => {
  // \const [isLoading,setIsLoading] = useState(false)
  // const [temp,setTemp] = useState(0)
  // const [numarr,setNumArr] = useState([])
  // const [returnTime,setReturnTime] = useState()

  const bits = props.currentdifficulty
  
  const timeInterver = props.interver1
  const blockInterver = props.interver2
  
  const miningTime = props.miningtime
  const prevTime = miningTime[1]
  const nowTime = miningTime[0]
 
  
  // useEffect(async() => {
  //   setTemp(temp+1)
  //   setNumArr([...numarr,nowTime-prevTime,])
  //   console.log("템프템프",temp)
  //   console.log(numarr)
  //   let sum = 0
  //   if (temp==6){
  //     const timearr = numarr[temp-2,temp-1]
  //     console.log("======타임 arr ===========",timearr)
  //     for (let i = 0; i < timearr.length; i++) {
  //       if (timearr[0]) {
  //         sum +=0
  //         continue
  //       }
  //       sum += timearr[i];
  //     }
  //     console.log(sum)
  //     setReturnTime(sum)
  //   }
  // }, [prevTime])


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
            <Box sx={{marginTop:5,color:"#fff",fontSize:22,display: 'flex',justifyContent:'space-around'}}>
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
            </Box>
        </Grid>
        
      </CardContent>
    </Card>
  );
};
