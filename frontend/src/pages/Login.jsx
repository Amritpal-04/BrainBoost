import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { handleError, handleSuccess } from "../utils";

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginInfo((currentInfo) => ({ ...currentInfo, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!loginInfo.email || !loginInfo.password) {
      handleError("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();

      if (!response.ok || !result.success || !result.token) {
        handleError(result.message || "Unable to log in. Please try again.");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      handleSuccess(result.message || "Welcome back!");
      navigate("/home");
    } catch (error) {
      handleError(
        error instanceof TypeError
          ? "Cannot connect to the backend. Start it with npm start from the project root."
          : error instanceof Error
            ? error.message
            : "Unable to log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-cyan-50 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-violet-950/10 md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-12 text-white md:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-300/10" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
              <Brain size={25} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">BrainBoost</span>
          </div>
          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <Sparkles size={16} /> A little practice goes a long way
            </span>
            <h1 className="text-4xl font-black leading-tight">
              Ready to give your brain a boost?
            </h1>
            <p className="mt-4 max-w-sm leading-7 text-violet-100">
              Pick up where you left off and make today a great day to learn.
            </p>
          </div>
          <p className="relative text-sm text-violet-200">
            Think curious. Learn confidently.
          </p>
        </div>

        <div className="p-7 sm:p-12">
          <div className="mb-9 md:hidden">
            <div className="flex items-center gap-3 text-violet-700">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100">
                <Brain size={25} />
              </span>
              <span className="text-xl font-extrabold tracking-tight">BrainBoost</span>
            </div>
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
            Welcome back
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Log in to your account
          </h2>
          <p className="mt-2 text-slate-500">
            Your next bright idea is just around the corner.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={loginInfo.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={loginInfo.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            New to BrainBoost?{" "}
            <Link
              className="font-bold text-violet-700 hover:text-violet-900"
              to="/signup"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
      <ToastContainer position="top-right" autoClose={5000} />
    </main>
  );
}

export default Login;
