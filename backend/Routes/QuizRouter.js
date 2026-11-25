const router = require("express").Router();
const { ensureAuth } = require("../Middlewares/ensureAuth");
const { listQuestions, submitQuiz, summary, leaderboard } = require("../Controllers/QuizController");

router.use(ensureAuth);
router.get("/questions", listQuestions);
router.post("/submit", submitQuiz);
router.get("/summary", summary);
router.get("/leaderboard", leaderboard);

module.exports = router;
