import { useState, useMemo } from "react";
import { Lock, ChevronRight, Table2 } from "lucide-react";

const COLORS = {
  der: { main: "#1E5FAE", label: "masculino" },
  die: { main: "#C8313A", label: "femenino" },
  das: { main: "#1F7A4D", label: "neutro" },
};

const BASIC_WORDS = [
  { id: "b1", article: "der", noun: "Tisch", sentence: "Der Tisch ist groß.", translation: "La mesa es grande." },
  { id: "b2", article: "die", noun: "Tür", sentence: "Die Tür ist offen.", translation: "La puerta está abierta." },
  { id: "b3", article: "das", noun: "Haus", sentence: "Das Haus ist groß.", translation: "La casa es grande." },
  { id: "b4", article: "der", noun: "Hund", sentence: "Der Hund schläft.", translation: "El perro duerme." },
  { id: "b5", article: "die", noun: "Katze", sentence: "Die Katze ist klein.", translation: "El gato es pequeño." },
  { id: "b6", article: "das", noun: "Auto", sentence: "Das Auto ist neu.", translation: "El coche es nuevo." },
  { id: "b7", article: "der", noun: "Mann", sentence: "Der Mann arbeitet viel.", translation: "El hombre trabaja mucho." },
  { id: "b8", article: "die", noun: "Frau", sentence: "Die Frau liest ein Buch.", translation: "La mujer lee un libro." },
  { id: "b9", article: "das", noun: "Kind", sentence: "Das Kind spielt im Garten.", translation: "El niño juega en el jardín." },
  { id: "b10", article: "der", noun: "Stuhl", sentence: "Der Stuhl ist kaputt.", translation: "La silla está rota." },
  { id: "b11", article: "die", noun: "Lampe", sentence: "Die Lampe ist sehr hell.", translation: "La lámpara es muy brillante." },
  { id: "b12", article: "das", noun: "Buch", sentence: "Das Buch ist interessant.", translation: "El libro es interesante." },
  { id: "b13", article: "der", noun: "Apfel", sentence: "Der Apfel ist rot.", translation: "La manzana es roja." },
  { id: "b14", article: "die", noun: "Banane", sentence: "Die Banane ist gelb.", translation: "El plátano es amarillo." },
  { id: "b15", article: "das", noun: "Brot", sentence: "Das Brot ist frisch.", translation: "El pan es fresco." },
  { id: "b16", article: "der", noun: "Garten", sentence: "Der Garten ist sehr schön.", translation: "El jardín es muy bonito." },
  { id: "b17", article: "die", noun: "Straße", sentence: "Die Straße ist lang.", translation: "La calle es larga." },
  { id: "b18", article: "das", noun: "Fenster", sentence: "Das Fenster ist offen.", translation: "La ventana está abierta." },
];

const CASE_INFO = {
  Nominativ: { note: "El sujeto de la frase: quién hace la acción." },
  Akkusativ: { note: "El objeto directo: ¿a quién o qué?" },
  Dativ: { note: "El objeto indirecto, o tras preposiciones de lugar fijo." },
  Genitiv: { note: "Posesión: ¿de quién o de qué?" },
};
const CASE_ORDER = ["Nominativ", "Akkusativ", "Dativ", "Genitiv"];

