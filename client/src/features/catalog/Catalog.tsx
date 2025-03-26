import { useEffect } from "react";
import ProductList from "./ProductList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import LoadingComponent from "../../layout/LoadingComponent";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../components/RadioButtonGroup";
import CheckboxButtons from "../../components/CheckboxButtons";
import AppPagination from "../../components/AppPagination";

function Catalog() {
  const { catalogStore } = useStore();
  const {
    productsArray,
    loadProducts,
    loadFilters,
    filtersLoaded,
    brands,
    types,
    productParams,
    setProductParams,
    pagination
  } = catalogStore;

  useEffect(() => {
    if (!filtersLoaded) loadFilters();
  }, [filtersLoaded, loadFilters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, productParams]);

  if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2, p: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedValue={productParams.orderBy}
            options={[
              { value: "name", label: "Alphabetical" },
              { value: "priceDesc", label: "Price - High to low" },
              { value: "price", label: "Price - Low to high" },
            ]}
            onChange={(e) => setProductParams({ orderBy: e.target.value })}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={brands}
            checked={productParams.brands}
            onChange={(items: string[]) => setProductParams({ brands: items })}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={types}
            checked={productParams.types}
            onChange={(items: string[]) => setProductParams({ types: items })}
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={productsArray} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        {pagination && (
          <AppPagination
            metaData={pagination}
            onPageChange={(page: number) => catalogStore.setPageNumber(page)}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default observer(Catalog);