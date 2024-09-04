import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function QuestionsList() {
    const { taskId } = useParams(); // Get the taskId from the URL
    const location = useLocation();
    const task = location.state?.task;

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [userAnswer, setuserAnswer] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        axiosInstance.get(`/tasks/${taskId}/questions`) // Use the taskId in the API call
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [taskId]);

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

    useEffect(() => {
        axiosInstance.get('/user_answers')
            .then((res) => {
                setuserAnswer(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleAnswerChange = (event) => {
        setSelectedAnswer(Number(event.target.value));
    };

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            console.log(`Selected answer ID: ${selectedAnswer}`);
            if (answers.find(answer => answer.id === selectedAnswer).correct) {
                setScore(score + 1);
            }
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setIsCompleted(true);
            }
            // You can also send the selected answer ID to the server here
        } else {
            console.log('No answer selected');
        }
    };

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
                    {questions.length > 0 && (
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