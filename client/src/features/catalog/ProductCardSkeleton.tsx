import { Card, CardActions, CardContent, CardHeader, Grid, Skeleton } from "@mui/material";

export default function ProductCardSkeleton() {
  return (
    <Card>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
        }
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
      />
      <Skeleton sx={{ height: 140 }} animation="wave" variant="rectangular" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Skeleton animation="wave" height={20} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton animation="wave" height={20} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Skeleton animation="wave" height={40} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton animation="wave" height={40} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}