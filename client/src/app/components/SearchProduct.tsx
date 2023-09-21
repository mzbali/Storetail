import { Paper, TextField, debounce } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { setProductParams } from "../../features/catalog/catalogSlice";

const SearchProduct: React.FC = () => {
  const { productParams } = useAppSelector((state) => state.catalog);
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
  const dispatch = useAppDispatch();

  const debounceSearch = debounce((event) => {
    dispatch(setProductParams({ searchTerm: event.target.value }));
  }, 1000);

  return (
    <TextField
      id="search-product"
      label="Search Products"
      variant="outlined"
      fullWidth
      onChange={(event) => {
        setSearchTerm(event.target.value);
        debounceSearch(event);
      }}
      value={searchTerm || ""}
    />
  );
};

export default SearchProduct;
