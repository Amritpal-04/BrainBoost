const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  modeId: { type: String, required: true },
  topic: { type: String, default: "" },
  difficulty: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("quizattempts", QuizAttemptSchema);
