// src/App.js
import TopicList from './components/Topics';
import TasksList from './components/Tasks';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import { AppBar, IconButton, Button } from '@mui/material'; // Imported Button
import { Toolbar } from '@mui/material';
import { Menu, Search } from '@mui/icons-material';
import QuestionsList from './components/Questions';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Dcl from './utils/SvgEditor'
// import Dcl from './assets/dcl.svg'

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <>
      <div className="App">
        <AppBar id='top-app-bar' position='fixed' color='primary'>
          <Toolbar>
            <IconButton color='inherit' aria-label="drawer">
              <Menu /* style={{ fill: 'rgba(255, 255, 255, 0.75' }}  *//>
            </IconButton>
            <IconButton color='inherit' aria-label="search">
              <Search /* style={{ fill: 'rgba(255, 255, 255, 0.75' }} */ />
            </IconButton>
            {currentUser ? (
              <Button color='inherit' onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Link to='/login' style={{ marginRight: '10px', color: 'white', textDecoration: 'none' }}>
                  <Button color='inherit'>Log in</Button>
                </Link>
                <Link to='/signup' style={{ color: 'white', textDecoration: 'none' }}>
                  <Button color='inherit'>Signup</Button>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </div>

      <Routes>
        <Route path="/topics" element={<TopicList />} />
        <Route path="/topics/:topicId/tasks" element={<TasksList />} />
        <Route path="/tasks/:taskId/questions" element={<QuestionsList />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
