import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, Box, CircularProgress} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';

function TasksList() {
    const { topicId } = useParams(); // Get the topicId from the URL
    const [tasks, setTasks] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [render, setRender] = useState(false);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const navigate = useNavigate();

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
    }, []);

    const sendQuestions = (task) => {
        axiosInstance.get(`/tasks/${task.id}/questions`)
            .then((res) => {
                const taskQuestions = res.data;  
                return axiosInstance.get('/user_questions').then((res) => {
                    const filteredQuestions = taskQuestions.filter(question => {
                        const userQuestion = res.data.find(uq => uq.question_id === question.id && uq.user_id === currentUser.id);
                        return !(userQuestion && userQuestion.correct);
                    });
                    console.log(filteredQuestions);
                    navigate(`/tasks/${task.id}/questions`, { state: { task, questions: filteredQuestions } });
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };
    
    const getCompletion = (taskId) => {
        const userTask = userTasks.find(ut => ut.task_id === taskId && ut.user_id === currentUser.id);
        console.log('UserTask for taskId:', taskId, 'is', userTask);
        return userTask ? userTask.completion : 0;
    };

    const getCompletionColor = (completion) => {
        if (completion >= 75) return '#4caf50';
        if (completion >= 50) return '#e6d119'; 
        return '#f44336'; 
    };

    return (
        <div>
            <Typography variant="h2" color="#111111">Tasks</Typography>
            {!render ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {tasks.map((task) => (
                        <Accordion key={task.id} sx={{ width: 500, backgroundColor: '#E4FFC2', borderRadius: '10px', marginBottom: '15px' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`task-${task.id}-content`}
                                id={`task-${task.id}-header`}
                                sx={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Typography sx={{ fontWeight: 'bold', marginRight: '15px' }}>{`Task ${task.id}: ${task.name}`}</Typography>
                                    {task.difficulty === 1 && (
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#C1E1A6', color: '#fff', textTransform: 'none', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', marginRight: '10px' }}
                                        >
                                            Easy
                                        </Button>
                                    )}
                                    {task.difficulty === 2 && (
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#C1E1A6', color: '#fff', textTransform: 'none', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', marginRight: '10px' }}
                                        >
                                            Medium
                                        </Button>
                                    )}
                                    {task.difficulty === 3 && (
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#C1E1A6', color: '#fff', textTransform: 'none', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', marginRight: '10px' }}
                                        >
                                            Hard
                                        </Button>
                                    )}
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
                                            value={getCompletion(task.id)}
                                            size={60}
                                            thickness={6}
                                            sx={{
                                                color: getCompletionColor(getCompletion(task.id)),
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
                                                {`${getCompletion(task.id)}%`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {getCompletion(task.id) === 100 ? (
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
                                            onClick={() => sendQuestions(task)}
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
                    ))}
                </div>
            )}
            <Link to="/topics">
                <Button variant="contained" sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}>Return to Topics</Button>
            </Link>
        </div>
    );
}

export default TasksList;
