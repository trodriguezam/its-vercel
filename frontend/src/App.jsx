// src/App.js
import TopicList from './components/TopicList';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';
import './App.css';
import Dcl from './utils/svg-editor'

function App() {
  return (
    <div className="App">
      {/* <SignupForm /> */}
      <Dcl />
    </div>
  );
}

export default App;
