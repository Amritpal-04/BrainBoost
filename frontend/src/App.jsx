import './App.css'
import { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home, { PracticeSetup, StudentProfile, StudentProgress } from './pages/Home';
import Quiz from './pages/Quiz';
import StudentLayout from './pages/StudentLayout';

function App() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<StudentLayout />}>
          <Route index element={<Home />} />
          <Route path="practice/:modeId" element={<PracticeSetup />} />
          <Route path="practice/:modeId/quiz" element={<Quiz />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App
