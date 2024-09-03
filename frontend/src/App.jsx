// src/App.js
import TopicList from './components/Topics';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';
import TasksList from './components/Tasks';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import { AppBar, IconButton } from '@mui/material';
import { Toolbar } from '@mui/material';
import { Menu, Search } from '@mui/icons-material';

function App() {
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
          <Link to='/login'>Log in</Link>
          <Link to='/signup'>Sign up</Link>
          <Link to='/topics'>Topics</Link>

        </Toolbar>
      </AppBar>
        <h1>Welcome to the ITS</h1>
      </div>

      <Routes>
        <Route path="/topics" element={<TopicList />}/>
        <Route path="/topics/:topicId/tasks" element={<TasksList />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </>
  );
}

export default App;
