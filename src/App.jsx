import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AuthScreen from "./AuthScreen";
import ArticlesGame, { CSS } from "./ArticlesGame";

export default function App() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    supabase
      .from("profiles")
      .select("is_premium")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data || { is_premium: false });
        setProfileLoading(false);
      });
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <style>{CSS}</style>
      {checkingSession ? (
        <div className="gda-root" style={{ textAlign: "center" }}>
          Cargando...
        </div>
      ) : !session ? (
        <AuthScreen />
      ) : profileLoading ? (
        <div className="gda-root" style={{ textAlign: "center" }}>
          Cargando tu cuenta...
        </div>
      ) : (
        <ArticlesGame
          isPremium={profile?.is_premium || false}
          userEmail={session.user.email}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
