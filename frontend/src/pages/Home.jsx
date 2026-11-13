import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Calculator,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  Clock3,
  Lightbulb,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const practiceModes = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Practise addition, subtraction, multiplication, and division.",
    icon: Calculator,
    tint: "bg-violet-100 text-violet-700",
    topics: ["Mixed maths", "Addition", "Subtraction", "Multiplication", "Division"],
  },
  {
    id: "logical-thinking",
    name: "Logical Thinking",
    description: "Spot patterns, follow clues, and work out what comes next.",
    icon: Lightbulb,
    tint: "bg-amber-100 text-amber-800",
    topics: ["Mixed puzzles", "Patterns", "Number sequences"],
  },
  {
    id: "fast-calculation",
    name: "Fast Calculation",
    description: "Get quicker at solving short mental maths problems.",
    icon: Zap,
    tint: "bg-teal-100 text-teal-800",
  },
];

const difficulties = ["Easy", "Medium", "Hard"];
const panelClass = "rounded-2xl border border-violet-100 bg-white";
const practiceLinkClass = "inline-flex min-h-11 w-fit items-center gap-2 rounded-lg text-sm font-bold text-violet-700 hover:text-violet-900 hover:underline";
const genderLabels = {
  male: "Male",
  female: "Female",
  woman: "Woman",
  man: "Man",
  nonbinary: "Non-binary",
  other: "Other",
  "prefer-not-to-say": "Prefer not to say",
};
const educationLevelLabels = {
  primary: "Primary school",
  middle: "Middle school",
  high: "High school",
  college: "College or university",
  other: "Other",
};
const learningGoalLabels = {
  math: "Improve math skills",
  logic: "Build logical thinking",
  calculation: "Improve calculation speed",
  confidence: "Build learning confidence",
  other: "Other",
};

function formatBirthDate(value) {
  if (!value) {
    return "Unavailable";
  }

  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" })
    .format(new Date(year, month - 1, day));
}

