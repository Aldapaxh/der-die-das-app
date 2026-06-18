import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <input
          id="password"
          className="gda-auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          required
        />
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
    </div>
  );
}
