import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Box, CircularProgress, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button, List, ListItem, ListItemText, Divider, Card, CardContent } from '@mui/material';

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
    const [performanceList, setPerformanceList] = useState([]);

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
    
                // Wait for state to update before calculating performance
                setRender(true);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        if (render) {
            calculateUserPerformance();
        }
    }, [render]);
    
    const calculateUserPerformance = () => {
        const performance = users.map((user) => {
            const userTopicsForUser = userTopics.filter((ut) => ut.user_id === user.id);
            const sumCompletion = userTopicsForUser.reduce((sum, ut) => sum + ut.completion, 0);
            const performanceValue = user.time_spent > 0 ? sumCompletion / user.time_spent : 0;
            return {
                userId: user.id,
                performance: performanceValue
            };
        });
    
        const sortedPerformance = performance.sort((a, b) => b.performance - a.performance);
        setPerformanceList(sortedPerformance);
    };
    

    const getUserPosition = (userId) => {
        const position = performanceList.findIndex((user) => user.userId === userId);

        return position !== -1 ? position + 1 : null;
    };

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

    const getLastTask = (user_id) => {
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

    const lastT = getLastTask(parseInt(userId));

    const style = {
        py: 0,
        width: '100%',
       
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      };

    return (
        <Box sx={{ width: '1200px', margin: '0 auto', padding: '60px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#111111', fontWeight: 'bold', mr: 2 }}>
                    Usuario: {users.find((u) => u.id === parseInt(userId)).email}
                </Typography>
                <Button 
                    variant="contained" 
                    sx={{ ml: 2, backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }} 
                    onClick={() => window.location.href = '/dashboards'}
                >
                    Ir al Dashboard
                </Button>
            </Box>
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
                <Typography variant='h5' gutterBottom sx={{color: '#111111'}}>Datos</Typography>
                    <Card sx={{ margin: 2 }}>
                        <CardContent>
                            <List>
                                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography sx={{ color: "#111111", fontWeight: 'bold' }}>Último Login:</Typography>
                                    <Typography sx={{ color: "#111111" }}>
                                        {formatDate(users.find((u) => u.id === parseInt(userId)).updated_at)}
                                    </Typography>
                                </ListItem>
                                <Divider component="li" sx={{ mb: 2 }} />
                                
                                <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                                    
                                    {lastT ? (
                                        <>
                                        <Typography sx={{ color: "#111111" }}>
                                            <span style={{ fontWeight: 'bold' }}>Ultima Tarea:</span> {allTasks.find((t) => t.id === lastT.task_id)?.name || 'Tarea no encontrada'}
                                        </Typography>
                                        <Typography sx={{ color: "#111111" }}>
                                            <span style={{ fontWeight: 'bold' }}>Resultado:</span> {lastT.completion} %
                                        </Typography>
                                        </>
                                    ) : (
                                        <>
                                        <Typography sx={{ color: "#111111", fontWeight: 'bold' }}>Última Tarea:</Typography>
                                        <Typography sx={{ color: "#111111" }}>N/A</Typography>
                                        </>
                                    )}
                                </ListItem>
                                <Divider component="li" sx={{ mb: 2 }} />
                                
                                <ListItem sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography sx={{ color: "#111111", fontWeight: 'bold' }}>Tiempo en uso:</Typography>
                                    <Typography sx={{ color: "#111111" }}>
                                        {formatTimeSpent(users.find((u) => u.id === parseInt(userId)).time_spent)}
                                    </Typography>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Typography variant='h6' gutterBottom sx={{color: '#111111'}}>Puesto entre Estudiantes</Typography>
                    <Card sx={{ margin: 2 }}>
                        <CardContent>
                            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant='h5' sx={{color:"#111111", fontWeight: 'bold'}}>
                                    Rank: {getUserPosition(parseInt(userId))}
                                </Typography>
                                <Typography variant='body2' sx={{ color: "#111111", mt: 1 }}>
                                    (Depende de Progreso/Tiempo)
                                </Typography>
                            </ListItem>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default UserData;
