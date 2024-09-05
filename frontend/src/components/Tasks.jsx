import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';

function TasksList() {
    const { topicId } = useParams(); // Get the topicId from the URL
    const [tasks, setTasks] = useState([]);
    const [Allquestions, setQuestions] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        axiosInstance.get(`/topics/${topicId}/tasks`) // Use the topicId in the API call
            .then((res) => {
                setTasks(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [topicId]);

    useEffect(() => {
        axiosInstance.get('/user_questions')
            .then((res) => {
                setUserQuestions(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    , []);


    return (
        <div>
            <Typography variant="h2" color="#111111">Tasks</Typography>
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
                                <Box>
                                    <Typography variant="body2">accuracy: {task.accuracy}%</Typography>
                                </Box>
                                <Link to={`/tasks/${task.id}/questions`} state={{ task }} style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="contained"
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
                                </Link>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
            <Link to="/topics">
                <Button variant="contained" sx={{ backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}>Return to Topics</Button>
            </Link>
        </div>
    );
}

export default TasksList;
