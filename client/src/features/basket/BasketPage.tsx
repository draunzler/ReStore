import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { currencyFormat } from "../../util/util";
import BasketSummary from "./BasketSummary";

function BasketPage() {
  const { basketStore } = useStore();
  const { basket, removeItem, addItem, loading } = basketStore;

  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Grid container alignItems="center">
                    <Grid item sx={{ marginRight: 2 }}>
                      <img 
                        src={item.pictureUrl} 
                        alt={item.name} 
                        style={{ height: 50, marginRight: 20 }} 
                      />
                    </Grid>
                    <Grid item>
                      <Typography 
                        component={Link} 
                        to={`/catalog/${item.productId}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {item.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(item.price)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton 
                    loading={loading} 
                    onClick={() => removeItem(item.productId, 1)} 
                    color='error'
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton 
                    loading={loading} 
                    onClick={() => addItem(item.productId)} 
                    color='primary'
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(item.price * item.quantity)}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton 
                    loading={loading} 
                    onClick={() => removeItem(item.productId, item.quantity)} 
                    color='error'
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to='/checkout'
            variant='contained'
            size='large'
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default observer(BasketPage);