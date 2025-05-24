import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Button, CardActions } from '@mui/material';

const Featured = ({ featured_pages }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
        {featured_pages.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image_url}
                alt={item.header}
                sx={{ backgroundColor: '#fff', objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6">
                  {item.header}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.footer}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" href={item.path}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
  );
};

export default Featured;
