import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';


function QuestionsList() {
    const { taskId } = useParams(); // Get the taskId from the URL
    const location = useLocation();
    const task = location.state?.task;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

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
            .then((res2) => {
                setAnswers(res2.data);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }, [currentIndex, questions]);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleAnswerChange = (event) => {
        setSelectedAnswer(Number(event.target.value));
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
            ) 
        }
        else {
            return (
                <input
                    type="text"
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                />
            )
        }
    
    }

    return (
        <div>
            <h2>Task: {task?.name}</h2>
            {questions.length > 0 && (
                <div>
                    <li key={questions[currentIndex].id} style={{ color: 'white' }}>
                        <p>{questions[currentIndex].question_text}</p>
                    </li>
                    <QuestionType question={questions[currentIndex]} task={task}/>
                    <div>
                        <button onClick={handleBack} disabled={currentIndex === 0}>Back</button>
                        <button onClick={handleNext} disabled={currentIndex === questions.length - 1}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionsList;
