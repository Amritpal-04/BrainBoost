import {
  Brain,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { handleSuccess } from "../utils";

const navigation = [
  { label: "Dashboard", to: "/home", icon: LayoutDashboard },
  { label: "My Progress", to: "/home/progress", icon: ChartNoAxesColumnIncreasing },
  { label: "Profile", to: "/home/profile", icon: UserRound },
];

function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function StudentLayout() {
  const navigate = useNavigate();
  if (!sessionStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  const user = getStoredUser();
  const name = user?.name?.trim() || "Learner";
  const initials = name.split(/\s+/).slice(0, 2)
    .map((part) => Array.from(part)[0]).join("").toUpperCase();

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    handleSuccess("You have logged out.");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-slate-900">
      <header className="border-b border-violet-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-x-4 px-4 sm:px-8 md:grid-cols-[1fr_auto_1fr]">
          <Link to="/home" className="my-4 flex w-fit items-center gap-2.5 rounded-lg font-extrabold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-violet-700 text-white">
              <Brain size={22} aria-hidden="true" />
            </span>
            <span className="text-lg">BrainBoost</span>
          </Link>

          <nav aria-label="Student navigation" className="col-span-2 row-start-2 flex items-center gap-1 pb-3 md:col-span-1 md:col-start-2 md:row-start-1 md:gap-2 md:pb-0">
            {navigation.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-lg px-2 text-sm font-semibold sm:px-3 ${isActive ? "bg-violet-100 text-violet-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
                }
              >
                <Icon size={16} aria-hidden="true" className="hidden min-[380px]:block" />
                {label}
              </NavLink>
            ))}
          </nav>

          <details className="relative col-start-2 row-start-1 justify-self-end md:col-start-3">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg px-1.5 hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-violet-100 text-xs font-extrabold text-violet-800">
                {initials}
              </span>
              <span className="sr-only">Account menu for {name}</span>
              <span aria-hidden="true" className="hidden max-w-24 truncate text-sm font-bold lg:block">{name}</span>
              <ChevronDown size={15} aria-hidden="true" className="text-slate-500" />
            </summary>
            <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-800"
              >
                <LogOut size={16} aria-hidden="true" /> Sign out
              </button>
            </div>
          </details>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-9">
        <Outlet context={{ user, name, initials }} />
      </main>
    </div>
  );
}
