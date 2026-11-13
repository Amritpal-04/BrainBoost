const router = require("express").Router();
const { ensureAuth } = require("../Middlewares/ensureAuth");
const { listQuestions, submitQuiz, summary } = require("../Controllers/QuizController");

router.use(ensureAuth);
router.get("/questions", listQuestions);
router.post("/submit", submitQuiz);
router.get("/summary", summary);

module.exports = router;
