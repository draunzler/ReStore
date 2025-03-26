import { debounce, TextField } from "@mui/material";
import { useState } from "react";
import { useStore } from "../../stores/store";

export default function ProductSearch() {
  const { catalogStore } = useStore();
  const { setProductParams, productParams } = catalogStore;
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm || '');

  const debouncedSearch = debounce((event: any) => {
    setProductParams({ searchTerm: event.target.value });
  }, 1000);

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(event: any) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event);
      }}
    />
  );
}