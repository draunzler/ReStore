import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Product } from '../../models';
import ProductCard from './ProductCard';
import { useStore } from '../../stores/store';
import ProductCardSkeleton from './ProductCardSkeleton';

interface Props {
  products: Product[];
}

function ProductList({ products }: Props) {
  const { catalogStore } = useStore();
  const { loadingInitial } = catalogStore;

  return (
    <Grid container spacing={4}>
      {products.map(product => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          {loadingInitial ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard product={product} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}

export default observer(ProductList);