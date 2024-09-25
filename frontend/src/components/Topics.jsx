import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material';

function TopicList() {
    const [topics, setTopics] = useState([]);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        axiosInstance.get('/topics')
            .then((res) => {
                setTopics(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    if (!currentUser || currentUser.role !== 'user') {
      return (
          <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
              <Typography 
                  variant="h3" 
                  sx={{ mb: 4, textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
              >
                  Topics
              </Typography>
              <Typography 
                  variant="body1" 
                  sx={{ textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
              >
                  You are not authorized to view this page. Please log in as a user.
              </Typography>
          </Box>
      );
  }

    return (
        <div>
          <Typography variant="h2" color="#111111">Topics</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {topics.map((topic) => (
              <Card key={topic.id} sx={{ width: 500, height: 130, backgroundColor: '#E4FFC2', color: '#111111' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {topic.name}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Link to={`/topics/${topic.id}/tasks`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}>View Tasks</Button>
                  </Link>
                </CardActions>
              </Card>
            ))}
          </div>
        </div>
      );
}

export default TopicList;
