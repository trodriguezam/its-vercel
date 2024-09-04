import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import Button from '@mui/material/Button';

function TasksList() {
    const { topicId } = useParams(); // Get the topicId from the URL
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axiosInstance.get(`/topics/${topicId}/tasks`) // Use the topicId in the API call
            .then((res) => {
                setTasks(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [topicId]);

    return (
        <div>
            {tasks.map((task) => (
                    <li key={task.id} style={{ color: 'white' }}>
                        {task.name}
                        <Link to={`/tasks/${task.id}/questions`} state={{task}}>
                            <Button variant="contained">View Questions</Button>
                        </Link>
                    </li>
                ))}
        </div>
    );
}

export default TasksList;
