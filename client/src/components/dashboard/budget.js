import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import axios from 'axios';
import { useState,useEffect } from 'react';


export const Budget = (props) => {
 
  const [allBlocks,setAllBlocks] = useState(0)

  useEffect(() => {
    const getAllBlocks = async()=>{
        await axios.get('http://localhost:3001/blocks').then(res=>{
            console.log(res.data)  
            console.log(res.data.length)  
            setAllBlocks(res.data.length)
        })
    }

    getAllBlocks()
  }, [props.blocks])
 
  return (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={1}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
            <RequestQuoteIcon sx={{color:"#fff", height: 50,width: 50}}/>
        </Grid>
        <Grid item>
          <Typography
            color="#fff"
            gutterBottom
            variant="h5" 
            fontWeight={500}
          >
            Block
            <span style={{marginLeft:20}}>    {allBlocks}</span>
          <Typography
            color="#fff"
            variant="h5"
          >
          </Typography>
          </Typography>
          <Typography
            color="#fff"
            gutterBottom
            variant="h5"
            fontWeight={500}
          >
            My Blocks
          <span style={{marginLeft:20}}>{allBlocks}</span>
          </Typography>
          <Typography
            color="#fff"
            variant="h5"
          >
          </Typography>
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
      {/* <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ViewColumnIcon color="error" />
        <Typography
          color="error"
          sx={{
            mr: 2
          }}
          variant="body2"
        >
          12%
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
        </Typography>
      </Box> */}
    </CardContent>
  </Card>
);
        }
  
