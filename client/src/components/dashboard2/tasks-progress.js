import { useState,useEffect } from 'react';
import axios from 'axios'
import { Avatar, Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
export const TasksProgress = (props) => {
  const [isWallet,setIsWallet] = useState(false)
  const [address, setAddress] = useState('')
  const [inputWallet, setinputWallet] = useState('')

const WalletCheck = async(e)=>{
  e.preventDefault();
    await axios.post('http://localhost:3002/wallet',{data: inputWallet}).then(res=>{
        console.log("월렛요청 결과",res.data.result)
        if  (res.data.result){
          setIsWallet(true)
          setAddress(res.data.addr)
        }   
    })
}

const handleWallet = (e)=>{
  setinputWallet(e.target.value)
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
          spacing={4}
          sx={{ justifyContent: 'flex-start' }}
          >
          <Grid item>
              <AccountBalanceWalletOutlinedIcon sx={{color:"#fff",height: 50,width: 50}} />
          </Grid>
          <Grid item sx={{width:270}}>
            <Typography
             color="#fff"
             gutterBottom
             variant="h5" 
             fontWeight={500}
            >
              Address
            </Typography>
            <Box sx={{color:"#fff",fontWeight:300,fontSize:13,wordBreak:"break-all"}}>
             {address}
            </Box>
          </Grid>
        </Grid> :
             <Grid
             container
             spacing={1}
             sx={{ justifyContent: 'space-between' }}
             >
          <Grid item>
              <AccountBalanceWalletOutlinedIcon sx={{color:"#fff",height: 50,width: 50}} />
          </Grid>
             <Grid item>
             <Typography
            color="#fff"
            gutterBottom
            variant="h5" 
            fontWeight={500}
          >
            Wallet  
            <Button sx={{color:"#ffff"}}>
            <AddCircleOutlineOutlinedIcon/>
            </Button>
          </Typography>
              <form>
                {/* <input type="text" placeholder='지갑 비밀번호를 입력하세요'/> */}
                <TextField id="outlined-basic" variant="outlined" label="거래 내용 입력란" size="small" style={{width:120}} onChange={handleWallet}/>
                <Button sx={{backgroundColor:"#fff",color:"#5A78F0",marginLeft:1,width:120,height:40,fontSize:15,border:"2px solid white"}} type="submit" onClick={WalletCheck}>connect</Button>
              </form>
        </Grid>
        </Grid>
        }
      </CardContent>
    </Card>
);}
