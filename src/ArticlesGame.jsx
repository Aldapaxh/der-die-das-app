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
  { id: "c1",  noun: "Mann",      gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Mann",      template: "___ arbeitet viel.",                 translation: "El hombre trabaja mucho." },
    Akkusativ: { phrase: "den Mann",      template: "Ich kenne ___.",                     translation: "Conozco al hombre." },
    Dativ:     { phrase: "dem Mann",      template: "Ich helfe ___.",                     translation: "Ayudo al hombre." },
    Genitiv:   { phrase: "des Mannes",    template: "Das Auto ___ ist alt.",              translation: "El coche del hombre es viejo." },
  }},
  { id: "c2",  noun: "Hund",      gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Hund",      template: "___ läuft schnell.",                 translation: "El perro corre rápido." },
    Akkusativ: { phrase: "den Hund",      template: "Ich sehe ___.",                      translation: "Veo al perro." },
    Dativ:     { phrase: "dem Hund",      template: "Ich gebe ___ einen Ball.",           translation: "Le doy una pelota al perro." },
    Genitiv:   { phrase: "des Hundes",    template: "Die Leine ___ ist neu.",             translation: "La correa del perro es nueva." },
  }},
  { id: "c3",  noun: "Vater",     gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Vater",     template: "___ kocht heute.",                   translation: "El padre cocina hoy." },
    Akkusativ: { phrase: "den Vater",     template: "Ich besuche ___.",                   translation: "Visito al padre." },
    Dativ:     { phrase: "dem Vater",     template: "Das Buch gehört ___.",               translation: "El libro pertenece al padre." },
    Genitiv:   { phrase: "des Vaters",    template: "Das Hemd ___ ist blau.",             translation: "La camisa del padre es azul." },
  }},
  { id: "c4",  noun: "Lehrer",    gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Lehrer",    template: "___ erklärt die Aufgabe.",           translation: "El profesor explica el ejercicio." },
    Akkusativ: { phrase: "den Lehrer",    template: "Die Schüler sehen ___.",             translation: "Los alumnos ven al profesor." },
    Dativ:     { phrase: "dem Lehrer",    template: "Das Kind gibt ___ ein Heft.",        translation: "El niño le da un cuaderno al profesor." },
    Genitiv:   { phrase: "des Lehrers",   template: "Das Buch ___ ist dick.",             translation: "El libro del profesor es grueso." },
  }},
  { id: "c5",  noun: "Freund",    gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Freund",    template: "___ kommt heute.",                   translation: "El amigo viene hoy." },
    Akkusativ: { phrase: "den Freund",    template: "Ich treffe ___ im Park.",            translation: "Quedo con el amigo en el parque." },
    Dativ:     { phrase: "dem Freund",    template: "Ich schreibe ___ eine Nachricht.",   translation: "Le escribo un mensaje al amigo." },
    Genitiv:   { phrase: "des Freundes",  template: "Das Fahrrad ___ ist neu.",           translation: "La bici del amigo es nueva." },
  }},
  { id: "c6",  noun: "Zug",       gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Zug",       template: "___ ist pünktlich.",                 translation: "El tren es puntual." },
    Akkusativ: { phrase: "den Zug",       template: "Ich nehme ___.",                     translation: "Tomo el tren." },
    Dativ:     { phrase: "dem Zug",       template: "Ich warte auf ___.",                 translation: "Espero el tren." },
    Genitiv:   { phrase: "des Zuges",     template: "Die Türen ___ sind offen.",          translation: "Las puertas del tren están abiertas." },
  }},
  { id: "c7",  noun: "Brief",     gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Brief",     template: "___ ist lang.",                      translation: "La carta es larga." },
    Akkusativ: { phrase: "den Brief",     template: "Ich schreibe ___.",                  translation: "Escribo la carta." },
    Dativ:     { phrase: "dem Brief",     template: "Ich antworte auf ___.",              translation: "Respondo a la carta." },
    Genitiv:   { phrase: "des Briefes",   template: "Der Inhalt ___ ist wichtig.",        translation: "El contenido de la carta es importante." },
  }},
  { id: "c8",  noun: "Frau",      gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Frau",      template: "___ singt sehr gut.",                translation: "La mujer canta muy bien." },
    Akkusativ: { phrase: "die Frau",      template: "Ich kenne ___.",                     translation: "Conozco a la mujer." },
    Dativ:     { phrase: "der Frau",      template: "Ich helfe ___.",                     translation: "Ayudo a la mujer." },
    Genitiv:   { phrase: "der Frau",      template: "Das Auto ___ ist rot.",              translation: "El coche de la mujer es rojo." },
  }},
  { id: "c9",  noun: "Mutter",    gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Mutter",    template: "___ kocht sehr gut.",                translation: "La madre cocina muy bien." },
    Akkusativ: { phrase: "die Mutter",    template: "Ich besuche ___.",                   translation: "Visito a la madre." },
    Dativ:     { phrase: "der Mutter",    template: "Ich gebe ___ die Blumen.",           translation: "Le doy las flores a la madre." },
    Genitiv:   { phrase: "der Mutter",    template: "Das Kleid ___ ist schön.",           translation: "El vestido de la madre es bonito." },
  }},
  { id: "c10", noun: "Lehrerin",  gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Lehrerin",  template: "___ erklärt das Wort.",              translation: "La profesora explica la palabra." },
    Akkusativ: { phrase: "die Lehrerin",  template: "Die Schüler mögen ___.",             translation: "Los alumnos quieren a la profesora." },
    Dativ:     { phrase: "der Lehrerin",  template: "Das Kind gibt ___ ein Buch.",        translation: "El niño le da un libro a la profesora." },
    Genitiv:   { phrase: "der Lehrerin",  template: "Der Tisch ___ ist groß.",            translation: "La mesa de la profesora es grande." },
  }},
  { id: "c11", noun: "Stadt",     gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Stadt",     template: "___ ist sehr schön.",                translation: "La ciudad es muy bonita." },
    Akkusativ: { phrase: "die Stadt",     template: "Ich besuche ___.",                   translation: "Visito la ciudad." },
    Dativ:     { phrase: "der Stadt",     template: "Wir wohnen in ___.",                 translation: "Vivimos en la ciudad." },
    Genitiv:   { phrase: "der Stadt",     template: "Das Zentrum ___ ist groß.",          translation: "El centro de la ciudad es grande." },
  }},
  { id: "c12", noun: "Schule",    gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Schule",    template: "___ ist sehr groß.",                 translation: "La escuela es muy grande." },
    Akkusativ: { phrase: "die Schule",    template: "Das Kind geht in ___.",              translation: "El niño va a la escuela." },
    Dativ:     { phrase: "der Schule",    template: "Wir treffen uns vor ___.",           translation: "Nos encontramos delante de la escuela." },
    Genitiv:   { phrase: "der Schule",    template: "Der Direktor ___ ist nett.",         translation: "El director de la escuela es simpático." },
  }},
  { id: "c13", noun: "Katze",     gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Katze",     template: "___ schläft viel.",                  translation: "La gata duerme mucho." },
    Akkusativ: { phrase: "die Katze",     template: "Ich sehe ___.",                      translation: "Veo a la gata." },
    Dativ:     { phrase: "der Katze",     template: "Ich gebe ___ Milch.",                translation: "Le doy leche a la gata." },
    Genitiv:   { phrase: "der Katze",     template: "Das Futter ___ ist teuer.",          translation: "La comida de la gata es cara." },
  }},
  { id: "c14", noun: "Zeitung",   gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Zeitung",   template: "___ ist auf dem Tisch.",             translation: "El periódico está en la mesa." },
    Akkusativ: { phrase: "die Zeitung",   template: "Ich lese ___.",                      translation: "Leo el periódico." },
    Dativ:     { phrase: "der Zeitung",   template: "Ich suche in ___.",                  translation: "Busco en el periódico." },
    Genitiv:   { phrase: "der Zeitung",   template: "Der Artikel ___ ist interessant.",   translation: "El artículo del periódico es interesante." },
  }},
  { id: "c15", noun: "Kind",      gender: "das", category: "personas", cases: {
    Nominativ: { phrase: "das Kind",      template: "___ spielt im Park.",                translation: "El niño juega en el parque." },
    Akkusativ: { phrase: "das Kind",      template: "Ich sehe ___.",                      translation: "Veo al niño." },
    Dativ:     { phrase: "dem Kind",      template: "Ich gebe ___ ein Buch.",             translation: "Le doy un libro al niño." },
    Genitiv:   { phrase: "des Kindes",    template: "Das Spielzeug ___ ist neu.",         translation: "El juguete del niño es nuevo." },
  }},
  { id: "c16", noun: "Haus",      gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Haus",      template: "___ ist groß.",                      translation: "La casa es grande." },
    Akkusativ: { phrase: "das Haus",      template: "Wir kaufen ___.",                    translation: "Compramos la casa." },
    Dativ:     { phrase: "dem Haus",      template: "Wir wohnen in ___.",                 translation: "Vivimos en la casa." },
    Genitiv:   { phrase: "des Hauses",    template: "Das Dach ___ ist rot.",              translation: "El tejado de la casa es rojo." },
  }},
  { id: "c17", noun: "Auto",      gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Auto",      template: "___ ist neu.",                       translation: "El coche es nuevo." },
    Akkusativ: { phrase: "das Auto",      template: "Ich kaufe ___.",                     translation: "Compro el coche." },
    Dativ:     { phrase: "dem Auto",      template: "Ich fahre mit ___.",                 translation: "Voy en el coche." },
    Genitiv:   { phrase: "des Autos",     template: "Der Motor ___ ist kaputt.",          translation: "El motor del coche está roto." },
  }},
  { id: "c18", noun: "Buch",      gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Buch",      template: "___ ist interessant.",               translation: "El libro es interesante." },
    Akkusativ: { phrase: "das Buch",      template: "Ich lese ___.",                      translation: "Leo el libro." },
    Dativ:     { phrase: "dem Buch",      template: "Ich lerne aus ___.",                 translation: "Aprendo del libro." },
    Genitiv:   { phrase: "des Buches",    template: "Der Autor ___ ist bekannt.",         translation: "El autor del libro es conocido." },
  }},
  { id: "c19", noun: "Fahrrad",   gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Fahrrad",   template: "___ ist kaputt.",                    translation: "La bicicleta está rota." },
    Akkusativ: { phrase: "das Fahrrad",   template: "Ich nehme ___.",                     translation: "Cojo la bicicleta." },
    Dativ:     { phrase: "dem Fahrrad",   template: "Ich fahre mit ___.",                 translation: "Voy en bicicleta." },
    Genitiv:   { phrase: "des Fahrrads",  template: "Das Rad ___ ist platt.",             translation: "La rueda de la bicicleta está pinchada." },
  }},
  { id: "c20", noun: "Wasser",    gender: "das", category: "naturaleza", cases: {
    Nominativ: { phrase: "das Wasser",    template: "___ ist kalt.",                      translation: "El agua está fría." },
    Akkusativ: { phrase: "das Wasser",    template: "Ich trinke ___.",                    translation: "Bebo el agua." },
    Dativ:     { phrase: "dem Wasser",    template: "Das Salz löst sich in ___.",         translation: "La sal se disuelve en el agua." },
    Genitiv:   { phrase: "des Wassers",   template: "Die Temperatur ___ ist niedrig.",    translation: "La temperatura del agua es baja." },
  }},
  { id: "c21", noun: "Tisch", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Tisch", template: "___ ist sehr nützlich.", translation: "La mesa es muy útil." },
    Akkusativ: { phrase: "den Tisch", template: "Ich kaufe ___.", translation: "Compro la mesa." },
    Dativ: { phrase: "dem Tisch", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la mesa." },
    Genitiv: { phrase: "des Tisches", template: "Die Farbe ___ ist schön.", translation: "El color de la mesa es bonito." },
  }},
  { id: "c22", noun: "Tür", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Tür", template: "___ ist hier.", translation: "La puerta está aquí." },
    Akkusativ: { phrase: "die Tür", template: "Ich brauche ___ dringend.", translation: "Necesito la puerta urgentemente." },
    Dativ: { phrase: "der Tür", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la puerta." },
    Genitiv: { phrase: "der Tür", template: "Der Preis ___ ist hoch.", translation: "El precio de la puerta es alto." },
  }},
  { id: "c23", noun: "Fenster", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Fenster", template: "___ funktioniert gut.", translation: "La ventana funciona bien." },
    Akkusativ: { phrase: "das Fenster", template: "Wir benutzen ___ oft.", translation: "Usamos la ventana a menudo." },
    Dativ: { phrase: "dem Fenster", template: "Wir stehen vor ___.", translation: "Estamos delante de la ventana." },
    Genitiv: { phrase: "des Fensters", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la ventana es impresionante." },
  }},
  { id: "c24", noun: "Lampe", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Lampe", template: "___ ist sehr groß.", translation: "La lámpara es muy grande." },
    Akkusativ: { phrase: "die Lampe", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la lámpara todos los días." },
    Dativ: { phrase: "der Lampe", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la lámpara." },
    Genitiv: { phrase: "der Lampe", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la lámpara es enorme." },
  }},
  { id: "c25", noun: "Stuhl", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Stuhl", template: "___ ist wirklich interessant.", translation: "La silla es realmente interesante." },
    Akkusativ: { phrase: "den Stuhl", template: "Er nimmt ___ mit.", translation: "Él se lleva la silla." },
    Dativ: { phrase: "dem Stuhl", template: "Es ist in ___.", translation: "Está dentro de la silla." },
    Genitiv: { phrase: "des Stuhls", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la silla es inusual." },
  }},
  { id: "c26", noun: "Bett", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Bett", template: "___ ist kaputt.", translation: "La cama ya no funciona." },
    Akkusativ: { phrase: "das Bett", template: "Ich sehe ___ dort.", translation: "Veo la cama allí." },
    Dativ: { phrase: "dem Bett", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la cama." },
    Genitiv: { phrase: "des Bettes", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la cama ha subido." },
  }},
  { id: "c27", noun: "Küche", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Küche", template: "___ ist sehr nützlich.", translation: "La cocina es muy útil." },
    Akkusativ: { phrase: "die Küche", template: "Ich kaufe ___.", translation: "Compro la cocina." },
    Dativ: { phrase: "der Küche", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la cocina." },
    Genitiv: { phrase: "der Küche", template: "Die Farbe ___ ist schön.", translation: "El color de la cocina es bonito." },
  }},
  { id: "c28", noun: "Bad", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Bad", template: "___ ist hier.", translation: "El baño está aquí." },
    Akkusativ: { phrase: "das Bad", template: "Ich brauche ___ dringend.", translation: "Necesito el baño urgentemente." },
    Dativ: { phrase: "dem Bad", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del baño." },
    Genitiv: { phrase: "des Bades", template: "Der Preis ___ ist hoch.", translation: "El precio del baño es alto." },
  }},
  { id: "c29", noun: "Wohnung", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Wohnung", template: "___ funktioniert gut.", translation: "El piso funciona bien." },
    Akkusativ: { phrase: "die Wohnung", template: "Wir benutzen ___ oft.", translation: "Usamos el piso a menudo." },
    Dativ: { phrase: "der Wohnung", template: "Wir stehen vor ___.", translation: "Estamos delante del piso." },
    Genitiv: { phrase: "der Wohnung", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del piso es impresionante." },
  }},
  { id: "c30", noun: "Schrank", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Schrank", template: "___ ist sehr groß.", translation: "El armario es muy grande." },
    Akkusativ: { phrase: "den Schrank", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia el armario todos los días." },
    Dativ: { phrase: "dem Schrank", template: "Das Buch liegt auf ___.", translation: "El libro está encima del armario." },
    Genitiv: { phrase: "des Schranks", template: "Das Gewicht ___ ist enorm.", translation: "El peso del armario es enorme." },
  }},
  { id: "c31", noun: "Sofa", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Sofa", template: "___ ist wirklich interessant.", translation: "El sofá es realmente interesante." },
    Akkusativ: { phrase: "das Sofa", template: "Er nimmt ___ mit.", translation: "Él se lleva el sofá." },
    Dativ: { phrase: "dem Sofa", template: "Es ist in ___.", translation: "Está dentro del sofá." },
    Genitiv: { phrase: "des Sofas", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del sofá es inusual." },
  }},
  { id: "c32", noun: "Spiegel", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Spiegel", template: "___ ist kaputt.", translation: "El espejo ya no funciona." },
    Akkusativ: { phrase: "den Spiegel", template: "Ich sehe ___ dort.", translation: "Veo el espejo allí." },
    Dativ: { phrase: "dem Spiegel", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al espejo." },
    Genitiv: { phrase: "des Spiegels", template: "Der Wert ___ ist gestiegen.", translation: "El valor del espejo ha subido." },
  }},
  { id: "c33", noun: "Teppich", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Teppich", template: "___ ist sehr nützlich.", translation: "La alfombra es muy útil." },
    Akkusativ: { phrase: "den Teppich", template: "Ich kaufe ___.", translation: "Compro la alfombra." },
    Dativ: { phrase: "dem Teppich", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la alfombra." },
    Genitiv: { phrase: "des Teppichs", template: "Die Farbe ___ ist schön.", translation: "El color de la alfombra es bonito." },
  }},
  { id: "c34", noun: "Wand", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Wand", template: "___ ist hier.", translation: "La pared está aquí." },
    Akkusativ: { phrase: "die Wand", template: "Ich brauche ___ dringend.", translation: "Necesito la pared urgentemente." },
    Dativ: { phrase: "der Wand", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la pared." },
    Genitiv: { phrase: "der Wand", template: "Der Preis ___ ist hoch.", translation: "El precio de la pared es alto." },
  }},
  { id: "c35", noun: "Boden", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Boden", template: "___ funktioniert gut.", translation: "El suelo funciona bien." },
    Akkusativ: { phrase: "den Boden", template: "Wir benutzen ___ oft.", translation: "Usamos el suelo a menudo." },
    Dativ: { phrase: "dem Boden", template: "Wir stehen vor ___.", translation: "Estamos delante del suelo." },
    Genitiv: { phrase: "des Bodens", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del suelo es impresionante." },
  }},
  { id: "c36", noun: "Garage", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Garage", template: "___ ist sehr groß.", translation: "El garaje es muy grande." },
    Akkusativ: { phrase: "die Garage", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia el garaje todos los días." },
    Dativ: { phrase: "der Garage", template: "Das Buch liegt auf ___.", translation: "El libro está encima del garaje." },
    Genitiv: { phrase: "der Garage", template: "Das Gewicht ___ ist enorm.", translation: "El peso del garaje es enorme." },
  }},
  { id: "c37", noun: "Garten", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Garten", template: "___ ist wirklich interessant.", translation: "El jardín es realmente interesante." },
    Akkusativ: { phrase: "den Garten", template: "Er nimmt ___ mit.", translation: "Él se lleva el jardín." },
    Dativ: { phrase: "dem Garten", template: "Es ist in ___.", translation: "Está dentro del jardín." },
    Genitiv: { phrase: "des Gartens", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del jardín es inusual." },
  }},
  { id: "c38", noun: "Treppe", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Treppe", template: "___ ist kaputt.", translation: "La escalera ya no funciona." },
    Akkusativ: { phrase: "die Treppe", template: "Ich sehe ___ dort.", translation: "Veo la escalera allí." },
    Dativ: { phrase: "der Treppe", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la escalera." },
    Genitiv: { phrase: "der Treppe", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la escalera ha subido." },
  }},
  { id: "c39", noun: "Keller", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Keller", template: "___ ist sehr nützlich.", translation: "El sótano es muy útil." },
    Akkusativ: { phrase: "den Keller", template: "Ich kaufe ___.", translation: "Compro el sótano." },
    Dativ: { phrase: "dem Keller", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al sótano." },
    Genitiv: { phrase: "des Kellers", template: "Die Farbe ___ ist schön.", translation: "El color del sótano es bonito." },
  }},
  { id: "c40", noun: "Dach", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Dach", template: "___ ist hier.", translation: "El tejado está aquí." },
    Akkusativ: { phrase: "das Dach", template: "Ich brauche ___ dringend.", translation: "Necesito el tejado urgentemente." },
    Dativ: { phrase: "dem Dach", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del tejado." },
    Genitiv: { phrase: "des Daches", template: "Der Preis ___ ist hoch.", translation: "El precio del tejado es alto." },
  }},
  { id: "c41", noun: "Schlüssel", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Schlüssel", template: "___ funktioniert gut.", translation: "La llave funciona bien." },
    Akkusativ: { phrase: "den Schlüssel", template: "Wir benutzen ___ oft.", translation: "Usamos la llave a menudo." },
    Dativ: { phrase: "dem Schlüssel", template: "Wir stehen vor ___.", translation: "Estamos delante de la llave." },
    Genitiv: { phrase: "des Schlüssels", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la llave es impresionante." },
  }},
  { id: "c42", noun: "Kissen", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Kissen", template: "___ ist sehr groß.", translation: "El cojín es muy grande." },
    Akkusativ: { phrase: "das Kissen", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia el cojín todos los días." },
    Dativ: { phrase: "dem Kissen", template: "Das Buch liegt auf ___.", translation: "El libro está encima del cojín." },
    Genitiv: { phrase: "des Kissens", template: "Das Gewicht ___ ist enorm.", translation: "El peso del cojín es enorme." },
  }},
  { id: "c43", noun: "Teller", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Teller", template: "___ ist wirklich interessant.", translation: "El plato es realmente interesante." },
    Akkusativ: { phrase: "den Teller", template: "Er nimmt ___ mit.", translation: "Él se lleva el plato." },
    Dativ: { phrase: "dem Teller", template: "Es ist in ___.", translation: "Está dentro del plato." },
    Genitiv: { phrase: "des Tellers", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del plato es inusual." },
  }},
  { id: "c44", noun: "Tasse", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Tasse", template: "___ ist kaputt.", translation: "La taza ya no funciona." },
    Akkusativ: { phrase: "die Tasse", template: "Ich sehe ___ dort.", translation: "Veo la taza allí." },
    Dativ: { phrase: "der Tasse", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la taza." },
    Genitiv: { phrase: "der Tasse", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la taza ha subido." },
  }},
  { id: "c45", noun: "Apfel", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Apfel", template: "___ ist sehr nützlich.", translation: "La manzana es muy útil." },
    Akkusativ: { phrase: "den Apfel", template: "Ich kaufe ___.", translation: "Compro la manzana." },
    Dativ: { phrase: "dem Apfel", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la manzana." },
    Genitiv: { phrase: "des Apfels", template: "Die Farbe ___ ist schön.", translation: "El color de la manzana es bonito." },
  }},
  { id: "c46", noun: "Banane", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Banane", template: "___ ist hier.", translation: "El plátano está aquí." },
    Akkusativ: { phrase: "die Banane", template: "Ich brauche ___ dringend.", translation: "Necesito el plátano urgentemente." },
    Dativ: { phrase: "der Banane", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del plátano." },
    Genitiv: { phrase: "der Banane", template: "Der Preis ___ ist hoch.", translation: "El precio del plátano es alto." },
  }},
  { id: "c47", noun: "Brot", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Brot", template: "___ funktioniert gut.", translation: "El pan funciona bien." },
    Akkusativ: { phrase: "das Brot", template: "Wir benutzen ___ oft.", translation: "Usamos el pan a menudo." },
    Dativ: { phrase: "dem Brot", template: "Wir stehen vor ___.", translation: "Estamos delante del pan." },
    Genitiv: { phrase: "des Brotes", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del pan es impresionante." },
  }},
  { id: "c48", noun: "Milch", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Milch", template: "___ ist sehr groß.", translation: "La leche es muy grande." },
    Akkusativ: { phrase: "die Milch", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la leche todos los días." },
    Dativ: { phrase: "der Milch", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la leche." },
    Genitiv: { phrase: "der Milch", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la leche es enorme." },
  }},
  { id: "c49", noun: "Käse", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Käse", template: "___ ist wirklich interessant.", translation: "El queso es realmente interesante." },
    Akkusativ: { phrase: "den Käse", template: "Er nimmt ___ mit.", translation: "Él se lleva el queso." },
    Dativ: { phrase: "dem Käse", template: "Es ist in ___.", translation: "Está dentro del queso." },
    Genitiv: { phrase: "des Käses", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del queso es inusual." },
  }},
  { id: "c50", noun: "Ei", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Ei", template: "___ ist kaputt.", translation: "El huevo ya no funciona." },
    Akkusativ: { phrase: "das Ei", template: "Ich sehe ___ dort.", translation: "Veo el huevo allí." },
    Dativ: { phrase: "dem Ei", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al huevo." },
    Genitiv: { phrase: "des Eies", template: "Der Wert ___ ist gestiegen.", translation: "El valor del huevo ha subido." },
  }},
  { id: "c51", noun: "Kuchen", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Kuchen", template: "___ ist sehr nützlich.", translation: "El pastel es muy útil." },
    Akkusativ: { phrase: "den Kuchen", template: "Ich kaufe ___.", translation: "Compro el pastel." },
    Dativ: { phrase: "dem Kuchen", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al pastel." },
    Genitiv: { phrase: "des Kuchens", template: "Die Farbe ___ ist schön.", translation: "El color del pastel es bonito." },
  }},
  { id: "c52", noun: "Suppe", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Suppe", template: "___ ist hier.", translation: "La sopa está aquí." },
    Akkusativ: { phrase: "die Suppe", template: "Ich brauche ___ dringend.", translation: "Necesito la sopa urgentemente." },
    Dativ: { phrase: "der Suppe", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la sopa." },
    Genitiv: { phrase: "der Suppe", template: "Der Preis ___ ist hoch.", translation: "El precio de la sopa es alto." },
  }},
  { id: "c53", noun: "Fleisch", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Fleisch", template: "___ funktioniert gut.", translation: "La carne funciona bien." },
    Akkusativ: { phrase: "das Fleisch", template: "Wir benutzen ___ oft.", translation: "Usamos la carne a menudo." },
    Dativ: { phrase: "dem Fleisch", template: "Wir stehen vor ___.", translation: "Estamos delante de la carne." },
    Genitiv: { phrase: "des Fleisches", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la carne es impresionante." },
  }},
  { id: "c54", noun: "Wein", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Wein", template: "___ ist sehr groß.", translation: "El vino es muy grande." },
    Akkusativ: { phrase: "den Wein", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia el vino todos los días." },
    Dativ: { phrase: "dem Wein", template: "Das Buch liegt auf ___.", translation: "El libro está encima del vino." },
    Genitiv: { phrase: "des Weines", template: "Das Gewicht ___ ist enorm.", translation: "El peso del vino es enorme." },
  }},
  { id: "c55", noun: "Reis", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Reis", template: "___ ist wirklich interessant.", translation: "El arroz es realmente interesante." },
    Akkusativ: { phrase: "den Reis", template: "Er nimmt ___ mit.", translation: "Él se lleva el arroz." },
    Dativ: { phrase: "dem Reis", template: "Es ist in ___.", translation: "Está dentro del arroz." },
    Genitiv: { phrase: "des Reises", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del arroz es inusual." },
  }},
  { id: "c56", noun: "Zucker", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Zucker", template: "___ ist kaputt.", translation: "El azúcar ya no funciona." },
    Akkusativ: { phrase: "den Zucker", template: "Ich sehe ___ dort.", translation: "Veo el azúcar allí." },
    Dativ: { phrase: "dem Zucker", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al azúcar." },
    Genitiv: { phrase: "des Zuckers", template: "Der Wert ___ ist gestiegen.", translation: "El valor del azúcar ha subido." },
  }},
  { id: "c57", noun: "Salz", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Salz", template: "___ ist sehr nützlich.", translation: "La sal es muy útil." },
    Akkusativ: { phrase: "das Salz", template: "Ich kaufe ___.", translation: "Compro la sal." },
    Dativ: { phrase: "dem Salz", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la sal." },
    Genitiv: { phrase: "des Salzes", template: "Die Farbe ___ ist schön.", translation: "El color de la sal es bonito." },
  }},
  { id: "c58", noun: "Pfeffer", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Pfeffer", template: "___ ist hier.", translation: "La pimienta está aquí." },
    Akkusativ: { phrase: "den Pfeffer", template: "Ich brauche ___ dringend.", translation: "Necesito la pimienta urgentemente." },
    Dativ: { phrase: "dem Pfeffer", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la pimienta." },
    Genitiv: { phrase: "des Pfeffers", template: "Der Preis ___ ist hoch.", translation: "El precio de la pimienta es alto." },
  }},
  { id: "c59", noun: "Tomate", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Tomate", template: "___ funktioniert gut.", translation: "El tomate funciona bien." },
    Akkusativ: { phrase: "die Tomate", template: "Wir benutzen ___ oft.", translation: "Usamos el tomate a menudo." },
    Dativ: { phrase: "der Tomate", template: "Wir stehen vor ___.", translation: "Estamos delante del tomate." },
    Genitiv: { phrase: "der Tomate", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del tomate es impresionante." },
  }},
  { id: "c60", noun: "Kartoffel", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Kartoffel", template: "___ ist sehr groß.", translation: "La patata es muy grande." },
    Akkusativ: { phrase: "die Kartoffel", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la patata todos los días." },
    Dativ: { phrase: "der Kartoffel", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la patata." },
    Genitiv: { phrase: "der Kartoffel", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la patata es enorme." },
  }},
  { id: "c61", noun: "Zwiebel", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Zwiebel", template: "___ ist wirklich interessant.", translation: "La cebolla es realmente interesante." },
    Akkusativ: { phrase: "die Zwiebel", template: "Er nimmt ___ mit.", translation: "Él se lleva la cebolla." },
    Dativ: { phrase: "der Zwiebel", template: "Es ist in ___.", translation: "Está dentro de la cebolla." },
    Genitiv: { phrase: "der Zwiebel", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la cebolla es inusual." },
  }},
  { id: "c62", noun: "Schokolade", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Schokolade", template: "___ ist kaputt.", translation: "El chocolate ya no funciona." },
    Akkusativ: { phrase: "die Schokolade", template: "Ich sehe ___ dort.", translation: "Veo el chocolate allí." },
    Dativ: { phrase: "der Schokolade", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al chocolate." },
    Genitiv: { phrase: "der Schokolade", template: "Der Wert ___ ist gestiegen.", translation: "El valor del chocolate ha subido." },
  }},
  { id: "c63", noun: "Kaffee", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Kaffee", template: "___ ist sehr nützlich.", translation: "El café es muy útil." },
    Akkusativ: { phrase: "den Kaffee", template: "Ich kaufe ___.", translation: "Compro el café." },
    Dativ: { phrase: "dem Kaffee", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al café." },
    Genitiv: { phrase: "des Kaffees", template: "Die Farbe ___ ist schön.", translation: "El color del café es bonito." },
  }},
  { id: "c64", noun: "Tee", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Tee", template: "___ ist hier.", translation: "El té está aquí." },
    Akkusativ: { phrase: "den Tee", template: "Ich brauche ___ dringend.", translation: "Necesito el té urgentemente." },
    Dativ: { phrase: "dem Tee", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del té." },
    Genitiv: { phrase: "des Tees", template: "Der Preis ___ ist hoch.", translation: "El precio del té es alto." },
  }},
  { id: "c65", noun: "Saft", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Saft", template: "___ funktioniert gut.", translation: "El zumo funciona bien." },
    Akkusativ: { phrase: "den Saft", template: "Wir benutzen ___ oft.", translation: "Usamos el zumo a menudo." },
    Dativ: { phrase: "dem Saft", template: "Wir stehen vor ___.", translation: "Estamos delante del zumo." },
    Genitiv: { phrase: "des Saftes", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del zumo es impresionante." },
  }},
  { id: "c66", noun: "Honig", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Honig", template: "___ ist sehr groß.", translation: "La miel es muy grande." },
    Akkusativ: { phrase: "den Honig", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la miel todos los días." },
    Dativ: { phrase: "dem Honig", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la miel." },
    Genitiv: { phrase: "des Honigs", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la miel es enorme." },
  }},
  { id: "c67", noun: "Joghurt", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Joghurt", template: "___ ist wirklich interessant.", translation: "El yogur es realmente interesante." },
    Akkusativ: { phrase: "den Joghurt", template: "Er nimmt ___ mit.", translation: "Él se lleva el yogur." },
    Dativ: { phrase: "dem Joghurt", template: "Es ist in ___.", translation: "Está dentro del yogur." },
    Genitiv: { phrase: "des Joghurts", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del yogur es inusual." },
  }},
  { id: "c68", noun: "Nudel", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Nudel", template: "___ ist kaputt.", translation: "La pasta ya no funciona." },
    Akkusativ: { phrase: "die Nudel", template: "Ich sehe ___ dort.", translation: "Veo la pasta allí." },
    Dativ: { phrase: "der Nudel", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la pasta." },
    Genitiv: { phrase: "der Nudel", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la pasta ha subido." },
  }},
  { id: "c69", noun: "Pizza", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Pizza", template: "___ ist sehr nützlich.", translation: "La pizza es muy útil." },
    Akkusativ: { phrase: "die Pizza", template: "Ich kaufe ___.", translation: "Compro la pizza." },
    Dativ: { phrase: "der Pizza", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la pizza." },
    Genitiv: { phrase: "der Pizza", template: "Die Farbe ___ ist schön.", translation: "El color de la pizza es bonito." },
  }},
  { id: "c70", noun: "Straße", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Straße", template: "___ ist hier.", translation: "La calle está aquí." },
    Akkusativ: { phrase: "die Straße", template: "Ich brauche ___ dringend.", translation: "Necesito la calle urgentemente." },
    Dativ: { phrase: "der Straße", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la calle." },
    Genitiv: { phrase: "der Straße", template: "Der Preis ___ ist hoch.", translation: "El precio de la calle es alto." },
  }},
  { id: "c71", noun: "Bahnhof", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Bahnhof", template: "___ funktioniert gut.", translation: "La estación funciona bien." },
    Akkusativ: { phrase: "den Bahnhof", template: "Wir benutzen ___ oft.", translation: "Usamos la estación a menudo." },
    Dativ: { phrase: "dem Bahnhof", template: "Wir stehen vor ___.", translation: "Estamos delante de la estación." },
    Genitiv: { phrase: "des Bahnhofs", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la estación es impresionante." },
  }},
  { id: "c72", noun: "Geschäft", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Geschäft", template: "___ ist sehr groß.", translation: "La tienda es muy grande." },
    Akkusativ: { phrase: "das Geschäft", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la tienda todos los días." },
    Dativ: { phrase: "dem Geschäft", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la tienda." },
    Genitiv: { phrase: "des Geschäfts", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la tienda es enorme." },
  }},
  { id: "c73", noun: "Kirche", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Kirche", template: "___ ist wirklich interessant.", translation: "La iglesia es realmente interesante." },
    Akkusativ: { phrase: "die Kirche", template: "Er nimmt ___ mit.", translation: "Él se lleva la iglesia." },
    Dativ: { phrase: "der Kirche", template: "Es ist in ___.", translation: "Está dentro de la iglesia." },
    Genitiv: { phrase: "der Kirche", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la iglesia es inusual." },
  }},
  { id: "c74", noun: "Park", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Park", template: "___ ist kaputt.", translation: "El parque ya no funciona." },
    Akkusativ: { phrase: "den Park", template: "Ich sehe ___ dort.", translation: "Veo el parque allí." },
    Dativ: { phrase: "dem Park", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al parque." },
    Genitiv: { phrase: "des Parks", template: "Der Wert ___ ist gestiegen.", translation: "El valor del parque ha subido." },
  }},
  { id: "c75", noun: "Restaurant", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Restaurant", template: "___ ist sehr nützlich.", translation: "El restaurante es muy útil." },
    Akkusativ: { phrase: "das Restaurant", template: "Ich kaufe ___.", translation: "Compro el restaurante." },
    Dativ: { phrase: "dem Restaurant", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al restaurante." },
    Genitiv: { phrase: "des Restaurants", template: "Die Farbe ___ ist schön.", translation: "El color del restaurante es bonito." },
  }},
  { id: "c76", noun: "Bank", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Bank", template: "___ ist hier.", translation: "El banco está aquí." },
    Akkusativ: { phrase: "die Bank", template: "Ich brauche ___ dringend.", translation: "Necesito el banco urgentemente." },
    Dativ: { phrase: "der Bank", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del banco." },
    Genitiv: { phrase: "der Bank", template: "Der Preis ___ ist hoch.", translation: "El precio del banco es alto." },
  }},
  { id: "c77", noun: "Markt", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Markt", template: "___ funktioniert gut.", translation: "El mercado funciona bien." },
    Akkusativ: { phrase: "den Markt", template: "Wir benutzen ___ oft.", translation: "Usamos el mercado a menudo." },
    Dativ: { phrase: "dem Markt", template: "Wir stehen vor ___.", translation: "Estamos delante del mercado." },
    Genitiv: { phrase: "des Marktes", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del mercado es impresionante." },
  }},
  { id: "c78", noun: "Krankenhaus", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Krankenhaus", template: "___ ist sehr groß.", translation: "El hospital es muy grande." },
    Akkusativ: { phrase: "das Krankenhaus", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia el hospital todos los días." },
    Dativ: { phrase: "dem Krankenhaus", template: "Das Buch liegt auf ___.", translation: "El libro está encima del hospital." },
    Genitiv: { phrase: "des Krankenhauses", template: "Das Gewicht ___ ist enorm.", translation: "El peso del hospital es enorme." },
  }},
  { id: "c79", noun: "Brücke", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Brücke", template: "___ ist wirklich interessant.", translation: "El puente es realmente interesante." },
    Akkusativ: { phrase: "die Brücke", template: "Er nimmt ___ mit.", translation: "Él se lleva el puente." },
    Dativ: { phrase: "der Brücke", template: "Es ist in ___.", translation: "Está dentro del puente." },
    Genitiv: { phrase: "der Brücke", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del puente es inusual." },
  }},
  { id: "c80", noun: "Platz", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Platz", template: "___ ist kaputt.", translation: "La plaza ya no funciona." },
    Akkusativ: { phrase: "den Platz", template: "Ich sehe ___ dort.", translation: "Veo la plaza allí." },
    Dativ: { phrase: "dem Platz", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la plaza." },
    Genitiv: { phrase: "des Platzes", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la plaza ha subido." },
  }},
  { id: "c81", noun: "Rathaus", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Rathaus", template: "___ ist sehr nützlich.", translation: "El ayuntamiento es muy útil." },
    Akkusativ: { phrase: "das Rathaus", template: "Ich kaufe ___.", translation: "Compro el ayuntamiento." },
    Dativ: { phrase: "dem Rathaus", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al ayuntamiento." },
    Genitiv: { phrase: "des Rathauses", template: "Die Farbe ___ ist schön.", translation: "El color del ayuntamiento es bonito." },
  }},
  { id: "c82", noun: "Museum", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Museum", template: "___ ist hier.", translation: "El museo está aquí." },
    Akkusativ: { phrase: "das Museum", template: "Ich brauche ___ dringend.", translation: "Necesito el museo urgentemente." },
    Dativ: { phrase: "dem Museum", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del museo." },
    Genitiv: { phrase: "des Museums", template: "Der Preis ___ ist hoch.", translation: "El precio del museo es alto." },
  }},
  { id: "c83", noun: "Theater", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Theater", template: "___ funktioniert gut.", translation: "El teatro funciona bien." },
    Akkusativ: { phrase: "das Theater", template: "Wir benutzen ___ oft.", translation: "Usamos el teatro a menudo." },
    Dativ: { phrase: "dem Theater", template: "Wir stehen vor ___.", translation: "Estamos delante del teatro." },
    Genitiv: { phrase: "des Theaters", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del teatro es impresionante." },
  }},
  { id: "c84", noun: "Bibliothek", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Bibliothek", template: "___ ist sehr groß.", translation: "La biblioteca es muy grande." },
    Akkusativ: { phrase: "die Bibliothek", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la biblioteca todos los días." },
    Dativ: { phrase: "der Bibliothek", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la biblioteca." },
    Genitiv: { phrase: "der Bibliothek", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la biblioteca es enorme." },
  }},
  { id: "c85", noun: "Apotheke", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Apotheke", template: "___ ist wirklich interessant.", translation: "La farmacia es realmente interesante." },
    Akkusativ: { phrase: "die Apotheke", template: "Er nimmt ___ mit.", translation: "Él se lleva la farmacia." },
    Dativ: { phrase: "der Apotheke", template: "Es ist in ___.", translation: "Está dentro de la farmacia." },
    Genitiv: { phrase: "der Apotheke", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la farmacia es inusual." },
  }},
  { id: "c86", noun: "Hotel", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Hotel", template: "___ ist kaputt.", translation: "El hotel ya no funciona." },
    Akkusativ: { phrase: "das Hotel", template: "Ich sehe ___ dort.", translation: "Veo el hotel allí." },
    Dativ: { phrase: "dem Hotel", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al hotel." },
    Genitiv: { phrase: "des Hotels", template: "Der Wert ___ ist gestiegen.", translation: "El valor del hotel ha subido." },
  }},
  { id: "c87", noun: "Flughafen", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Flughafen", template: "___ ist sehr nützlich.", translation: "El aeropuerto es muy útil." },
    Akkusativ: { phrase: "den Flughafen", template: "Ich kaufe ___.", translation: "Compro el aeropuerto." },
    Dativ: { phrase: "dem Flughafen", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al aeropuerto." },
    Genitiv: { phrase: "des Flughafens", template: "Die Farbe ___ ist schön.", translation: "El color del aeropuerto es bonito." },
  }},
  { id: "c88", noun: "Hafen", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Hafen", template: "___ ist hier.", translation: "El puerto está aquí." },
    Akkusativ: { phrase: "den Hafen", template: "Ich brauche ___ dringend.", translation: "Necesito el puerto urgentemente." },
    Dativ: { phrase: "dem Hafen", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del puerto." },
    Genitiv: { phrase: "des Hafens", template: "Der Preis ___ ist hoch.", translation: "El precio del puerto es alto." },
  }},
  { id: "c89", noun: "Turm", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Turm", template: "___ funktioniert gut.", translation: "La torre funciona bien." },
    Akkusativ: { phrase: "den Turm", template: "Wir benutzen ___ oft.", translation: "Usamos la torre a menudo." },
    Dativ: { phrase: "dem Turm", template: "Wir stehen vor ___.", translation: "Estamos delante de la torre." },
    Genitiv: { phrase: "des Turms", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la torre es impresionante." },
  }},
  { id: "c90", noun: "Denkmal", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Denkmal", template: "___ ist sehr groß.", translation: "El monumento es muy grande." },
    Akkusativ: { phrase: "das Denkmal", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia el monumento todos los días." },
    Dativ: { phrase: "dem Denkmal", template: "Das Buch liegt auf ___.", translation: "El libro está encima del monumento." },
    Genitiv: { phrase: "des Denkmals", template: "Das Gewicht ___ ist enorm.", translation: "El peso del monumento es enorme." },
  }},
  { id: "c91", noun: "Polizei", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Polizei", template: "___ ist wirklich interessant.", translation: "La policía es realmente interesante." },
    Akkusativ: { phrase: "die Polizei", template: "Er nimmt ___ mit.", translation: "Él se lleva la policía." },
    Dativ: { phrase: "der Polizei", template: "Es ist in ___.", translation: "Está dentro de la policía." },
    Genitiv: { phrase: "der Polizei", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la policía es inusual." },
  }},
  { id: "c92", noun: "Feuerwehr", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Feuerwehr", template: "___ ist kaputt.", translation: "Los bomberos ya no funciona." },
    Akkusativ: { phrase: "die Feuerwehr", template: "Ich sehe ___ dort.", translation: "Veo los bomberos allí." },
    Dativ: { phrase: "der Feuerwehr", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a los bomberos." },
    Genitiv: { phrase: "der Feuerwehr", template: "Der Wert ___ ist gestiegen.", translation: "El valor de los bomberos ha subido." },
  }},
  { id: "c93", noun: "Tankstelle", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Tankstelle", template: "___ ist sehr nützlich.", translation: "La gasolinera es muy útil." },
    Akkusativ: { phrase: "die Tankstelle", template: "Ich kaufe ___.", translation: "Compro la gasolinera." },
    Dativ: { phrase: "der Tankstelle", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la gasolinera." },
    Genitiv: { phrase: "der Tankstelle", template: "Die Farbe ___ ist schön.", translation: "El color de la gasolinera es bonito." },
  }},
  { id: "c94", noun: "Chef", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Chef", template: "___ kommt gleich.", translation: "El jefe viene enseguida." },
    Akkusativ: { phrase: "den Chef", template: "Ich kenne ___ gut.", translation: "Conozco bien al jefe." },
    Dativ: { phrase: "dem Chef", template: "Ich glaube ___ nicht.", translation: "No le creo al jefe." },
    Genitiv: { phrase: "des Chefs", template: "Der Name ___ ist bekannt.", translation: "El nombre del jefe es conocido." },
  }},
  { id: "c95", noun: "Arbeit", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Arbeit", template: "___ funktioniert gut.", translation: "El trabajo funciona bien." },
    Akkusativ: { phrase: "die Arbeit", template: "Wir benutzen ___ oft.", translation: "Usamos el trabajo a menudo." },
    Dativ: { phrase: "der Arbeit", template: "Wir stehen vor ___.", translation: "Estamos delante del trabajo." },
    Genitiv: { phrase: "der Arbeit", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del trabajo es impresionante." },
  }},
  { id: "c96", noun: "Büro", gender: "das", category: "trabajo", cases: {
    Nominativ: { phrase: "das Büro", template: "___ ist sehr groß.", translation: "La oficina es muy grande." },
    Akkusativ: { phrase: "das Büro", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la oficina todos los días." },
    Dativ: { phrase: "dem Büro", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la oficina." },
    Genitiv: { phrase: "des Büros", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la oficina es enorme." },
  }},
  { id: "c97", noun: "Computer", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Computer", template: "___ ist wirklich interessant.", translation: "El ordenador es realmente interesante." },
    Akkusativ: { phrase: "den Computer", template: "Er nimmt ___ mit.", translation: "Él se lleva el ordenador." },
    Dativ: { phrase: "dem Computer", template: "Es ist in ___.", translation: "Está dentro del ordenador." },
    Genitiv: { phrase: "des Computers", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del ordenador es inusual." },
  }},
  { id: "c98", noun: "Besprechung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Besprechung", template: "___ ist kaputt.", translation: "La reunión ya no funciona." },
    Akkusativ: { phrase: "die Besprechung", template: "Ich sehe ___ dort.", translation: "Veo la reunión allí." },
    Dativ: { phrase: "der Besprechung", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la reunión." },
    Genitiv: { phrase: "der Besprechung", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la reunión ha subido." },
  }},
  { id: "c99", noun: "Gehalt", gender: "das", category: "trabajo", cases: {
    Nominativ: { phrase: "das Gehalt", template: "___ ist sehr nützlich.", translation: "El sueldo es muy útil." },
    Akkusativ: { phrase: "das Gehalt", template: "Ich kaufe ___.", translation: "Compro el sueldo." },
    Dativ: { phrase: "dem Gehalt", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al sueldo." },
    Genitiv: { phrase: "des Gehalts", template: "Die Farbe ___ ist schön.", translation: "El color del sueldo es bonito." },
  }},
  { id: "c100", noun: "Firma", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Firma", template: "___ ist hier.", translation: "La empresa está aquí." },
    Akkusativ: { phrase: "die Firma", template: "Ich brauche ___ dringend.", translation: "Necesito la empresa urgentemente." },
    Dativ: { phrase: "der Firma", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la empresa." },
    Genitiv: { phrase: "der Firma", template: "Der Preis ___ ist hoch.", translation: "El precio de la empresa es alto." },
  }},
  { id: "c101", noun: "Projekt", gender: "das", category: "trabajo", cases: {
    Nominativ: { phrase: "das Projekt", template: "___ funktioniert gut.", translation: "El proyecto funciona bien." },
    Akkusativ: { phrase: "das Projekt", template: "Wir benutzen ___ oft.", translation: "Usamos el proyecto a menudo." },
    Dativ: { phrase: "dem Projekt", template: "Wir stehen vor ___.", translation: "Estamos delante del proyecto." },
    Genitiv: { phrase: "des Projekts", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del proyecto es impresionante." },
  }},
  { id: "c102", noun: "Urlaub", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Urlaub", template: "___ ist sehr groß.", translation: "Las vacaciones es muy grande." },
    Akkusativ: { phrase: "den Urlaub", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia las vacaciones todos los días." },
    Dativ: { phrase: "dem Urlaub", template: "Das Buch liegt auf ___.", translation: "El libro está encima de las vacaciones." },
    Genitiv: { phrase: "des Urlaubs", template: "Das Gewicht ___ ist enorm.", translation: "El peso de las vacaciones es enorme." },
  }},
  { id: "c103", noun: "Beruf", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Beruf", template: "___ ist wirklich interessant.", translation: "La profesión es realmente interesante." },
    Akkusativ: { phrase: "den Beruf", template: "Er nimmt ___ mit.", translation: "Él se lleva la profesión." },
    Dativ: { phrase: "dem Beruf", template: "Es ist in ___.", translation: "Está dentro de la profesión." },
    Genitiv: { phrase: "des Berufs", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la profesión es inusual." },
  }},
  { id: "c104", noun: "Termin", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Termin", template: "___ ist kaputt.", translation: "La cita ya no funciona." },
    Akkusativ: { phrase: "den Termin", template: "Ich sehe ___ dort.", translation: "Veo la cita allí." },
    Dativ: { phrase: "dem Termin", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la cita." },
    Genitiv: { phrase: "des Termins", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la cita ha subido." },
  }},
  { id: "c105", noun: "Vertrag", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Vertrag", template: "___ ist sehr nützlich.", translation: "El contrato es muy útil." },
    Akkusativ: { phrase: "den Vertrag", template: "Ich kaufe ___.", translation: "Compro el contrato." },
    Dativ: { phrase: "dem Vertrag", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al contrato." },
    Genitiv: { phrase: "des Vertrags", template: "Die Farbe ___ ist schön.", translation: "El color del contrato es bonito." },
  }},
  { id: "c106", noun: "Mitarbeiter", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Mitarbeiter", template: "___ kommt gleich.", translation: "El empleado viene enseguida." },
    Akkusativ: { phrase: "den Mitarbeiter", template: "Ich kenne ___ gut.", translation: "Conozco bien al empleado." },
    Dativ: { phrase: "dem Mitarbeiter", template: "Ich glaube ___ nicht.", translation: "No le creo al empleado." },
    Genitiv: { phrase: "des Mitarbeiters", template: "Der Name ___ ist bekannt.", translation: "El nombre del empleado es conocido." },
  }},
  { id: "c107", noun: "Fabrik", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Fabrik", template: "___ funktioniert gut.", translation: "La fábrica funciona bien." },
    Akkusativ: { phrase: "die Fabrik", template: "Wir benutzen ___ oft.", translation: "Usamos la fábrica a menudo." },
    Dativ: { phrase: "der Fabrik", template: "Wir stehen vor ___.", translation: "Estamos delante de la fábrica." },
    Genitiv: { phrase: "der Fabrik", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la fábrica es impresionante." },
  }},
  { id: "c108", noun: "Maschine", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Maschine", template: "___ ist sehr groß.", translation: "La máquina es muy grande." },
    Akkusativ: { phrase: "die Maschine", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la máquina todos los días." },
    Dativ: { phrase: "der Maschine", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la máquina." },
    Genitiv: { phrase: "der Maschine", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la máquina es enorme." },
  }},
  { id: "c109", noun: "Rechnung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Rechnung", template: "___ ist wirklich interessant.", translation: "La factura es realmente interesante." },
    Akkusativ: { phrase: "die Rechnung", template: "Er nimmt ___ mit.", translation: "Él se lleva la factura." },
    Dativ: { phrase: "der Rechnung", template: "Es ist in ___.", translation: "Está dentro de la factura." },
    Genitiv: { phrase: "der Rechnung", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la factura es inusual." },
  }},
  { id: "c110", noun: "Bewerbung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Bewerbung", template: "___ ist kaputt.", translation: "La solicitud ya no funciona." },
    Akkusativ: { phrase: "die Bewerbung", template: "Ich sehe ___ dort.", translation: "Veo la solicitud allí." },
    Dativ: { phrase: "der Bewerbung", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la solicitud." },
    Genitiv: { phrase: "der Bewerbung", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la solicitud ha subido." },
  }},
  { id: "c111", noun: "Konferenz", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Konferenz", template: "___ ist sehr nützlich.", translation: "La conferencia es muy útil." },
    Akkusativ: { phrase: "die Konferenz", template: "Ich kaufe ___.", translation: "Compro la conferencia." },
    Dativ: { phrase: "der Konferenz", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la conferencia." },
    Genitiv: { phrase: "der Konferenz", template: "Die Farbe ___ ist schön.", translation: "El color de la conferencia es bonito." },
  }},
  { id: "c112", noun: "Abteilung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Abteilung", template: "___ ist hier.", translation: "El departamento está aquí." },
    Akkusativ: { phrase: "die Abteilung", template: "Ich brauche ___ dringend.", translation: "Necesito el departamento urgentemente." },
    Dativ: { phrase: "der Abteilung", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del departamento." },
    Genitiv: { phrase: "der Abteilung", template: "Der Preis ___ ist hoch.", translation: "El precio del departamento es alto." },
  }},
  { id: "c113", noun: "Lohn", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Lohn", template: "___ funktioniert gut.", translation: "El salario funciona bien." },
    Akkusativ: { phrase: "den Lohn", template: "Wir benutzen ___ oft.", translation: "Usamos el salario a menudo." },
    Dativ: { phrase: "dem Lohn", template: "Wir stehen vor ___.", translation: "Estamos delante del salario." },
    Genitiv: { phrase: "des Lohns", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del salario es impresionante." },
  }},
  { id: "c114", noun: "Aufgabe", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Aufgabe", template: "___ ist sehr groß.", translation: "La tarea es muy grande." },
    Akkusativ: { phrase: "die Aufgabe", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la tarea todos los días." },
    Dativ: { phrase: "der Aufgabe", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la tarea." },
    Genitiv: { phrase: "der Aufgabe", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la tarea es enorme." },
  }},
  { id: "c115", noun: "Pause", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Pause", template: "___ ist wirklich interessant.", translation: "La pausa es realmente interesante." },
    Akkusativ: { phrase: "die Pause", template: "Er nimmt ___ mit.", translation: "Él se lleva la pausa." },
    Dativ: { phrase: "der Pause", template: "Es ist in ___.", translation: "Está dentro de la pausa." },
    Genitiv: { phrase: "der Pause", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la pausa es inusual." },
  }},
  { id: "c116", noun: "Erfolg", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Erfolg", template: "___ ist kaputt.", translation: "El éxito ya no funciona." },
    Akkusativ: { phrase: "den Erfolg", template: "Ich sehe ___ dort.", translation: "Veo el éxito allí." },
    Dativ: { phrase: "dem Erfolg", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al éxito." },
    Genitiv: { phrase: "des Erfolgs", template: "Der Wert ___ ist gestiegen.", translation: "El valor del éxito ha subido." },
  }},
  { id: "c117", noun: "Chefin", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Chefin", template: "___ ist sehr nett.", translation: "La jefa es muy amable." },
    Akkusativ: { phrase: "die Chefin", template: "Ich sehe ___ oft.", translation: "Veo a la jefa a menudo." },
    Dativ: { phrase: "der Chefin", template: "Ich helfe ___ gern.", translation: "Ayudo a la jefa con gusto." },
    Genitiv: { phrase: "der Chefin", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa de la jefa." },
  }},
  { id: "c118", noun: "Baum", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Baum", template: "___ ist hier.", translation: "El árbol está aquí." },
    Akkusativ: { phrase: "den Baum", template: "Ich brauche ___ dringend.", translation: "Necesito el árbol urgentemente." },
    Dativ: { phrase: "dem Baum", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del árbol." },
    Genitiv: { phrase: "des Baumes", template: "Der Preis ___ ist hoch.", translation: "El precio del árbol es alto." },
  }},
  { id: "c119", noun: "Blume", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Blume", template: "___ funktioniert gut.", translation: "La flor funciona bien." },
    Akkusativ: { phrase: "die Blume", template: "Wir benutzen ___ oft.", translation: "Usamos la flor a menudo." },
    Dativ: { phrase: "der Blume", template: "Wir stehen vor ___.", translation: "Estamos delante de la flor." },
    Genitiv: { phrase: "der Blume", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la flor es impresionante." },
  }},
  { id: "c120", noun: "Berg", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Berg", template: "___ ist sehr groß.", translation: "La montaña es muy grande." },
    Akkusativ: { phrase: "den Berg", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la montaña todos los días." },
    Dativ: { phrase: "dem Berg", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la montaña." },
    Genitiv: { phrase: "des Berges", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la montaña es enorme." },
  }},
  { id: "c121", noun: "Sonne", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Sonne", template: "___ ist wirklich interessant.", translation: "El sol es realmente interesante." },
    Akkusativ: { phrase: "die Sonne", template: "Er nimmt ___ mit.", translation: "Él se lleva el sol." },
    Dativ: { phrase: "der Sonne", template: "Es ist in ___.", translation: "Está dentro del sol." },
    Genitiv: { phrase: "der Sonne", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del sol es inusual." },
  }},
  { id: "c122", noun: "Wald", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Wald", template: "___ ist kaputt.", translation: "El bosque ya no funciona." },
    Akkusativ: { phrase: "den Wald", template: "Ich sehe ___ dort.", translation: "Veo el bosque allí." },
    Dativ: { phrase: "dem Wald", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al bosque." },
    Genitiv: { phrase: "des Waldes", template: "Der Wert ___ ist gestiegen.", translation: "El valor del bosque ha subido." },
  }},
  { id: "c123", noun: "Fluss", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Fluss", template: "___ ist sehr nützlich.", translation: "El río es muy útil." },
    Akkusativ: { phrase: "den Fluss", template: "Ich kaufe ___.", translation: "Compro el río." },
    Dativ: { phrase: "dem Fluss", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al río." },
    Genitiv: { phrase: "des Flusses", template: "Die Farbe ___ ist schön.", translation: "El color del río es bonito." },
  }},
  { id: "c124", noun: "See", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der See", template: "___ ist hier.", translation: "El lago está aquí." },
    Akkusativ: { phrase: "den See", template: "Ich brauche ___ dringend.", translation: "Necesito el lago urgentemente." },
    Dativ: { phrase: "dem See", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del lago." },
    Genitiv: { phrase: "des Sees", template: "Der Preis ___ ist hoch.", translation: "El precio del lago es alto." },
  }},
  { id: "c125", noun: "Mond", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Mond", template: "___ funktioniert gut.", translation: "La luna funciona bien." },
    Akkusativ: { phrase: "den Mond", template: "Wir benutzen ___ oft.", translation: "Usamos la luna a menudo." },
    Dativ: { phrase: "dem Mond", template: "Wir stehen vor ___.", translation: "Estamos delante de la luna." },
    Genitiv: { phrase: "des Mondes", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la luna es impresionante." },
  }},
  { id: "c126", noun: "Stern", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Stern", template: "___ ist sehr groß.", translation: "La estrella es muy grande." },
    Akkusativ: { phrase: "den Stern", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la estrella todos los días." },
    Dativ: { phrase: "dem Stern", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la estrella." },
    Genitiv: { phrase: "des Sterns", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la estrella es enorme." },
  }},
  { id: "c127", noun: "Himmel", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Himmel", template: "___ ist wirklich interessant.", translation: "El cielo es realmente interesante." },
    Akkusativ: { phrase: "den Himmel", template: "Er nimmt ___ mit.", translation: "Él se lleva el cielo." },
    Dativ: { phrase: "dem Himmel", template: "Es ist in ___.", translation: "Está dentro del cielo." },
    Genitiv: { phrase: "des Himmels", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma del cielo es inusual." },
  }},
  { id: "c128", noun: "Wind", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Wind", template: "___ ist kaputt.", translation: "El viento ya no funciona." },
    Akkusativ: { phrase: "den Wind", template: "Ich sehe ___ dort.", translation: "Veo el viento allí." },
    Dativ: { phrase: "dem Wind", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al viento." },
    Genitiv: { phrase: "des Windes", template: "Der Wert ___ ist gestiegen.", translation: "El valor del viento ha subido." },
  }},
  { id: "c129", noun: "Regen", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Regen", template: "___ ist sehr nützlich.", translation: "La lluvia es muy útil." },
    Akkusativ: { phrase: "den Regen", template: "Ich kaufe ___.", translation: "Compro la lluvia." },
    Dativ: { phrase: "dem Regen", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la lluvia." },
    Genitiv: { phrase: "des Regens", template: "Die Farbe ___ ist schön.", translation: "El color de la lluvia es bonito." },
  }},
  { id: "c130", noun: "Schnee", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Schnee", template: "___ ist hier.", translation: "La nieve está aquí." },
    Akkusativ: { phrase: "den Schnee", template: "Ich brauche ___ dringend.", translation: "Necesito la nieve urgentemente." },
    Dativ: { phrase: "dem Schnee", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la nieve." },
    Genitiv: { phrase: "des Schnees", template: "Der Preis ___ ist hoch.", translation: "El precio de la nieve es alto." },
  }},
  { id: "c131", noun: "Wolke", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Wolke", template: "___ funktioniert gut.", translation: "La nube funciona bien." },
    Akkusativ: { phrase: "die Wolke", template: "Wir benutzen ___ oft.", translation: "Usamos la nube a menudo." },
    Dativ: { phrase: "der Wolke", template: "Wir stehen vor ___.", translation: "Estamos delante de la nube." },
    Genitiv: { phrase: "der Wolke", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la nube es impresionante." },
  }},
  { id: "c132", noun: "Wiese", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Wiese", template: "___ ist sehr groß.", translation: "La pradera es muy grande." },
    Akkusativ: { phrase: "die Wiese", template: "Sie putzt ___ jeden Tag.", translation: "Ella limpia la pradera todos los días." },
    Dativ: { phrase: "der Wiese", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la pradera." },
    Genitiv: { phrase: "der Wiese", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la pradera es enorme." },
  }},
  { id: "c133", noun: "Insel", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Insel", template: "___ ist wirklich interessant.", translation: "La isla es realmente interesante." },
    Akkusativ: { phrase: "die Insel", template: "Er nimmt ___ mit.", translation: "Él se lleva la isla." },
    Dativ: { phrase: "der Insel", template: "Es ist in ___.", translation: "Está dentro de la isla." },
    Genitiv: { phrase: "der Insel", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la isla es inusual." },
  }},
  { id: "c134", noun: "Wüste", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Wüste", template: "___ ist kaputt.", translation: "El desierto ya no funciona." },
    Akkusativ: { phrase: "die Wüste", template: "Ich sehe ___ dort.", translation: "Veo el desierto allí." },
    Dativ: { phrase: "der Wüste", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al desierto." },
    Genitiv: { phrase: "der Wüste", template: "Der Wert ___ ist gestiegen.", translation: "El valor del desierto ha subido." },
  }},
  { id: "c135", noun: "Strand", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Strand", template: "___ ist sehr nützlich.", translation: "La playa es muy útil." },
    Akkusativ: { phrase: "den Strand", template: "Ich kaufe ___.", translation: "Compro la playa." },
    Dativ: { phrase: "dem Strand", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la playa." },
    Genitiv: { phrase: "des Strands", template: "Die Farbe ___ ist schön.", translation: "El color de la playa es bonito." },
  }},
  { id: "c136", noun: "Tier", gender: "das", category: "naturaleza", cases: {
    Nominativ: { phrase: "das Tier", template: "___ kommt gleich.", translation: "El animal viene enseguida." },
    Akkusativ: { phrase: "das Tier", template: "Ich kenne ___ gut.", translation: "Conozco bien al animal." },
    Dativ: { phrase: "dem Tier", template: "Ich glaube ___ nicht.", translation: "No le creo al animal." },
    Genitiv: { phrase: "des Tieres", template: "Der Name ___ ist bekannt.", translation: "El nombre del animal es conocido." },
  }},
  { id: "c137", noun: "Vogel", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Vogel", template: "___ lacht viel.", translation: "El pájaro se ríe mucho." },
    Akkusativ: { phrase: "den Vogel", template: "Wir besuchen ___ morgen.", translation: "Visitamos al pájaro mañana." },
    Dativ: { phrase: "dem Vogel", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo al pájaro." },
    Genitiv: { phrase: "des Vogels", template: "Die Idee ___ ist gut.", translation: "La idea del pájaro es buena." },
  }},
  { id: "c138", noun: "Fisch", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Fisch", template: "___ ist sehr klug.", translation: "El pez es muy inteligente." },
    Akkusativ: { phrase: "den Fisch", template: "Ich rufe ___ an.", translation: "Llamo al pez." },
    Dativ: { phrase: "dem Fisch", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al pez." },
    Genitiv: { phrase: "des Fisches", template: "Das Auto ___ ist neu.", translation: "El coche del pez es nuevo." },
  }},
  { id: "c139", noun: "Stein", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Stein", template: "___ ist wirklich interessant.", translation: "La piedra es realmente interesante." },
    Akkusativ: { phrase: "den Stein", template: "Er nimmt ___ mit.", translation: "Él se lleva la piedra." },
    Dativ: { phrase: "dem Stein", template: "Es ist in ___.", translation: "Está dentro de la piedra." },
    Genitiv: { phrase: "des Steins", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la piedra es inusual." },
  }},
  { id: "c140", noun: "Erde", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Erde", template: "___ ist kaputt.", translation: "La tierra ya no funciona." },
    Akkusativ: { phrase: "die Erde", template: "Ich sehe ___ dort.", translation: "Veo la tierra allí." },
    Dativ: { phrase: "der Erde", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto a la tierra." },
    Genitiv: { phrase: "der Erde", template: "Der Wert ___ ist gestiegen.", translation: "El valor de la tierra ha subido." },
  }},
  { id: "c141", noun: "Luft", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Luft", template: "___ ist sehr nützlich.", translation: "El aire es muy útil." },
    Akkusativ: { phrase: "die Luft", template: "Ich kaufe ___.", translation: "Compro el aire." },
    Dativ: { phrase: "der Luft", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al aire." },
    Genitiv: { phrase: "der Luft", template: "Die Farbe ___ ist schön.", translation: "El color del aire es bonito." },
  }},
  { id: "c142", noun: "Mädchen", gender: "das", category: "personas", cases: {
    Nominativ: { phrase: "das Mädchen", template: "___ kommt gleich.", translation: "La niña viene enseguida." },
    Akkusativ: { phrase: "das Mädchen", template: "Ich kenne ___ gut.", translation: "Conozco bien a la niña." },
    Dativ: { phrase: "dem Mädchen", template: "Ich glaube ___ nicht.", translation: "No le creo a la niña." },
    Genitiv: { phrase: "des Mädchens", template: "Der Name ___ ist bekannt.", translation: "El nombre de la niña es conocido." },
  }},
  { id: "c143", noun: "Onkel", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Onkel", template: "___ lacht viel.", translation: "El tío se ríe mucho." },
    Akkusativ: { phrase: "den Onkel", template: "Wir besuchen ___ morgen.", translation: "Visitamos al tío mañana." },
    Dativ: { phrase: "dem Onkel", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo al tío." },
    Genitiv: { phrase: "des Onkels", template: "Die Idee ___ ist gut.", translation: "La idea del tío es buena." },
  }},
  { id: "c144", noun: "Tante", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Tante", template: "___ ist sehr klug.", translation: "La tía es muy inteligente." },
    Akkusativ: { phrase: "die Tante", template: "Ich rufe ___ an.", translation: "Llamo a la tía." },
    Dativ: { phrase: "der Tante", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje a la tía." },
    Genitiv: { phrase: "der Tante", template: "Das Auto ___ ist neu.", translation: "El coche de la tía es nuevo." },
  }},
  { id: "c145", noun: "Großvater", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Großvater", template: "___ wohnt hier.", translation: "El abuelo vive aquí." },
    Akkusativ: { phrase: "den Großvater", template: "Ich treffe ___ später.", translation: "Me encuentro con el abuelo más tarde." },
    Dativ: { phrase: "dem Großvater", template: "Das gehört ___.", translation: "Eso le pertenece al abuelo." },
    Genitiv: { phrase: "des Großvaters", template: "Die Geschichte ___ ist lang.", translation: "La historia del abuelo es larga." },
  }},
  { id: "c146", noun: "Großmutter", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Großmutter", template: "___ arbeitet viel.", translation: "La abuela trabaja mucho." },
    Akkusativ: { phrase: "die Großmutter", template: "Sie mag ___ sehr.", translation: "Ella quiere mucho a la abuela." },
    Dativ: { phrase: "der Großmutter", template: "Ich danke ___ herzlich.", translation: "Le doy las gracias a la abuela de corazón." },
    Genitiv: { phrase: "der Großmutter", template: "Die Stimme ___ ist laut.", translation: "La voz de la abuela es fuerte." },
  }},
  { id: "c147", noun: "Bruder", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Bruder", template: "___ ist sehr nett.", translation: "El hermano es muy amable." },
    Akkusativ: { phrase: "den Bruder", template: "Ich sehe ___ oft.", translation: "Veo al hermano a menudo." },
    Dativ: { phrase: "dem Bruder", template: "Ich helfe ___ gern.", translation: "Ayudo al hermano con gusto." },
    Genitiv: { phrase: "des Bruders", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa del hermano." },
  }},
  { id: "c148", noun: "Schwester", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Schwester", template: "___ kommt gleich.", translation: "La hermana viene enseguida." },
    Akkusativ: { phrase: "die Schwester", template: "Ich kenne ___ gut.", translation: "Conozco bien a la hermana." },
    Dativ: { phrase: "der Schwester", template: "Ich glaube ___ nicht.", translation: "No le creo a la hermana." },
    Genitiv: { phrase: "der Schwester", template: "Der Name ___ ist bekannt.", translation: "El nombre de la hermana es conocido." },
  }},
  { id: "c149", noun: "Sohn", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Sohn", template: "___ lacht viel.", translation: "El hijo se ríe mucho." },
    Akkusativ: { phrase: "den Sohn", template: "Wir besuchen ___ morgen.", translation: "Visitamos al hijo mañana." },
    Dativ: { phrase: "dem Sohn", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo al hijo." },
    Genitiv: { phrase: "des Sohnes", template: "Die Idee ___ ist gut.", translation: "La idea del hijo es buena." },
  }},
  { id: "c150", noun: "Tochter", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Tochter", template: "___ ist sehr klug.", translation: "La hija es muy inteligente." },
    Akkusativ: { phrase: "die Tochter", template: "Ich rufe ___ an.", translation: "Llamo a la hija." },
    Dativ: { phrase: "der Tochter", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje a la hija." },
    Genitiv: { phrase: "der Tochter", template: "Das Auto ___ ist neu.", translation: "El coche de la hija es nuevo." },
  }},
  { id: "c151", noun: "Baby", gender: "das", category: "personas", cases: {
    Nominativ: { phrase: "das Baby", template: "___ wohnt hier.", translation: "El bebé vive aquí." },
    Akkusativ: { phrase: "das Baby", template: "Ich treffe ___ später.", translation: "Me encuentro con el bebé más tarde." },
    Dativ: { phrase: "dem Baby", template: "Das gehört ___.", translation: "Eso le pertenece al bebé." },
    Genitiv: { phrase: "des Babys", template: "Die Geschichte ___ ist lang.", translation: "La historia del bebé es larga." },
  }},
  { id: "c152", noun: "Arzt", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Arzt", template: "___ arbeitet viel.", translation: "El médico trabaja mucho." },
    Akkusativ: { phrase: "den Arzt", template: "Sie mag ___ sehr.", translation: "Ella quiere mucho al médico." },
    Dativ: { phrase: "dem Arzt", template: "Ich danke ___ herzlich.", translation: "Le doy las gracias al médico de corazón." },
    Genitiv: { phrase: "des Arztes", template: "Die Stimme ___ ist laut.", translation: "La voz del médico es fuerte." },
  }},
  { id: "c153", noun: "Ärztin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Ärztin", template: "___ ist sehr nett.", translation: "La médica es muy amable." },
    Akkusativ: { phrase: "die Ärztin", template: "Ich sehe ___ oft.", translation: "Veo a la médica a menudo." },
    Dativ: { phrase: "der Ärztin", template: "Ich helfe ___ gern.", translation: "Ayudo a la médica con gusto." },
    Genitiv: { phrase: "der Ärztin", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa de la médica." },
  }},
  { id: "c154", noun: "Verkäufer", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Verkäufer", template: "___ kommt gleich.", translation: "El vendedor viene enseguida." },
    Akkusativ: { phrase: "den Verkäufer", template: "Ich kenne ___ gut.", translation: "Conozco bien al vendedor." },
    Dativ: { phrase: "dem Verkäufer", template: "Ich glaube ___ nicht.", translation: "No le creo al vendedor." },
    Genitiv: { phrase: "des Verkäufers", template: "Der Name ___ ist bekannt.", translation: "El nombre del vendedor es conocido." },
  }},
  { id: "c155", noun: "Verkäuferin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Verkäuferin", template: "___ lacht viel.", translation: "La vendedora se ríe mucho." },
    Akkusativ: { phrase: "die Verkäuferin", template: "Wir besuchen ___ morgen.", translation: "Visitamos a la vendedora mañana." },
    Dativ: { phrase: "der Verkäuferin", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo a la vendedora." },
    Genitiv: { phrase: "der Verkäuferin", template: "Die Idee ___ ist gut.", translation: "La idea de la vendedora es buena." },
  }},
  { id: "c156", noun: "Schauspieler", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Schauspieler", template: "___ ist sehr klug.", translation: "El actor es muy inteligente." },
    Akkusativ: { phrase: "den Schauspieler", template: "Ich rufe ___ an.", translation: "Llamo al actor." },
    Dativ: { phrase: "dem Schauspieler", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al actor." },
    Genitiv: { phrase: "des Schauspielers", template: "Das Auto ___ ist neu.", translation: "El coche del actor es nuevo." },
  }},
  { id: "c157", noun: "Sänger", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Sänger", template: "___ wohnt hier.", translation: "El cantante vive aquí." },
    Akkusativ: { phrase: "den Sänger", template: "Ich treffe ___ später.", translation: "Me encuentro con el cantante más tarde." },
    Dativ: { phrase: "dem Sänger", template: "Das gehört ___.", translation: "Eso le pertenece al cantante." },
    Genitiv: { phrase: "des Sängers", template: "Die Geschichte ___ ist lang.", translation: "La historia del cantante es larga." },
  }},
  { id: "c158", noun: "Sängerin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Sängerin", template: "___ arbeitet viel.", translation: "La cantante trabaja mucho." },
    Akkusativ: { phrase: "die Sängerin", template: "Sie mag ___ sehr.", translation: "Ella quiere mucho a la cantante." },
    Dativ: { phrase: "der Sängerin", template: "Ich danke ___ herzlich.", translation: "Le doy las gracias a la cantante de corazón." },
    Genitiv: { phrase: "der Sängerin", template: "Die Stimme ___ ist laut.", translation: "La voz de la cantante es fuerte." },
  }},
  { id: "c159", noun: "Künstler", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Künstler", template: "___ ist sehr nett.", translation: "El artista es muy amable." },
    Akkusativ: { phrase: "den Künstler", template: "Ich sehe ___ oft.", translation: "Veo al artista a menudo." },
    Dativ: { phrase: "dem Künstler", template: "Ich helfe ___ gern.", translation: "Ayudo al artista con gusto." },
    Genitiv: { phrase: "des Künstlers", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa del artista." },
  }},
  { id: "c160", noun: "Künstlerin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Künstlerin", template: "___ kommt gleich.", translation: "La artista viene enseguida." },
    Akkusativ: { phrase: "die Künstlerin", template: "Ich kenne ___ gut.", translation: "Conozco bien a la artista." },
    Dativ: { phrase: "der Künstlerin", template: "Ich glaube ___ nicht.", translation: "No le creo a la artista." },
    Genitiv: { phrase: "der Künstlerin", template: "Der Name ___ ist bekannt.", translation: "El nombre de la artista es conocido." },
  }},
  { id: "c161", noun: "Nachbarin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Nachbarin", template: "___ lacht viel.", translation: "La vecina se ríe mucho." },
    Akkusativ: { phrase: "die Nachbarin", template: "Wir besuchen ___ morgen.", translation: "Visitamos a la vecina mañana." },
    Dativ: { phrase: "der Nachbarin", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo a la vecina." },
    Genitiv: { phrase: "der Nachbarin", template: "Die Idee ___ ist gut.", translation: "La idea de la vecina es buena." },
  }},
  { id: "c162", noun: "Maus", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Maus", template: "___ ist sehr klug.", translation: "El ratón es muy inteligente." },
    Akkusativ: { phrase: "die Maus", template: "Ich rufe ___ an.", translation: "Llamo al ratón." },
    Dativ: { phrase: "der Maus", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al ratón." },
    Genitiv: { phrase: "der Maus", template: "Das Auto ___ ist neu.", translation: "El coche del ratón es nuevo." },
  }},
  { id: "c163", noun: "Pferd", gender: "das", category: "personas", cases: {
    Nominativ: { phrase: "das Pferd", template: "___ wohnt hier.", translation: "El caballo vive aquí." },
    Akkusativ: { phrase: "das Pferd", template: "Ich treffe ___ später.", translation: "Me encuentro con el caballo más tarde." },
    Dativ: { phrase: "dem Pferd", template: "Das gehört ___.", translation: "Eso le pertenece al caballo." },
    Genitiv: { phrase: "des Pferdes", template: "Die Geschichte ___ ist lang.", translation: "La historia del caballo es larga." },
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

.gda-root{ background:#1C2128; color:#F2EFE6; font-family:'Inter',sans-serif; border-radius:18px; padding:32px 22px; max-width:680px; margin:0 auto; position:relative; isolation:isolate;
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
.gda-auth-password-wrap{ position:relative; display:flex; align-items:center; }
.gda-auth-password-wrap .gda-auth-input{ padding-right:40px; }
.gda-auth-eye-btn{ position:absolute; right:8px; background:none; border:none; cursor:pointer; color:#8a8576; display:flex; align-items:center; padding:4px; }
.gda-auth-eye-btn:hover{ color:#1C2128; }
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
            <span className="gda-category-badge" style={{ "--cat-color": CATEGORIES[currentCaseWord.category].color }}>
              {CATEGORIES[currentCaseWord.category].label}
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
