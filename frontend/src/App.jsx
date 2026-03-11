import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import GenerateQuiz from "./pages/GenerateQuiz";
import QuizAttempt from "./pages/QuizAttempt";
import Result from "./pages/Result";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";
import JoinContest from "./pages/JoinContest";
import ContestAttempt from "./pages/ContestAttempt";
import ContestLeaderboard from "./pages/ContestLeaderboard";
import CreateContest from "./pages/CreateContest";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import QuizReview from "./pages/QuizReview";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<GenerateQuiz />} />
          <Route path="/quiz/:id" element={<QuizAttempt />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/join-contest" element={<JoinContest />} />
          <Route path="/contest/:contestId" element={<ContestAttempt />} />
          <Route path="/contest-leaderboard/:contestId" element={<ContestLeaderboard />} />
          <Route path="/create-contest" element={<CreateContest />} />
          <Route path="/quiz-review/:id" element={<QuizReview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
