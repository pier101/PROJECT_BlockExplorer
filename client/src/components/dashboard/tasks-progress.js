import { useState,useEffect } from 'react';
import axios from 'axios'
import { Avatar, Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
export const TasksProgress = (props) => {
  const [isWallet,setIsWallet] = useState(false)
  const [address, setAddress] = useState('')
  const [inputWallet, setinputWallet] = useState('')
  const [inputPwd, setinputPwd] = useState('')
  const [switchInput,setSwitchInput] = useState(false)
  const [balance,setBalance] = useState(100)

const WalletCheck = async(e)=>{
  e.preventDefault();
    await axios.post('http://localhost:3001/wallet',{pwd: inputWallet}).then(res=>{
        console.log("월렛요청 결과",res.data.result)
        if  (res.data.result){
          setIsWallet(true)
          setAddress(res.data.addr)
        }  else{
          alert(res.data.msg)
        }
    })
}
const createWallet = async(e)=>{
  e.preventDefault();
    await axios.post('http://localhost:3001/createWallet',{pwd: inputPwd}).then(res=>{
      console.log("크리에이트 월렛 : ",res.data)
        alert(res.data)
        setSwitchInput(true)
    })
}

const handleWallet = (e)=>{
  setinputWallet(e.target.value)
}
const handlePassword = (e)=>{
  console.log(e.target.value)
  setinputPwd(e.target.value)
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
            sx={{ justifyContent: 'flex-start',paddingBottom:0 }}
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
                marginBottom={0}
              >
                Address
              </Typography>
              <Box sx={{color:"#fff",fontWeight:300,fontSize:12 ,wordBreak:"break-all"}}>
              {address}
              </Box>
              <Box> 보유 금액 : {balance}</Box>
            </Grid>
          </Grid> :
          <Grid
          container
          spacing={1}
          sx={{ justifyContent: 'flex-start' }}
          >
            <Grid item>
                <AccountBalanceWalletOutlinedIcon sx={{color:"#fff",height: 50,width: 50}}/>
            </Grid>
                {switchInput ? 
              <Grid item>
                <Typography
                      color="#fff"
                      gutterBottom
                      variant="h5" 
                      fontWeight={500}
                      sx={{marginLeft:2}}
                >
                  Wallet Connect 
                <form>
                  {/* <input type="text" placeholder='지갑 비밀번호를 입력하세요'/> */}
                  <TextField id="outlined-basic" type={"password"}  variant="outlined" label="거래 내용 입력란" size="small" style={{marginTop:8 ,width:120}} onChange={handleWallet}/>
                  <Button sx={{backgroundColor:"#fff",marginTop:1,color:"#5A78F0",marginLeft:1,width:120,height:40,fontSize:15,border:"2px solid white"}} type="submit" onClick={WalletCheck}>connect</Button>
                </form>
                </Typography>
            </Grid>
                :
                <Grid item>
                <Typography
                color="#fff"
                gutterBottom
                variant="h5" 
                fontWeight={500}
                sx={{marginLeft:2}}
                >
                Create Wallet
                    <form>
                      <TextField id="outlined-basic" type={"password"} variant="outlined" label="거래 내용 입력란" size="small" style={{marginTop:8 ,width:120}} onChange={handlePassword}/>
                      <Button sx={{backgroundColor:"#fff",marginTop:1,color:"#5A78F0",marginLeft:1,width:120,height:40,fontSize:15,border:"2px solid white"}} type="submit" onClick={createWallet} >
                        create 
                        {/* <AddCircleOutlineOutlinedIcon sx={{marginTop:0.5,marginLeft:1}} onClick={createWallet}/> */}
                      </Button>
                    </form>
                  </Typography>
              </Grid>


                  
              }
        </Grid>
        }
      </CardContent>
    </Card>
);}
