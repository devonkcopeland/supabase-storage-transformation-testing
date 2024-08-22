import { createClient, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import StorageTesting from "./StorageTesting";

const SUPABASE_PROJECT_ID = import.meta.env.VITE_APP_SUPABASE_PROJECT_ID;
const SUPABASE_ANON_KEY = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(
  `https://${SUPABASE_PROJECT_ID}.supabase.co`,
  SUPABASE_ANON_KEY
);

function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [session, setSession] = useState<null | Session>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const handleSignIn = () => {
    supabase.auth.signInWithPassword({
      email: username ?? "",
      password: password ?? "",
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-4 p-6 items-center">
      <div className="text-2xl font-bold">
        Supabase Storage Image Transformation Testing
      </div>
      <a
        className="text-blue-600 underline"
        href="https://github.com/devonkcopeland/supabase-storage-transformation-testing"
      >
        source code for this website
      </a>
      <div>
        Project ID: <span className="font-mono">{SUPABASE_PROJECT_ID}</span>
      </div>
      {session?.user ? (
        <>
          <div className="font-bold text-green-500">Authenticated ✅</div>
          <StorageTesting />
        </>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="w-full text-center">Authentication:</div>
          <input
            type="text"
            className="border rounded"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
          />
          <input
            type="password"
            className="border rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
          />
          <button
            className="border bg-blue-500 text-white rounded"
            onClick={() => handleSignIn()}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
