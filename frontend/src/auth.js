export async function signIn(credentials) {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const result = await response.json();

  if (!response.ok || !result.success || !result.token) {
    throw new Error(result.message || "Unable to log in. Please try again.");
  }

  localStorage.setItem("user", JSON.stringify(result.user));
  localStorage.setItem("token", result.token);
  return result;
}
