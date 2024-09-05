import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function QuestionsList() {
    const { taskId } = useParams();
    const location = useLocation();
    const task = location.state?.task;

    const [Allquestions, setQuestions] = useState([]);
    const [questions, setQ] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const Qlenght = questions.length;

    useEffect(() => {
        axiosInstance.get(`/tasks/${taskId}/questions`)
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [taskId]);

    useEffect(() => {
        axiosInstance.get('/user_questions')
            .then((res) => {
                setUserQuestions(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [refresh]);

    useEffect(() => {
        const correctQuestions = userQuestions.filter(
            userQuestion => userQuestion.user_id === currentUser?.id && userQuestion.correct
        );
        const remainingQuestions = Allquestions.filter(question => 
            !correctQuestions.some(
                userQuestion => userQuestion.question_id === question.id
            )
        );

        setQ(remainingQuestions);

        if (remainingQuestions.length === 0 && Allquestions.length > 0) {
            setIsCompleted(true);
        }

    }, [userQuestions, Allquestions]);


    useEffect(() => {
        if (questions.length > 0 && questions[currentIndex]) {
            axiosInstance.get(`/questions/${questions[currentIndex].id}/answers`)
                .then((res) => {
                    setAnswers(res.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [currentIndex, questions]);

    const handleAnswerChange = (event) => {
        setSelectedAnswer(Number(event.target.value));
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
                }
                else if (Qlenght > questions.length) {
                    setCurrentIndex(currentIndex);
                    Qlenght = questions.length;
                }
                else {
                    finalizeQuiz(); 
                }
            };

            if (existingUserQuestion) {
                axiosInstance.put(`/user_questions/${existingUserQuestion.id}`, {
                    correct: selectedAnswerObj.correct
                })
                .then(handleUpdate)
                .catch((error) => {
                    console.error(error);
                });
            } else {
                axiosInstance.post('/user_questions', {
                    user_id: currentUser.id,
                    question_id: questions[currentIndex].id,
                    correct: selectedAnswerObj.correct
                })
                .then(handleUpdate)
                .catch((error) => {
                    console.error(error);
                });
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
                <ul>
                    {answers.map((answer) => (
                        <li key={answer.id} style={{ color: 'white' }}>
                            <label>
                                <input
                                    type="radio"
                                    value={answer.id}
                                    checked={selectedAnswer === answer.id}
                                    onChange={handleAnswerChange}
                                />
                                {answer.answer_text}
                            </label>
                        </li>
                    ))}
                </ul>
            );
        } else {
            return (
                <input
                    type="text"
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                />
            );
        }
    }

    return (
        <div>
            <h2>Task: {task?.name}</h2>
            {!quizStarted && !isCompleted ? (
                <Button variant="contained" onClick={handleStartQuiz}>Start Quiz</Button>
            ) : (
                <>
                    {isCompleted ? (
                        <div>
                            <h3>Quiz Completed!</h3>
                            <p>Your score: {score} out of {Allquestions.length}</p>
                            <p>Score Percentage: {scorePercentage.toFixed(2)}%</p>
                            <Link to={`/topics/${task.topic_id}/tasks`}>
                                <Button variant="contained">Return to Tasks</Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {questions.length > 0 && currentIndex < questions.length && (
                                <div>
                                    <h2>id:{currentIndex}, {questions.length}</h2>
                                    <li key={questions[currentIndex].id} style={{ color: 'white' }}>
                                        <p>{questions[currentIndex].question_text}</p>
                                    </li>
                                    <QuestionType question={questions[currentIndex]} task={task} />
                                    <div>
                                        <button onClick={handleSubmit}>Submit</button>
                                    </div>
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
