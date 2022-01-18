import { useState,useEffect } from 'react';
import axios from 'axios'
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  Avartar,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from '../severity-pill';


export const LatestOrders = (props) => {
  
  const [blockInfo,setBlockInfo] = useState("")
  const [node_1,setNode_1] = useState("")
  const [node_2,setNode_2] = useState("")
  const [node_3,setNode_3] = useState("")

  const getBlockInfo = async()=>{
      await axios.get('http://localhost:3001/blocks').then(res=>{
          console.log("마이너 : ", res.data.miner)  
          setBlockInfo(res.data)
      }).catch(()=>{console.log(" 서버가 열려있지 않습니다.")})
  }

  useEffect(() => {
    const getBlockInfo = async()=>{
        await axios.get('http://localhost:3001/blocks').then(res=>{
            console.log("마이너 : ", res.data.miner)  
            setBlockInfo(res.data)
        }).catch(()=>{console.log(" 서버가 열려있지 않습니다.")})
    }

    getBlockInfo()
  }, [props.blocks])

  useEffect(() => {
    const nodeCheck = async()=>{
          await axios.get('http://localhost:3001/miner').then(res=>{
          console.log(res.data)  
              setNode_1(res.data)
          }).catch(()=>{console.log(" 서버가 열려있지 않습니다.")})
          await axios.get('http://localhost:3002/miner').then(res=>{
              console.log(res.data)  
              setNode_2(res.data)
          }).catch(()=>console.log("요청하는 서버가 열려있지 않습니다."))
          await axios.get('http://localhost:3003/miner').then(res=>{
              console.log(res.data)  
              setNode_3(res.data)
          }).catch(()=>console.log("요청하는 서버가 열려있지 않습니다."))
    }
    nodeCheck()
  }, [])

  return (
    <Card {...props}>
      <Grid sx={{display:"flex"}}>
          <CardHeader title="실시간 블록현황" style={{color:"#333D4B"}}/>
          <Button type='submit' onClick={getBlockInfo} sx={{margin:0,padding:0}}>
            <ReplayIcon sx={{width:35,color:"#333D4B"}}/>
          </Button>

      </Grid>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Hash
                </TableCell>
                <TableCell>
                  Difficulty
                </TableCell>
                <TableCell>
                  Timestamp
                </TableCell>
                <TableCell>
                  Node
                </TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip
                    enterDelay={300}
                    title="Sort"
                  >
                    <TableSortLabel
                      active
                      direction="desc"
                    >
                      MerkleRoot
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  Size
                </TableCell>
                <TableCell>
                  Nonce
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blockInfo && blockInfo.map((block) => (
                <TableRow
                  hover
                  key={block.index}
                >
                  <TableCell style={{fontSize:13}}>
                    {block.hash}
                  </TableCell>
                  <TableCell>
                    {block.difficulty}
                  </TableCell>
                  <TableCell style={{fontSize:13}}>
                    {format(block.timestamp, 'dd/MM/yyyy')}
                    {/* {new Date(block.header.timestamp).getTime()} */}
                  </TableCell>
                  <TableCell>
                    <SeverityPill
                      color={(block.miner == node_1 && 'primary')
                      || (block.miner == node_2 && 'secondary')
                      || (block.miner  == node_3 && 'warning')
                      || 'warning'}
                    >
              
                      {(block.miner == node_1 && 'NODE1')|| (block.miner == node_2 && 'NODE2') || (block.miner  == node_3 && 'NODE3')}
                    </SeverityPill>
                  </TableCell>
                  <TableCell style={{fontSize:13}}>
                    {block.merkleRoot}
                  </TableCell>
                  <TableCell>
                    {/* {block.header.size} */}
                  </TableCell>
                  <TableCell>
                    {block.nonce}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          variant="text"
        >
          내림차순
        </Button>
      </Box>
    </Card>
);
}