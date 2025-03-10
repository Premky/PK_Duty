import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function ActionAreaCard({ title, info }) {
  return (
    <Card sx={{ width: '100%', minWidth: '150px' }}>

      <CardContent style={{ backgroundColor: 'blue', textAlign: 'center', color: 'white' }}>
        <Typography gutterBottom variant="h3" component="div" >
          {title}
        </Typography>
        <Typography variant="h6" >
          {/* <h5> */}
            {info}
          {/* </h5> */}
        </Typography>
      </CardContent>

    </Card>
  );
}
