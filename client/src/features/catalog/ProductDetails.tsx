// src/features/catalog/ProductDetails.tsx
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import NotFound from "../../errors/NotFound";
import LoadingComponent from "../../layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../util/util";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { catalogStore, basketStore } = useStore();
  const { loadProduct, selectedProduct, clearSelectedProduct, loadingInitial } = catalogStore;
  const { addItem, loading } = basketStore;
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) loadProduct(parseInt(id));

    return () => clearSelectedProduct();
  }, [id, loadProduct, clearSelectedProduct]);

  if (loadingInitial) return <LoadingComponent message="Loading product..." />;
  if (!selectedProduct) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={selectedProduct.pictureUrl} alt={selectedProduct.name} style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{selectedProduct.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">{currencyFormat(selectedProduct.price)}</Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{selectedProduct.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{selectedProduct.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{selectedProduct.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{selectedProduct.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>In Stock</TableCell>
                <TableCell>{selectedProduct.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              sx={{ height: '55px' }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              loading={loading}
              onClick={() => addItem(selectedProduct.id, quantity)}
              disabled={quantity < 1 || quantity > selectedProduct.quantityInStock}
            >
              {quantity > selectedProduct.quantityInStock 
                ? 'Not enough in stock' 
                : 'Add to Cart'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default observer(ProductDetails);