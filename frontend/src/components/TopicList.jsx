// src/components/TopicList.js
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import './TopicList.css';

function TopicList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // Solicitud a la API para obtener los tópicos
    axiosInstance.get('/topics')
      .then(response => {
        setTopics(response.data);
      })
      .catch(error => {
        console.error('Error fetching topics:', error);
      });
  }, []);

  return (
    <div className="topic-list-container">
      <h1 className="title">Topics</h1>
      <ul className="topic-list">
        {topics.map(topic => (
          <li key={topic.id} className="topic-item">
            <div className="topic-header">
              <h2>{topic.name}</h2>
            </div>
            <div className="topic-details">
              <p><strong>Prerequisites:</strong> {topic.prerequisites || 'None'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicList;
