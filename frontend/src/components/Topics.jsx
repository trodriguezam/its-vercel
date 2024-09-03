import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import Button from '@mui/material/Button';

function TopicList() {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        axiosInstance.get('/topics')
            .then((res) => {
                setTopics(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>Topics</h1>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id} style={{ color: 'white' }}>
                        {topic.name}
                        <Link to={`/topics/${topic.id}/tasks`}>
                            <Button variant="contained">View Tasks</Button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopicList;
