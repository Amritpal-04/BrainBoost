const API = "http://localhost:8080";

function authHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Something went wrong. Please try again.");
  }
  return result.data;
}

export function fetchQuestions({ modeId, topic, difficulty }) {
  const params = new URLSearchParams({ mode: modeId, difficulty });
  if (topic) params.set("topic", topic);
  return request(`/quiz/questions?${params}`);
}

export function submitQuiz(body) {
  return request("/quiz/submit", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchSummary() {
  return request("/quiz/summary");
}
