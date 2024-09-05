// src/App.js
import TopicList from './components/Topics';
import TasksList from './components/Tasks';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import { AppBar, IconButton, Button, Typography } from '@mui/material'; // Imported Button
import { Toolbar } from '@mui/material';
import { Menu, Search } from '@mui/icons-material';
import QuestionsList from './components/Questions';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

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
        <AppBar id='top-app-bar' position='fixed' sx={{backgroundColor:"#D9FFD9"}}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ color: '#111111'}}>
            BasicFisics
            </Typography>
            <Box sx={{ marginLeft: 'auto' }}>
            {currentUser ? (
              <Button color='#111111' onClick={handleLogout}>
              <Typography variant="h7" component="div" sx={{ color: '#111111'}}>
                Logout
              </Typography>
              </Button>
            ) : (
              <>
                <Link to='/login' style={{ marginRight: '10px', color: '#111111', textDecoration: 'none' }}>
                  <Button color='#111111'>Log in</Button>
                </Link>
                <Link to='/signup' style={{ color: '#111111', textDecoration: 'none' }}>
                  <Button color='#111111'>Signup</Button>
                </Link>
              </>
            )}
            </Box>
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
