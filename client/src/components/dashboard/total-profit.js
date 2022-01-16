import { Avatar, Card, CardContent, Grid, Typography, Button,Box,TextField } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from 'axios';
import { useState } from 'react';

export const TotalProfit = (props) =>{
  const [transaction,setTransaction] = useState('')
  
  const minning = async()=>{
    
    await axios.post('http://localhost:3001/mineBlock',).then(res=>{
      console.log("받은 데이터",res.data)
      props.onCreate(res.data)
    })
  }

  const handleTransaction = (e) =>{
    console.log(e.target.value)
    setTransaction(e.target.value)   
}
  return (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"

          >
            거래 내용 입력란
          </Typography>
          <Box>
            <TextField id="outlined-basic" variant="outlined" size="small" onChange={handleTransaction}/>
          </Box>
        <Button variant='contained'  style={{backgroundColor:'#00838f'}} onClick={minning}>
        <b style={{fontSize:10}}>
        채굴하기
        </b>
      </Button>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
}