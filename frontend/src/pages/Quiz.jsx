import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { practiceModes } from "./Home";
import { fetchQuestions, submitQuiz } from "../services/quizApi";

const difficulties = ["Easy", "Medium", "Hard"];

export default function Quiz() {
  const { modeId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = practiceModes.find(({ id }) => id === modeId);
  const topic = mode?.topics?.includes(searchParams.get("topic"))
    ? searchParams.get("topic")
    : mode?.topics?.[0];
  const difficulty = difficulties.includes(searchParams.get("difficulty"))
    ? searchParams.get("difficulty")
    : difficulties[0];

  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!mode) return undefined;
    let active = true;
    fetchQuestions({ modeId, topic })
      .then((data) => {
        if (active) setQuestions(data);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode, modeId, topic]);

  if (!mode) {
    return <Navigate to="/home#practice" replace />;
  }

  const current = questions[step];
  const isLast = step === questions.length - 1;
  const setupQuery = new URLSearchParams({
    ...(topic ? { topic } : {}),
    difficulty,
  });

  async function finishQuiz() {
    setSubmitting(true);
    setError("");
    try {
      const data = await submitQuiz({
        modeId,
        topic: topic || "",
        difficulty,
        answers: questions.map((question) => ({
          questionId: question.id,
          choiceIndex: selected[question.id],
        })),
      });
      setResult(data);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Link className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900 hover:underline" to={`/home/practice/${mode.id}?${setupQuery}`}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to setup
      </Link>

      <section className="mt-3 max-w-2xl rounded-2xl border border-violet-100 bg-white p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-600">
          {mode.name}{topic ? ` · ${topic}` : ""} · {difficulty}
        </p>

        {loading && <p className="mt-6 text-slate-600">Loading your two questions…</p>}
        {!loading && error && !result && <p className="mt-6 text-sm font-semibold text-rose-700">{error}</p>}
        {!loading && !error && questions.length === 0 && (
          <p className="mt-6 text-slate-600">No questions are available for this topic yet.</p>
        )}

        {current && !result && (
          <>
            <h1 className="mt-3 text-2xl font-black tracking-tight">
              Question {step + 1} of {questions.length}
            </h1>
            <p className="mt-4 text-lg font-bold leading-7">{current.prompt}</p>
            <div className="mt-5 grid gap-2">
              {current.choices.map((choice, index) => {
                const isSelected = selected[current.id] === index;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelected((currentAnswers) => ({ ...currentAnswers, [current.id]: index }))}
                    className={`min-h-11 rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                      isSelected
                        ? "border-violet-600 bg-violet-100 text-violet-900"
                        : "border-slate-200 text-slate-700 hover:border-violet-300"
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((value) => value - 1)}
                  className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Previous
                </button>
              )}
              {isLast ? (
                <button
                  type="button"
                  disabled={selected[current.id] == null || submitting}
                  onClick={finishQuiz}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-bold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-300"
                >
                  {submitting ? "Checking…" : "See results"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={selected[current.id] == null}
                  onClick={() => setStep((value) => value + 1)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-bold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-300"
                >
                  Next <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </>
        )}

        {result && (
          <>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              You scored {result.score}/{result.total}
            </h1>
            <ul className="mt-5 grid gap-3">
              {result.results.map((item, index) => (
                <li key={item.questionId} className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-bold">
                    {index + 1}. {item.prompt}
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${item.correct ? "text-emerald-700" : "text-rose-700"}`}>
                    {item.correct ? "Correct" : `Your answer: ${item.selected}. Correct answer: ${item.correctChoice}`}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.explanation}</p>
                </li>
              ))}
            </ul>
            <Link
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-violet-700 px-5 text-sm font-bold text-white hover:bg-violet-800"
              to="/home"
            >
              Back to dashboard
            </Link>
          </>
        )}
      </section>
    </>
  );
}
