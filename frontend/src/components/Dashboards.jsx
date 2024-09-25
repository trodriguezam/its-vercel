import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Card, CardContent, CardActionArea, Typography, Box, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
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
        return `${userTasksCompleted.length} / ${allTasks.length}`;
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

        console.log("Sorted Questions:", sortedQuestions);

        const mostTriedThreeQuestions = sortedQuestions.slice(0, 3);

        return mostTriedThreeQuestions;
    }

    let largestQuestion = { question_text: "" };

    if (render) {
        // Assign the value to largestQuestion if render is true and questions is not empty
        largestQuestion = questions.reduce((max, question) => 
            question.question_text.length > max.question_text.length ? question : max,
            { question_text: "" }
        );
    }
    

    const DifTops = mostDifficultTopics().slice(0,2)
    const EasTops = mostDifficultTopics().slice(-2)


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
                    You are not authorized to view this page. Please log in as a professor.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

            <Grid container spacing={4}>
                {/* Static Box with Scrollable Users List */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ color: '#111111', mb: 2, fontWeight: 'bold' }}>
                        User Stats
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
                                <Card sx={{ backgroundColor: '#E4FFC2', padding: '20px', marginBottom: '10px' }}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                                {user.email}
                                            </Typography>
                                            <Typography variant="body1">
                                                Account created: {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                            </Typography>
                                            <Typography variant="body1">
                                                Time Spent: {user.time_spent ? formatTimeSpent(user.time_spent) : 'N/A'}
                                            </Typography>
                                            <Typography variant="body1">
                                                Task Completion: {getUserTaskCompletion(user.id)}
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
                                Topics with Most Difficulty
                            </Typography>
                            {DifTops.map((topic) => {
                                const topicName = topics.find(t => t.id === parseInt(topic.topic_id))?.name || 'Unknown Topic'; 
                                return (
                                    <Typography key={topic.topic_id} sx={{color: '#111111'}}>
                                        {topicName}, Avg Completion: {topic.avgCompletion.toFixed(2)}%
                                    </Typography>
                                );
                            })}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{color: '#111111', fontWeight: 'bold', marginBottom: '20px' }}>
                                Topics with Least Difficulty
                            </Typography>
                            {EasTops.map((topic) => {
                                const topicName = topics.find(t => t.id === parseInt(topic.topic_id))?.name || 'Unknown Topic'; 
                                return (
                                    <Typography key={topic.topic_id} sx={{color: '#111111'}}>
                                        {topicName}, Avg Completion: {topic.avgCompletion.toFixed(2)}%
                                    </Typography>
                                );
                            })}
                        </Grid>

                        <Grid item xs={12}>
                        <Typography variant="h5" sx={{color: '#111111', fontWeight: 'bold', marginBottom: '20px' }}>
                                Highlighted Question
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
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={1}>Most Tried</MenuItem>
                            <MenuItem value={2}>Easiest</MenuItem>
                            <MenuItem value={3}>Largest</MenuItem>
                            </Select>
                        </FormControl>

                        {highlight === 1 && (
                            <Grid item xs={12}>
                                {MostTriedQuestions().map((question) => {
                                    const questionName = questions.find(q => q.id === parseInt(question.question_id))?.question_text || 'Unknown Question';
                                    return (
                                        <Typography key={question.question_id} sx={{color: '#111111'}}>
                                            {questionName}, Total Tries: {question.totalTries}
                                        </Typography>
                                    );
                                })}
                            </Grid>
                        )}

                        {highlight === 3 && (
                            <Grid item xs={12}>
                                <Typography  sx={{color: '#111111'}}>
                                    {largestQuestion.question_text}
                                </Typography>
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
