import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard2/budget';
import { LatestOrders } from '../components/dashboard2/latest-orders';
import { Sales } from '../components/dashboard2/sales';
import { TasksProgress } from '../components/dashboard2/tasks-progress';
import { TotalCustomers } from '../components/dashboard2/total-customers';
import { TotalProfit } from '../components/dashboard2/total-profit';
import { TrafficByDevice } from '../components/dashboard2/traffic-by-device';
import { DashboardLayout } from '../components/dashboard-layout';
import {useState} from 'react'

const Node2 = () => {
  
  
  const [blockLength,setBlockLength] = useState(0)
  const [block,setBlock] = useState()
  const [miningResult,setMiningResult] = useState([])
  
  const handleBlockLength = (data)=>{
    setBlockLength(data[0].length)
    setBlock(data[0])
    console.log("000000000",...miningResult)
    setMiningResult([data[1],...miningResult])
  }
  
  
  return (

     <DashboardLayout>
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
      <Container maxWidth={false}>
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
            <TotalProfit style={{backgroundColor:"#7070E3"}} sx={{ height: '85%' }} onCreate={handleBlockLength}/>
            {/* onCreate={handleBlockLength} */}
          </Grid>
          {/* <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
          
            <TotalProfit2 style={{backgroundColor:"#7070E3"}} sx={{ height: '85%' }} onCreate={handleBlockLength}/> */}
            {/* onCreate={handleBlockLength} */}
          {/* </Grid> */}
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <TasksProgress sx={{ height: '85%' }} style={{backgroundColor:"#5A78F0"}}/>  
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
            >
            <Budget blocks={blockLength} sx={{ height: '85%' }} style={{backgroundColor:"#25B0E8"}}/>
            {/* blocks={blockLength} */}
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <TotalCustomers sx={{ height: '85%' }} style={{backgroundColor:"#536D8B"}}/>
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
            >
            <Sales resultMsg={miningResult}/>
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
            >
            <TrafficByDevice sx={{ height: '100%' }} />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
            >
            <LatestOrders blocks={block}/>
            {/* blocks={block} */}
          </Grid>
        </Grid>
      </Container>
    </Box>

    </DashboardLayout>
);}
// Dashboard.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );


export default Node2;