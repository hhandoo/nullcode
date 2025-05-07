import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const Featured = (props) => {
    return (
        <Grid container spacing={4} sx={{ mt: 4 }} >

            <Grid item xs={12} sm={6} md={3}>
                <Card

                >
                    <CardMedia
                        component="img"
                        height="200"
                        image="https://via.placeholder.com/400x200/007bff/FFFFFF?Text=Spark"
                        alt="Spark Course"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div">
                            Apache Spark Fundamentals
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Learn the core concepts of Apache Spark for big data processing and analysis.
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <Button size="small" color="primary">
                            Learn More
                        </Button>
                    </CardContent>
                </Card>
            </Grid>


        </Grid >
    );
};

export default Featured;
