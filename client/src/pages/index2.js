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
const DashboardCore = () => {
    
    const [blockLength,setBlockLength] = useState(0)
    const [block,setBlock] = useState()
    
    const handleBlockLength = (data)=>{
      setBlockLength(data.length)
      setBlock(data)
    }
    
    return (

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
            <TotalProfit sx={{ height: '100%' }} onCreate={handleBlockLength}/>
            {/* onCreate={handleBlockLength} */}
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <TasksProgress />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
            >
            <Budget blocks={blockLength}/>
            {/* blocks={blockLength} */}
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
            >
            <TotalCustomers/>
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
            >
            <Sales />
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

);}

export default DashboardCore;