const CASE_WORDS = [
  {
    id: "c1", noun: "Tisch", gender: "der",
    cases: {
      Nominativ: { phrase: "der Tisch", template: "___ ist alt.", translation: "La mesa es vieja." },
      Akkusativ: { phrase: "den Tisch", template: "Ich kaufe ___.", translation: "Compro la mesa." },
      Dativ: { phrase: "dem Tisch", template: "Die Katze sitzt unter ___.", translation: "El gato está debajo de la mesa." },
      Genitiv: { phrase: "des Tisches", template: "Die Farbe ___ ist braun.", translation: "El color de la mesa es marrón." },
    },
  },
  {
    id: "c2", noun: "Tür", gender: "die",
    cases: {
      Nominativ: { phrase: "die Tür", template: "___ ist offen.", translation: "La puerta está abierta." },
      Akkusativ: { phrase: "die Tür", template: "Ich öffne ___.", translation: "Abro la puerta." },
      Dativ: { phrase: "der Tür", template: "Ich stehe vor ___.", translation: "Estoy delante de la puerta." },
      Genitiv: { phrase: "der Tür", template: "Der Griff ___ ist kaputt.", translation: "El pomo de la puerta está roto." },
    },
  },
  {
    id: "c3", noun: "Haus", gender: "das",
    cases: {
      Nominativ: { phrase: "das Haus", template: "___ ist groß.", translation: "La casa es grande." },
      Akkusativ: { phrase: "das Haus", template: "Wir kaufen ___.", translation: "Compramos la casa." },
      Dativ: { phrase: "dem Haus", template: "Wir wohnen in ___.", translation: "Vivimos en la casa." },
      Genitiv: { phrase: "des Hauses", template: "Das Dach ___ ist rot.", translation: "El tejado de la casa es rojo." },
    },
  },
  {
    id: "c4", noun: "Hund", gender: "der",
    cases: {
      Nominativ: { phrase: "der Hund", template: "___ läuft schnell.", translation: "El perro corre rápido." },
      Akkusativ: { phrase: "den Hund", template: "Ich sehe ___.", translation: "Veo al perro." },
      Dativ: { phrase: "dem Hund", template: "Ich gebe ___ einen Ball.", translation: "Le doy una pelota al perro." },
      Genitiv: { phrase: "des Hundes", template: "Die Leine ___ ist neu.", translation: "La correa del perro es nueva." },
    },
  },
  {
    id: "c5", noun: "Frau", gender: "die",
    cases: {
      Nominativ: { phrase: "die Frau", template: "___ singt sehr gut.", translation: "La mujer canta muy bien." },
      Akkusativ: { phrase: "die Frau", template: "Ich kenne ___.", translation: "Conozco a la mujer." },
      Dativ: { phrase: "der Frau", template: "Ich helfe ___.", translation: "Ayudo a la mujer." },
      Genitiv: { phrase: "der Frau", template: "Das Auto ___ ist rot.", translation: "El coche de la mujer es rojo." },
    },
  },
];

const TIPS = [
  {
    title: "Terminaciones que delatan el género",
    text: "Si una palabra termina en -ung, -heit, -keit, -schaft, -tion o -tät, casi siempre es die. Es una de las pistas más fiables del alemán: die Wohnung, die Freiheit, die Universität.",
  },
  {
    title: "Pistas para der",
    text: "Las palabras que terminan en -ismus, -or, -ist o -ling suelen ser der: der Tourismus, der Motor, der Frühling. Funciona casi siempre, también con profesiones.",
  },
  {
    title: "El truco más famoso",
    text: "Toda palabra terminada en -chen o -lein es das, sin excepción. Por eso das Mädchen (la chica) es neutro: el sufijo manda sobre el significado.",
  },
  {
    title: "Cuando el significado ayuda",
    text: "Los días de la semana, los meses y las estaciones suelen ser der: der Montag, der Januar, der Sommer. No hace falta memorizar cada uno por separado.",
  },
  {
    title: "Categorías femeninas por significado",
    text: "Las flores y los números usados como sustantivos suelen ser die: die Rose, die Drei. También casi todos los ríos alemanes: die Donau.",
  },
  {
    title: "Categorías neutras por significado",
    text: "Los verbos convertidos en sustantivos y los metales suelen ser das: das Schwimmen, das Gold, das Silber.",
  },
  {
    title: "La última palabra manda",
    text: "En una palabra compuesta, el género lo decide siempre la última parte, sin importar las anteriores: der Tisch + das Bein → das Tischbein.",
  },
  {
    title: "Si tienes que apostar...",
    text: "Cuando no sepas el género y tengas que arriesgar, elige die. Casi la mitad de los sustantivos alemanes son femeninos, así que es la apuesta más rentable a ciegas.",
  },
  {
    title: "Por qué aprender siempre el artículo",
    text: "El género no solo cambia el artículo: también afecta a los adjetivos y a los pronombres. Aprenderlo desde el primer día evita tener que corregir el hábito más adelante.",
  },
  {
    title: "Un error de género no es el fin del mundo",
    text: "Si te equivocas, te entienden igual. Lo importante es seguir hablando: con práctica, el género se vuelve automático.",
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCaseRounds() {
  const rounds = [];
  CASE_WORDS.forEach((w) => {
    CASE_ORDER.forEach((c) => rounds.push({ wordId: w.id, caseName: c }));
  });
  return shuffle(rounds);
}

function getInsertedPhrase(template, phrase) {
  if (template.startsWith("___")) {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  }
  return phrase;
}

function fillSentence(template, phrase) {
  return template.replace("___", getInsertedPhrase(template, phrase));
}

function ColoredSentence({ text, phrase, gender }) {
  const idx = text.indexOf(phrase);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: COLORS[gender].main, fontWeight: 700 }}>{phrase}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
}

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

