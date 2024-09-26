import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Card, CardContent, CardActionArea, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

function DashboardList() {
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [userTopics, setUserTopics] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [render, setRender] = useState(false);
    const [highlight, setHighlight] = useState(0);

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

    const getUserTaskCompletion = (userId) => {
        const userTasksForUser = userTasks.filter((userTask) => userTask.user_id === userId);
        const userTasksCompleted = userTasksForUser.filter((userTask) => userTask.completion === 100);
        return `${(userTasksCompleted.length / allTasks.length).toFixed(2)}`;
    };

    const formatTimeSpent = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const NumUsers = () => {
        return users.filter((user) => user.role === 'user').length;
    }

    const handleChange = (event) => {
        setHighlight(event.target.value);
    };

    const mostDifficultTopics = () => {
        const topicsGroupedByTopicId = userTopics.reduce((acc, userTopic) => {
            if (!acc[userTopic.topic_id]) {
                acc[userTopic.topic_id] = [];
            }
            acc[userTopic.topic_id].push(userTopic);
            return acc;
        }, {});
    
        const topicsWithAvgCompletion = Object.keys(topicsGroupedByTopicId).map((topicId) => {
            const topics = topicsGroupedByTopicId[topicId];
            const totalCompletion = topics.reduce((sum, userTopic) => sum + userTopic.completion, 0);
            const avgCompletion = totalCompletion / NumUsers();
            return {
                topic_id: topicId,
                avgCompletion: avgCompletion
            };
        });

        const sortedTopics = topicsWithAvgCompletion.sort((a, b) => a.avgCompletion - b.avgCompletion);

        return sortedTopics;
    };

    const MostTriedQuestions = () => {
        const questionsGroupedByQuestionId = userQuestions.reduce((acc, userQuestion) => {
            if (!acc[userQuestion.question_id]) {
                acc[userQuestion.question_id] = [];
            }
            acc[userQuestion.question_id].push(userQuestion);
            return acc;
        }, {});

        const questionsWithTries = Object.keys(questionsGroupedByQuestionId).map((questionId) => {
            const questions = questionsGroupedByQuestionId[questionId];
            const totalTries = questions.reduce((sum, userQuestion) => sum + userQuestion.try, 0);
            return {
                question_id: questionId,
                totalTries: totalTries
            };
        });

        const sortedQuestions = questionsWithTries.sort((a, b) => a.totalTries - b.totalTries);

        return sortedQuestions;
    }

    let largestQuestion = { question_text: "" };
    let smallestQuestion = { question_text: "" };

    if (render) {
        largestQuestion = questions.reduce((max, question) => 
            question.question_text.length > max.question_text.length ? question : max,
            { question_text: "" }
        );

        smallestQuestion = questions.reduce((min, question) => 
            question.question_text.length < min.question_text.length ? question : min,
            { question_text: questions[0].question_text }
        );
    }
 

    const DifTops = mostDifficultTopics().slice(0,2)
    const EasTops = mostDifficultTopics().slice(-2)
    const MostTried = MostTriedQuestions().slice(-3)
    const LeastTried = MostTriedQuestions().slice(0,3)
    if (!render){
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

    return (
        <Box sx={{ maxWidth: '1400px', margin: '0 auto', padding: '50px' }}>
            <Typography variant='h4' sx={{ color: '#111111', mb: 2, fontWeight: 'bold' }}>Dashboard General</Typography>

            <Grid container spacing={4}>
                {/* Static Box with Scrollable Users List */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ color: '#111111', mb: 2, fontWeight: 'bold' }}>
                        Estadisticas de Usuario
                    </Typography>
                    <Box sx={{
                        height: '400px', // Adjust height as necessary
                        overflowY: 'scroll',
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        '&::-webkit-scrollbar': {
                            display: 'none', // Hides the scrollbar
                        },
                    }}>
                        {users.filter((user) => user.role === 'user').map((user) => (
                            <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }} key={user.id}>
                                <Card sx={{  padding: '20px', marginBottom: '10px' }}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                                {user.email}
                                            </Typography>
                                            <Typography variant="body1">
                                                Cuenta Creada: {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                            </Typography>
                                            <Typography variant="body1">
                                                Tiempo en Uso: {user.time_spent ? formatTimeSpent(user.time_spent) : 'N/A'}
                                            </Typography>
                                            <Typography variant="body1">
                                                Progreso Total: {getUserTaskCompletion(user.id)} %
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Link>
                        ))}
                    </Box>
                </Grid>

                {/* Right Column: Topics and Questions */}
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{color: '#111111', fontWeight: 'bold', marginBottom: '20px' }}>
                                Temas con Mayor Dificultad
                            </Typography>
                            {DifTops.map((topic) => {
                                const topicName = topics.find(t => t.id === parseInt(topic.topic_id))?.name || 'Unknown Topic'; 
                                return (
                                    <Card key={topic.topic_id} sx={{  marginBottom: '10px' }}>
                                        <CardContent>
                                        <Typography variant="body1" sx={{ color: '#111111' }}>
                                            {topicName}, Progreso Promedio: {topic.avgCompletion.toFixed(2)}%
                                        </Typography>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{color: '#111111', fontWeight: 'bold', marginBottom: '20px' }}>
                                Temas con Menor Dificultad
                            </Typography>
                            {EasTops.map((topic) => {
                                const topicName = topics.find(t => t.id === parseInt(topic.topic_id))?.name || 'Unknown Topic'; 
                                return (
                                    <Card key={topic.topic_id} sx={{  marginBottom: '10px' }}>
                                        <CardContent>
                                        <Typography variant="body1" sx={{ color: '#111111' }}>
                                            {topicName}, Progreso Promedio: {topic.avgCompletion.toFixed(2)}%
                                        </Typography>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Grid>

                        <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginLeft: '50px' }}>
                    <Typography variant="h5" sx={{ color: '#111111', fontWeight: 'bold', marginRight: '20px' }}>
                        Pregunta Destacada
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: 220 }}>
                        <InputLabel id="demo-simple-select-helper-label">Highlight</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={highlight}
                            label="Highlight"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Ninguna</em>
                            </MenuItem>
                            <MenuItem value={1}>Mas Intentada</MenuItem>
                            <MenuItem value={2}>Menos Intentada</MenuItem>
                            <MenuItem value={3}>Mas Larga</MenuItem>
                            <MenuItem value={4}>Mas Pequeña</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                        {highlight === 1 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#111111', fontWeight: 'bold', marginRight: '20px' }}>
                                    3 Preguntas Mas Intentadas:
                                </Typography>
                                {MostTried.map((question) => {
                                    const questionName = questions.find(q => q.id === parseInt(question.question_id))?.question_text || 'Unknown Question';
                                    return (
                                    <Card key={question.question_id} sx={{  marginBottom: '5px' }}>
                                        <CardContent>
                                        <Typography variant="body1" sx={{ color: '#111111' }}>
                                            {questionName}, Intentos Totales: {question.totalTries}
                                        </Typography>
                                        </CardContent>
                                    </Card>
                                    );
                                })}
                            </Grid>
                        )}

                        {highlight === 2 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#111111', fontWeight: 'bold', marginRight: '20px' }}>
                                    3 preguntas Menos Intentadas:
                                </Typography>
                                {LeastTried.map((question) => {
                                    const questionName = questions.find(q => q.id === parseInt(question.question_id))?.question_text || 'Unknown Question';
                                    return (
                                        <Card key={question.question_id} sx={{  marginBottom: '5px' }}>
                                        <CardContent>
                                        <Typography variant="body1" sx={{ color: '#111111' }}>
                                            {questionName}, Intentos Totales: {question.totalTries}
                                        </Typography>
                                        </CardContent>
                                    </Card>
                                    );
                                })}
                            </Grid>
                        )}

                        {highlight === 3 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#111111', fontWeight: 'bold', marginRight: '20px' }}>
                                    Pregunta Mas Larga:
                                </Typography>
                                <Card sx={{  marginBottom: '10px' }}>
                                    <CardContent>
                                    <Typography variant="body1" sx={{ color: '#111111' }}>
                                        {largestQuestion.question_text}
                                    </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {highlight === 4 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ color: '#111111', fontWeight: 'bold', marginRight: '20px' }}>
                                    Pregunta Mas Pequeña:
                                </Typography>
                                <Card sx={{  marginBottom: '10px' }}>
                                    <CardContent>
                                    <Typography variant="body1" sx={{ color: '#111111' }}>
                                        {smallestQuestion.question_text}
                                    </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                            
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashboardList;
