const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  modeId: { type: String, required: true },
  topic: { type: String, default: "" },
  difficulty: { type: String, required: true, enum: ["Easy", "Medium", "Hard"] },
  prompt: { type: String, required: true },
  choices: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
});

module.exports = mongoose.model("questions", QuestionSchema);
