import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Card, CardContent, CardActionArea, Typography, Box, Grid } from '@mui/material';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns function
import axios from "axios";

function DashboardList() {
    const [users, setUsers] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [render, setRender] = useState(false);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, userQuestionsRes, userTasksRes, allTasks] = await Promise.all([
                    axiosInstance.get(`/users`),
                    axiosInstance.get('/user_questions'),
                    axiosInstance.get('/user_tasks'),
                    axiosInstance.get('/tasks')
                ]);

                setUsers(usersRes.data);
                setUserQuestions(userQuestionsRes.data);
                setUserTasks(userTasksRes.data);
                setAllTasks(allTasks.data);
            } catch (error) {
                console.error(error);
            } finally {
                setRender(true); // Set render to true after data fetching is complete
            }

        };

        fetchData();
    }, []);
    
    const getUserTaskCompletion = (userId) => {
        const userTasksForUser = userTasks.filter((userTask) => userTask.user_id === userId);
        const userTasksCompleted = userTasksForUser.filter((userTask) => userTask.completion === 100);
        const completionPercentage = `${userTasksCompleted.length} / ${allTasks.length}`;
        
        return completionPercentage;
    }

    return (
        <Box sx={{maxWidth: '900px', margin: '0 auto', padding: '70px' }}>
            <Typography variant="h3" sx={{ mb: 2, textAlign: 'center',justifyContent:"center", color: '#111111' }}>
                Dashboard
            </Typography>

            <Grid container spacing={4} sx={{ mt: 3 }}>
                {users.filter((user) => user.role === 'user').map((user) => (
                    <Grid item xs={12} sm={6} md={6} key={user.id}>
                        <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ backgroundColor: '#E4FFC2', transition: 'background-color 0.3s ease', '&:hover': { backgroundColor: '#c8e6a3' } }}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {user.email}
                                        </Typography>
                                        <Typography variant="h6" component="div">
                                            Account created: {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                        </Typography>
                                        <Typography variant="h6" component="div">
                                            Task Completion: {getUserTaskCompletion(user.id)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default DashboardList;
