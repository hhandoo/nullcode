import React from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const Featured = (props) => {
    return (
        <Grid container spacing={4} sx={{ mt: 4 }} justifyContent='center'>
            {props.featured_pages.map((item, index) => {
                return <Grid item key={index} xs={12} sm={6} md={6}>
                    <Card key={index} variant='outlined'>
                        <CardMedia
                            sx={{ backgroundColor: '#ffffff' }}
                            component="img"
                            height="200"
                            image={item.image_url}
                            alt={item.header}
                        />
                        <CardContent >
                            <Typography gutterBottom variant="h6" >
                                {item.header}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.footer}
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Button size="small" color="primary" href={item.path}>
                                Learn More
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            })}
        </Grid >
    );
};

export default Featured;
