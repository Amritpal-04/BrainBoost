const mongoose = require("mongoose");
const Question = require("../Models/Question");
const { questions } = require("../data/questions");

async function seedQuestions() {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const keys = questions.map((question) => question.key);
  await Question.deleteMany({ key: { $nin: keys } });

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
