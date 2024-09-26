import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button, Typography, FormControl, Card, CardContent } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box } from '@mui/system';
import { set } from 'date-fns';
import { setIn } from 'formik';
import axios from 'axios';

import SimpleGravedad from '../assets/gravedad/SimpleGravedad.svg?react';
import ComplexGravedad from '../assets/gravedad/ComplexGravedad.svg?react';
import SimpleTiposFuerza from '../assets/tiposFuerza/SimpleTiposFuerza.svg?react';
import ComplexTiposFuerza from '../assets/tiposFuerza/ComplexTiposFuerza.svg?react';
import SimpleDCL from '../assets/dcl/SimpleDcl.svg?react';
import ComplexDCL from '../assets/dcl/ComplexDcl.svg?react';
import SimpleEquilibrio from '../assets/equilibrio/SimpleEquilibrio.svg?react';
import ComplexEquilibrio from '../assets/equilibrio/ComplexEquilibrio.svg?react';
import SimplePoleas from '../assets/poleas/SimplePoleas.svg?react';
import ComplexPoleas from '../assets/poleas/ComplexPoleas.svg?react';

function QuestionsList() {
    const { taskId } = useParams();
    const location = useLocation();
    const task = location.state?.task;
    const questions = location.state?.questions;
    const navigate = useNavigate();

    const [topicId, setTopicId] = useState(0);
    const [topicName, setTopicName] = useState('');
    const [SVGname, setSVGname] = useState('');
    const [answers, setAnswers] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [Allquestions, setAllquestions] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [hint, setHint] = useState(0);
    const [hintDev, setHintDev] = useState(-1);
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
    const [l1, setL1] = useState(0);
    const [l2, setL2] = useState(0);
    const [l3, setL3] = useState(0);
    const [l4, setL4] = useState(0);
    const [l5, setL5] = useState(0);
    const [l6, setL6] = useState(0);
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
        const [r1, r2, l1, l2, l3, l4, l5, l6] = getRandomValues([10, 10, 4, 4, 4, 4, 4, 4])

        setRandomDir(randomDir);
        setR1(r1);
        setR2(r2);
        setL1(l1);
        setL2(l2);
        setL3(l3);
        setL4(l4);
        setL5(l5);
        setL6(l6);

    }, []);

    useEffect(() => {
        axiosInstance.get(`/tasks/${taskId}`)
            .then((res) => {
                setTopicId(res.data.topic_id)
                console.log(res.data.topic_id)
                setTaskDifficulty(res.data.difficulty)
                console.log(res.data.difficulty)
            }) 
            .catch((error) => console.error(error));
    }, [taskId]);

    useEffect(() => {
        axiosInstance.get(`/topics/${topicId}`)
            .then((res) => {
                setTopicName(res.data.name)
                console.log(res.data.name)
            })
            .catch((error) => console.error(error));
    }, [topicId]);

    useEffect(() => {
        if(taskDifficulty === 1) {
            if (topicName === 'Centro de Gravedad') {
                setSVGname('SimpleGravedad');
            } else if (topicName === 'Tipos de Fuerzas más Comunes') {
                setSVGname('SimpleTiposFuerza');
            } else if (topicName === 'Diagrama de Cuerpo Libre') {
                setSVGname('SimpleDCL');
            } else if (topicName === 'Rozamiento y Poleas') {
                setSVGname('SimplePoleas');
            } else if (topicName === 'Condiciones de Equilibrio y Gravedad') {
                setSVGname('SimpleEquilibrio');
            }
        } else if (taskDifficulty > 1) {
            if (topicName === 'Centro de Gravedad') {
                setSVGname('ComplexGravedad');
            } else if (topicName === 'Tipos de Fuerzas más Comunes') {
                setSVGname('ComplexTiposFuerza');
            } else if (topicName === 'Diagrama de Cuerpo Libre') {
                setSVGname('ComplexDCL');
            } else if (topicName === 'Rozamiento y Poleas') {
                setSVGname('ComplexPoleas');
            } else if (topicName === 'Condiciones de Equilibrio y Gravedad') {
                setSVGname('ComplexEquilibrio');
            }
        }

    }, [topicName, taskDifficulty]);

    function DLCComponent( {DLCType} ) {
        if (DLCType === 'SimpleGravedad') {
            return (
                <>
                    <SimpleGravedad />
                </>
            )
        } else if (DLCType === 'ComplexGravedad') {
            return (
                <>
                    <ComplexGravedad />
                </>
            )
        } else if (DLCType === 'SimpleTiposFuerza') {
            return (
                <>
                    <SimpleTiposFuerza />
                </>
            )
        } else if (DLCType === 'ComplexTiposFuerza') {
            return (
                <>
                    <ComplexTiposFuerza />
                </>
            )
        } else if (DLCType === 'SimpleDCL') {
            return (
                <>
                    <SimpleDCL />
                </>
            )
        } else if (DLCType === 'ComplexDCL') {
            return (
                <>
                    <ComplexDCL />
                </>
            )
        } else if (DLCType === 'SimpleEquilibrio') {
            return (
                <>
                    <SimpleEquilibrio />
                </>
            )
        } else if (DLCType === 'ComplexEquilibrio') {
            return (
                <>
                    <ComplexEquilibrio />
                </>
            )
        } else if (DLCType === 'SimplePoleas') {
            return (
                <>
                    <SimplePoleas />
                </>
            )
        } else if (DLCType === 'ComplexPoleas') {
            return (
                <>
                    <ComplexPoleas />
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

    const score = userQuestions.filter(userQuestion => {
        const QS = Allquestions.find(q => q.id === userQuestion.question_id && q.task_id === parseInt(taskId));
        return userQuestion.user_id === currentUser?.id && userQuestion.correct && QS;
    }).length;

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

    function sendInputResult() {
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
    }

    const handleInputSumbit = () => {
        if (SVGname === 'SimpleGravedad') {
            const expected = (r1*2 + r2*4) / (r1 + r2);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);
        } else if (SVGname === 'ComplexGravedad') {
            const values = inputValue.replace(/[()]/g, '').split(',').map(Number);
            const expected1 = (l1 * 2 + l3 * 3 + l5 * 1) / (6);
            const expected2 = (l2 * 2 + l4 * 3 + l6 * 1) / (6);
            console.log(values, expected1, expected2);
            if (Math.abs(values[0] - expected1) <= 1 && Math.abs(values[1] - expected2) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);
        } else if (SVGname === 'SimpleTiposFuerza') {
            const expected = r1*10*0.3*10;
            console.log(expected, inputValue);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);
        } else if (SVGname === 'ComplexTiposFuerza') {
            const expcted = Math.abs(r1 - r2)*10;
            console.log(expcted, inputValue);
            if(Math.abs(Number(inputValue) - expcted) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);

        } else if (SVGname === 'SimpleDCL') {
            const expected = Math.abs(r1*10*10);
            console.log(expected, inputValue);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);

        } else if (SVGname === 'ComplexDCL') {

            const expected = Math.abs(r1*10*10*Math.cos(30*Math.PI/180));
            console.log(expected, inputValue);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);

        } else if (SVGname === 'SimpleEquilibrio') {
            const expected = 100/l1;
            console.log(expected, inputValue);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);
        
        } else if (SVGname === 'ComplexEquilibrio') {
            const expected = r1*20;
            console.log(expected, inputValue);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);
        } else if (SVGname === 'SimplePoleas') {
            const expected = r1*10*0.2;
            console.log(expected, inputValue);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0);setHintDev(hintDev + 1);
        } else if (SVGname === 'ComplexPoleas') {
            const expected = r1*100;
            console.log(expected, inputValue);
            if(Math.abs(Number(inputValue) - expected) <= 1) {
                sendInputResult();
            } else setResult0(0); setHintDev(hintDev + 1);
        } else {
            console.log('Invalid SVG name');
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

    console.log(SVGname)

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
                                hint === 2 && getTries(questions[currentIndex]) === 1 ? <Typography>Intenta Denuevo!</Typography> : 
                                hint === 2 && getTries(questions[currentIndex]) > 1 ? <Typography>La respuesta correcta es: {getCorrectAnswer(questions[currentIndex])}</Typography> : null
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
                                <>
                                    <Typography variant="h4" gutterBottom color='#111111'>
                                        {Allquestions[0].question_text.replace('{valor1}', r1*10).replace('{valor2}', r2*10).replace('{distancia1}', l1).replace('{distancia2}', l2).replace('{distancia3}', l3).replace('{distancia4}', l4).replace('{distancia5}', l5).replace('{distancia6}', l6)}
                                    </Typography>
                                    <Typography>
                                        {(result0 === 0) ? (
                                            hintsArray[(hintDev < hintsArray.length) ? hintDev : hintsArray.length - 1]
                                        ) : null}
                                    </Typography>
                                    <DLCComponent DLCType={SVGname}/>
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
                        </>    
                    )}
                </>
            )}
        </div>
    );
}

export default QuestionsList;