.gda-root{ background:#1C2128; color:#F2EFE6; font-family:'Inter',sans-serif; border-radius:18px; padding:32px 22px; max-width:680px; margin:0 auto; }
.gda-account-bar{ display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#9C9787; margin-bottom:14px; }
.gda-link-btn{ background:none; border:none; color:#F2B705; text-decoration:underline; cursor:pointer; font-size:12px; padding:0; }
.gda-auth-label{ display:block; font-size:11.5px; color:#5b574c; margin-bottom:6px; margin-top:14px; text-transform:uppercase; letter-spacing:0.5px; }
.gda-auth-input{ width:100%; padding:10px 12px; border-radius:8px; border:1px solid rgba(0,0,0,0.15); background:#fff; color:#1C2128; font-size:14px; }
.gda-auth-input:focus{ outline:2px solid #F2B705; }
.gda-auth-error{ color:#C8313A; font-size:13px; margin-top:10px; }
.gda-auth-info{ color:#1F7A4D; font-size:13px; margin-top:10px; }
.gda-header{ text-align:center; margin-bottom:10px; }
.gda-sign{ display:inline-block; background:#F2EFE6; color:#1C2128; font-family:'Oswald',sans-serif; font-weight:700; letter-spacing:3px; font-size:28px; padding:10px 26px; border-radius:10px; border:4px solid #1C2128; box-shadow:0 0 0 4px #F2B705 inset; }
.gda-tagline{ margin-top:14px; font-size:14px; color:#C7C3B8; max-width:460px; margin-inline:auto; line-height:1.55; }
.gda-legend{ display:flex; gap:8px; justify-content:center; margin-top:18px; flex-wrap:wrap; }
.gda-chip{ font-size:12.5px; padding:6px 12px; border-radius:20px; background:rgba(255,255,255,0.06); border-left:4px solid var(--c); font-weight:600; }
.gda-laneline{ height:0; border-top:3px dashed #F2B705; opacity:0.45; margin:22px 0; }
.gda-levels{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px; }
.gda-level-btn{ text-align:left; padding:14px 16px; border-radius:12px; border:2px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); cursor:pointer; color:#F2EFE6; }
.gda-level-btn.active{ border-color:#F2B705; background:rgba(242,183,5,0.08); }
.gda-level-title{ font-family:'Oswald',sans-serif; font-weight:600; font-size:14px; letter-spacing:0.5px; display:flex; align-items:center; gap:6px; }
.gda-level-sub{ font-size:12px; color:#9C9787; margin-top:4px; line-height:1.4; }
.gda-paywall{ background:rgba(255,255,255,0.04); border:2px dashed rgba(242,183,5,0.5); border-radius:12px; padding:20px; text-align:center; margin-bottom:18px; }
.gda-btn-primary{ background:#F2B705; color:#1C2128; border:none; padding:10px 22px; border-radius:8px; font-weight:700; cursor:pointer; font-family:'Oswald',sans-serif; letter-spacing:0.5px; font-size:13.5px; }
.gda-mode-toggle{ display:flex; gap:8px; margin-bottom:16px; justify-content:center; }
.gda-toggle-btn{ padding:7px 16px; border-radius:8px; border:1px solid rgba(255,255,255,0.18); background:transparent; color:#F2EFE6; cursor:pointer; font-size:13px; font-weight:600; }
.gda-toggle-btn.active{ background:#F2EFE6; color:#1C2128; border-color:#F2EFE6; }
.gda-card{ background:#F2EFE6; color:#1C2128; border-radius:16px; padding:30px 22px; min-height:170px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border:5px solid var(--gender-color, #8a8576); position:relative; }
.gda-card.clickable{ cursor:pointer; }
.gda-card-noun{ font-family:'Oswald',sans-serif; font-weight:700; font-size:32px; letter-spacing:0.5px; }
.gda-card-article-badge{ position:absolute; top:12px; left:12px; font-family:'Oswald',sans-serif; font-weight:700; font-size:12px; letter-spacing:1px; padding:4px 10px; border-radius:6px; color:#fff; background:var(--gender-color, #1C2128); }
.gda-card-sentence{ font-size:18px; font-weight:600; line-height:1.4; max-width:420px; }
.gda-card-translation{ font-size:13.5px; color:#5b574c; margin-top:10px; font-style:italic; }
.gda-card-hint{ font-size:11px; color:#8a8576; margin-top:16px; text-transform:uppercase; letter-spacing:1px; }
.gda-context-line{ text-align:center; font-size:13px; color:#C7C3B8; margin-bottom:12px; }
.gda-options{ display:flex; gap:9px; justify-content:center; margin-top:16px; flex-wrap:wrap; }
.gda-option-btn{ font-family:'Oswald',sans-serif; font-weight:700; font-size:14px; padding:9px 18px; border-radius:8px; border:3px solid var(--c, rgba(0,0,0,0.15)); cursor:pointer; background:rgba(255,255,255,0.6); color:#1C2128; letter-spacing:0.5px; }
.gda-option-btn:disabled{ cursor:default; }
.gda-option-btn:not(:disabled):hover{ background:rgba(255,255,255,0.9); }
.gda-option-btn.correct{ background:#1F7A4D; border-color:#1F7A4D; color:#fff; }
.gda-option-btn.wrong{ background:#C8313A; border-color:#C8313A; color:#fff; }
.gda-feedback{ margin-top:14px; font-size:13px; padding:10px 14px; border-radius:8px; max-width:440px; line-height:1.5; }
.gda-feedback.ok{ background:rgba(31,122,77,0.12); border:1px solid #1F7A4D; }
.gda-feedback.bad{ background:rgba(200,49,58,0.12); border:1px solid #C8313A; }
.gda-actions{ display:flex; justify-content:center; gap:10px; margin-top:18px; flex-wrap:wrap; }
.gda-next-btn{ display:flex; align-items:center; gap:6px; background:transparent; border:1px solid rgba(255,255,255,0.22); color:#F2EFE6; padding:8px 16px; border-radius:8px; cursor:pointer; font-size:12.5px; font-weight:600; }
.gda-next-btn:hover{ background:rgba(255,255,255,0.06); }
.gda-stats{ display:flex; justify-content:center; gap:26px; margin-top:26px; }
.gda-stat{ text-align:center; }
.gda-stat-value{ font-family:'Oswald',sans-serif; font-size:20px; font-weight:700; font-variant-numeric:tabular-nums; }
.gda-stat-label{ font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#9C9787; margin-top:2px; }
.gda-table{ width:100%; border-collapse:collapse; margin-top:14px; font-size:13px; background:rgba(255,255,255,0.04); border-radius:8px; overflow:hidden; }
.gda-table th, .gda-table td{ padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.08); text-align:left; }
.gda-table th{ font-family:'Oswald',sans-serif; text-transform:uppercase; font-size:10.5px; letter-spacing:1px; color:#9C9787; }
.gda-tip{ background:#F2EFE6; color:#1C2128; border-radius:16px; padding:30px 24px; border:4px dashed #F2B705; text-align:center; }
.gda-tip-label{ font-family:'Oswald',sans-serif; font-weight:700; font-size:11px; letter-spacing:2px; color:#F2B705; text-transform:uppercase; margin-bottom:12px; background:#1C2128; display:inline-block; padding:4px 12px; border-radius:6px; }
.gda-tip-title{ font-family:'Oswald',sans-serif; font-weight:700; font-size:19px; margin-bottom:10px; }
.gda-tip-text{ font-size:14.5px; line-height:1.6; max-width:440px; margin:0 auto; }
button:focus-visible{ outline:2px solid #F2B705; outline-offset:2px; }
@media (max-width: 520px){
  .gda-levels{ grid-template-columns:1fr; }
  .gda-sign{ font-size:22px; padding:8px 18px; }
  .gda-card-noun{ font-size:26px; }
  .gda-card-sentence{ font-size:16px; }
}
@media (prefers-reduced-motion: reduce){
  *{ transition:none !important; }
}
`;

export default function ArticlesGame({ isPremium, userEmail, onLogout }) {
  const [level, setLevel] = useState("basico");

  const [basicMode, setBasicMode] = useState("tarjeta");
  const [basicOrder, setBasicOrder] = useState(() => shuffle(BASIC_WORDS));
  const [basicIndex, setBasicIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [basicAnswer, setBasicAnswer] = useState(null);
  const [basicStats, setBasicStats] = useState({ correct: 0, total: 0, streak: 0 });

  const [caseRounds, setCaseRounds] = useState(buildCaseRounds);
  const [caseIndex, setCaseIndex] = useState(0);
  const [caseAnswer, setCaseAnswer] = useState(null);
  const [caseStats, setCaseStats] = useState({ correct: 0, total: 0, streak: 0 });
  const [showTable, setShowTable] = useState(false);

  const [totalSeen, setTotalSeen] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [activeTip, setActiveTip] = useState(null);

  const basicWord = basicOrder[basicIndex % basicOrder.length];
  const currentRound = caseRounds[caseIndex % caseRounds.length];
  const currentCaseWord = CASE_WORDS.find((w) => w.id === currentRound.wordId);
  const currentCaseData = currentCaseWord.cases[currentRound.caseName];

  const basicOptions = useMemo(() => shuffle(["der", "die", "das"]), [basicIndex]);
  const caseOptions = useMemo(() => {
    const phrases = CASE_ORDER.map((c) => currentCaseWord.cases[c].phrase);
    return shuffle([...new Set(phrases)]);
  }, [caseIndex]);

  function switchBasicMode(mode) {
    setBasicMode(mode);
    setFlipped(false);
    setBasicAnswer(null);
  }

  function maybeShowTip() {
    const next = totalSeen + 1;
    setTotalSeen(next);
    if (next % 5 === 0) {
      setActiveTip(TIPS[tipIndex % TIPS.length]);
      setTipIndex((i) => i + 1);
    }
  }

  function nextBasic() {
    setFlipped(false);
    setBasicAnswer(null);
    const next = basicIndex + 1;
    if (next >= basicOrder.length) {
      setBasicOrder(shuffle(BASIC_WORDS));
      setBasicIndex(0);
    } else {
      setBasicIndex(next);
    }
    maybeShowTip();
  }

  function answerBasic(article) {
    if (basicAnswer) return;
    const correct = article === basicWord.article;
    setBasicAnswer(article);
    setBasicStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
      streak: correct ? s.streak + 1 : 0,
    }));
  }

  function nextCase() {
    setCaseAnswer(null);
    setShowTable(false);
    const next = caseIndex + 1;
    if (next >= caseRounds.length) {
      setCaseRounds(buildCaseRounds());
      setCaseIndex(0);
    } else {
      setCaseIndex(next);
    }
    maybeShowTip();
  }

  function answerCase(phrase) {
    if (caseAnswer) return;
    const correct = phrase === currentCaseData.phrase;
    setCaseAnswer(phrase);
    setCaseStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
      streak: correct ? s.streak + 1 : 0,
    }));
  }

  return (
    <div className="gda-root">
      <div className="gda-account-bar">
        <span>{userEmail}</span>
        <button className="gda-link-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="gda-header">
        <div className="gda-sign">DER · DIE · DAS</div>
        <p className="gda-tagline">
          El artículo es parte de la palabra, no un accesorio. Cada sustantivo se aprende
          dentro de una frase real, nunca suelto.
        </p>
        <div className="gda-legend">
          <span className="gda-chip" style={{ "--c": COLORS.der.main }}>der · masculino</span>
          <span className="gda-chip" style={{ "--c": COLORS.die.main }}>die · femenino</span>
          <span className="gda-chip" style={{ "--c": COLORS.das.main }}>das · neutro</span>
        </div>
      </div>

      <div className="gda-laneline" />

      <div className="gda-levels">
        <button className={`gda-level-btn ${level === "basico" ? "active" : ""}`} onClick={() => setLevel("basico")}>
          <div className="gda-level-title">NIVEL 1 · BÁSICO</div>
          <div className="gda-level-sub">Vocabulario + Nominativ — Gratis</div>
        </button>
        <button className={`gda-level-btn ${level === "casos" ? "active" : ""}`} onClick={() => setLevel("casos")}>
          <div className="gda-level-title">{!isPremium && <Lock size={13} />} NIVEL 2 · CASOS</div>
          <div className="gda-level-sub">Nominativ, Akkusativ, Dativ, Genitiv — Premium</div>
        </button>
      </div>

      {level === "casos" && !isPremium && (
        <div className="gda-paywall">
          <p style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.5 }}>
            Este nivel enseña cómo cambia el artículo según la función de la palabra en la
            frase: der → den → dem → des. Es el contenido completo, de pago.
          </p>
          <p style={{ fontSize: 13, color: "#9C9787" }}>
            Tu cuenta todavía no tiene acceso premium. Muy pronto podrás activarlo desde aquí
            mismo con una compra única o suscripción.
          </p>
        </div>
      )}

      {activeTip ? (
        <div className="gda-tip">
          <div className="gda-tip-label">Consejo</div>
          <div className="gda-tip-title">{activeTip.title}</div>
          <p className="gda-tip-text">{activeTip.text}</p>
          <div className="gda-actions" style={{ marginTop: 18 }}>
            <button className="gda-btn-primary" onClick={() => setActiveTip(null)}>
              Seguir estudiando
            </button>
          </div>
        </div>
      ) : (
        <>
      {level === "basico" && (
        <>
          <div className="gda-mode-toggle">
            <button className={`gda-toggle-btn ${basicMode === "tarjeta" ? "active" : ""}`} onClick={() => switchBasicMode("tarjeta")}>
              Tarjeta
            </button>
            <button className={`gda-toggle-btn ${basicMode === "quiz" ? "active" : ""}`} onClick={() => switchBasicMode("quiz")}>
              Quiz
            </button>
          </div>

          {basicMode === "tarjeta" ? (
            <div
              className="gda-card clickable"
              style={{ "--gender-color": flipped ? COLORS[basicWord.article].main : undefined }}
              onClick={() => setFlipped((f) => !f)}
            >
              {flipped && <span className="gda-card-article-badge">{basicWord.article}</span>}
              {!flipped ? (
                <>
                  <div className="gda-card-noun">{basicWord.noun}</div>
                  <div className="gda-card-hint">Toca para ver el artículo</div>
                </>
              ) : (
                <>
                  <div className="gda-card-sentence">
                    <ColoredSentence
                      text={basicWord.sentence}
                      phrase={basicWord.sentence.split(" ").slice(0, 2).join(" ")}
                      gender={basicWord.article}
                    />
                  </div>
                  <div className="gda-card-translation">{basicWord.translation}</div>
                  <div className="gda-card-hint">Toca para volver</div>
                </>
              )}
            </div>
          ) : (
            <div className="gda-card" style={{ "--gender-color": basicAnswer ? COLORS[basicWord.article].main : undefined }}>
              <div className="gda-card-sentence">
                {basicAnswer ? (
                  <ColoredSentence
                    text={basicWord.sentence}
                    phrase={basicWord.sentence.split(" ").slice(0, 2).join(" ")}
                    gender={basicWord.article}
                  />
                ) : (
                  "___ " + basicWord.sentence.split(" ").slice(1).join(" ")
                )}
              </div>
              <div className="gda-options">
                {basicOptions.map((opt) => {
                  let stateClass = "";
                  if (basicAnswer) {
                    if (opt === basicWord.article) stateClass = "correct";
                    else if (opt === basicAnswer) stateClass = "wrong";
                  }
                  return (
                    <button
                      key={opt}
                      className={`gda-option-btn ${stateClass}`}
                      style={{ "--c": COLORS[opt].main }}
                      onClick={() => answerBasic(opt)}
                      disabled={!!basicAnswer}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {basicAnswer && (
                <div className={`gda-feedback ${basicAnswer === basicWord.article ? "ok" : "bad"}`}>
                  {basicAnswer === basicWord.article
                    ? "¡Correcto! "
                    : "¡Oops! La frase correcta es: "}
                  <ColoredSentence
                    text={basicWord.sentence}
                    phrase={basicWord.sentence.split(" ").slice(0, 2).join(" ")}
                    gender={basicWord.article}
                  />{" "}
                  — {basicWord.translation}
                </div>
              )}
            </div>
          )}

          <div className="gda-actions">
            <button className="gda-next-btn" onClick={nextBasic}>
              Siguiente <ChevronRight size={14} />
            </button>
          </div>

          <div className="gda-stats">
            <div className="gda-stat">
              <div className="gda-stat-value">{basicStats.streak}</div>
              <div className="gda-stat-label">Racha</div>
            </div>
            <div className="gda-stat">
              <div className="gda-stat-value">{basicStats.correct}/{basicStats.total}</div>
              <div className="gda-stat-label">Aciertos</div>
            </div>
            <div className="gda-stat">
              <div className="gda-stat-value">{basicIndex + 1}/{basicOrder.length}</div>
              <div className="gda-stat-label">Tarjeta</div>
            </div>
          </div>
        </>
      )}

      {level === "casos" && isPremium && (
        <>
          <p className="gda-context-line">
            Sustantivo: <strong style={{ color: "#F2EFE6" }}>{currentCaseWord.noun}</strong> · Género
            base:{" "}
            <strong style={{ color: COLORS[currentCaseWord.gender].main }}>{currentCaseWord.gender}</strong>
          </p>

          <div
            className="gda-card"
            style={{
              "--gender-color": caseAnswer
                ? caseAnswer === currentCaseData.phrase
                  ? COLORS[currentCaseWord.gender].main
                  : "#C8313A"
                : undefined,
            }}
          >
            <span className="gda-card-article-badge" style={{ background: "#1C2128" }}>
              {currentRound.caseName}
            </span>
            <div className="gda-card-sentence">
              {caseAnswer ? (
                <ColoredSentence
                  text={fillSentence(currentCaseData.template, currentCaseData.phrase)}
                  phrase={getInsertedPhrase(currentCaseData.template, currentCaseData.phrase)}
                  gender={currentCaseWord.gender}
                />
              ) : (
                currentCaseData.template.replace("___", "_____")
              )}
            </div>
            <div className="gda-options">
              {caseOptions.map((phrase) => {
                let stateClass = "";
                if (caseAnswer) {
                  if (phrase === currentCaseData.phrase) stateClass = "correct";
                  else if (phrase === caseAnswer) stateClass = "wrong";
                }
                return (
                  <button
                    key={phrase}
                    className={`gda-option-btn ${stateClass}`}
                    onClick={() => answerCase(phrase)}
                    disabled={!!caseAnswer}
                  >
                    {phrase}
                  </button>
                );
              })}
            </div>
            {caseAnswer && (
              <div className={`gda-feedback ${caseAnswer === currentCaseData.phrase ? "ok" : "bad"}`}>
                {caseAnswer === currentCaseData.phrase ? "¡Correcto! " : "¡Oops! La frase correcta es: "}
                <ColoredSentence
                  text={fillSentence(currentCaseData.template, currentCaseData.phrase)}
                  phrase={getInsertedPhrase(currentCaseData.template, currentCaseData.phrase)}
                  gender={currentCaseWord.gender}
                />{" "}
                — {currentCaseData.translation} ({CASE_INFO[currentRound.caseName].note})
              </div>
            )}
          </div>

          <div className="gda-actions">
            <button className="gda-next-btn" onClick={() => setShowTable((s) => !s)}>
              <Table2 size={14} /> {showTable ? "Ocultar tabla" : "Ver tabla completa"}
            </button>
            <button className="gda-next-btn" onClick={nextCase}>
              Siguiente <ChevronRight size={14} />
            </button>
          </div>

          {showTable && (
            <table className="gda-table">
              <thead>
                <tr>
                  <th>Caso</th>
                  <th>Frase</th>
                  <th>Traducción</th>
                </tr>
              </thead>
              <tbody>
                {CASE_ORDER.map((c) => (
                  <tr key={c}>
                    <td>{c}</td>
                    <td style={{ color: COLORS[currentCaseWord.gender].main, fontWeight: 700 }}>
                      {currentCaseWord.cases[c].phrase}
                    </td>
                    <td>{currentCaseWord.cases[c].translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="gda-stats">
            <div className="gda-stat">
              <div className="gda-stat-value">{caseStats.streak}</div>
              <div className="gda-stat-label">Racha</div>
            </div>
            <div className="gda-stat">
              <div className="gda-stat-value">{caseStats.correct}/{caseStats.total}</div>
              <div className="gda-stat-label">Aciertos</div>
            </div>
            <div className="gda-stat">
              <div className="gda-stat-value">{caseIndex + 1}/{caseRounds.length}</div>
              <div className="gda-stat-label">Ronda</div>
            </div>
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
}
