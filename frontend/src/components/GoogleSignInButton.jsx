import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";

const GOOGLE_SCRIPT_ID = "google-identity-services";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
let googleScriptPromise;

function loadGoogleIdentityServices() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      let script = document.getElementById(GOOGLE_SCRIPT_ID);
      if (!script) {
        script = document.createElement("script");
        script.id = GOOGLE_SCRIPT_ID;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
      }

      if (script.dataset.loaded === "true") {
        resolve();
        return;
      }

      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        resolve();
      }, { once: true });
      script.addEventListener("error", reject, { once: true });

      if (!script.isConnected) {
        document.head.appendChild(script);
      }
    }).then(() => {
      if (!window.google?.accounts?.id) {
        throw new Error("Google sign-in could not be initialized.");
      }
    }).catch((error) => {
      googleScriptPromise = undefined;
      throw error;
    });
  }

  return googleScriptPromise;
}

export default function GoogleSignInButton() {
  const buttonRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!googleClientId) {
      return undefined;
    }

    const buttonElement = buttonRef.current;
    const abortController = new AbortController();
    loadGoogleIdentityServices()
      .then(() => {
        if (abortController.signal.aborted || !buttonElement) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async ({ credential }) => {
            if (!credential || isSubmittingRef.current) {
              return;
            }

            isSubmittingRef.current = true;
            setIsSubmitting(true);
            try {
              const response = await fetch("http://localhost:8080/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential }),
              });
              const result = await response.json();

              if (!response.ok || !result.success || !result.token || !result.user) {
                handleError(result.message || "Google sign-in failed. Please try again.");
                return;
              }

              sessionStorage.setItem("token", result.token);
              sessionStorage.setItem("user", JSON.stringify(result.user));
              handleSuccess(result.message || "Signed in with Google.");
              navigate("/home", { replace: true });
            } catch (error) {
              handleError(
                error instanceof TypeError
                  ? "Cannot connect to the backend. Start it with npm start from the project root."
                  : error instanceof Error
                    ? error.message
                    : "Google sign-in failed. Please try again.",
              );
            } finally {
              isSubmittingRef.current = false;
              setIsSubmitting(false);
            }
          },
        });

        window.google.accounts.id.renderButton(buttonElement, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: Math.min(400, Math.max(240, Math.floor(buttonElement.clientWidth))),
        });
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          handleError(error instanceof Error ? error.message : "Google sign-in could not be loaded.");
        }
      });

    return () => {
      abortController.abort();
      buttonElement?.replaceChildren();
    };
  }, [navigate]);

  return (
    <div className="mt-6">
      <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>or continue with</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      {googleClientId ? (
        <>
          <div ref={buttonRef} className="flex min-h-10 justify-center" />
          {isSubmitting && (
            <p className="mt-3 text-center text-sm text-slate-500" role="status">
              Signing in with Google…
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-sm text-slate-500" role="status">
          Google sign-in needs a client ID. Configure <code>VITE_GOOGLE_CLIENT_ID</code>.
        </p>
      )}
    </div>
  );
}
