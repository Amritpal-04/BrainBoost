import { useMemo, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const timeframes = ["Daily", "Weekly", "All Time"];
const currentUsername = "brightthinker";

const mockLeaderboard = {
  Daily: [
    { username: "numberninja", points: 980 },
    { username: "curiousmind", points: 920 },
    { username: "brightthinker", points: 870 },
    { username: "pixelpuzzler", points: 810 },
    { username: "mathsprout", points: 760 },
    { username: "logicfox", points: 710 },
    { username: "starlearner", points: 650 },
    { username: "quickquokka", points: 590 },
  ],
  Weekly: [
    { username: "curiousmind", points: 5840 },
    { username: "brightthinker", points: 5310 },
    { username: "numberninja", points: 5120 },
    { username: "mathsprout", points: 4780 },
    { username: "pixelpuzzler", points: 4420 },
    { username: "starlearner", points: 3980 },
    { username: "logicfox", points: 3610 },
    { username: "quickquokka", points: 3240 },
  ],
  "All Time": [
    { username: "brightthinker", points: 42850 },
    { username: "numberninja", points: 40120 },
    { username: "curiousmind", points: 38540 },
    { username: "pixelpuzzler", points: 34780 },
    { username: "mathsprout", points: 32610 },
    { username: "logicfox", points: 29840 },
    { username: "quickquokka", points: 27460 },
    { username: "starlearner", points: 25190 },
  ],
};

const podiumStyles = [
  { place: 2, pedestal: "h-28", medal: "bg-slate-100 text-slate-600", ring: "ring-slate-200" },
  { place: 1, pedestal: "h-36", medal: "bg-amber-100 text-amber-700", ring: "ring-amber-200" },
  { place: 3, pedestal: "h-24", medal: "bg-orange-100 text-orange-800", ring: "ring-orange-200" },
];

function initials(username) {
  return username.split(/[._-]/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]).join("").toUpperCase();
}

function Avatar({ username, highlighted = false, large = false }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-extrabold ${large ? "size-14 text-lg" : "size-10 text-sm"} ${highlighted ? "bg-violet-700 text-white" : "bg-violet-100 text-violet-800"}`}>
      {initials(username)}
    </span>
  );
}

function Podium({ entries }) {
  const ordered = podiumStyles.map((style) => ({ ...style, player: entries[style.place - 1] }));

  return (
    <section aria-label="Top three players" className="rounded-2xl border border-violet-100 bg-white px-4 pt-6 pb-0 shadow-sm shadow-violet-900/5 sm:px-8 sm:pt-8">
      <div className="mx-auto flex max-w-2xl items-end justify-center gap-2 sm:gap-5">
        {ordered.map(({ place, player, pedestal, medal, ring }) => player && (
          <div key={place} className="flex w-1/3 max-w-44 flex-col items-center text-center">
            <div className="relative mb-3 flex flex-col items-center">
              {place === 1 && <Crown size={21} className="mb-1 text-amber-500" aria-hidden="true" />}
              <Avatar username={player.username} highlighted={player.username === currentUsername} large />
              <span className={`absolute -right-1 bottom-0 grid size-7 place-items-center rounded-full ring-2 ring-white ${medal}`}>
                {place === 1 ? <Trophy size={14} aria-hidden="true" /> : <Medal size={14} aria-hidden="true" />}
              </span>
            </div>
            <p className="max-w-full truncate text-sm font-extrabold text-slate-900">@{player.username}</p>
            <p className="mt-1 text-sm font-bold text-violet-700">{player.points.toLocaleString()} <span className="font-medium text-slate-500">pts</span></p>
            <div className={`mt-4 flex w-full items-start justify-center rounded-t-2xl border-x border-t ${pedestal} ${ring} ${place === 1 ? "bg-amber-50" : "bg-slate-50"}`}>
              <span className={`mt-3 grid size-9 place-items-center rounded-full text-sm font-black ${medal}`}>{place}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RankedList({ entries }) {
  return (
    <section aria-labelledby="rankings-heading" className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm shadow-violet-900/5">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
        <h2 id="rankings-heading" className="text-lg font-extrabold">Rankings</h2>
        <span className="text-xs font-semibold text-slate-500">Top {entries.length} learners</span>
      </div>
      <ol start="4" className="divide-y divide-slate-100">
        {entries.slice(3).map((player, index) => {
          const isCurrentUser = player.username === currentUsername;
          return (
            <li key={player.username} className={`flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 ${isCurrentUser ? "bg-violet-50" : ""}`}>
              <span className={`w-7 shrink-0 text-center text-sm font-extrabold ${isCurrentUser ? "text-violet-800" : "text-slate-500"}`}>{index + 4}</span>
              <Avatar username={player.username} highlighted={isCurrentUser} />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-bold ${isCurrentUser ? "text-violet-900" : "text-slate-800"}`}>@{player.username}</p>
                {isCurrentUser && <p className="mt-0.5 text-xs font-semibold text-violet-700">You</p>}
              </div>
              <p className="shrink-0 text-sm font-extrabold text-slate-900">{player.points.toLocaleString()} <span className="font-medium text-slate-500">pts</span></p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function YourStanding({ player, rank }) {
  return (
    <section aria-label="Your leaderboard standing" className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4 sm:gap-4 sm:px-6">
      <span className="w-7 shrink-0 text-center text-sm font-black text-violet-800">{rank}</span>
      <Avatar username={player.username} highlighted />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-violet-900">@{player.username}</p>
        <p className="mt-0.5 text-xs font-semibold text-violet-700">Your place · sample ranking</p>
      </div>
      <p className="shrink-0 text-sm font-extrabold text-violet-900">{player.points.toLocaleString()} <span className="font-medium">pts</span></p>
    </section>
  );
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState("Daily");
  const { user } = useOutletContext();
  const entries = useMemo(() => mockLeaderboard[timeframe], [timeframe]);
  const username = user?.username || currentUsername;
  const standing = entries.find((player) => player.username.toLowerCase() === username.toLowerCase())
    || { username, points: 0 };
  const rank = entries.findIndex((player) => player.username.toLowerCase() === username.toLowerCase()) + 1;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-600">Learn together</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Leaderboard</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">See how learners are doing and celebrate every bright idea.</p>
        </div>
        <div role="group" aria-label="Leaderboard timeframe" className="inline-flex w-fit rounded-xl border border-violet-100 bg-white p-1 shadow-sm">
          {timeframes.map((period) => (
            <button
              key={period}
              type="button"
              aria-pressed={timeframe === period}
              onClick={() => setTimeframe(period)}
              className={`min-h-10 rounded-lg px-3 text-sm font-bold transition sm:px-4 ${timeframe === period ? "bg-violet-700 text-white shadow-sm" : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"}`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <Trophy size={32} className="mx-auto text-violet-400" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-extrabold">No rankings yet</h2>
          <p className="mt-1 text-sm text-slate-600">Complete a practice round to help fill this leaderboard.</p>
        </section>
      ) : (
        <div className="mt-6 grid gap-5">
          <Podium entries={entries} />
          {entries.length > 3 && <RankedList entries={entries} />}
          <YourStanding player={standing} rank={rank || "—"} />
          <p className="text-center text-xs text-slate-500">Sample leaderboard data · points are for display only</p>
        </div>
      )}
    </div>
  );
}
