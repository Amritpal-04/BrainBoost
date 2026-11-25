import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { fetchLeaderboard } from "../services/quizApi";

const timeframes = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "All Time", value: "all-time" },
];

const podiumStyles = [
  { place: 2, pedestal: "h-28", medal: "bg-slate-100 text-slate-600", ring: "ring-slate-200" },
  { place: 1, pedestal: "h-36", medal: "bg-amber-100 text-amber-700", ring: "ring-amber-200" },
  { place: 3, pedestal: "h-24", medal: "bg-orange-100 text-orange-800", ring: "ring-orange-200" },
];

function initials(username) {
  return String(username || "Learner").split(/[._-]/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]).join("").toUpperCase();
}

function Avatar({ username, highlighted = false, large = false }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-extrabold ${large ? "size-14 text-lg" : "size-10 text-sm"} ${highlighted ? "bg-violet-700 text-white" : "bg-violet-100 text-violet-800"}`}>
      {initials(username)}
    </span>
  );
}

function Podium({ entries, currentUsername }) {
  const ordered = podiumStyles.map((style) => ({ ...style, player: entries[style.place - 1] }));

  return (
    <section aria-label="Top three players" className="rounded-2xl border border-violet-100 bg-white px-4 pt-6 pb-0 shadow-sm shadow-violet-900/5 sm:px-8 sm:pt-8">
      <div className="mx-auto flex max-w-2xl items-end justify-center gap-2 sm:gap-5">
        {ordered.map(({ place, player, pedestal, medal, ring }) => {
          if (!player) return null;
          const username = player.username || `learner${player.rank || place}`;
          return (
            <div key={place} className="flex w-1/3 max-w-44 flex-col items-center text-center">
            <div className="relative mb-3 flex flex-col items-center">
              {place === 1 && <Crown size={21} className="mb-1 text-amber-500" aria-hidden="true" />}
              <Avatar username={username} highlighted={player.isCurrentUser || username === currentUsername} large />
              <span className={`absolute -right-1 bottom-0 grid size-7 place-items-center rounded-full ring-2 ring-white ${medal}`}>
                {place === 1 ? <Trophy size={14} aria-hidden="true" /> : <Medal size={14} aria-hidden="true" />}
              </span>
            </div>
            <p className="max-w-full truncate text-sm font-extrabold text-slate-900">@{username}</p>
            <p className="mt-1 text-sm font-bold text-violet-700">{player.points.toLocaleString()} <span className="font-medium text-slate-500">pts</span></p>
            <div className={`mt-4 flex w-full items-start justify-center rounded-t-2xl border-x border-t ${pedestal} ${ring} ${place === 1 ? "bg-amber-50" : "bg-slate-50"}`}>
              <span className={`mt-3 grid size-9 place-items-center rounded-full text-sm font-black ${medal}`}>{place}</span>
            </div>
            </div>
          );
        })}
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
      <ol className="divide-y divide-slate-100">
        {entries.slice(3).map((player) => {
          const isCurrentUser = player.isCurrentUser;
          const username = player.username || `learner${player.rank}`;
          return (
            <li key={player.rank} className={`flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 ${isCurrentUser ? "bg-violet-50" : ""}`}>
              <span className={`w-7 shrink-0 text-center text-sm font-extrabold ${isCurrentUser ? "text-violet-800 dark:text-violet-200" : "text-slate-500 dark:text-slate-400"}`}>{player.rank}</span>
              <Avatar username={username} highlighted={isCurrentUser} />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-bold ${isCurrentUser ? "text-violet-900 dark:text-white" : "text-white dark:text-violet-700"}`}>@{username}</p>
                {isCurrentUser && <p className="mt-0.5 text-xs font-semibold text-violet-700 dark:text-violet-300">You</p>}
              </div>
              <p className="shrink-0 text-sm font-extrabold text-slate-900 dark:text-slate-100">{player.points.toLocaleString()} <span className="font-medium text-slate-500 dark:text-slate-400">pts</span></p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function YourStanding({ player }) {
  return (
    <section aria-label="Your leaderboard standing" className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-4 text-slate-900 dark:border-violet-800 dark:bg-violet-950 dark:text-slate-100 sm:gap-4 sm:px-6">
      <span className="w-7 shrink-0 text-center text-sm font-black text-violet-800 dark:text-violet-200">{player?.rank || "—"}</span>
      <Avatar username={player?.username || "you"} highlighted />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold text-violet-900 dark:text-violet-100">@{player?.username || "you"}</p>
        <p className="mt-0.5 text-xs font-semibold text-violet-700 dark:text-violet-300">{player ? "Your place" : "Complete a quiz to join the rankings"}</p>
      </div>
      <p className="shrink-0 text-sm font-extrabold text-violet-900 dark:text-violet-100">{(player?.points || 0).toLocaleString()} <span className="font-medium">pts</span></p>
    </section>
  );
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState("daily");
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState({ entries: [], currentUser: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useOutletContext();
  const timeframeLabel = useMemo(() => timeframes.find((period) => period.value === timeframe)?.label, [timeframe]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchLeaderboard(timeframe)
      .then((result) => { if (active) setData(result); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [timeframe, reloadKey]);

  const entries = data.entries;

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
              key={period.value}
              type="button"
              aria-pressed={timeframe === period.value}
              onClick={() => setTimeframe(period.value)}
              className={`min-h-10 rounded-lg px-3 text-sm font-bold transition sm:px-4 ${timeframe === period.value ? "bg-violet-700 text-white shadow-sm" : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"}`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <section aria-live="polite" className="mt-6 rounded-2xl border border-violet-100 bg-white px-6 py-14 text-center text-slate-600">Loading {timeframeLabel.toLowerCase()} rankings…</section>
      ) : error ? (
        <section role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-white px-6 py-10 text-center">
          <p className="font-bold text-rose-700">{error}</p>
          <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white">Try again</button>
        </section>
      ) : entries.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <Trophy size={32} className="mx-auto text-violet-400" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-extrabold">No rankings yet</h2>
          <p className="mt-1 text-sm text-slate-600">Complete a practice round to help fill this leaderboard.</p>
        </section>
      ) : (
        <div className="mt-6 grid gap-5">
          <Podium entries={entries} currentUsername={user?.username} />
          {entries.length > 3 && <RankedList entries={entries} />}
          <YourStanding player={data.currentUser || (user?.username ? { username: user.username, points: 0, rank: null } : null)} />
          <p className="text-center text-xs text-slate-500">Points are total correct answers from completed quizzes.</p>
        </div>
      )}
    </div>
  );
}
