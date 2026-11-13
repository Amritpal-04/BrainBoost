const mongoose = require("mongoose");
const Question = require("../Models/Question");
const { questions } = require("../data/questions");

async function seedQuestions() {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  await Question.bulkWrite(
    questions.map((question) => ({
      updateOne: {
        filter: { key: question.key },
        update: { $set: question },
        upsert: true,
      },
    })),
  );
}

module.exports = { seedQuestions };
