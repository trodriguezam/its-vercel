// src/components/TopicList.js
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import './TopicList.css';

function TopicList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axiosInstance.get('/topics')
      .then(response => {
        setTopics(response.data);
      })
      .catch(error => {
        console.error('Error fetching topics:', error);
      });
  }, []);

  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(topic => (
          <li key={topic.id}>
            <div>
              <h2>{topic.name}</h2>
            </div>
            <div>
              <p><strong>Prerequisites:</strong> {topic.prerequisites || 'None'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicList;