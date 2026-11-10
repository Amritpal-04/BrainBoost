import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Calculator,
  Clock3,
  Lightbulb,
  LogOut,
  Shapes,
  Sparkles,
  Target,
} from "lucide-react";
import { handleSuccess } from "../utils";

const practiceModes = [
  {
    name: "Number skills",
    description: "Build confidence with calculations and mental maths.",
    icon: Calculator,
    color: "bg-sky-100 text-sky-700",
  },
  {
    name: "Logic puzzles",
    description: "Slow down, spot the clues, and solve problems step by step.",
    icon: Lightbulb,
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Patterns",
    description: "Find what comes next in sequences and visual patterns.",
    icon: Shapes,
    color: "bg-emerald-100 text-emerald-700",
  },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();
  const [selectedMode, setSelectedMode] = useState(practiceModes[0].name);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Learner";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleSuccess("You have logged out.");
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/home" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <Brain size={23} />
            </span>
            <span className="text-lg font-extrabold tracking-tight">BrainBoost</span>
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-7 py-9 text-white shadow-xl shadow-violet-900/10 sm:px-10 sm:py-12">
          <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-cyan-300/10" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-sm font-semibold text-violet-50">
              <Sparkles size={16} /> Your learning space
            </span>
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              Hey {firstName}, ready to give your brain a boost?
            </h1>
            <p className="mt-3 max-w-xl leading-7 text-violet-100">
              Choose something to explore. A few minutes of curious thinking
              can make a big difference.
            </p>
            <a
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-violet-700 shadow-lg transition hover:bg-violet-50"
              href="#practice"
            >
              Explore practice modes <ArrowRight size={18} />
            </a>
          </div>
          <div className="absolute bottom-8 right-10 hidden h-32 w-32 items-center justify-center rounded-[2rem] bg-white/10 text-white/90 lg:flex">
            <Brain size={76} strokeWidth={1.4} />
          </div>
        </section>

        <section
          aria-labelledby="practice-heading"
          className="mt-10"
          id="practice"
        >
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-600">
                Pick your path
              </p>
              <h2
                className="mt-1 text-2xl font-black tracking-tight sm:text-3xl"
                id="practice-heading"
              >
                What would you like to practice?
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Choose a topic to see what interests you.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {practiceModes.map(({ name, description, icon: Icon, color }) => {
              const isSelected = selectedMode === name;
              return (
                <button
                  aria-pressed={isSelected}
                  className={`rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected
                      ? "border-violet-300 ring-4 ring-violet-100"
                      : "border-slate-200"
                  }`}
                  key={name}
                  onClick={() => setSelectedMode(name)}
                  type="button"
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}
                  >
                    <Icon size={24} />
                  </span>
                  <span className="mt-5 block text-lg font-extrabold">{name}</span>
                  <span className="mt-2 block min-h-12 text-sm leading-6 text-slate-500">
                    {description}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700">
                    {isSelected ? "Selected" : "Choose topic"}
                    <ArrowRight size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <Target size={22} />
            </span>
            <h2 className="mt-4 text-lg font-extrabold">Your progress</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your practice progress will appear here once you complete your
              first activity.
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-0 rounded-full bg-violet-500" />
            </div>
            <p className="mt-2 text-xs font-medium text-slate-400">
              Your learning journey starts with one activity.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
              <Clock3 size={22} />
            </span>
            <h2 className="mt-4 text-lg font-extrabold">Recent activity</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              No activities yet. Choose a topic above when you are ready to
              begin.
            </p>
            <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              Selected topic: {selectedMode}
            </p>
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-slate-400">
          Keep asking questions. Keep getting better.
        </p>
      </div>
    </main>
  );
}

export default Home;
