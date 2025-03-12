import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Grid2 } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';

export default function AboutOfficeCard({ info }) {
  return (
    <Card sx={{ width: '100%' }}>
      {/* <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <Grid2 container pl={2}
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'blue', color: 'white', width: '100%' }}>

            <Grid2 item size={{ sm: 1 }} p={2} borderRadius={5}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', color: 'white' }}>
              <HouseIcon />
            </Grid2>

            <Grid2 item size={{ sm: 10 }} p={1}>
              परिचय
            </Grid2>
          </Grid2>
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {info}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Share</Button> */}
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
