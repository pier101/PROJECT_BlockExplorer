import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from '../severity-pill';

const orders = [
  {
    id: uuid(),
    hash: '00000007d7as8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    amount: 30.5,
    customer: {
      difficulty: '1'
    },
    createdAt: 1555016400000,
    status: 'Node3',
    merkleroot: 'ge8423d7d7as8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    size: '0.13 bytes',
    nonce: '518,483'
  },
  {
    id: uuid(),
    hash: '0000000532ds8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    amount: 25.1,
    customer: {
      difficulty: '1'
    },
    createdAt: 1555016400000,
    status: 'NODE1',
    merkleroot: 'ge8423d7d7as8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    size: '0.13 bytes',
    nonce: '518,483'
  },
  {
    id: uuid(),
    hash: '000000052fd8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    amount: 10.99,
    customer: {
      difficulty: '1'
    },
    createdAt: 1554930000000,
    status: 'NODE2',
    merkleroot: 'ge8423d7d7as8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    size: '0.13 bytes',
    nonce: '518,483'
  },
  {
    id: uuid(),
    hash: '000000053dfs8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    amount: 96.43,
    customer: {
      difficulty: '0'
    },
    createdAt: 1554757200000,
    status: 'Node3',
    merkleroot: 'ge8423d7d7as8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    size: '0.13 bytes',
    nonce: '518,483'
  },
  {
    id: uuid(),
    hash: '0000000643fs8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    amount: 32.54,
    customer: {
      difficulty: '0'
    },
    createdAt: 1554670800000,
    status: 'NODE1',
    merkleroot: 'ge8423d7d7as8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    size: '0.13 bytes',
    nonce: '518,483'
  },
  {
    id: uuid(),
    hash: '000000023fds8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    amount: 16.76,
    customer: {
      difficulty: '0'
    },
    createdAt: 2554670800000,
    status: 'NODE1',
    merkleroot: 'ge8423d7d7as8ef4s5d6f4sa8eaf4a6s4fe8e5dsadf',
    size: '0.13 bytes',
    nonce: '518,483'
  }
];

export const LatestOrders = (props) => (
  <Card {...props}>
    <CardHeader title="실시간 블록현황" />
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
            {orders.map((order) => (
              <TableRow
                hover
                key={order.id}
              >
                <TableCell>
                  {order.hash}
                </TableCell>
                <TableCell>
                  {order.customer.difficulty}
                </TableCell>
                <TableCell>
                  {format(order.createdAt, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <SeverityPill
                    color={(order.status === 'NODE1' && 'success')
                    || (order.status === 'NODE2' && 'error')
                    || 'warning'}
                  >
                    {order.status}
                  </SeverityPill>
                </TableCell>
                <TableCell>
                  {order.merkleroot}
                </TableCell>
                <TableCell>
                  {order.size}
                </TableCell>
                <TableCell>
                  {order.nonce}
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
