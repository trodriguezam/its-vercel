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
    const [hint1, setHint1] = useState(-1);
    const [hint2, setHint2] = useState(-1);
    const [hintsArray, setHintsArray] = useState([]);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const [inputValue, setInputValue] = useState('');
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [result0, setResult0] = useState(1);
    const [result1, setResult1] = useState(1);
    const [result2, setResult2] = useState(1);
    const [r1, setR1] = useState(0);
    const [r2, setR2] = useState(0);
    const [r3, setR3] = useState(0);
    const [taskDifficulty, setTaskDifficulty] = useState(0);
    const [randomDir, setRandomDir] = useState('');
    const directions = ['right', 'left'];

    useEffect(() => {
        axiosInstance.get(`/tasks/${taskId}/questions`)
            .then((res) => {
                setAllquestions(res.data);
                if (res.data.length > 0) {
                    if (res.data[0].hint.includes('|')) {
                        const var2hints = res.data[0].hint.split('|');
                        setHintsArray(var2hints.map(hint => hint.split(';')));
                    } else {
                        const aux = res.data[0].hint.split(';');
                        console.log(res.data)
                        setHintsArray(aux);
                    }
                }
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
        const randomDir = directions[getRandomValues([2])[0] - 1];
        const [r1, r2, r3] = getRandomValues([10, 10, 10])

        setRandomDir(randomDir);
        setR1(r1);
        setR2(r2);
        setR3(r3);

    }, []);

    function DLCComponent( {DLCType} ) {
        if (DLCType === 'Simple') { 
            return (
                <>
                    <Dcl 
                        type={'Simple'}
                        keys={['horizontal-plane', 'body', 'body-center', randomDir, directions.filter(dir => dir !== randomDir)[0]]} 
                        modifications={[
                            {id: 'value', newText: r1*10},
                            {id: 'sub', newText: ''},
                            {id: 'name-vector', newText: ''},
                        ]}
                    />
                </>
            )
        } else if (DLCType === 'Mid' ){
            return (
                <>
                    <Dcl 
                        type={'Mid'}
                        keys={['horizontal-plane', 'body', 'body-center', 'left']}
                    />
                </>
            )
        } else if (DLCType === 'Complex') {
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

    const handleSkip = () => {
        setRefresh(!refresh);
        setHint(0);

        const existingUserQuestion = userQuestions.find(
            userQuestion =>
                userQuestion.question_id === questions[currentIndex].id &&
                userQuestion.user_id === currentUser?.id
        );

        if (existingUserQuestion) {
            axiosInstance.put(`/user_questions/${existingUserQuestion.id}`, {
                correct: false,
            })
            .catch((error) => console.error(error));
        } else {
            axiosInstance.post('/user_questions', {
                user_id: currentUser.id,
                question_id: questions[currentIndex].id,
                correct: false,
                try: 0
            })
            .catch((error) => console.error(error));
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finalizeQuiz();
        }
    }


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
                    try: typeof existingUserQuestion.try === 'undefined' ? 1 : existingUserQuestion.try + 1
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
    
    const getTries = (question) => {
        return userQuestions.find(
            userQuestion =>
                userQuestion.question_id === question.id &&
                userQuestion.user_id === currentUser?.id
        )?.try;
    }

    const getCorrectAnswer = (question) => {
        return answers.find(
            answer =>
                answer.question_id === question.id &&
                answer.correct === true
        )?.answer_text
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
            setResult0(0);
        }
    }

    const handleInputSumbit2 = () => {
        // cambiar logica
        if ((Number(inputValue1) === (r1*10)) && (Number(inputValue2) === (r2*10))) {
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
        } else if (Number(inputValue1) === (r1*10)) {
            console.log('Incorrect Answer 2');
            setResult1(2);
            setResult2(0);
            setHint2(hint2 + 1);
        } else if (Number(inputValue2) === (r2*10)) {
            console.log('Incorrect Answer 1');
            setResult1(0);
            setResult2(2);
            setHint1(hint1 + 1);
        } else {
            console.log('Incorrect Answer');
            setResult1(0);
            setResult2(0);
            setHint2(hint2 + 1);
            setHint1(hint1 + 1);
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

    if (!currentUser || currentUser.role !== 'user') {
        return (
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
                <Typography 
                    variant="h3" 
                    sx={{ mb: 4, textAlign: 'center', color: '#111111', fontWeight: 'bold' }}
                >
                    Questions
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
                            <Typography variant="h5" color='#111111'>Quiz Terminado!</Typography>
                            <Typography variant="h6" color='#111111'>Tu puntuación: {score} de {Allquestions.length}</Typography>
                            <Typography variant="h6" color='#111111'>Porcentaje de acierto: {scorePercentage.toFixed(2)}%</Typography>
                            <Button variant="contained" onClick={() => handleReturn(scorePercentage.toFixed(2))} color="secondary" sx={{ marginTop: '20px', backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}>
                                Return to Tasks
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Typography variant="h5" gutterBottom color='#111111'>Pregunta {currentIndex+1}/{questions.length}</Typography>
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
                            <Box mt={3} sx={{ display: 'flex', gap: '10px' }}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                color="primary"
                                style={{ flex: 1, borderRadius: '10px' }}
                                sx={{
                                    backgroundColor: '#8AB573',
                                    '&:hover': { backgroundColor: '#79a362' }
                                }}
                            >
                                Confirmar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSkip}
                                color="primary"
                                style={{ flex: 1, borderRadius: '10px' }}
                                sx={{
                                    backgroundColor: '#8AB573',
                                    '&:hover': { backgroundColor: '#79a362' }
                                }}
                            >
                                Saltar Pregunta
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
                                {hint === 1 ? "Buen Trabajo!" : 
                                hint === 2 && getTries(questions[currentIndex]) < 2 ? <Typography>Hint: {questions[currentIndex].hint}</Typography> : 
                                hint === 2 && getTries(questions[currentIndex]) >= 2 ? <Typography>La respuesta correcta es: {getCorrectAnswer(questions[currentIndex])}</Typography> : null
                                }
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
                                    Siguiente
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
                            <br />
                            <br />
                            {task.difficulty == 1 ? (
                                <>
                                    <Typography variant="h3" gutterBottom color='#111111'>
                                        {Allquestions[0].question_text}
                                    </Typography>
                                    <DLCComponent DLCType={'Simple'}/>
                                    <Box mt={3}>
                                        <FormControl>
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                style={{ padding: '10px', width: '100%', borderRadius: '10px', border: '1px solid #ccc' }}
                                            />
                                        </FormControl>
                                        <br />
                                        {result0 === 0 ? (
                                            <Typography variant="h6" color='red'>Incorrect Answer</Typography>
                                            ) : (
                                                result0 === 2 ? (
                                                    <Typography variant="h6" color='green'>Correct Answer!</Typography>
                                                ) : null
                                            )}
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
                            ) : (
                                <>
                                    {task.difficulty == 2 ? (
                                        <>
                                            <Typography variant="h3" gutterBottom color='#111111'>
                                                {Allquestions[0].question_text}
                                            </Typography>
                                            <br />
                                            <DLCComponent DLCType={'Mid'}/>
                                            <Box mt={3}>
                                                <FormControl>
                                                    <input
                                                        type="text"
                                                        value={inputValue}
                                                        onChange={(e) => setInputValue(e.target.value)}
                                                        style={{ padding: '10px', width: '100%', borderRadius: '10px', border: '1px solid #ccc' }}
                                                    />
                                                </FormControl>
                                                <br />
                                                {result0 === 0 ? (
                                                    <Typography variant="h6" color='red'>Incorrect Answer</Typography>
                                                    ) : (
                                                        result0 === 2 ? (
                                                            <Typography variant="h6" color='green'>Correct Answer!</Typography>
                                                        ) : null
                                                    )}
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
                                    ):(
                                        <>
                                            {task.difficulty == 3 ? (
                                                <>
                                                    <Typography variant="h3" gutterBottom color='#111111'>
                                                        {Allquestions[0].question_text}
                                                    </Typography>
                                                    <Typography>
                                                        {(result1 === 0) ? (
                                                            hintsArray[0][(hint1 < hintsArray.length) ? hint1 : hintsArray[0].length - 1]
                                                        ) : null}
                                                        {(result2 === 0) ? (
                                                            hintsArray[1][(hint2 < hintsArray.length) ? hint2 : hintsArray[1].length - 1]
                                                        ) : null}
                                                    </Typography>
                                                    <DLCComponent DLCType={'Complex'}/>
                                                    <Box mt={3}>
                                                        <FormControl>
                                                            <input
                                                                type="text"
                                                                value={inputValue1}
                                                                onChange={(e) => setInputValue1(e.target.value)}
                                                                style={{ padding: '10px', width: '100%', borderRadius: '10px', border: '1px solid #ccc' }}
                                                            />
                                                        </FormControl>
                                                        <br />
                                                        {result1 === 0 ? (
                                                            <Typography variant="h6" color='red'>Incorrect Answer</Typography>
                                                            ) : (
                                                                result1 === 2 ? (
                                                                    <Typography variant="h6" color='green'>Correct Answer!</Typography>
                                                                ) : null
                                                            )}
                                                        <br />
                                                        <FormControl>
                                                            <input
                                                                type="text"
                                                                value={inputValue2}
                                                                onChange={(e) => setInputValue2(e.target.value)}
                                                                style={{ padding: '10px', width: '100%', borderRadius: '10px', border: '1px solid #ccc' }}
                                                            />
                                                        </FormControl>
                                                        <br />
                                                        {result2 === 0 ? (
                                                            <Typography variant="h6" color='red'>Incorrect Answer</Typography>
                                                            ) : (
                                                                result2 === 2 ? (
                                                                    <Typography variant="h6" color='green'>Correct Answer!</Typography>
                                                                ) : null
                                                            )}
                                                    </Box>
                                                    <Box mt={3}>
                                                        <Button
                                                            variant="contained"
                                                            onClick={handleInputSumbit2}
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
                                            ) : (null)}
                                        </>
                                    )}
                                    
                                </>
                            )}
                            
                        </>    
                    )}
                </>
            )}
        </div>
    );
}

export default QuestionsList;
