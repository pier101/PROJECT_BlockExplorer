import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import { LatestOrders } from '../components/dashboard/latest-orders';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { DashboardLayout } from '../components/dashboard-layout';
import {useState} from 'react'
const Dashboard = () => {
  
  
  const [blockLength,setBlockLength] = useState(0)
  const [blockDifficulty,setBlockDifficulty] = useState(0)
  const [block,setBlock] = useState()
  const [miningResult,setMiningResult] = useState([])
  const [timestamp,setTimestamp] = useState([])
  const [timeInterver,setTimeInterver] = useState()
  const [blockInterver,setBlockInterver] = useState()

  
  const handleBlockLength = (data)=>{
    console.log("데이터좀 보자",data)
    console.log(">><<<>><><", data[0][data[0].length-1].header.timestamp)  
    setBlockLength(data[0].length)
    setBlockDifficulty(data[0][data[0].length-1].header.difficulty)
    setBlock(data[0])
    console.log("000000000",...miningResult)
    setMiningResult([data[1],...miningResult])
    setTimeInterver(data[2])
    setBlockInterver(data[3])
    setTimestamp([data[0][data[0].length-1].header.timestamp,...timestamp])
  }

  const startPoint = (data) =>{
    console.log("startstartstart!!!",data)
    setStart(data)
  }

  const finishPoint = (data) =>{
    console.log("finish!!!!!!",data)
    setFinish(data)
  }
  
  return (

     <DashboardLayout >
    <Head>
      <title>
        Dashboard | Material Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
      >
      <Container maxWidth={false} >
        <Grid
          container
          spacing={3}
          
          >
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <TotalProfit style={{backgroundColor:"#7070E3"}} sx={{ height: '95%' }} onStart={startPoint} onFinish={finishPoint} onCreate={handleBlockLength}/>
            {/* onCreate={handleBlockLength} */}
          </Grid>

          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <TasksProgress  sx={{ height: '95%' }} style={{backgroundColor:"#5A78F0"}}/>  
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
            >
            <Budget blocks={blockLength} sx={{ height: '95%' }} style={{backgroundColor:"#25B0E8"}}/>
            {/* blocks={blockLength} */}
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <TotalCustomers sx={{ height: '95%' }} style={{backgroundColor:"#536D8B"}}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
            >
            <Sales resultmsg={miningResult}/>
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
            >
            <TrafficByDevice 
            interver1={timeInterver}
            interver2={blockInterver}
            miningtime={timestamp}
            currentdifficulty={blockDifficulty}
             sx={{ height: '100%' }}/>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
            >
            <LatestOrders blocks={block}/>

          </Grid>
        </Grid>
      </Container>
    </Box>

    </DashboardLayout>
);}


export default Dashboard;
