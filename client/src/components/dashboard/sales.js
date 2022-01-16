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
  const message = props.resultMsg
  console.log("들오는 메세지 궁금",message)

  return (
    <Card {...props}>
      <CardHeader
        // action={(
        //   <Button
        //     endIcon={<ArrowDropDownIcon fontSize="small" />}
        //     size="small"
        //   >
        //     Last 7 block
        //   </Button>
        // )}
        title="노드별 채굴속도"
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
                    block
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
                <TableRow>
                  <TableCell>
                    block
                  </TableCell>
                  <TableCell>
                    {msg.type}
                  </TableCell>
                  <TableCell>
                    {msg.result}
                  </TableCell>
                  <TableCell>
                    {msg.msg}
                  </TableCell>
                  <TableCell>
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
