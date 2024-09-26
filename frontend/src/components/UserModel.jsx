import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Box, CircularProgress, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TasksList from "./Tasks";

function UserData() {
    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [userTopics, setUserTopics] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [render, setRender] = useState(false);

    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, userQuestionsRes, userTasksRes, userTopicsRes, allTasksRes, questionsRes, topicsRes] = await Promise.all([
                    axiosInstance.get(`/users`),
                    axiosInstance.get('/user_questions'),
                    axiosInstance.get('/user_tasks'),
                    axiosInstance.get('/user_topics'),
                    axiosInstance.get('/tasks'),
                    axiosInstance.get('/questions'),
                    axiosInstance.get('/topics')
                ]);

                setUsers(usersRes.data);
                setUserQuestions(userQuestionsRes.data);
                setUserTasks(userTasksRes.data);
                setUserTopics(userTopicsRes.data);
                setAllTasks(allTasksRes.data);
                setQuestions(questionsRes.data);
                setTopics(topicsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setRender(true);
            }
        };

        fetchData();
    }, []);

    if (!render) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress />
            </Box>
        );
    }

    if (!currentUser || currentUser.role !== 'professor') {
        return (
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
                <Typography 
                    variant="h3" 
                    sx={{ mb: 4, textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
                >
                    Dashboard
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
                >
                    No estas Autorizado a ver esta Pagina, Porfavor Logea como Profesor
                </Typography>
            </Box>
        );
    }

    const getRating = (topicId) => {
        const userTopic = userTopics.find((ut) => ut.topic_id === topicId && ut.user_id === parseInt(userId));
        return userTopic ? ((userTopic.completion)/10).toFixed(1) : 0;
    }

    const getlastTask = (user_id) => {
        const userTask = userTasks.filter((ut) => ut.user_id === user_id);
        
        if (userTask.length === 0) {
            return null;
        }
    
        const lastTask = userTask.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
        return lastTask;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const formatTimeSpent = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const lastT = getlastTask(parseInt(userId))

    return (
        <Box sx={{ width: '1200px', margin: '0 auto', padding: '40px' }}>
            <Typography  variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#111111', fontWeight: 'bold' }}>Usuario: {users.find((u) => u.id === parseInt(userId)).email}</Typography>
            <Grid container spacing={3} >
                <Grid item xs={12} md={7}>
                <Typography variant='h5' gutterBottom sx={{color: '#111111'}}>Calificaciones por Tema</Typography>
                
                {/* Table to display topics and values */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tema</TableCell>
                                <TableCell align="right">Calificación</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {topics.map((topic) => (
                                <TableRow key={topic.id}>
                                    <TableCell>{topic.name}</TableCell>
                                    <TableCell align="right">{getRating(topic.id)} / 10</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>

                <Grid item xs={12} md={5}>
                        <Typography sx={{color:"#111111"}}>Ultimo Login:</Typography>

                        <Typography sx={{color:"#111111"}}>{formatDate(users.find((u) => u.id === parseInt(userId)).updated_at)}</Typography>
                        <Typography sx={{color:"#111111"}}>Ultima Tarea:</Typography>
                        <Typography sx={{color:"#111111"}}>{allTasks.find((t) => t.id === lastT.task_id).name} Resultado: {lastT.completion}%</Typography>
                        <Typography sx={{color:"#111111"}}>Tiempo en uso: {formatTimeSpent(users.find((u) => u.id === parseInt(userId)).time_spent)}</Typography>
                        
                        
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                
            </Grid>
        </Box>
    );
}

export default UserData;
