import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import { set } from "date-fns";

function TopicList() {
    const [topics, setTopics] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [render, setRender] = useState(false);
    const [userTopics, setUserTopics] = useState([]);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;


    const getTopicCompletion = (topicId, userId) => {
      if (!tasks || !userTasks) return 0; // Add a guard clause to ensure `tasks` and `userTasks` are available
  
      const tasksForTopic = tasks.filter((task) => task.topic_id === topicId);
      const taskIdsForTopic = tasksForTopic.map((task) => task.id);
  
      const userTasksForTopic = userTasks.filter(
          (userTask) => taskIdsForTopic.includes(userTask.task_id) && userTask.user_id === userId
      );
  
      const sumCompletion = userTasksForTopic.reduce((sum, userTask) => sum + userTask.completion, 0);
      const amount = tasksForTopic.length;
      
      return amount > 0 ? sumCompletion / amount : 0;
  };
  
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const [topicsRes, tasksRes, userTasksRes, userTopicsRes] = await Promise.all([
                  axiosInstance.get(`/topics`),
                  axiosInstance.get('/tasks'),
                  axiosInstance.get(`/user_tasks`),
                  axiosInstance.get(`/user_topics`)
              ]);
  
              setTopics(topicsRes.data);
              setTasks(tasksRes.data);
              setUserTasks(userTasksRes.data);
              setUserTopics(userTopicsRes.data);
  
              // Check if the necessary data has been loaded
              if (currentUser && tasksRes.data.length > 0 && userTasksRes.data.length > 0) {
                  setDataReady(true); // Set dataReady to true once everything is loaded
              }
          } catch (error) {
              console.error(error);
          }
      };
  
      fetchData();
  }, []); // Only run once on component mount
  
  useEffect(() => {
      if (dataReady) {
          const postData = async () => {
              const completionData = topics.map((topic) => ({
                  topic_id: topic.id,
                  user_id: currentUser.id,
                  completion: getTopicCompletion(topic.id, currentUser.id)
              }));
  
              for (const data of completionData) {
                  const existingUserTopic = userTopics.find(
                      (ut) => ut.topic_id === data.topic_id && ut.user_id === data.user_id
                  );
  
                  if (!existingUserTopic) {
                      try {
                          const response = await axiosInstance.post('/user_topics', data);
                          console.log('Completion data posted successfully:', response.data);
                      } catch (error) {
                          console.error('Error posting completion data:', error);
                      }
                  } else if (existingUserTopic.completion !== data.completion) {
                      try {
                          const response = await axiosInstance.put(`/user_topics/${existingUserTopic.id}`, data);
                          console.log('Completion data updated successfully:', response.data);
                      } catch (error) {
                          console.error('Error updating completion data:', error);
                      }
                  } else {
                      console.log('Completion data already up to date:', existingUserTopic);
                  }
              }
          };
  
          postData();
          setRender(true);
      }
  }, [dataReady]);
  
  

    if (!render) {
      return <Typography variant="h6">Loading...</Typography>;
    }

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
                  <Typography variant="h6" component="div">
                    {getTopicCompletion(topic.id, currentUser.id)}%
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
