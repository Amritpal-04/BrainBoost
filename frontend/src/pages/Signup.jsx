import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import phoneLabels from "react-phone-number-input/locale/en.json";
import { handleError, handleSuccess } from "../utils";

const PhoneInput = lazy(() => import("react-phone-number-input/min"));

function getDefaultPhoneCountry() {
  const region = navigator.language.match(/-([A-Za-z]{2})$/)?.[1]?.toUpperCase();
  return region || "US";
}

function Signup() {
  const [signupInfo, setSignupInfo] = useState(() => ({
    name: "",
    email: "",
    password: "",
    username: "",
    birthDate: "",
    gender: "",
    phoneNumber: "",
    phoneCountry: getDefaultPhoneCountry(),
    educationLevel: "",
    learningGoal: "",
  }));
  const [usernameCheck, setUsernameCheck] = useState({ username: "", status: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [maxBirthDate] = useState(() => new Date().toISOString().slice(0, 10));
  const normalizedUsername = signupInfo.username.trim().toLowerCase();
  const visibleUsernameStatus = usernameCheck.username === normalizedUsername
    ? usernameCheck.status
    : "idle";

  useEffect(() => {
    if (!/^[A-Za-z0-9_]{3,30}$/.test(normalizedUsername)) {
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setUsernameCheck({ username: normalizedUsername, status: "checking" });
      try {
        const response = await fetch(
          `http://localhost:8080/auth/username-availability?username=${encodeURIComponent(normalizedUsername)}`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok || !result.success || typeof result.available !== "boolean") {
          throw new Error(result.message || "Unable to check username.");
        }

        setUsernameCheck({
          username: normalizedUsername,
          status: result.available ? "available" : "taken",
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setUsernameCheck({ username: normalizedUsername, status: "error" });
      }
    }, 350);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [normalizedUsername]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignupInfo((currentInfo) => ({ ...currentInfo, [name]: value }));
  };

  const handleContinue = (event) => {
    event.preventDefault();
    setStep(2);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!/^\+[1-9]\d{6,14}$/.test(signupInfo.phoneNumber)) {
      handleError("Enter a valid phone number for the selected country.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signupInfo,
          username: normalizedUsername,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        const validationMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.details?.[0]?.message;
        handleError(validationMessage || result.message || "Signup failed.");
        return;
      }

      handleSuccess(result.message || "Signup successful.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      handleError(
        error instanceof TypeError
          ? "Cannot connect to the backend. Start it with npm start from the project root."
          : error instanceof Error
            ? error.message
            : "Signup failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-cyan-50 px-4 py-10">
      <section className={`grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-violet-950/10 ${
        step === 2 ? "max-w-6xl md:grid-cols-[2fr_3fr]" : "max-w-5xl md:grid-cols-2"
      }`}>
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-12 text-white md:flex">
          <div className="auth-bubble auth-bubble--top absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
          <div className="auth-bubble auth-bubble--bottom absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-300/10" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
              <Brain size={25} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">BrainBoost</span>
          </div>
          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <Sparkles size={16} /> Small steps. Bright ideas.
            </span>
            <h1 className="text-4xl font-black leading-tight">
                {step === 1 ? "Make room for a little more curiosity." : "A profile built around you."}
            </h1>
            <p className="mt-4 max-w-sm leading-7 text-violet-100">
                {step === 1
                  ? "Practice numbers, explore patterns, and discover how much you can do."
                  : "A few details help us make your BrainBoost experience more personal."}
            </p>
          </div>
          <p className="relative text-sm text-violet-200">
            Think curious. Learn confidently.
          </p>
        </div>

        <div className={step === 2 ? "p-6 sm:p-8" : "p-7 sm:p-12"}>
          <div className="mb-9 md:hidden">
            <div className="flex items-center gap-3 text-violet-700">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100">
                <Brain size={25} />
              </span>
              <span className="text-xl font-extrabold tracking-tight">BrainBoost</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
              Step {step} of 2
            </span>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800">
              {step === 1 ? "Account" : "Profile details"}
            </span>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Signup progress"
            aria-valuemin={1}
            aria-valuemax={2}
            aria-valuenow={step}
          >
            <div className={`h-full rounded-full bg-violet-600 transition-all ${step === 1 ? "w-1/2" : "w-full"}`} />
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
            {step === 1 ? "Create your account" : "Tell us about yourself"}
          </h2>
          <p className="mt-2 text-slate-500">
            {step === 1
              ? "Join BrainBoost and start exploring new ideas."
              : "Complete your profile to finish creating your account."}
          </p>

          <form
            className="mt-6 space-y-5"
            onSubmit={step === 1 ? handleContinue : handleSignup}
          >
            {step === 1 ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="name">
                    Your name
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={signupInfo.name}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
                    Email address
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={signupInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={signupInfo.password}
                    onChange={handleChange}
                    minLength={4}
                    maxLength={100}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Choose a username"
                    value={signupInfo.username}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={30}
                    pattern="[A-Za-z0-9_]{3,30}"
                    title="Use 3–30 letters, numbers, or underscores."
                    required
                  />
                  {visibleUsernameStatus !== "idle" && (
                    <p
                      role={visibleUsernameStatus === "taken" ? "alert" : "status"}
                      className={`mt-2 text-sm ${
                        visibleUsernameStatus === "taken" || visibleUsernameStatus === "error"
                          ? "text-rose-600"
                          : visibleUsernameStatus === "available"
                            ? "text-emerald-700"
                            : "text-slate-500"
                      }`}
                    >
                      {visibleUsernameStatus === "checking" && "Checking username availability…"}
                      {visibleUsernameStatus === "available" && "Username is available."}
                      {visibleUsernameStatus === "taken" && "That username already exists. Please choose another."}
                      {visibleUsernameStatus === "error" && "Could not check availability. It will be checked when you submit."}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="birthDate">
                    Birthday
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    max={maxBirthDate}
                    autoComplete="bday"
                    value={signupInfo.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="gender"
                    name="gender"
                    value={signupInfo.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phoneNumber">
                    Phone number
                  </label>
                  <Suspense fallback={<div className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">Loading country selector…</div>}>
                    <PhoneInput
                      className="signup-phone flex min-h-12 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100"
                      country={signupInfo.phoneCountry}
                      international
                      withCountryCallingCode
                      countryCallingCodeEditable={false}
                      labels={phoneLabels}
                      value={signupInfo.phoneNumber || undefined}
                      onChange={(phoneNumber) => setSignupInfo((currentInfo) => ({
                        ...currentInfo,
                        phoneNumber: phoneNumber || "",
                      }))}
                      onCountryChange={(phoneCountry) => setSignupInfo((currentInfo) => ({
                        ...currentInfo,
                        phoneCountry: phoneCountry || getDefaultPhoneCountry(),
                        phoneNumber: "",
                      }))}
                      countrySelectProps={{ "aria-label": "Phone country" }}
                      numberInputProps={{
                        id: "phoneNumber",
                        name: "phoneNumber",
                        autoComplete: "tel",
                        placeholder: "Number",
                        required: true,
                        className: "min-w-0 flex-1 bg-transparent py-3 text-slate-900 outline-none placeholder:text-slate-400",
                      }}
                    />
                  </Suspense>
                  <p className="mt-2 text-sm text-slate-500">Select your country to format and validate the number.</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="educationLevel">
                    Education level (optional)
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="educationLevel"
                    name="educationLevel"
                    value={signupInfo.educationLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select your level</option>
                    <option value="primary">Primary school</option>
                    <option value="middle">Middle school</option>
                    <option value="high">High school</option>
                    <option value="college">College or university</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="learningGoal">
                    Learning goal (optional)
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    id="learningGoal"
                    name="learningGoal"
                    value={signupInfo.learningGoal}
                    onChange={handleChange}
                  >
                    <option value="">Select a goal</option>
                    <option value="math">Improve math skills</option>
                    <option value="logic">Build logical thinking</option>
                    <option value="calculation">Improve calculation speed</option>
                    <option value="confidence">Build learning confidence</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              {step === 2 && (
                <button
                  className="min-h-12 flex-1 rounded-xl border border-slate-200 px-5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}
              <button
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {step === 1 ? "Continue" : isSubmitting ? "Creating account..." : "Create account"}
                {step === 1 && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              className="font-bold text-violet-700 hover:text-violet-900"
              to="/login"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
      <ToastContainer position="top-right" autoClose={5000} />
    </main>
  );
}

export default Signup;
