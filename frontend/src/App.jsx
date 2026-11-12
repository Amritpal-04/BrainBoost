import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home, { PracticeSetup, StudentProfile, StudentProgress } from './pages/Home';
import StudentLayout from './pages/StudentLayout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<StudentLayout />}>
          <Route index element={<Home />} />
          <Route path="practice/:modeId" element={<PracticeSetup />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App
