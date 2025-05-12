import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import { Grid } from '@mui/material';

export default function CustomPagination() {
  return (
    <Grid container justifyContent="center" sx={{ mt: 6 }} spacing={2}><Pagination count={11} defaultPage={6} boundaryCount={2} /></Grid>

  );
}
