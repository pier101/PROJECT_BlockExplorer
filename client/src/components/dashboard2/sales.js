import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme,Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel, } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export const Sales = (props) => {
  const message = props.resultmsg
  const result = message.msg
  console.log("메세지 결과 ",result)
  return (
    <Card {...props}>
      <CardHeader
        title="채굴 기록"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          {/* <Bar
            data={data}
            options={options}
          /> */}
          <Table>
            <TableHead>
                <TableRow>
                  <TableCell>
                    block_Index
                  </TableCell>
                  <TableCell>
                    type
                  </TableCell>
                  <TableCell>
                    result
                  </TableCell>
                  <TableCell>
                    message
                  </TableCell>
                  <TableCell>
                    time
                  </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {message && message.map(msg=>{
                return(
                <TableRow >
                  <TableCell sx={{color:"#333D4B",fontWeight:600}}>
                    {msg.blockIndex}
                  </TableCell>
                  <TableCell sx={{color:"#333D4B",fontWeight:700}}>
                    {msg.type}
                  </TableCell>
                  <TableCell style={result =="실패"? {color:"red"}:{color:"#28B83E"}} sx={{fontWeight:700}}>
                    {msg.result}
                  </TableCell>
                  <TableCell  sx={{fontWeight:600}}>
                    {msg.msg}
                  </TableCell>
                  <TableCell sx={{color:"#333D4B",fontWeight:600}}>
                    {msg.time}
                  </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
      {/* <Divider />
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
        >
          초단위
        </Button>
      </Box> */}
    </Card>
  );
};
