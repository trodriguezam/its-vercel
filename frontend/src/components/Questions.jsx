import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button, Typography, FormControl, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box } from '@mui/system';
import  Dcl from '../utils/SvgEditor'
import { set } from 'date-fns';
import { setIn } from 'formik';
import axios from 'axios';

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
    const [hint, setHint] = useState(0);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const [inputValue, setInputValue] = useState('');
    const [r1, setR1] = useState(0);
    const [r2, setR2] = useState(0);
    const [r3, setR3] = useState(0);
    const [taskDifficulty, setTaskDifficulty] = useState(0);
    const [randomDir, setRandomDir] = useState('');

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

    useEffect(() => {
        const directions = ['right', 'left'];
        const randomDir = directions[getRandomValues([2])[0] - 1];
        const [r1, r2, r3] = getRandomValues([10, 10, 10])

        setRandomDir(randomDir);
        setR1(r1);
        setR2(r2);
        setR3(r3);

    }, []);

    function DLCComponent( {DLCType} ) {

        console.log(r1)
        console.log(randomDir)

        if (DLCType === 'Simple') { 
            return (
                <>
                    <Dcl 
                        type={'Simple'}
                        keys={['horizontal-plane', 'body', 'body-center', randomDir]} 
                        modifications={[
                            {id: 'value', newText: r1*10},
                            {id: 'sub', newText: ''},
                            {id: 'name-vector', newText: ''},
                        ]}
                    />
                </>
            )
        } else 
        if (DLCType === 'Complex') {
            return (
                <>
                    <Dcl 
                        type={'Complex'}
                        keys={['inclined-plane', 'body', 'body-center', 'blue', 'pink', 'blue-pink-arch']} 
                        modifications={[
                            {id: 'blue-value', newText: r1*10},
                            {id: 'pink-value', newText: r2*10},
                            {id: 'blue-pink-arch-value', newText: r3*10},
                        ]}
                    />
                </>
            )
        }
    }

    const handleAnswerChange = (answerId) => {
        setSelectedAnswer(answerId);
    };

    const handleUpdate = () => {
        setRefresh(!refresh);
        setHint(0);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finalizeQuiz();
        }
    };


    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            const selectedAnswerObj = answers.find(answer => answer.id === selectedAnswer);

            const existingUserQuestion = userQuestions.find(
                userQuestion =>
                    userQuestion.question_id === questions[currentIndex].id &&
                    userQuestion.user_id === currentUser?.id
            );
            
            const handleHint = () => {
                if (selectedAnswerObj.correct) {
                    setHint(1);
                } else {
                    setHint(2);
                }
            };

            if (existingUserQuestion) {
                axiosInstance.put(`/user_questions/${existingUserQuestion.id}`, {
                    correct: selectedAnswerObj.correct,
                    try: existingUserQuestion.try + 1
                })
                .then(handleHint)
                .catch((error) => console.error(error));
            } else {
                axiosInstance.post('/user_questions', {
                    user_id: currentUser.id,
                    question_id: questions[currentIndex].id,
                    correct: selectedAnswerObj.correct,
                    try: 1
                })
                .then(handleHint)
                .catch((error) => console.error(error));
            }
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

    const handleInputSumbit = () => {
        if (((Number(inputValue) === (r1*10)) && task.difficulty === 1) || (task.difficulty > 1 && (Number(inputValue) === (r2*10)))) {
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
                        completion: 100
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
                        completion: 100
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
            
        } else {
            console.log('Incorrect Answer');
        }
    }

    function QuestionType({ question, task }) {
        if (task.task_type === 'Option') {
            return (
                <>
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
                </>
            );
        } else {
            return (
                <>
                    <DLCComponent DLCType={'Simple'}/>
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
                {task.task_type === 'Option' ? (
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
                                    </div>
                                )}
                                {hint === 0 ? (
                                <Box mt={3}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    color="primary"
                                    style={{ width: '100%', borderRadius: '10px' }}
                                    sx={{
                                    backgroundColor: '#8AB573',
                                    '&:hover': { backgroundColor: '#79a362' }
                                    }}
                                >
                                    Check
                                </Button>
                                </Box>
                            ) : (
                                <Card variant="outlined" sx={{ mt: 3, backgroundColor: hint === 1 ? '#d9ffd6' : '#ffe3de', padding: '10px' }}>
                                <CardContent>
                                    {hint === 1 ? (
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <CheckCircleIcon color="success" sx={{ fontSize: '40px', marginRight: '10px' }} />
                                        <Typography variant="h6" color='green'>Correcto!</Typography>
                                    </Box>
                                    ) : (
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <CancelIcon color="error" sx={{ fontSize: '40px', marginRight: '10px' }} />
                                        <Typography variant="h6" color='red'>Incorrecto!</Typography>
                                    </Box>
                                    )}
                                    <Typography variant="body1" mt={2} color='#333'>
                                    {hint === 1 ? "Buen Trabajo!" : <Typography>Hint: {questions[currentIndex].hint}</Typography>}
                                    </Typography>
                                    <Box mt={3}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdate}
                                        style={{ width: '100%', borderRadius: '10px' }}
                                        sx={{
                                        backgroundColor: hint === 1 ? '#8AB573' : '#FF6B6B',
                                        '&:hover': { backgroundColor: hint === 1 ? '#79a362' : '#ff5a5a' }
                                        }}
                                    >
                                        Next
                                    </Button>
                                    </Box>
                                </CardContent>
                                </Card>
                            )}
                            </>
                        )}
                    </>) : 
                    (
                        <>
                            {task.difficulty == 1 ? (
                                <>
                                    <Typography variant="h3" gutterBottom color='#111111'>
                                        Cual debe ser el valor de F1 para compensar los {r1*10}N
                                    </Typography>
                                    <DLCComponent DLCType={'Simple'}/>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h3" gutterBottom color='#111111'>
                                        Cual debe ser el valor de F1 para compensar los {r2*10}N
                                    </Typography>
                                    <DLCComponent DLCType={'Complex'}/>
                                </>
                            )}
                            <Box mt={3}>
                                <FormControl>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        style={{ padding: '10px', width: '100%', borderRadius: '10px', border: '1px solid #ccc' }}
                                    />
                                </FormControl>
                            </Box>
                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    onClick={handleInputSumbit}
                                    color="primary"
                                    style={{ width: '100%', borderRadius: '10px' }}
                                    sx={{
                                    backgroundColor: '#8AB573',
                                    '&:hover': { backgroundColor: '#79a362' }
                                    }}
                                >
                                    Check
                                </Button>
                            </Box>
                        </>    
                    )}
                </>
            )}
        </div>
    );
}

export default QuestionsList;
