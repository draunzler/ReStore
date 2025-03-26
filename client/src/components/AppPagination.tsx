import { Box, Typography, Pagination } from "@mui/material";
import { Pagination as PaginationType } from "../models";

interface Props {
  metaData: PaginationType;
  onPageChange: (page: number) => void;
}

export default function AppPagination({ metaData, onPageChange }: Props) {
  const {currentPage, totalPages, totalCount, pageSize} = metaData;
  
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <Typography>
        Displaying {(currentPage-1)*pageSize+1}-
        {currentPage*pageSize > totalCount 
          ? totalCount 
          : currentPage*pageSize} of {totalCount} items
      </Typography>
      <Pagination
        color='secondary'
        size='large'
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
      />
    </Box>
  );
}