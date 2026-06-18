import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AuthScreen from "./AuthScreen";
import ArticlesGame, { CSS } from "./ArticlesGame";

function BiergartenbgEl() {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:0,
      overflow:"hidden", pointerEvents:"none",
      filter:"blur(4px) brightness(0.55)", opacity:0.75,
    }}>
      <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg"
           preserveAspectRatio="xMidYMid slice"
           style={{width:"100%",height:"100%",display:"block"}}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A1828"/>
            <stop offset="55%" stopColor="#2C1808"/>
            <stop offset="100%" stopColor="#1A0C04"/>
          </linearGradient>
        </defs>
        <rect width="700" height="400" fill="url(#sky)"/>
        <circle cx="590" cy="55" r="28" fill="#F5E870" opacity="0.18"/>
        <circle cx="590" cy="55" r="16" fill="#F5E870" opacity="0.38"/>
        <circle cx="100" cy="35" r="1.5" fill="white" opacity="0.55"/>
        <circle cx="185" cy="22" r="1" fill="white" opacity="0.5"/>
        <circle cx="290" cy="48" r="1.5" fill="white" opacity="0.6"/>
        <circle cx="395" cy="28" r="1" fill="white" opacity="0.45"/>
        <circle cx="475" cy="62" r="1.5" fill="white" opacity="0.55"/>
        <circle cx="55" cy="78" r="1" fill="white" opacity="0.4"/>
        <circle cx="645" cy="38" r="1" fill="white" opacity="0.5"/>
        <circle cx="340" cy="18" r="1" fill="white" opacity="0.45"/>
        <rect y="305" width="700" height="95" fill="#150A02"/>
        <ellipse cx="350" cy="345" rx="290" ry="38" fill="#241408" opacity="0.85"/>
        <rect x="52" y="170" width="14" height="136" rx="5" fill="#281404"/>
        <circle cx="59" cy="152" r="56" fill="#0C2808"/>
        <circle cx="36" cy="175" r="42" fill="#10300A"/>
        <circle cx="80" cy="178" r="40" fill="#0C2808"/>
        <rect x="6" y="190" width="11" height="116" rx="4" fill="#281404"/>
        <circle cx="12" cy="175" r="46" fill="#082208"/>
        <circle cx="30" cy="186" r="30" fill="#082208"/>
        <rect x="632" y="172" width="14" height="133" rx="5" fill="#281404"/>
        <circle cx="639" cy="155" r="54" fill="#0C2808"/>
        <circle cx="614" cy="178" r="40" fill="#10300A"/>
        <circle cx="658" cy="180" r="42" fill="#0C2808"/>
        <rect x="674" y="192" width="11" height="114" rx="4" fill="#281404"/>
        <circle cx="680" cy="176" r="46" fill="#082208"/>
        <circle cx="700" cy="188" r="30" fill="#082208"/>
        <rect x="168" y="95" width="10" height="212" rx="3" fill="#4A2C10"/>
        <rect x="348" y="95" width="10" height="212" rx="3" fill="#4A2C10"/>
        <rect x="528" y="95" width="10" height="212" rx="3" fill="#4A2C10"/>
        <rect x="163" y="92" width="380" height="10" rx="4" fill="#4A2C10"/>
        <rect x="190" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="220" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="250" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="280" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="310" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="340" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="370" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="400" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="430" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="460" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="490" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <rect x="520" y="102" width="4" height="188" rx="1" fill="#6A4018" opacity="0.45"/>
        <path d="M 173 98 Q 261 140 353 98" fill="none" stroke="#F2B705" strokeWidth="1.5" opacity="0.72"/>
        <path d="M 353 98 Q 441 140 533 98" fill="none" stroke="#F2B705" strokeWidth="1.5" opacity="0.72"/>
        <circle cx="193" cy="104" r="3.5" fill="#FFF0A0"/>
        <circle cx="218" cy="117" r="3.5" fill="#FFF0A0"/>
        <circle cx="243" cy="127" r="3.5" fill="#FFF0A0"/>
        <circle cx="268" cy="132" r="3.5" fill="#FFF0A0"/>
        <circle cx="293" cy="134" r="3.5" fill="#FFF0A0"/>
        <circle cx="318" cy="130" r="3.5" fill="#FFF0A0"/>
        <circle cx="340" cy="114" r="3.5" fill="#FFF0A0"/>
        <circle cx="373" cy="104" r="3.5" fill="#FFF0A0"/>
        <circle cx="398" cy="117" r="3.5" fill="#FFF0A0"/>
        <circle cx="423" cy="127" r="3.5" fill="#FFF0A0"/>
        <circle cx="448" cy="132" r="3.5" fill="#FFF0A0"/>
        <circle cx="473" cy="134" r="3.5" fill="#FFF0A0"/>
        <circle cx="498" cy="130" r="3.5" fill="#FFF0A0"/>
        <circle cx="520" cy="114" r="3.5" fill="#FFF0A0"/>
        <ellipse cx="263" cy="138" rx="88" ry="16" fill="#F2B705" opacity="0.07"/>
        <ellipse cx="443" cy="138" rx="88" ry="16" fill="#F2B705" opacity="0.07"/>
        <ellipse cx="178" cy="122" rx="18" ry="6" fill="#F2B705" opacity="0.12"/>
        <rect x="163" y="74" width="25" height="20" rx="4" fill="#C88C18"/>
        <rect x="165" y="76" width="21" height="16" rx="2" fill="#F8E060" opacity="0.72"/>
        <rect x="172" y="70" width="7" height="8" rx="2" fill="#A07010"/>
        <ellipse cx="358" cy="122" rx="18" ry="6" fill="#F2B705" opacity="0.12"/>
        <rect x="343" y="74" width="25" height="20" rx="4" fill="#C88C18"/>
        <rect x="345" y="76" width="21" height="16" rx="2" fill="#F8E060" opacity="0.72"/>
        <rect x="352" y="70" width="7" height="8" rx="2" fill="#A07010"/>
        <ellipse cx="538" cy="122" rx="18" ry="6" fill="#F2B705" opacity="0.12"/>
        <rect x="523" y="74" width="25" height="20" rx="4" fill="#C88C18"/>
        <rect x="525" y="76" width="21" height="16" rx="2" fill="#F8E060" opacity="0.72"/>
        <rect x="532" y="70" width="7" height="8" rx="2" fill="#A07010"/>
        <ellipse cx="235" cy="315" rx="46" ry="13" fill="#3C2010"/>
        <rect x="231" y="304" width="10" height="38" rx="3" fill="#281408"/>
        <rect x="217" y="294" width="12" height="19" rx="2" fill="#CC9A10"/>
        <ellipse cx="223" cy="293" rx="6.5" ry="3.5" fill="white" opacity="0.82"/>
        <rect x="233" y="291" width="12" height="19" rx="2" fill="#CC9A10"/>
        <ellipse cx="239" cy="290" rx="6.5" ry="3.5" fill="white" opacity="0.82"/>
        <rect x="249" y="296" width="11" height="17" rx="2" fill="#CC9A10"/>
        <ellipse cx="254" cy="295" rx="6" ry="3" fill="white" opacity="0.75"/>
        <ellipse cx="455" cy="317" rx="46" ry="13" fill="#3C2010"/>
        <rect x="451" y="306" width="10" height="38" rx="3" fill="#281408"/>
        <rect x="437" y="296" width="12" height="19" rx="2" fill="#CC9A10"/>
        <ellipse cx="443" cy="295" rx="6.5" ry="3.5" fill="white" opacity="0.82"/>
        <rect x="453" y="293" width="12" height="19" rx="2" fill="#CC9A10"/>
        <ellipse cx="459" cy="292" rx="6.5" ry="3.5" fill="white" opacity="0.82"/>
        <rect x="469" y="297" width="11" height="17" rx="2" fill="#CC9A10"/>
        <ellipse cx="474" cy="296" rx="6" ry="3" fill="white" opacity="0.75"/>
        <ellipse cx="235" cy="294" rx="55" ry="26" fill="#F2A020" opacity="0.07"/>
        <ellipse cx="455" cy="295" rx="55" ry="26" fill="#F2A020" opacity="0.07"/>
      </svg>
    </div>
  );
}

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
      <BiergartenbgEl/>
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
