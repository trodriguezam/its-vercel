import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, Box, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import axios from "axios";

function TasksList() {
    const { topicId } = useParams(); // Get the topicId from the URL
    const [tasks, setTasks] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [skips, setSkips] = useState(0);
    const [render, setRender] = useState(false);
    const [currentDifficulty, setCurrentDifficulty] = useState(1); // State to track the current difficulty
    const [taskIndex, setTaskIndex] = useState(0); // State to track the current task index for each difficulty
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

    const difficulties = ['Easy', 'Medium', 'Hard']; // Difficulty levels

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, userQuestionsRes, userTasksRes] = await Promise.all([
                    axiosInstance.get(`/topics/${topicId}/tasks`),
                    axiosInstance.get('/user_questions'),
                    axiosInstance.get('/user_tasks')
                ]);

                setTasks(tasksRes.data);
                setUserQuestions(userQuestionsRes.data);
                setUserTasks(userTasksRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setRender(true); // Set render to true after data fetching is complete
            }
        };

        fetchData();
    }, [topicId]);

    const sendQuestions = (task) => {
        axiosInstance.get(`/tasks/${task.id}/questions`)
            .then((res) => {
                const taskQuestions = res.data;  
                return axiosInstance.get('/user_questions').then((res) => {
                    const filteredQuestions = taskQuestions.filter(question => {
                        const userQuestion = res.data.find(uq => uq.question_id === question.id && uq.user_id === currentUser.id);
                        return !(userQuestion && userQuestion.correct);
                    });
                    navigate(`/tasks/${task.id}/questions`, { state: { task, questions: filteredQuestions } });
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };
    
    const getCompletion = (taskId) => {
        const userTask = userTasks.find(ut => ut.task_id === taskId && ut.user_id === currentUser.id);
        return userTask ? userTask.completion : 0;
    };

    const getCompletionColor = (completion) => {
        if (completion >= 75) return '#4caf50';
        if (completion >= 50) return '#e6d119'; 
        return '#f44336'; 
    };

    const handleSkipTask = () => {
        const filteredTasks = tasks.filter(task => task.difficulty === currentDifficulty);
        if (taskIndex < filteredTasks.length - 1) {
            setTaskIndex(taskIndex + 1); // Move to the next task
            console.log('Task skipped');
            handleSkipPost(filteredTasks[taskIndex].id);
        }
    };

    const handleSkipDifficulty = () => {
        if (currentDifficulty < 3) {
            setCurrentDifficulty(currentDifficulty + 1); // Move to the next difficulty
            setTaskIndex(0); // Reset the task index for the new difficulty
        }
    };

    const handleSkipPost = (taskId) => {
        // the user has already answered the question
        console.log('Skip count' + taskId + ' ' + skips + ' ' + currentUser.id);
        const userTask = userTasks.find(ut => ut.task_id === taskId && ut.user_id === currentUser.id);
        console.log(userTask);
        if (userTask) {
            // if the user answered the question correctly, reset the skip count
            if (userTask.completion === 100) {
                axiosInstance.post('/user_task_skips', { user_id: currentUser.id, task_id: taskId, skip_count: 0 })
                    .then(() => (
                        console.log('Skip count reset' + taskId + ' ' + 0 + ' ' + currentUser.id + ' ' + skips),
                        setSkips(0)
                    ))
                    .catch((error) => {
                        console.error(error);
                    });
                return;
            }
        }
            // if the user has not answered the question, create a new user task
        //     axiosInstance.post('/user_tasks', { user_id: currentUser.id, task_id: taskId, completion: 0 })
        //         .then(() => {
        //             console.log('User task created');
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //         });
        // }
        // check if the user has skipped the question before
        axiosInstance.get('/user_task_skips')
            .then((res) => {
                const userTaskSkip = res.data.find(uts => uts.user_id === currentUser.id && uts.task_id === taskId);
                if (userTaskSkip) {
                    return;
                } else {
                    // if the user has not skipped the question before, create a new user task skip
                    axiosInstance.post('/user_task_skips', { user_id: currentUser.id, task_id: taskId, skip_count: 1 })
                        .then(() => {
                            setSkips(1);
                            console.log('Skip count created' + taskId + ' ' + 1 + ' ' + currentUser.id);
                            return;
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            })

        axiosInstance.put('/user_task_skips', { user_id: currentUser.id, task_id: taskId, skip_count: skips + 1 })
            .then(() => {
                setSkips(skips + 1);
                console.log('Skip count updated' + taskId + ' ' + (skips) + ' ' + currentUser.id);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    if (!currentUser || currentUser.role !== 'user') {
        return (
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
                <Typography 
                    variant="h3" 
                    sx={{ mb: 4, textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
                >
                    Tasks
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

    // Filter tasks based on the current difficulty
    const filteredTasks = tasks.filter(task => task.difficulty === currentDifficulty);
    const currentTask = filteredTasks[taskIndex]; // Only show the current task based on the task index

    return (
        <div>
            <Typography variant="h2" color="#111111">Tasks</Typography>

            {/* Show the current difficulty */}
            <Typography 
                variant="h5" 
                sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: currentDifficulty === 1 ? '#8AB573' : (currentDifficulty === 2 ? 'orange' : 'red') }}
            >
                Level: {difficulties[currentDifficulty - 1]}
            </Typography>

            {!render ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                currentTask && (
                    <Accordion key={currentTask.id} sx={{ width: 500, backgroundColor: '#E4FFC2', borderRadius: '10px', marginBottom: '15px' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`task-${currentTask.id}-content`}
                            id={`task-${currentTask.id}-header`}
                            sx={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                            <Box display="flex" alignItems="center">
                                <Typography sx={{ fontWeight: 'bold', marginRight: '15px' }}>{`${currentTask.name}`}</Typography>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: currentDifficulty === 1 ? '#8AB573' : (currentDifficulty === 2 ? 'orange' : 'red'), color: '#fff', textTransform: 'none', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', marginRight: '10px' }}
                                >
                                    {difficulties[currentDifficulty - 1]}
                                </Button>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <LockIcon sx={{ color: '#333' }} />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: '#D9FFD9' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center" gap={2} position="relative">
                                    <CircularProgress
                                        variant="determinate"
                                        value={getCompletion(currentTask.id)}
                                        size={60}
                                        thickness={6}
                                        sx={{
                                            color: getCompletionColor(getCompletion(currentTask.id)),
                                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                            borderRadius: '50%',
                                        }}
                                    />
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        bottom={0}
                                        right={0}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Typography variant="caption" component="div" color="textSecondary">
                                            {`${getCompletion(currentTask.id)}%`}
                                        </Typography>
                                    </Box>
                                </Box>
                                {getCompletion(currentTask.id) === 100 ? (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#3a6326',
                                            color: '#fff',
                                            borderRadius: '10px',
                                            padding: '10px 20px',
                                            textTransform: 'none',
                                            fontSize: '18px',
                                        }}
                                    >
                                        Completed!
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={() => sendQuestions(currentTask)}
                                        sx={{
                                            backgroundColor: '#8AB573',
                                            color: '#fff',
                                            borderRadius: '10px',
                                            padding: '10px 20px',
                                            textTransform: 'none',
                                            fontSize: '18px',
                                        }}
                                    >
                                        Start
                                    </Button>
                                )}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                )
            )}

            {filteredTasks.length > 1 && (
                <Typography sx={{ textAlign: 'center', color: '#111111' }}>
                    {`Task ${taskIndex + 1} of ${filteredTasks.length}`}
                </Typography>
            )}

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <div>
                    {filteredTasks.length > 1 && taskIndex > 0 && (
                    <Box sx={{ textAlign: 'center', mx: 1 }}>
                        <Button
                        variant="contained"
                        onClick={() => setTaskIndex(taskIndex - 1)}
                        sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
                        >
                        Previous Task
                        </Button>
                    </Box>
                    )}

                    {filteredTasks.length > 1 && taskIndex < filteredTasks.length - 1 && (
                    <Box sx={{ textAlign: 'center', mx: 1 }}>
                        <Button
                        variant="contained"
                        onClick={handleSkipTask}
                        sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
                        >
                        Skip Task
                        </Button>
                    </Box>
                    )}
                </div>

                <div>
                    {currentDifficulty > 1 && (
                    <Box sx={{ textAlign: 'center', mx: 1 }}>
                        <Button
                        variant="contained"
                        onClick={() => setCurrentDifficulty(currentDifficulty - 1)}
                        sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
                        >
                        Previous level
                        </Button>
                    </Box>
                    )}
                </div>

                <div>
                    {currentDifficulty < 3 && (
                    <Box sx={{ textAlign: 'center', mx: 1 }}>
                        <Button
                        variant="contained"
                        onClick={handleSkipDifficulty}
                        sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
                        >
                        Skip level
                        </Button>
                    </Box>
                    )}
                </div>
                </Box>
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/topics">
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}
                    >
                        Return to Topics
                    </Button>
                </Link>
            </Box>
        </div>
    );
}

export default TasksList;
