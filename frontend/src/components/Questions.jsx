import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function QuestionsList() {
    const { taskId } = useParams();
    const location = useLocation();
    const task = location.state?.task;

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [userQuestions, setUserQuestions] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

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
        // Calculate the score based on the userQuestions data
        const calculateScore = () => {
            const correctAnswersCount = userQuestions.filter(
                userQuestion => userQuestion.user_id === currentUser?.id &&
                    userQuestion.correct &&
                    questions.some(question => question.id === userQuestion.question_id)
            ).length;
            return correctAnswersCount;
        };

        // Update the score when userQuestions or questions are updated
        const score = calculateScore();
        const remainingQuestions = questions.filter(question => {
            const userQuestion = userQuestions.find(
                uq => uq.question_id === question.id && uq.user_id === currentUser?.id
            );
            return !userQuestion || !userQuestion.correct;
        });

        if (remainingQuestions.length === 0) {
            setIsCompleted(true); // All questions have been answered correctly
        }

    }, [userQuestions, questions, currentUser]);

    useEffect(() => {
        setIsCompleted(false);
        const findNextUnansweredQuestion = () => {
            let nextIndex = currentIndex;
    
            while (nextIndex < questions.length) {
                const currentUserQuestion = userQuestions.find(
                    userQuestion =>
                        userQuestion.question_id === questions[nextIndex]?.id &&
                        userQuestion.user_id === currentUser?.id
                );
    
                if (!currentUserQuestion || !currentUserQuestion.correct) {
                    break;
                }
    
                nextIndex += 1;
            }
            if (nextIndex >= questions.length) {
                setIsCompleted(true); 
            } else {
                setCurrentIndex(nextIndex);
            }
        };
    
        if (questions.length > 0) {
            findNextUnansweredQuestion();
        }
    }, [questions, userQuestions, currentUser]);
    

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

            if (existingUserQuestion) {
                axiosInstance.put(`/user_questions/${existingUserQuestion.id}`, {
                    correct: selectedAnswerObj.correct
                })
                .then(() => {
                    setRefresh(!refresh);
                })
                .catch((error) => {
                    console.error(error);
                });
            } else {
                axiosInstance.post('/user_questions', {
                    user_id: currentUser.id,
                    question_id: questions[currentIndex].id,
                    correct: selectedAnswerObj.correct
                })
                .then(() => {
                    setRefresh(!refresh);
                })
                .catch((error) => {
                    console.error(error);
                });
            }

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setIsCompleted(true);
            }
        } else {
            console.log('No answer selected');
        }
    };

    const score = userQuestions.filter(
        userQuestion => userQuestion.user_id === currentUser?.id && userQuestion.correct
    ).length;

    const scorePercentage = (score / questions.length) * 100;

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
            {isCompleted ? (
                <div>
                    <h3>Quiz Completed!</h3>
                    <p>Your score: {score} out of {questions.length}</p>
                    <p>Score Percentage: {scorePercentage.toFixed(2)}%</p>
                    <Link to={`/topics/${task.topic_id}/tasks`}>
                        <Button variant="contained">Return to Tasks</Button>
                    </Link>
                </div>
            ) : (
                <>
                    {questions.length > 0 && currentIndex < questions.length && (
                        <div>
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
        </div>
    );
}

export default QuestionsList;
