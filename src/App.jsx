import "./style/App.css";
import AppRouter from "./routes/AppRouter";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth, setUser } from "./features/auth/authSlice";
import { supabase } from "./supabase/client";

function App() {
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // 1. Check auth on mount
    const initAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (err) {
        console.log("checkAuth failed:", err);
      } finally {
        setAuthReady(true);
      }
    };

    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!authReady) return;

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, "Session:", session ? "YES" : "NO");

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        let profile = null;
        try {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();
          profile = data;
        } catch (err) {
          console.warn("Profile fetch failed:", err.message);
        }

        dispatch(
          setUser({
            user: session.user,
            session,
            profile,
          }),
        );
      }

      if (event === "SIGNED_OUT") {
        dispatch(setUser({ user: null, session: null, profile: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, [authReady, dispatch]);

  if (!authReady) {
    return null; 
  }

  return <AppRouter />
}

export default App;
