import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import  Dcl from '../utils/SvgEditor'

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

    // useEffect(() => {
    //     const correctQuestions = userQuestions.filter(
    //         userQuestion => userQuestion.user_id === currentUser?.id && userQuestion.correct
    //     );
    //     const remainingQuestions = Allquestions.filter(question => 
    //         !correctQuestions.some(
    //             userQuestion => userQuestion.question_id === question.id
    //         )
    //     );

    //     setQ(remainingQuestions);

    //     if (remainingQuestions.length === 0 && Allquestions.length > 0) {
    //         setIsCompleted(true);
    //     }

    // }, [userQuestions, Allquestions]);


    useEffect(() => {
        if (Allquestions.length > 0 && Allquestions[currentIndex]) {
            axiosInstance.get(`/questions/${Allquestions[currentIndex].id}/answers`)
                .then((res) => {
                    setAnswers(res.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [currentIndex, Allquestions]);

    const handleAnswerChange = (event) => {
        setSelectedAnswer(Number(event.target.value));
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
                    question_id: Allquestions[currentIndex].id,
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

    const getRandomValues = (samples) => {
        return samples.map(range => Math.floor(Math.random() * range + 1));
    }

    function QuestionType({ question, task }) {
        if (task.task_type === 'Option') {
            return (
                <>
                    <ul>
                        {answers.map((answer) => (
                            <li key={answer.id}>
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
                </>
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
                    />
                </>
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
                            {Allquestions.length > 0 && currentIndex < Allquestions.length && (
                                <div>
                                    <h2>id:{currentIndex}, {Allquestions.length}</h2>
                                    <li key={Allquestions[currentIndex].id}>
                                        <p key={Allquestions[currentIndex].id}>
                                            {Allquestions[currentIndex].question_text}
                                        </p>
                                    </li>
                                    <QuestionType question={Allquestions[currentIndex]} task={task} />
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
