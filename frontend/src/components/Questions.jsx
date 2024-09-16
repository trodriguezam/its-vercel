import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button, Typography, FormControl } from '@mui/material';
import { Box } from '@mui/system';
import  Dcl from '../utils/SvgEditor'

function QuestionsList() {
    const { taskId } = useParams();
    const location = useLocation();
    const task = location.state?.task;
    const questions = location.state?.questions;
    const navigate = useNavigate();

    const [answers, setAnswers] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [Allquestions, setAllquestions] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        axiosInstance.get(`/tasks/${taskId}/questions`)
            .then((res) => {
                setAllquestions(res.data);
            })
            .catch((error) => console.error(error));
    }, [taskId]);

    useEffect(() => {
        axiosInstance.get('/user_questions')
            .then((res) => setUserQuestions(res.data))
            .catch((error) => console.error(error));
    }, [refresh]);

    useEffect(() => {
        if (questions.length > 0 && questions[currentIndex]) {
            axiosInstance.get(`/questions/${questions[currentIndex].id}/answers`)
                .then((res) => setAnswers(res.data))
                .catch((error) => console.error(error));
        }
    }, [currentIndex, questions]);

    const handleAnswerChange = (answerId) => {
        setSelectedAnswer(answerId);
    };

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            const selectedAnswerObj = answers.find(answer => answer.id === selectedAnswer);

            const existingUserQuestion = userQuestions.find(
                userQuestion =>
                    userQuestion.question_id === questions[currentIndex].id &&
                    userQuestion.user_id === currentUser?.id
            );

            const handleUpdate = () => {
                setRefresh(!refresh);

                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    finalizeQuiz();
                }
            };

            if (existingUserQuestion) {
                axiosInstance.put(`/user_questions/${existingUserQuestion.id}`, {
                    correct: selectedAnswerObj.correct
                })
                .then(handleUpdate)
                .catch((error) => console.error(error));
            } else {
                axiosInstance.post('/user_questions', {
                    user_id: currentUser.id,
                    question_id: questions[currentIndex].id,
                    correct: selectedAnswerObj.correct
                })
                .then(handleUpdate)
                .catch((error) => console.error(error));
            }
        } else {
            console.log('No answer selected');
        }
    };

    const finalizeQuiz = () => {
        setIsCompleted(true);
    };

    const handleReturn = (scorePercentage) => {
    axiosInstance.get(`/user_tasks`)
        .then((res) => {
            const userTasks = res.data;
            const existingTask = userTasks.find(userTask => {
                return userTask.task_id === task.id && userTask.user_id === currentUser.id;
            });

            if (existingTask) {
                axiosInstance.put(`/user_tasks/${existingTask.id}`, {
                    task_id: taskId,
                    user_id: currentUser.id,
                    completion: scorePercentage
                })
                .then((response) => {
                    console.log('Task updated:', response.data);
                    navigate(`/topics/${task.topic_id}/tasks`);
                })
                .catch((error) => {
                    console.error('Error updating task:', error);
                });
            } else {
                axiosInstance.post(`/user_tasks`, {
                    task_id: taskId,
                    user_id: currentUser.id,
                    completion: scorePercentage
                })
                .then((response) => {
                    console.log('Task created:', response.data);
                    navigate(`/topics/${task.topic_id}/tasks`);
                })
                .catch((error) => {
                    console.error('Error creating task:', error);
                });
            }
        })
        .catch((error) => {
            console.error('Error fetching user tasks:', error);
        });
};

    const score = userQuestions.filter(
        userQuestion => userQuestion.user_id === currentUser?.id && userQuestion.correct
    ).length;

    const scorePercentage = (score / Allquestions.length) * 100;

    const handleStartQuiz = () => {
        setIsCompleted(false);
        setQuizStarted(true);
        setCurrentIndex(0);
    };

    const getRandomValues = (samples) => {
        return samples.map(range => Math.floor(Math.random() * range + 1));
    }

    function QuestionType({ question, task }) {
        if (task.task_type === 'Option') {
            return (
                <FormControl component="fieldset">
                    {answers.map((answer) => (
                        <Button
                            key={answer.id}
                            variant={selectedAnswer === answer.id ? 'contained' : 'outlined'}
                            onClick={() => handleAnswerChange(answer.id)}
                            style={{
                                margin: '10px 0',
                                width: '100%',
                                textTransform: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                            }}
                            sx={{
                                backgroundColor: selectedAnswer === answer.id ? '#659948' : '#fff',
                                color: selectedAnswer === answer.id ? '#fff' : '#111111'
                            }}
                        >
                            <Typography variant='h6'>
                                {answer.answer_text}
                            </Typography>
                        </Button>
                    ))}
                </FormControl>
            );
        } else {
            const directions = ['left', 'right'];
            const randomDir = directions[getRandomValues([2])]
            const [r1, r2, r3] = getRandomValues([10, 10, 10])
            return (
                <>  
                    <Dcl 
                        type={'Simple'}
                        keys={['horizontal-plane', 'body', 'body-center', `${randomDir}`]} 
                        modifications={[
                            {id: 'value', newText: `${r1*10}N`},
                            {id: 'sub', newText: ''},
                            {id: 'name-vector', newText: ''},
                        ]}
                    />
                    {/* <Dcl 
                        type={'Complex'}
                        keys={['inclined-plane', 'body', 'body-center', 'blue', 'pink', 'blue-pink-arch']} 
                        modifications={[
                            {id: 'blue-value', newText: '10N'},
                            {id: 'pink-value', newText: '10N'},
                            {id: 'blue-pink-arch-value', newText: '10N'},
                        ]}
                    /> */}
                    <input
                        type="text"
                        value={selectedAnswer}
                        onChange={handleAnswerChange}
                    style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                </>
            );
        }
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {!quizStarted && !isCompleted ? (
                <>
                    <Typography variant="h6" gutterBottom color='#111111'>
                        {task.name}
                    </Typography>
                    <Button variant="contained" sx={{ marginTop: '20px', backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }} onClick={handleStartQuiz}>
                        Start Quiz
                    </Button>
                </>
            ) : (
                <>
                    {isCompleted || score / Allquestions.length === 1 ? (
                        <div>
                            <Typography variant="h5" color='#111111'>Quiz Completed!</Typography>
                            <Typography variant="h6" color='#111111'>Your score: {score} out of {Allquestions.length}</Typography>
                            <Typography variant="h6" color='#111111'>Score Percentage: {scorePercentage.toFixed(2)}%</Typography>
                            <Button variant="contained" onClick={() => handleReturn(scorePercentage)} color="secondary" sx={{ marginTop: '20px', backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}>
                                Return to Tasks
                            </Button>
                        </div>
                    ) : (
                        <>
                            {questions.length > 0 && currentIndex < questions.length && (
                                <div>
                                    <Typography variant="h6" gutterBottom color='#111111'>
                                        {questions[currentIndex].question_text}
                                    </Typography>
                                    <QuestionType
                                        question={questions[currentIndex]}
                                        task={task}
                                    />
                                    <Box mt={3}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            style={{ width: '100%', borderRadius: '10px' }}
                                            sx={{
                                                backgroundColor:'#8AB573' ,
                                                '&:hover': { backgroundColor: '#79a362' }
                                            }}
                                        >
                                            Check
                                        </Button>
                                    </Box>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default QuestionsList;
