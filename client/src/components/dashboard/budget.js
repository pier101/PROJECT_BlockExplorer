import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';
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
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            총 블록수
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {allBlocks}블록
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            내가 생성한 블록
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {allBlocks}블록
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <MoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ArrowDownwardIcon color="error" />
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
      </Box>
    </CardContent>
  </Card>
);
        }
  
