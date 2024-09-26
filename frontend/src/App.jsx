import TopicList from './components/Topics';
import TasksList from './components/Tasks';
import HomePage from './components/Home';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import QuestionForm from './components/CreateQuestion';
import UserData from './components/UserModel';
import './App.css';
import { AppBar, IconButton, Button, Typography } from '@mui/material'; // Imported Button
import { Toolbar } from '@mui/material';
import {  Menu, Search } from '@mui/icons-material';
import QuestionsList from './components/Questions';
import DashboardList from './components/Dashboards';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import axiosInstance from './api/axiosInstance';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const GetTime = (logTime) => {
    const currentTime = new Date().getTime();
    const loginTime = new Date(logTime).getTime();
    const differenceInMilliseconds = currentTime - loginTime;
    return Math.floor(differenceInMilliseconds / 1000);
  };

  const handleLogout = () => {
    const storedLoginTime = localStorage.getItem('LoginTime');

    if (currentUser && storedLoginTime) {
      const timeDifferenceInSeconds = GetTime(storedLoginTime);

      const updatedTimeSpent = (currentUser.time_spent || 0) + timeDifferenceInSeconds;

      axiosInstance.put(`/users/${currentUser.id}`, { time_spent: updatedTimeSpent })
      .then(() => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('LoginTime');
        setCurrentUser(null);
        navigate('/login');
      });
    } else {
      console.error('Login time not found or user is not logged in.');
    }
  };

  return (
    <>
      <div className="App">
      <AppBar id='top-app-bar' position='fixed' sx={{ backgroundColor: "#D9FFD9" }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ color: '#111111', marginRight: '20px' }}>
              BasicFisics
            </Typography>

            {currentUser && (
              <>
                {currentUser.role === "user" ? (
                  <Link to='/topics' style={{ marginRight: '10px', color: '#111111' }}>
                    <Button color='#111111'>
                      <Typography variant="body1" component="div" sx={{ color: '#111111' }}>
                        Temas
                      </Typography>
                    </Button>
                  </Link>
                ) : currentUser.role === "professor" ? (
                  <>
                  <Link to='/dashboards' style={{ marginRight: '10px', color: '#111111' }}>
                    <Button color='#111111'>
                      <Typography variant="body1" component="div" sx={{ color: '#111111' }}>
                        Dashboard
                      </Typography>
                    </Button>
                  </Link>
                  <Link to='/question_create' style={{ marginRight: '10px', color: '#111111' }}>
                    <Button color='#111111'>
                      <Typography variant="body1" component="div" sx={{ color: '#111111' }}>
                        Crear Pregunta
                      </Typography>
                    </Button>
                  </Link>
                  </>
                  
                ) : null}
              </>
            )}
          </Box>
          
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {currentUser ? (
              <>
                {(currentUser.role === "professor" || (currentUser.role === "user" && location.pathname === '/topics')) ? (
                  <Button color='#111111' onClick={handleLogout}>
                    <Typography variant="body1" component="div" sx={{ color: '#111111' }}>
                      Logout
                    </Typography>
                  </Button>
                ) : (
                  // Show message when user is not on the topics page
                  currentUser.role === "user" && location.pathname !== '/topics' && (
                    <Typography variant="body1" component="div" sx={{ color: '#111111', marginLeft: '10px' }}>
                      Finaliza sesión en Temas
                    </Typography>
                  )
                )}
              </>
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
        <Route path="/" element={<HomePage />} />
        <Route path="/topics" element={<TopicList />} />
        <Route path="/topics/:topicId/tasks" element={<TasksList />} />
        <Route path="/tasks/:taskId/questions" element={<QuestionsList />} />
        <Route path="/dashboards" element={<DashboardList />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users/:userId" element={<UserData />} />
        <Route path="/question_create" element={<QuestionForm />} />
      </Routes>
    </>
  );
}

export default App;
