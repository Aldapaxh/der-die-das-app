import { useState, useMemo } from "react";
import { Lock, ChevronRight, Table2 } from "lucide-react";

const COLORS = {
  der: { main: "#1E5FAE", label: "masculino" },
  die: { main: "#C8313A", label: "femenino" },
  das: { main: "#1F7A4D", label: "neutro" },
};

const CATEGORIES = {
  casa:       { label: "🏠 Casa",       color: "#7C5CBF" },
  comida:     { label: "🍎 Comida",     color: "#D4762A" },
  ciudad:     { label: "🏙️ Ciudad",     color: "#2A7CA8" },
  trabajo:    { label: "💼 Trabajo",    color: "#3A8A4A" },
  naturaleza: { label: "🌿 Naturaleza", color: "#2A8A6A" },
  personas:   { label: "👥 Personas",   color: "#A84A4A" },
};

const BASIC_WORDS = [
  // 🏠 Casa
  { id: "b1",  article: "der", noun: "Tisch",       category: "casa",       sentence: "Der Tisch ist sehr groß.",         translation: "La mesa es muy grande." },
  { id: "b2",  article: "die", noun: "Tür",          category: "casa",       sentence: "Die Tür ist offen.",               translation: "La puerta está abierta." },
  { id: "b3",  article: "das", noun: "Haus",         category: "casa",       sentence: "Das Haus ist groß.",               translation: "La casa es grande." },
  { id: "b4",  article: "das", noun: "Fenster",      category: "casa",       sentence: "Das Fenster ist kaputt.",          translation: "La ventana está rota." },
  { id: "b5",  article: "die", noun: "Lampe",        category: "casa",       sentence: "Die Lampe ist sehr hell.",         translation: "La lámpara es muy brillante." },
  { id: "b6",  article: "der", noun: "Stuhl",        category: "casa",       sentence: "Der Stuhl ist kaputt.",            translation: "La silla está rota." },
  { id: "b7",  article: "das", noun: "Bett",         category: "casa",       sentence: "Das Bett ist sehr bequem.",        translation: "La cama es muy cómoda." },
  { id: "b8",  article: "die", noun: "Küche",        category: "casa",       sentence: "Die Küche ist modern.",            translation: "La cocina es moderna." },
  { id: "b9",  article: "das", noun: "Bad",          category: "casa",       sentence: "Das Bad ist klein.",               translation: "El baño es pequeño." },
  { id: "b10", article: "die", noun: "Wohnung",      category: "casa",       sentence: "Die Wohnung ist teuer.",           translation: "El piso es caro." },
  // 🍎 Comida
  { id: "b11", article: "der", noun: "Apfel",        category: "comida",     sentence: "Der Apfel ist rot.",               translation: "La manzana es roja." },
  { id: "b12", article: "die", noun: "Banane",       category: "comida",     sentence: "Die Banane ist gelb.",             translation: "El plátano es amarillo." },
  { id: "b13", article: "das", noun: "Brot",         category: "comida",     sentence: "Das Brot ist frisch.",             translation: "El pan es fresco." },
  { id: "b14", article: "die", noun: "Milch",        category: "comida",     sentence: "Die Milch ist kalt.",              translation: "La leche está fría." },
  { id: "b15", article: "der", noun: "Käse",         category: "comida",     sentence: "Der Käse ist lecker.",             translation: "El queso está rico." },
  { id: "b16", article: "das", noun: "Ei",           category: "comida",     sentence: "Das Ei ist frisch.",               translation: "El huevo está fresco." },
  { id: "b17", article: "der", noun: "Kuchen",       category: "comida",     sentence: "Der Kuchen schmeckt gut.",         translation: "El pastel sabe bien." },
  { id: "b18", article: "die", noun: "Suppe",        category: "comida",     sentence: "Die Suppe ist heiß.",              translation: "La sopa está caliente." },
  { id: "b19", article: "das", noun: "Fleisch",      category: "comida",     sentence: "Das Fleisch ist zart.",            translation: "La carne está tierna." },
  { id: "b20", article: "der", noun: "Wein",         category: "comida",     sentence: "Der Wein ist sehr gut.",           translation: "El vino está muy bueno." },
  // 🏙️ Ciudad
  { id: "b21", article: "die", noun: "Straße",       category: "ciudad",     sentence: "Die Straße ist sehr lang.",        translation: "La calle es muy larga." },
  { id: "b22", article: "der", noun: "Bahnhof",      category: "ciudad",     sentence: "Der Bahnhof ist groß.",            translation: "La estación es grande." },
  { id: "b23", article: "das", noun: "Geschäft",     category: "ciudad",     sentence: "Das Geschäft ist geschlossen.",    translation: "La tienda está cerrada." },
  { id: "b24", article: "die", noun: "Kirche",       category: "ciudad",     sentence: "Die Kirche ist sehr alt.",         translation: "La iglesia es muy antigua." },
  { id: "b25", article: "der", noun: "Park",         category: "ciudad",     sentence: "Der Park ist sehr schön.",         translation: "El parque es muy bonito." },
  { id: "b26", article: "das", noun: "Restaurant",   category: "ciudad",     sentence: "Das Restaurant ist teuer.",        translation: "El restaurante es caro." },
  { id: "b27", article: "die", noun: "Bank",         category: "ciudad",     sentence: "Die Bank ist geöffnet.",           translation: "El banco está abierto." },
  { id: "b28", article: "der", noun: "Markt",        category: "ciudad",     sentence: "Der Markt ist sehr bunt.",         translation: "El mercado es muy colorido." },
  { id: "b29", article: "das", noun: "Krankenhaus",  category: "ciudad",     sentence: "Das Krankenhaus ist modern.",      translation: "El hospital es moderno." },
  { id: "b30", article: "die", noun: "Schule",       category: "ciudad",     sentence: "Die Schule ist sehr groß.",        translation: "La escuela es muy grande." },
  // 💼 Trabajo
  { id: "b31", article: "der", noun: "Chef",         category: "trabajo",    sentence: "Der Chef ist sehr streng.",        translation: "El jefe es muy estricto." },
  { id: "b32", article: "die", noun: "Arbeit",       category: "trabajo",    sentence: "Die Arbeit ist schwer.",           translation: "El trabajo es duro." },
  { id: "b33", article: "das", noun: "Büro",         category: "trabajo",    sentence: "Das Büro ist modern.",             translation: "La oficina es moderna." },
  { id: "b34", article: "der", noun: "Computer",     category: "trabajo",    sentence: "Der Computer ist neu.",            translation: "El ordenador es nuevo." },
  { id: "b35", article: "die", noun: "Besprechung",  category: "trabajo",    sentence: "Die Besprechung ist lang.",        translation: "La reunión es larga." },
  { id: "b36", article: "das", noun: "Gehalt",       category: "trabajo",    sentence: "Das Gehalt ist gut.",              translation: "El sueldo está bien." },
  { id: "b37", article: "der", noun: "Kollege",      category: "trabajo",    sentence: "Der Kollege ist sehr nett.",       translation: "El compañero es muy simpático." },
  { id: "b38", article: "die", noun: "Firma",        category: "trabajo",    sentence: "Die Firma ist bekannt.",           translation: "La empresa es conocida." },
  { id: "b39", article: "das", noun: "Projekt",      category: "trabajo",    sentence: "Das Projekt ist fertig.",          translation: "El proyecto está terminado." },
  { id: "b40", article: "der", noun: "Urlaub",       category: "trabajo",    sentence: "Der Urlaub ist sehr schön.",       translation: "Las vacaciones son muy bonitas." },
  // 🌿 Naturaleza
  { id: "b41", article: "der", noun: "Baum",         category: "naturaleza", sentence: "Der Baum ist sehr hoch.",          translation: "El árbol es muy alto." },
  { id: "b42", article: "die", noun: "Blume",        category: "naturaleza", sentence: "Die Blume ist sehr schön.",        translation: "La flor es muy bonita." },
  { id: "b43", article: "das", noun: "Wasser",       category: "naturaleza", sentence: "Das Wasser ist kalt.",             translation: "El agua está fría." },
  { id: "b44", article: "der", noun: "Berg",         category: "naturaleza", sentence: "Der Berg ist sehr hoch.",          translation: "La montaña es muy alta." },
  { id: "b45", article: "die", noun: "Sonne",        category: "naturaleza", sentence: "Die Sonne scheint heute.",         translation: "El sol brilla hoy." },
  // 👥 Personas
  { id: "b46", article: "der", noun: "Mann",         category: "personas",   sentence: "Der Mann arbeitet viel.",          translation: "El hombre trabaja mucho." },
  { id: "b47", article: "die", noun: "Frau",         category: "personas",   sentence: "Die Frau liest ein Buch.",         translation: "La mujer lee un libro." },
  { id: "b48", article: "das", noun: "Kind",         category: "personas",   sentence: "Das Kind spielt im Garten.",       translation: "El niño juega en el jardín." },
  { id: "b49", article: "der", noun: "Hund",         category: "personas",   sentence: "Der Hund schläft.",                translation: "El perro duerme." },
  { id: "b50", article: "die", noun: "Katze",        category: "personas",   sentence: "Die Katze ist klein.",             translation: "El gato es pequeño." },
];

