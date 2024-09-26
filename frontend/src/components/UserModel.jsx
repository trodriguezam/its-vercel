import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, Box, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';

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

    if (!render){
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
            <Typography variant='h4' gutterBottom>User Data</Typography>
            {users.map((user) => {
                if (user.id === Number(userId)) {
                    return (
                        <Accordion key={user.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{user.username}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <strong>Time Spent: </strong>{user.time_spent} seconds
                                </Typography>
                                <Typography>
                                    <strong>Questions Attempted: </strong>
                                    {userQuestions.filter((userQuestion) => userQuestion.user_id === user.id).length}
                                </Typography>
                                <Typography>
                                    <strong>Tasks Completed: </strong>
                                    {userTasks.filter((userTask) => userTask.user_id === user.id).length}
                                </Typography>
                                <Typography>
                                    <strong>Topics Completed: </strong>
                                    {userTopics.filter((userTopic) => userTopic.user_id === user.id).length}
                                </Typography>
                                <Typography>
                                    <strong>Tasks Completed: </strong>
                                    {allTasks.filter((task) => userTasks.find((userTask) => userTask.task_id === task.id)).length}
                                </Typography>
                                <Typography>
                                    <strong>Questions Attempted: </strong>
                                    {questions.filter((question) => userQuestions.find((userQuestion) => userQuestion.question_id === question.id)).length}
                                </Typography>
                                <Typography>
                                    <strong>Topics Completed: </strong>
                                    {topics.filter((topic) => userTopics.find((userTopic) => userTopic.topic_id === topic.id)).length}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    );
                }
            }
            )}
        </Box>
    );
}

export default UserData;