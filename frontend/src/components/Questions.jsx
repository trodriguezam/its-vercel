import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button, Typography, FormControl } from '@mui/material';
import { Box } from '@mui/system';

function QuestionsList() {
    const { taskId } = useParams();
    const location = useLocation();
    const task = location.state?.task;

    const [Allquestions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        axiosInstance.get(`/tasks/${taskId}/questions`)
            .then((res) => setQuestions(res.data))
            .catch((error) => console.error(error));
    }, [taskId]);

    useEffect(() => {
        axiosInstance.get('/user_questions')
            .then((res) => setUserQuestions(res.data))
            .catch((error) => console.error(error));
    }, [refresh]);

    useEffect(() => {
        if (Allquestions.length > 0 && Allquestions[currentIndex]) {
            axiosInstance.get(`/questions/${Allquestions[currentIndex].id}/answers`)
                .then((res) => setAnswers(res.data))
                .catch((error) => console.error(error));
        }
    }, [currentIndex, Allquestions]);

    const handleAnswerChange = (answerId) => {
        setSelectedAnswer(answerId);
    };

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            const selectedAnswerObj = answers.find(answer => answer.id === selectedAnswer);

            const existingUserQuestion = userQuestions.find(
                userQuestion =>
                    userQuestion.question_id === Allquestions[currentIndex].id &&
                    userQuestion.user_id === currentUser?.id
            );

            const handleUpdate = () => {
                setRefresh(!refresh);

                if (currentIndex < Allquestions.length - 1) {
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
                    question_id: Allquestions[currentIndex].id,
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

    const score = userQuestions.filter(
        userQuestion => userQuestion.user_id === currentUser?.id && userQuestion.correct
    ).length;

    const scorePercentage = (score / Allquestions.length) * 100;

    const handleStartQuiz = () => {
        setIsCompleted(false);
        setQuizStarted(true);
        setCurrentIndex(0);
    };

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
            return (
                <input
                    type="text"
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                    style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                />
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
                    {isCompleted ? (
                        <div>
                            <Typography variant="h5" color='#111111'>Quiz Completed!</Typography>
                            <Typography variant="h6" color='#111111'>Your score: {score} out of {Allquestions.length}</Typography>
                            <Typography variant="h6" color='#111111'>Score Percentage: {scorePercentage.toFixed(2)}%</Typography>
                            <Link to={`/topics/${task.topic_id}/tasks`}>
                                <Button variant="contained" color="secondary" sx={{ marginTop: '20px', backgroundColor: '#8AB573', '&:hover': { backgroundColor: '#79a362' } }}>
                                    Return to Tasks
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {Allquestions.length > 0 && currentIndex < Allquestions.length && (
                                <div>
                                    <Typography variant="h6" gutterBottom color='#111111'>
                                        {Allquestions[currentIndex].question_text}
                                    </Typography>
                                    <QuestionType
                                        question={Allquestions[currentIndex]}
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
