// src/App.js
import TopicList from './components/TopicList';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Welcome to the ITS</h1>
      <SignupForm />
    </div>
  );
}

export default App;
