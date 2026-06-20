import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "./supabaseClient";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Cuenta creada. Revisa tu correo para confirmar el registro y luego inicia sesión.");
      }
    } catch (err) {
      setError(err.message || "Algo ha ido mal. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gda-root">
      <div className="gda-header">
        <div className="gda-sign">DER · DIE · DAS</div>
        <p className="gda-tagline">
          {mode === "login" ? "Inicia sesión para continuar." : "Crea tu cuenta para empezar a aprender."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="gda-card" style={{ display: "block", textAlign: "left", cursor: "default" }}>
        <label className="gda-auth-label" htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          className="gda-auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <label className="gda-auth-label" htmlFor="password">Contraseña</label>
        <div className="gda-auth-password-wrap">
          <input
            id="password"
            className="gda-auth-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            required
          />
          <button
            type="button"
            className="gda-auth-eye-btn"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {error && <p className="gda-auth-error">{error}</p>}
        {info && <p className="gda-auth-info">{info}</p>}
        <button className="gda-btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 16 }}>
          {loading ? "Un momento..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "#9C9787", marginTop: 16 }}>
        {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
        <button
          className="gda-link-btn"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
            setInfo("");
          }}
        >
          {mode === "login" ? "Crea una" : "Inicia sesión"}
        </button>
      </p>

      <section style={{ marginTop: 40, color: "#F2EFE6" }}>
        <h2 style={{ fontSize: 17, fontFamily: "'Oswald',sans-serif", textAlign: "center" }}>
          ¿Por qué der, die, das es tan difícil?
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#C7C3B8", maxWidth: 500, margin: "10px auto 0" }}>
          Cada sustantivo alemán tiene un género — masculino, femenino o neutro — y ese
          género no siempre tiene relación con el significado de la palabra. La forma
          en que más rápido se memoriza no es estudiando listas sueltas, sino aprendiendo
          cada palabra dentro de una frase real, con su artículo siempre pegado a ella.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 22 }}>
          {[
            { art: "der", noun: "Tisch", es: "la mesa", color: "#1E5FAE", sentence: "Der Tisch ist groß." },
            { art: "die", noun: "Tür", es: "la puerta", color: "#C8313A", sentence: "Die Tür ist offen." },
            { art: "das", noun: "Haus", es: "la casa", color: "#1F7A4D", sentence: "Das Haus ist groß." },
          ].map((w) => (
            <div
              key={w.noun}
              style={{
                background: "#F2EFE6",
                color: "#1C2128",
                borderRadius: 12,
                padding: "14px 18px",
                minWidth: 130,
                textAlign: "center",
                border: `3px solid ${w.color}`,
              }}
            >
              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 17 }}>
                <span style={{ color: w.color }}>{w.art}</span> {w.noun}
              </div>
              <div style={{ fontSize: 12, color: "#6b6760", marginTop: 2 }}>{w.es}</div>
              <div style={{ fontSize: 11.5, color: "#5b574c", marginTop: 6, fontStyle: "italic" }}>{w.sentence}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#C7C3B8", maxWidth: 500, margin: "22px auto 0" }}>
          Der, Die, Das ofrece un nivel gratuito con 50 palabras de uso cotidiano organizadas
          por categorías — casa, comida, ciudad, trabajo, naturaleza y personas — y un nivel
          premium con 163 palabras practicando los cuatro casos del alemán (Nominativ,
          Akkusativ, Dativ y Genitiv), para entender de una vez por todas por qué <em>der</em>{" "}
          se convierte en <em>den</em>, <em>dem</em> o <em>des</em> según la frase.
        </p>
      </section>
    </div>
  );
}
