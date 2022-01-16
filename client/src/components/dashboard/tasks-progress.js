import { useState,useEffect } from 'react';
import axios from 'axios'
import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';

export const TasksProgress = (props) => {
const [isWallet,setIsWallet] = useState(false)
  const [address, setAddress] = useState('')
const WalletCheck = async(e)=>{
  e.preventDefault();
    await axios.post('http://localhost:3001/wallet',{data: '953601fb7d65cc1dd3c7904bdb087096cc2ee1b2badefd408812de6224787ca6'}).then(res=>{
        console.log("월렛요청 결과",res.data.result)
        if  (res.data.result){
          setIsWallet(true)
          setAddress(res.data.addr)
        }   
    })
}


  useEffect(() => {
  }, [])
  return (
    <Card
      sx={{ height: '100%' }}
      {...props}
    >
      <CardContent>

        { isWallet ?
          <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
          >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
            >
              지갑주소
            </Typography>
            <Box>
              {address}
            </Box>
          </Grid>
          <Grid item>
            {/* <Avatar
              sx={{
                backgroundColor: 'warning.main',
                height: 56,
                width: 56
              }}
            >
              <InsertChartIcon />
            </Avatar> */}
          </Grid>
        </Grid> :
        <form>
          {/* <input type="text" placeholder='지갑 비밀번호를 입력하세요'/> */}
          <button type="submit" onClick={WalletCheck}>지갑 연결하기</button>
        </form>
        }
        <Box sx={{ pt: 3 }}>
          <LinearProgress
            value={75.5}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
);}
