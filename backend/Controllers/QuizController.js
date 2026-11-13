const Question = require("../Models/Question");
const QuizAttempt = require("../Models/QuizAttempt");
const { modes } = require("../data/questions");

const difficulties = ["Easy", "Medium", "Hard"];

function publicQuestion(question) {
  return {
    id: question.key,
    prompt: question.prompt,
    choices: question.choices,
  };
}

const listQuestions = async (req, res) => {
  try {
    const modeId = String(req.query.mode || "");
    const topics = modes[modeId];
    if (!topics) {
      return res.status(404).json({ success: false, message: "That practice mode was not found." });
    }

    const topic = String(req.query.topic || "");
    const difficulty = String(req.query.difficulty || "");
    if (topics.length > 0 && !topics.includes(topic)) {
      return res.status(400).json({ success: false, message: "Choose a topic before starting." });
    }
    if (!difficulties.includes(difficulty)) {
      return res.status(400).json({ success: false, message: "Choose a difficulty before starting." });
    }

    const questions = await Question.find({
      modeId,
      topic: topics.length ? topic : "",
      difficulty,
    })
      .sort({ key: 1 })
      .select("key prompt choices")
      .lean();

    return res.json({
      success: true,
      data: questions.map(publicQuestion),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load the quiz.", error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { modeId, topic = "", difficulty, answers } = req.body || {};
    const topics = modes[modeId];
    if (!topics) {
      return res.status(404).json({ success: false, message: "That practice mode was not found." });
    }
    if (topics.length > 0 && !topics.includes(topic)) {
      return res.status(400).json({ success: false, message: "Choose a topic before submitting." });
    }
    if (!difficulties.includes(difficulty)) {
      return res.status(400).json({ success: false, message: "Choose a difficulty before submitting." });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Answer the questions before submitting." });
    }

    const storedTopic = topics.length ? topic : "";
    const questions = await Question.find({ modeId, topic: storedTopic, difficulty }).sort({ key: 1 }).lean();
    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: "No questions are available for that topic." });
    }

    const selectedById = new Map(
      answers.map((answer) => [answer.questionId, Number(answer.choiceIndex)]),
    );

    const results = questions.map((question) => {
      const choiceIndex = selectedById.get(question.key);
      const correct = choiceIndex === question.correctIndex;
      return {
        questionId: question.key,
        prompt: question.prompt,
        selected: question.choices[choiceIndex] ?? "No answer",
        correctChoice: question.choices[question.correctIndex],
        correct,
        explanation: question.explanation,
      };
    });

    const score = results.filter((result) => result.correct).length;
    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      modeId,
      topic: storedTopic,
      difficulty,
      score,
      total: results.length,
    });

    return res.json({
      success: true,
      data: {
        attemptId: attempt._id,
        score,
        total: results.length,
        difficulty,
        results,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not score the quiz.", error: error.message });
  }
};

const summary = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    const roundsCompleted = attempts.length;
    const averageAccuracy = roundsCompleted
      ? Math.round(
          (attempts.reduce((total, attempt) => total + attempt.score / attempt.total, 0) / roundsCompleted) * 100,
        )
      : null;
    const latest = attempts[0];

    return res.json({
      success: true,
      data: {
        roundsCompleted,
        averageAccuracy,
        latestScore: latest ? `${latest.score}/${latest.total}` : null,
        recent: attempts.slice(0, 5).map((attempt) => ({
          id: attempt._id,
          modeId: attempt.modeId,
          topic: attempt.topic,
          difficulty: attempt.difficulty,
          score: attempt.score,
          total: attempt.total,
          createdAt: attempt.createdAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load your progress.", error: error.message });
  }
};

module.exports = { listQuestions, submitQuiz, summary };