const CASE_INFO = {
  Nominativ: { note: "El sujeto de la frase: quién hace la acción." },
  Akkusativ: { note: "El objeto directo: ¿a quién o qué?" },
  Dativ: { note: "El objeto indirecto, o tras preposiciones de lugar fijo." },
  Genitiv: { note: "Posesión: ¿de quién o de qué?" },
};
const CASE_ORDER = ["Nominativ", "Akkusativ", "Dativ", "Genitiv"];

const CASE_WORDS = [
  { id: "c1",  noun: "Mann",      gender: "der", cases: {
    Nominativ: { phrase: "der Mann",      template: "___ arbeitet viel.",                 translation: "El hombre trabaja mucho." },
    Akkusativ: { phrase: "den Mann",      template: "Ich kenne ___.",                     translation: "Conozco al hombre." },
    Dativ:     { phrase: "dem Mann",      template: "Ich helfe ___.",                     translation: "Ayudo al hombre." },
    Genitiv:   { phrase: "des Mannes",    template: "Das Auto ___ ist alt.",              translation: "El coche del hombre es viejo." },
  }},
  { id: "c2",  noun: "Hund",      gender: "der", cases: {
    Nominativ: { phrase: "der Hund",      template: "___ läuft schnell.",                 translation: "El perro corre rápido." },
    Akkusativ: { phrase: "den Hund",      template: "Ich sehe ___.",                      translation: "Veo al perro." },
    Dativ:     { phrase: "dem Hund",      template: "Ich gebe ___ einen Ball.",           translation: "Le doy una pelota al perro." },
    Genitiv:   { phrase: "des Hundes",    template: "Die Leine ___ ist neu.",             translation: "La correa del perro es nueva." },
  }},
  { id: "c3",  noun: "Vater",     gender: "der", cases: {
    Nominativ: { phrase: "der Vater",     template: "___ kocht heute.",                   translation: "El padre cocina hoy." },
    Akkusativ: { phrase: "den Vater",     template: "Ich besuche ___.",                   translation: "Visito al padre." },
    Dativ:     { phrase: "dem Vater",     template: "Das Buch gehört ___.",               translation: "El libro pertenece al padre." },
    Genitiv:   { phrase: "des Vaters",    template: "Das Hemd ___ ist blau.",             translation: "La camisa del padre es azul." },
  }},
  { id: "c4",  noun: "Lehrer",    gender: "der", cases: {
    Nominativ: { phrase: "der Lehrer",    template: "___ erklärt die Aufgabe.",           translation: "El profesor explica el ejercicio." },
    Akkusativ: { phrase: "den Lehrer",    template: "Die Schüler sehen ___.",             translation: "Los alumnos ven al profesor." },
    Dativ:     { phrase: "dem Lehrer",    template: "Das Kind gibt ___ ein Heft.",        translation: "El niño le da un cuaderno al profesor." },
    Genitiv:   { phrase: "des Lehrers",   template: "Das Buch ___ ist dick.",             translation: "El libro del profesor es grueso." },
  }},
  { id: "c5",  noun: "Freund",    gender: "der", cases: {
    Nominativ: { phrase: "der Freund",    template: "___ kommt heute.",                   translation: "El amigo viene hoy." },
    Akkusativ: { phrase: "den Freund",    template: "Ich treffe ___ im Park.",            translation: "Quedo con el amigo en el parque." },
    Dativ:     { phrase: "dem Freund",    template: "Ich schreibe ___ eine Nachricht.",   translation: "Le escribo un mensaje al amigo." },
    Genitiv:   { phrase: "des Freundes",  template: "Das Fahrrad ___ ist neu.",           translation: "La bici del amigo es nueva." },
  }},
  { id: "c6",  noun: "Zug",       gender: "der", cases: {
    Nominativ: { phrase: "der Zug",       template: "___ ist pünktlich.",                 translation: "El tren es puntual." },
    Akkusativ: { phrase: "den Zug",       template: "Ich nehme ___.",                     translation: "Tomo el tren." },
    Dativ:     { phrase: "dem Zug",       template: "Ich warte auf ___.",                 translation: "Espero el tren." },
    Genitiv:   { phrase: "des Zuges",     template: "Die Türen ___ sind offen.",          translation: "Las puertas del tren están abiertas." },
  }},
  { id: "c7",  noun: "Brief",     gender: "der", cases: {
    Nominativ: { phrase: "der Brief",     template: "___ ist lang.",                      translation: "La carta es larga." },
    Akkusativ: { phrase: "den Brief",     template: "Ich schreibe ___.",                  translation: "Escribo la carta." },
    Dativ:     { phrase: "dem Brief",     template: "Ich antworte auf ___.",              translation: "Respondo a la carta." },
    Genitiv:   { phrase: "des Briefes",   template: "Der Inhalt ___ ist wichtig.",        translation: "El contenido de la carta es importante." },
  }},
  { id: "c8",  noun: "Frau",      gender: "die", cases: {
    Nominativ: { phrase: "die Frau",      template: "___ singt sehr gut.",                translation: "La mujer canta muy bien." },
    Akkusativ: { phrase: "die Frau",      template: "Ich kenne ___.",                     translation: "Conozco a la mujer." },
    Dativ:     { phrase: "der Frau",      template: "Ich helfe ___.",                     translation: "Ayudo a la mujer." },
    Genitiv:   { phrase: "der Frau",      template: "Das Auto ___ ist rot.",              translation: "El coche de la mujer es rojo." },
  }},
  { id: "c9",  noun: "Mutter",    gender: "die", cases: {
    Nominativ: { phrase: "die Mutter",    template: "___ kocht sehr gut.",                translation: "La madre cocina muy bien." },
    Akkusativ: { phrase: "die Mutter",    template: "Ich besuche ___.",                   translation: "Visito a la madre." },
    Dativ:     { phrase: "der Mutter",    template: "Ich gebe ___ die Blumen.",           translation: "Le doy las flores a la madre." },
    Genitiv:   { phrase: "der Mutter",    template: "Das Kleid ___ ist schön.",           translation: "El vestido de la madre es bonito." },
  }},
  { id: "c10", noun: "Lehrerin",  gender: "die", cases: {
    Nominativ: { phrase: "die Lehrerin",  template: "___ erklärt das Wort.",              translation: "La profesora explica la palabra." },
    Akkusativ: { phrase: "die Lehrerin",  template: "Die Schüler mögen ___.",             translation: "Los alumnos quieren a la profesora." },
    Dativ:     { phrase: "der Lehrerin",  template: "Das Kind gibt ___ ein Buch.",        translation: "El niño le da un libro a la profesora." },
    Genitiv:   { phrase: "der Lehrerin",  template: "Der Tisch ___ ist groß.",            translation: "La mesa de la profesora es grande." },
  }},
  { id: "c11", noun: "Stadt",     gender: "die", cases: {
    Nominativ: { phrase: "die Stadt",     template: "___ ist sehr schön.",                translation: "La ciudad es muy bonita." },
    Akkusativ: { phrase: "die Stadt",     template: "Ich besuche ___.",                   translation: "Visito la ciudad." },
    Dativ:     { phrase: "der Stadt",     template: "Wir wohnen in ___.",                 translation: "Vivimos en la ciudad." },
    Genitiv:   { phrase: "der Stadt",     template: "Das Zentrum ___ ist groß.",          translation: "El centro de la ciudad es grande." },
  }},
  { id: "c12", noun: "Schule",    gender: "die", cases: {
    Nominativ: { phrase: "die Schule",    template: "___ ist sehr groß.",                 translation: "La escuela es muy grande." },
    Akkusativ: { phrase: "die Schule",    template: "Das Kind geht in ___.",              translation: "El niño va a la escuela." },
    Dativ:     { phrase: "der Schule",    template: "Wir treffen uns vor ___.",           translation: "Nos encontramos delante de la escuela." },
    Genitiv:   { phrase: "der Schule",    template: "Der Direktor ___ ist nett.",         translation: "El director de la escuela es simpático." },
  }},
  { id: "c13", noun: "Katze",     gender: "die", cases: {
    Nominativ: { phrase: "die Katze",     template: "___ schläft viel.",                  translation: "La gata duerme mucho." },
    Akkusativ: { phrase: "die Katze",     template: "Ich sehe ___.",                      translation: "Veo a la gata." },
    Dativ:     { phrase: "der Katze",     template: "Ich gebe ___ Milch.",                translation: "Le doy leche a la gata." },
    Genitiv:   { phrase: "der Katze",     template: "Das Futter ___ ist teuer.",          translation: "La comida de la gata es cara." },
  }},
  { id: "c14", noun: "Zeitung",   gender: "die", cases: {
    Nominativ: { phrase: "die Zeitung",   template: "___ ist auf dem Tisch.",             translation: "El periódico está en la mesa." },
    Akkusativ: { phrase: "die Zeitung",   template: "Ich lese ___.",                      translation: "Leo el periódico." },
    Dativ:     { phrase: "der Zeitung",   template: "Ich suche in ___.",                  translation: "Busco en el periódico." },
    Genitiv:   { phrase: "der Zeitung",   template: "Der Artikel ___ ist interessant.",   translation: "El artículo del periódico es interesante." },
  }},
  { id: "c15", noun: "Kind",      gender: "das", cases: {
    Nominativ: { phrase: "das Kind",      template: "___ spielt im Park.",                translation: "El niño juega en el parque." },
    Akkusativ: { phrase: "das Kind",      template: "Ich sehe ___.",                      translation: "Veo al niño." },
    Dativ:     { phrase: "dem Kind",      template: "Ich gebe ___ ein Buch.",             translation: "Le doy un libro al niño." },
    Genitiv:   { phrase: "des Kindes",    template: "Das Spielzeug ___ ist neu.",         translation: "El juguete del niño es nuevo." },
  }},
  { id: "c16", noun: "Haus",      gender: "das", cases: {
    Nominativ: { phrase: "das Haus",      template: "___ ist groß.",                      translation: "La casa es grande." },
    Akkusativ: { phrase: "das Haus",      template: "Wir kaufen ___.",                    translation: "Compramos la casa." },
    Dativ:     { phrase: "dem Haus",      template: "Wir wohnen in ___.",                 translation: "Vivimos en la casa." },
    Genitiv:   { phrase: "des Hauses",    template: "Das Dach ___ ist rot.",              translation: "El tejado de la casa es rojo." },
  }},
  { id: "c17", noun: "Auto",      gender: "das", cases: {
    Nominativ: { phrase: "das Auto",      template: "___ ist neu.",                       translation: "El coche es nuevo." },
    Akkusativ: { phrase: "das Auto",      template: "Ich kaufe ___.",                     translation: "Compro el coche." },
    Dativ:     { phrase: "dem Auto",      template: "Ich fahre mit ___.",                 translation: "Voy en el coche." },
    Genitiv:   { phrase: "des Autos",     template: "Der Motor ___ ist kaputt.",          translation: "El motor del coche está roto." },
  }},
  { id: "c18", noun: "Buch",      gender: "das", cases: {
    Nominativ: { phrase: "das Buch",      template: "___ ist interessant.",               translation: "El libro es interesante." },
    Akkusativ: { phrase: "das Buch",      template: "Ich lese ___.",                      translation: "Leo el libro." },
    Dativ:     { phrase: "dem Buch",      template: "Ich lerne aus ___.",                 translation: "Aprendo del libro." },
    Genitiv:   { phrase: "des Buches",    template: "Der Autor ___ ist bekannt.",         translation: "El autor del libro es conocido." },
  }},
  { id: "c19", noun: "Fahrrad",   gender: "das", cases: {
    Nominativ: { phrase: "das Fahrrad",   template: "___ ist kaputt.",                    translation: "La bicicleta está rota." },
    Akkusativ: { phrase: "das Fahrrad",   template: "Ich nehme ___.",                     translation: "Cojo la bicicleta." },
    Dativ:     { phrase: "dem Fahrrad",   template: "Ich fahre mit ___.",                 translation: "Voy en bicicleta." },
    Genitiv:   { phrase: "des Fahrrads",  template: "Das Rad ___ ist platt.",             translation: "La rueda de la bicicleta está pinchada." },
  }},
  { id: "c20", noun: "Wasser",    gender: "das", cases: {
    Nominativ: { phrase: "das Wasser",    template: "___ ist kalt.",                      translation: "El agua está fría." },
    Akkusativ: { phrase: "das Wasser",    template: "Ich trinke ___.",                    translation: "Bebo el agua." },
    Dativ:     { phrase: "dem Wasser",    template: "Das Salz löst sich in ___.",         translation: "La sal se disuelve en el agua." },
    Genitiv:   { phrase: "des Wassers",   template: "Die Temperatur ___ ist niedrig.",    translation: "La temperatura del agua es baja." },
  }},
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

function PretzelIcon({ size = 64 }) {
  return (
    <svg width={size} height={Math.round(size * 1.12)} viewBox="0 0 64 72" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="36" rx="30" ry="32" fill="#C07820" opacity="0.18"/>
      {/* Left loop */}
      <circle cx="21" cy="25" r="14" fill="none" stroke="#8B4513" strokeWidth="8.5"/>
      {/* Right loop */}
      <circle cx="43" cy="25" r="14" fill="none" stroke="#8B4513" strokeWidth="8.5"/>
      {/* Bottom arch */}
      <path d="M 10 35 C 6 48 8 58 15 66 C 19 70 25 72 32 72 C 39 72 45 70 49 66 C 56 58 58 48 54 35"
            fill="none" stroke="#8B4513" strokeWidth="8.5" strokeLinecap="round"/>
      {/* Cover to create woven crossing */}
      <rect x="16" y="33" width="32" height="13" fill="#1C2128"/>
      {/* Redraw left arm going over */}
      <path d="M 10 35 C 14 39 17 42 21 43" fill="none" stroke="#8B4513" strokeWidth="8.5" strokeLinecap="round"/>
      {/* Salt dots */}
      <circle cx="11" cy="17" r="3" fill="#F5EFE0"/>
      <circle cx="53" cy="17" r="3" fill="#F5EFE0"/>
      <circle cx="20" cy="61" r="3" fill="#F5EFE0"/>
      <circle cx="44" cy="61" r="3" fill="#F5EFE0"/>
      <circle cx="32" cy="67" r="2.5" fill="#F5EFE0"/>
    </svg>
  );
}

function DirndlGirl() {
  return (
    <svg width="68" height="108" viewBox="0 0 68 108" xmlns="http://www.w3.org/2000/svg">
      {/* Blonde braids */}
      <circle cx="19" cy="15" r="8" fill="#C89018"/>
      <circle cx="49" cy="15" r="8" fill="#C89018"/>
      <ellipse cx="34" cy="10" rx="16" ry="9" fill="#C89018"/>
      <path d="M 12 20 C 10 30 10 40 12 48" stroke="#A07010" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M 56 20 C 58 30 58 40 56 48" stroke="#A07010" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Face */}
      <ellipse cx="34" cy="20" rx="14" ry="15" fill="#F5CA90"/>
      {/* Eyes */}
      <circle cx="28" cy="19" r="2.5" fill="#2C1A00"/>
      <circle cx="40" cy="19" r="2.5" fill="#2C1A00"/>
      <circle cx="29" cy="18" r="1" fill="white"/>
      <circle cx="41" cy="18" r="1" fill="white"/>
      {/* Smile */}
      <path d="M 28 27 C 31 31 37 31 40 27" fill="none" stroke="#B06050" strokeWidth="2" strokeLinecap="round"/>
      {/* Cheeks */}
      <circle cx="24" cy="24" r="4" fill="#F09080" opacity="0.38"/>
      <circle cx="44" cy="24" r="4" fill="#F09080" opacity="0.38"/>
      {/* Neck */}
      <rect x="31" y="34" width="6" height="6" fill="#F5CA90"/>
      {/* Puffed sleeves */}
      <ellipse cx="11" cy="45" rx="9" ry="7.5" fill="white"/>
      <ellipse cx="57" cy="45" rx="9" ry="7.5" fill="white"/>
      {/* Blouse body */}
      <path d="M 17 39 L 51 39 L 53 57 L 15 57 Z" fill="white"/>
      {/* Bodice / Mieder */}
      <path d="M 19 39 L 49 39 L 51 57 L 17 57 Z" fill="#1A3A78"/>
      {/* Lacing detail */}
      <line x1="34" y1="40" x2="34" y2="56" stroke="#F2B705" strokeWidth="1.5"/>
      <line x1="27" y1="43" x2="41" y2="43" stroke="#F2B705" strokeWidth="1.5"/>
      <line x1="27" y1="47" x2="41" y2="47" stroke="#F2B705" strokeWidth="1.5"/>
      <line x1="27" y1="51" x2="41" y2="51" stroke="#F2B705" strokeWidth="1.5"/>
      {/* Skirt */}
      <path d="M 13 57 L 55 57 L 63 100 L 5 100 Z" fill="#1E6B3A"/>
      <path d="M 7 93 L 61 93" stroke="#F2B705" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      {/* White apron */}
      <path d="M 21 57 L 47 57 L 53 100 L 15 100 Z" fill="white" opacity="0.85"/>
      {/* Apron bow at waist */}
      <path d="M 21 57 C 17 60 16 65 20 66 C 24 67 25 61 21 57Z" fill="white"/>
      <path d="M 47 57 C 51 60 52 65 48 66 C 44 67 43 61 47 57Z" fill="white"/>
      <ellipse cx="34" cy="59" rx="4" ry="3" fill="white"/>
      {/* Shoes */}
      <ellipse cx="22" cy="103" rx="10" ry="4" fill="#3A1E08"/>
      <ellipse cx="46" cy="103" rx="10" ry="4" fill="#3A1E08"/>
      {/* Arms */}
      <path d="M 11 45 L 5 65" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <path d="M 57 45 L 63 65" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      {/* Hands */}
      <circle cx="5" cy="67" r="5" fill="#F5CA90"/>
      <circle cx="63" cy="67" r="5" fill="#F5CA90"/>
    </svg>
  );
}

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

.gda-root{ background:#1C2128; color:#F2EFE6; font-family:'Inter',sans-serif; border-radius:18px; padding:32px 22px; max-width:680px; margin:0 auto;
  background-image: repeating-linear-gradient(0deg, transparent 0px, transparent 29px, rgba(15,15,15,0.12) 29px, rgba(15,15,15,0.12) 30px, transparent 30px, transparent 59px, rgba(160,0,0,0.05) 59px, rgba(160,0,0,0.05) 60px, transparent 60px, transparent 89px, rgba(200,148,0,0.05) 89px, rgba(200,148,0,0.05) 90px);
}
.gda-german-flag{ display:flex; height:11px; margin:-32px -22px 20px; border-radius:14px 14px 0 0; overflow:hidden; }
.gda-flag-s{ flex:1; }
.gda-hero-row{ display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:10px; }
.gda-dirndl-wrap{ line-height:0; flex-shrink:0; }
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
.gda-card{ background-color:#F2EFE6; background-image: linear-gradient(135deg,rgba(0,80,160,0.055) 25%,transparent 25%), linear-gradient(225deg,rgba(0,80,160,0.055) 25%,transparent 25%), linear-gradient(315deg,rgba(0,80,160,0.055) 25%,transparent 25%), linear-gradient(45deg,rgba(0,80,160,0.055) 25%,transparent 25%); background-size:18px 18px; color:#1C2128; border-radius:16px; padding:30px 22px; min-height:170px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border:5px solid var(--gender-color, #8a8576); position:relative; }
.gda-card.clickable{ cursor:pointer; }
.gda-card-noun{ font-family:'Oswald',sans-serif; font-weight:700; font-size:32px; letter-spacing:0.5px; }
.gda-category-badge{ position:absolute; top:12px; right:12px; font-size:11px; padding:3px 9px; border-radius:6px; color:#fff; background:var(--cat-color,#8a8576); font-weight:600; letter-spacing:0.3px; }
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
  .gda-dirndl-wrap{ display:none; }
  .gda-hero-row{ gap:8px; }
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
      <div className="gda-german-flag">
        <span className="gda-flag-s" style={{background:'#1A1A1A'}}/>
        <span className="gda-flag-s" style={{background:'#CC0000'}}/>
        <span className="gda-flag-s" style={{background:'#F2B705'}}/>
      </div>
      <div className="gda-account-bar">
        <span>{userEmail}</span>
        <button className="gda-link-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="gda-header">
        <div className="gda-hero-row">
          <PretzelIcon size={58}/>
          <div className="gda-sign">DER · DIE · DAS</div>
          <div className="gda-dirndl-wrap"><DirndlGirl/></div>
        </div>
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
              <span className="gda-category-badge" style={{ "--cat-color": CATEGORIES[basicWord.category].color }}>
                {CATEGORIES[basicWord.category].label}
              </span>
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
              <span className="gda-category-badge" style={{ "--cat-color": CATEGORIES[basicWord.category].color }}>
                {CATEGORIES[basicWord.category].label}
              </span>
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