function PracticeLink() {
  return (
    <Link className={practiceLinkClass} to="/home#practice">
      Explore practice modes <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

function ProgressPanel() {
  return (
    <section aria-labelledby="progress-heading" className={`${panelClass} p-5 sm:p-6`}>
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
          <ChartNoAxesColumnIncreasing size={20} aria-hidden="true" />
        </span>
        <h2 id="progress-heading" className="text-lg font-extrabold">Progress at a glance</h2>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Rounds completed", value: "0" },
          { label: "Average accuracy", value: "—" },
          { label: "Latest score", value: "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 rounded-xl bg-slate-50 px-2 py-3 sm:px-3">
            <dt className="order-2 text-xs font-medium text-slate-600 sm:text-sm">{label}</dt>
            <dd className="text-2xl font-extrabold">
              {value === "—" ? <><span aria-hidden="true">—</span><span className="sr-only">Unavailable</span></> : value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm leading-6 text-slate-600">Complete a round to see your accuracy and score here.</p>
    </section>
  );
}

function ActivityPanel({ showViewAll = false }) {
  return (
    <section aria-labelledby="activity-heading" className={`${panelClass} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
            <Clock3 size={20} aria-hidden="true" />
          </span>
          <h2 id="activity-heading" className="text-lg font-extrabold">
            {showViewAll ? "Recent activity" : "Practice history"}
          </h2>
        </div>
        {showViewAll && (
          <Link to="/home/progress" className={practiceLinkClass} aria-label="View all practice activity">
            View all <ChevronRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-sm font-bold">No completed rounds yet</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">Your completed rounds will show up here.</p>
      </div>
    </section>
  );
}

export default function Home() {
  const { name } = useOutletContext();
  const { hash } = useLocation();
  const practiceSection = useRef(null);
  const firstName = name.split(/\s+/)[0];

  useEffect(() => {
    if (hash === "#practice") {
      practiceSection.current?.scrollIntoView();
    }
  }, [hash]);

  return (
    <>
      <section aria-labelledby="welcome-heading" className="relative isolate overflow-hidden rounded-[1.75rem] bg-linear-to-br from-violet-700 via-violet-700 to-indigo-800 px-6 py-8 text-white sm:px-10 sm:py-11">
        <div className="relative z-10 max-w-xl md:max-w-[65%]">
          <h1 id="welcome-heading" className="wrap-anywhere text-3xl leading-tight font-black tracking-tight sm:text-5xl">Welcome, {firstName}!</h1>
          <p className="mt-3 max-w-md text-base leading-7 text-violet-100 sm:text-lg">
            Pick a practice mode to work on your maths, logic, or calculation speed.
          </p>
          <a href="#practice" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-800 hover:bg-violet-100 sm:px-5">
            Explore practice modes <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] place-items-center md:grid">
          <div className="absolute size-64 rounded-full border border-white/15" />
          <div className="absolute size-52 rounded-full border border-white/20" />
          <div className="relative grid size-32 rotate-6 place-items-center rounded-4xl border border-white/30 bg-white/15 text-white shadow-xl shadow-indigo-950/20">
            <Brain size={76} strokeWidth={1.5} />
            <Sparkles size={29} className="absolute -top-4 -right-5 text-amber-200" />
          </div>
        </div>
      </section>

      <section aria-labelledby="practice-heading" id="practice" ref={practiceSection} className="mt-8 scroll-mt-6 sm:mt-10">
        <h2 id="practice-heading" className="text-2xl font-extrabold tracking-tight">Practice modes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {practiceModes.map(({ id, name: modeName, description, icon: Icon, tint }) => (
            <Link
              key={id}
              to={`/home/practice/${id}`}
              className={`group flex flex-col items-start p-5 transition hover:border-violet-300 hover:shadow-md hover:shadow-violet-900/5 sm:p-6 ${panelClass}`}
            >
              <span className={`grid size-12 place-items-center rounded-xl ${tint}`}>
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">{modeName}</h3>
              <p className="mt-1 mb-4 text-sm leading-6 text-slate-600">{description}</p>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-violet-700 group-hover:underline">
                Set up practice <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ProgressPanel />
        <ActivityPanel showViewAll />
      </div>
    </>
  );
}

export function StudentProgress() {
  return (
    <>
      <h1 className="text-3xl font-black tracking-tight">My Progress</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ProgressPanel />
        <ActivityPanel />
      </div>
      <div className="mt-3"><PracticeLink /></div>
    </>
  );
}

export function StudentProfile() {
  const { user, name, initials } = useOutletContext();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <h1 className="text-3xl font-black tracking-tight">Profile</h1>
      <section aria-label="Account details" className={`mt-5 max-w-lg p-6 ${panelClass}`}>
        <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-violet-100 text-xl font-extrabold text-violet-800">{initials}</span>
        <dl className="mt-5 grid gap-4">
          <div>
            <dt className="text-sm font-medium text-slate-600">Display name</dt>
            <dd className="mt-1 wrap-anywhere font-bold">{name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Email address</dt>
            <dd className="mt-1 wrap-anywhere font-bold">{user?.email || "Unavailable"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Username</dt>
            <dd className="mt-1 wrap-anywhere font-bold">{user?.username ? `@${user.username}` : "Unavailable"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Birthday</dt>
            <dd className="mt-1 wrap-anywhere font-bold">{formatBirthDate(user?.birthDate)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Gender</dt>
            <dd className="mt-1 wrap-anywhere font-bold">{genderLabels[user?.gender] || "Unavailable"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Phone number</dt>
            <dd className="mt-1 wrap-anywhere font-bold">{user?.phoneNumber || "Unavailable"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Phone country</dt>
            <dd className="mt-1 wrap-anywhere font-bold">{user?.phoneCountry || "Unavailable"}</dd>
          </div>
          {user?.educationLevel && (
            <div>
              <dt className="text-sm font-medium text-slate-600">Education level</dt>
              <dd className="mt-1 wrap-anywhere font-bold">{educationLevelLabels[user.educationLevel] || user.educationLevel}</dd>
            </div>
          )}
          {user?.learningGoal && (
            <div>
              <dt className="text-sm font-medium text-slate-600">Learning goal</dt>
              <dd className="mt-1 wrap-anywhere font-bold">{learningGoalLabels[user.learningGoal] || user.learningGoal}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6 border-t border-slate-200 pt-5">
          <h2 className="text-lg font-extrabold">Appearance</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Choose how BrainBoost looks on this device.
          </p>
          <label htmlFor="theme-preference" className="mt-5 block text-sm font-medium text-slate-600">
            Website theme
          </label>
          <select
            id="theme-preference"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          >
            <option value="default">Default (recommended)</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Default follows your device’s appearance setting.
          </p>
        </div>
      </section>
    </>
  );
}

function PracticeOptions({ label, name, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-base font-extrabold">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              className="peer sr-only"
              checked={value === option}
              onChange={() => onChange(name, option)}
            />
            <span className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-violet-300 peer-checked:border-violet-600 peer-checked:bg-violet-100 peer-checked:text-violet-900 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-700">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function PracticeSetup() {
  const { modeId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = practiceModes.find(({ id }) => id === modeId);
  if (!mode) {
    return <Navigate to="/home#practice" replace />;
  }

  const { icon: Icon, tint, topics } = mode;
  const topic = topics?.find((option) => option === searchParams.get("topic")) ?? topics?.[0];
  const difficulty = difficulties.find((option) => option === searchParams.get("difficulty")) ?? difficulties[0];

  function updateOption(name, option) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(name, option);
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <>
      <Link className={practiceLinkClass} to="/home#practice">
        <ArrowLeft size={16} aria-hidden="true" /> Back to practice modes
      </Link>
      <section aria-labelledby="setup-heading" className={`mt-3 max-w-2xl p-6 sm:p-8 ${panelClass}`}>
        <span className={`grid size-12 place-items-center rounded-xl ${tint}`}>
          <Icon size={24} aria-hidden="true" />
        </span>
        <h1 id="setup-heading" className="mt-4 text-3xl font-black tracking-tight">{mode.name}</h1>
        <p className="mt-2 text-slate-600">{mode.description}</p>
        <div className="mt-6 space-y-5">
          {topics && <PracticeOptions label="Topic" name="topic" options={topics} value={topic} onChange={updateOption} />}
          <PracticeOptions label="Difficulty" name="difficulty" options={difficulties} value={difficulty} onChange={updateOption} />
        </div>
        <p className="mt-6 rounded-xl bg-violet-50 px-4 py-3 text-sm leading-6 text-violet-900">
          Practice rounds will be available when quizzes are added.
        </p>
      </section>
    </>
  );
}
