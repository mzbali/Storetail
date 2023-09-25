import { Box, Typography, Pagination } from "@mui/material";
import React from "react";
import { MetaData } from "../models/pagination";

interface AppPaginationProps {
  metaData: MetaData;
  onPageChange: (value: number) => void;
}

export const AppPagination: React.FC<AppPaginationProps> = ({
  metaData,
  onPageChange,
}) => {
  const { pageSize, currentPage, count, totalPages } = metaData;
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{ pb: 3 }}
    >
      <Typography>
        Showing {(currentPage - 1) * pageSize + 1}-
        {count < pageSize ? count : pageSize * currentPage} of {count} items
      </Typography>
      <Pagination
        count={totalPages}
        page={currentPage}
        color="secondary"
        onChange={(_, value) => onPageChange(value)}
      />
    </Box>
  );
};
