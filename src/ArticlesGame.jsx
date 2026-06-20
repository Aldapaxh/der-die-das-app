import { useState, useMemo, useEffect } from "react";
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
    Akkusativ: { phrase: "die Lampe", template: "Ich putze ___ jeden Tag.", translation: "Limpio la lámpara todos los días." },
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
    Nominativ: { phrase: "die Küche", template: "___ ist sehr modern.", translation: "La cocina es muy actual." },
    Akkusativ: { phrase: "die Küche", template: "Wir besuchen ___ heute.", translation: "Visitamos la cocina hoy." },
    Dativ: { phrase: "der Küche", template: "Wir treffen uns vor ___.", translation: "Nos encontramos delante de la cocina." },
    Genitiv: { phrase: "der Küche", template: "Der Eingang ___ ist groß.", translation: "La entrada de la cocina es grande." },
  }},
  { id: "c28", noun: "Bad", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Bad", template: "___ ist gut besucht.", translation: "El baño recibe muchas visitas." },
    Akkusativ: { phrase: "das Bad", template: "Ich suche ___ seit Stunden.", translation: "Busco el baño desde hace horas." },
    Dativ: { phrase: "dem Bad", template: "Ich arbeite in ___.", translation: "Trabajo en el baño." },
    Genitiv: { phrase: "des Bades", template: "Die Adresse ___ ist bekannt.", translation: "La dirección del baño es conocida." },
  }},
  { id: "c29", noun: "Wohnung", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Wohnung", template: "___ liegt im Zentrum.", translation: "El piso está en el centro." },
    Akkusativ: { phrase: "die Wohnung", template: "Wir finden ___ schnell.", translation: "Encontramos el piso rápido." },
    Dativ: { phrase: "der Wohnung", template: "Der Bus hält vor ___.", translation: "El autobús se detiene delante del piso." },
    Genitiv: { phrase: "der Wohnung", template: "Das Dach ___ ist neu.", translation: "El tejado del piso es nuevo." },
  }},
  { id: "c30", noun: "Schrank", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Schrank", template: "___ ist sehr nützlich.", translation: "El armario es muy útil." },
    Akkusativ: { phrase: "den Schrank", template: "Ich kaufe ___.", translation: "Compro el armario." },
    Dativ: { phrase: "dem Schrank", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al armario." },
    Genitiv: { phrase: "des Schranks", template: "Die Farbe ___ ist schön.", translation: "El color del armario es bonito." },
  }},
  { id: "c31", noun: "Sofa", gender: "das", category: "casa", cases: {
    Nominativ: { phrase: "das Sofa", template: "___ ist hier.", translation: "El sofá está aquí." },
    Akkusativ: { phrase: "das Sofa", template: "Ich brauche ___ dringend.", translation: "Necesito el sofá urgentemente." },
    Dativ: { phrase: "dem Sofa", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo del sofá." },
    Genitiv: { phrase: "des Sofas", template: "Der Preis ___ ist hoch.", translation: "El precio del sofá es alto." },
  }},
  { id: "c32", noun: "Spiegel", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Spiegel", template: "___ funktioniert gut.", translation: "El espejo funciona bien." },
    Akkusativ: { phrase: "den Spiegel", template: "Wir benutzen ___ oft.", translation: "Usamos el espejo a menudo." },
    Dativ: { phrase: "dem Spiegel", template: "Wir stehen vor ___.", translation: "Estamos delante del espejo." },
    Genitiv: { phrase: "des Spiegels", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño del espejo es impresionante." },
  }},
  { id: "c33", noun: "Teppich", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Teppich", template: "___ ist sehr groß.", translation: "La alfombra es muy grande." },
    Akkusativ: { phrase: "den Teppich", template: "Ich putze ___ jeden Tag.", translation: "Limpio la alfombra todos los días." },
    Dativ: { phrase: "dem Teppich", template: "Das Buch liegt auf ___.", translation: "El libro está encima de la alfombra." },
    Genitiv: { phrase: "des Teppichs", template: "Das Gewicht ___ ist enorm.", translation: "El peso de la alfombra es enorme." },
  }},
  { id: "c34", noun: "Wand", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Wand", template: "___ ist wirklich interessant.", translation: "La pared es realmente interesante." },
    Akkusativ: { phrase: "die Wand", template: "Er nimmt ___ mit.", translation: "Él se lleva la pared." },
    Dativ: { phrase: "der Wand", template: "Es ist in ___.", translation: "Está dentro de la pared." },
    Genitiv: { phrase: "der Wand", template: "Die Form ___ ist ungewöhnlich.", translation: "La forma de la pared es inusual." },
  }},
  { id: "c35", noun: "Boden", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Boden", template: "___ ist kaputt.", translation: "El suelo ya no funciona." },
    Akkusativ: { phrase: "den Boden", template: "Ich sehe ___ dort.", translation: "Veo el suelo allí." },
    Dativ: { phrase: "dem Boden", template: "Der Schlüssel liegt bei ___.", translation: "La llave está junto al suelo." },
    Genitiv: { phrase: "des Bodens", template: "Der Wert ___ ist gestiegen.", translation: "El valor del suelo ha subido." },
  }},
  { id: "c36", noun: "Garage", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Garage", template: "___ wurde vor kurzem renoviert.", translation: "El garaje se renovó hace poco." },
    Akkusativ: { phrase: "die Garage", template: "Touristen besuchen ___ gern.", translation: "Los turistas visitan el garaje con gusto." },
    Dativ: { phrase: "der Garage", template: "Wir wohnen neben ___.", translation: "Vivimos junto al garaje." },
    Genitiv: { phrase: "der Garage", template: "Die Geschichte ___ ist interessant.", translation: "La historia del garaje es interesante." },
  }},
  { id: "c37", noun: "Garten", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Garten", template: "___ ist immer voll.", translation: "El jardín siempre tiene mucha gente." },
    Akkusativ: { phrase: "den Garten", template: "Ich erreiche ___ zu Fuß.", translation: "Llego al jardín a pie." },
    Dativ: { phrase: "dem Garten", template: "Es passiert in ___.", translation: "Sucede en el jardín." },
    Genitiv: { phrase: "des Gartens", template: "Der Name ___ ist alt.", translation: "El nombre del jardín es antiguo." },
  }},
  { id: "c38", noun: "Treppe", gender: "die", category: "casa", cases: {
    Nominativ: { phrase: "die Treppe", template: "___ ist sehr nützlich.", translation: "La escalera es muy útil." },
    Akkusativ: { phrase: "die Treppe", template: "Ich kaufe ___.", translation: "Compro la escalera." },
    Dativ: { phrase: "der Treppe", template: "Ich sitze neben ___.", translation: "Estoy sentado junto a la escalera." },
    Genitiv: { phrase: "der Treppe", template: "Die Farbe ___ ist schön.", translation: "El color de la escalera es bonito." },
  }},
  { id: "c39", noun: "Keller", gender: "der", category: "casa", cases: {
    Nominativ: { phrase: "der Keller", template: "___ ist sehr bekannt.", translation: "El sótano es muy popular." },
    Akkusativ: { phrase: "den Keller", template: "Wir sehen ___ von hier.", translation: "Vemos el sótano desde aquí." },
    Dativ: { phrase: "dem Keller", template: "Ich warte vor ___.", translation: "Espero delante del sótano." },
    Genitiv: { phrase: "des Kellers", template: "Die Lage ___ ist perfekt.", translation: "La ubicación del sótano es perfecta." },
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
    Akkusativ: { phrase: "das Kissen", template: "Ich putze ___ jeden Tag.", translation: "Limpio el cojín todos los días." },
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
    Nominativ: { phrase: "der Apfel", template: "___ schmeckt sehr gut.", translation: "La manzana sabe muy bien." },
    Akkusativ: { phrase: "den Apfel", template: "Ich esse ___ gern.", translation: "Como la manzana con gusto." },
    Dativ: { phrase: "dem Apfel", template: "Ich rieche gern an ___.", translation: "Me gusta el olor de la manzana." },
    Genitiv: { phrase: "des Apfels", template: "Der Geschmack ___ ist einzigartig.", translation: "El sabor de la manzana es único." },
  }},
  { id: "c46", noun: "Banane", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Banane", template: "___ ist frisch.", translation: "El plátano se conserva bien." },
    Akkusativ: { phrase: "die Banane", template: "Wir bestellen ___ oft.", translation: "Pedimos el plátano a menudo." },
    Dativ: { phrase: "der Banane", template: "Wir sprechen begeistert von ___.", translation: "Hablamos del plátano con entusiasmo." },
    Genitiv: { phrase: "der Banane", template: "Die Farbe ___ ist appetitlich.", translation: "El color del plátano llama la atención." },
  }},
  { id: "c47", noun: "Brot", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Brot", template: "___ ist noch warm.", translation: "El pan todavía está caliente." },
    Akkusativ: { phrase: "das Brot", template: "Sie kocht ___ jeden Tag.", translation: "Ella cocina el pan todos los días." },
    Dativ: { phrase: "dem Brot", template: "Das passt gut zu ___.", translation: "Eso combina bien con el pan." },
    Genitiv: { phrase: "des Brotes", template: "Der Preis ___ ist günstig.", translation: "El precio del pan es razonable." },
  }},
  { id: "c48", noun: "Milch", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Milch", template: "___ riecht sehr lecker.", translation: "La leche huele muy bien." },
    Akkusativ: { phrase: "die Milch", template: "Ich probiere ___ zum ersten Mal.", translation: "Pruebo la leche por primera vez." },
    Dativ: { phrase: "der Milch", template: "Ich füge etwas Salz zu ___ hinzu.", translation: "Le añado un poco de sal a la leche." },
    Genitiv: { phrase: "der Milch", template: "Die Qualität ___ ist hoch.", translation: "La calidad de la leche es alta." },
  }},
  { id: "c49", noun: "Käse", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Käse", template: "___ ist sehr gesund.", translation: "El queso es muy saludable." },
    Akkusativ: { phrase: "den Käse", template: "Wir genießen ___ langsam.", translation: "Disfrutamos del queso despacio." },
    Dativ: { phrase: "dem Käse", template: "Neben ___ liegt eine Gabel.", translation: "Junto al queso hay un tenedor." },
    Genitiv: { phrase: "des Käses", template: "Der Duft ___ ist verlockend.", translation: "El aroma del queso es tentador." },
  }},
  { id: "c50", noun: "Ei", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Ei", template: "___ ist schon kalt.", translation: "El huevo ya se ha enfriado." },
    Akkusativ: { phrase: "das Ei", template: "Wir teilen ___ zu zweit.", translation: "Compartimos el huevo entre dos." },
    Dativ: { phrase: "dem Ei", template: "Das Rezept gehört zu ___.", translation: "La receta pertenece al huevo." },
    Genitiv: { phrase: "des Eies", template: "Die Herkunft ___ ist bekannt.", translation: "El origen del huevo es conocido." },
  }},
  { id: "c51", noun: "Kuchen", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Kuchen", template: "___ schmeckt sehr gut.", translation: "El pastel sabe muy bien." },
    Akkusativ: { phrase: "den Kuchen", template: "Ich esse ___ gern.", translation: "Como el pastel con gusto." },
    Dativ: { phrase: "dem Kuchen", template: "Ich rieche gern an ___.", translation: "Me gusta el olor del pastel." },
    Genitiv: { phrase: "des Kuchens", template: "Der Geschmack ___ ist einzigartig.", translation: "El sabor del pastel es único." },
  }},
  { id: "c52", noun: "Suppe", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Suppe", template: "___ ist frisch.", translation: "La sopa se conserva bien." },
    Akkusativ: { phrase: "die Suppe", template: "Wir bestellen ___ oft.", translation: "Pedimos la sopa a menudo." },
    Dativ: { phrase: "der Suppe", template: "Wir sprechen begeistert von ___.", translation: "Hablamos de la sopa con entusiasmo." },
    Genitiv: { phrase: "der Suppe", template: "Die Farbe ___ ist appetitlich.", translation: "El color de la sopa llama la atención." },
  }},
  { id: "c53", noun: "Fleisch", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Fleisch", template: "___ ist noch warm.", translation: "La carne todavía está caliente." },
    Akkusativ: { phrase: "das Fleisch", template: "Sie kocht ___ jeden Tag.", translation: "Ella cocina la carne todos los días." },
    Dativ: { phrase: "dem Fleisch", template: "Das passt gut zu ___.", translation: "Eso combina bien con la carne." },
    Genitiv: { phrase: "des Fleisches", template: "Der Preis ___ ist günstig.", translation: "El precio de la carne es razonable." },
  }},
  { id: "c54", noun: "Wein", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Wein", template: "___ riecht sehr lecker.", translation: "El vino huele muy bien." },
    Akkusativ: { phrase: "den Wein", template: "Ich probiere ___ zum ersten Mal.", translation: "Pruebo el vino por primera vez." },
    Dativ: { phrase: "dem Wein", template: "Ich füge etwas Salz zu ___ hinzu.", translation: "Le añado un poco de sal al vino." },
    Genitiv: { phrase: "des Weines", template: "Die Qualität ___ ist hoch.", translation: "La calidad del vino es alta." },
  }},
  { id: "c55", noun: "Reis", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Reis", template: "___ ist sehr gesund.", translation: "El arroz es muy saludable." },
    Akkusativ: { phrase: "den Reis", template: "Wir genießen ___ langsam.", translation: "Disfrutamos del arroz despacio." },
    Dativ: { phrase: "dem Reis", template: "Neben ___ liegt eine Gabel.", translation: "Junto al arroz hay un tenedor." },
    Genitiv: { phrase: "des Reises", template: "Der Duft ___ ist verlockend.", translation: "El aroma del arroz es tentador." },
  }},
  { id: "c56", noun: "Zucker", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Zucker", template: "___ ist schon kalt.", translation: "El azúcar ya se ha enfriado." },
    Akkusativ: { phrase: "den Zucker", template: "Wir teilen ___ zu zweit.", translation: "Compartimos el azúcar entre dos." },
    Dativ: { phrase: "dem Zucker", template: "Das Rezept gehört zu ___.", translation: "La receta pertenece al azúcar." },
    Genitiv: { phrase: "des Zuckers", template: "Die Herkunft ___ ist bekannt.", translation: "El origen del azúcar es conocido." },
  }},
  { id: "c57", noun: "Salz", gender: "das", category: "comida", cases: {
    Nominativ: { phrase: "das Salz", template: "___ schmeckt sehr gut.", translation: "La sal sabe muy bien." },
    Akkusativ: { phrase: "das Salz", template: "Ich esse ___ gern.", translation: "Como la sal con gusto." },
    Dativ: { phrase: "dem Salz", template: "Ich rieche gern an ___.", translation: "Me gusta el olor de la sal." },
    Genitiv: { phrase: "des Salzes", template: "Der Geschmack ___ ist einzigartig.", translation: "El sabor de la sal es único." },
  }},
  { id: "c58", noun: "Pfeffer", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Pfeffer", template: "___ ist frisch.", translation: "La pimienta se conserva bien." },
    Akkusativ: { phrase: "den Pfeffer", template: "Wir bestellen ___ oft.", translation: "Pedimos la pimienta a menudo." },
    Dativ: { phrase: "dem Pfeffer", template: "Wir sprechen begeistert von ___.", translation: "Hablamos de la pimienta con entusiasmo." },
    Genitiv: { phrase: "des Pfeffers", template: "Die Farbe ___ ist appetitlich.", translation: "El color de la pimienta llama la atención." },
  }},
  { id: "c59", noun: "Tomate", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Tomate", template: "___ ist noch warm.", translation: "El tomate todavía está caliente." },
    Akkusativ: { phrase: "die Tomate", template: "Sie kocht ___ jeden Tag.", translation: "Ella cocina el tomate todos los días." },
    Dativ: { phrase: "der Tomate", template: "Das passt gut zu ___.", translation: "Eso combina bien con el tomate." },
    Genitiv: { phrase: "der Tomate", template: "Der Preis ___ ist günstig.", translation: "El precio del tomate es razonable." },
  }},
  { id: "c60", noun: "Kartoffel", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Kartoffel", template: "___ riecht sehr lecker.", translation: "La patata huele muy bien." },
    Akkusativ: { phrase: "die Kartoffel", template: "Ich probiere ___ zum ersten Mal.", translation: "Pruebo la patata por primera vez." },
    Dativ: { phrase: "der Kartoffel", template: "Ich füge etwas Salz zu ___ hinzu.", translation: "Le añado un poco de sal a la patata." },
    Genitiv: { phrase: "der Kartoffel", template: "Die Qualität ___ ist hoch.", translation: "La calidad de la patata es alta." },
  }},
  { id: "c61", noun: "Zwiebel", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Zwiebel", template: "___ ist sehr gesund.", translation: "La cebolla es muy saludable." },
    Akkusativ: { phrase: "die Zwiebel", template: "Wir genießen ___ langsam.", translation: "Disfrutamos de la cebolla despacio." },
    Dativ: { phrase: "der Zwiebel", template: "Neben ___ liegt eine Gabel.", translation: "Junto a la cebolla hay un tenedor." },
    Genitiv: { phrase: "der Zwiebel", template: "Der Duft ___ ist verlockend.", translation: "El aroma de la cebolla es tentador." },
  }},
  { id: "c62", noun: "Schokolade", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Schokolade", template: "___ ist schon kalt.", translation: "El chocolate ya se ha enfriado." },
    Akkusativ: { phrase: "die Schokolade", template: "Wir teilen ___ zu zweit.", translation: "Compartimos el chocolate entre dos." },
    Dativ: { phrase: "der Schokolade", template: "Das Rezept gehört zu ___.", translation: "La receta pertenece al chocolate." },
    Genitiv: { phrase: "der Schokolade", template: "Die Herkunft ___ ist bekannt.", translation: "El origen del chocolate es conocido." },
  }},
  { id: "c63", noun: "Kaffee", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Kaffee", template: "___ schmeckt sehr gut.", translation: "El café sabe muy bien." },
    Akkusativ: { phrase: "den Kaffee", template: "Ich esse ___ gern.", translation: "Como el café con gusto." },
    Dativ: { phrase: "dem Kaffee", template: "Ich rieche gern an ___.", translation: "Me gusta el olor del café." },
    Genitiv: { phrase: "des Kaffees", template: "Der Geschmack ___ ist einzigartig.", translation: "El sabor del café es único." },
  }},
  { id: "c64", noun: "Tee", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Tee", template: "___ ist frisch.", translation: "El té se conserva bien." },
    Akkusativ: { phrase: "den Tee", template: "Wir bestellen ___ oft.", translation: "Pedimos el té a menudo." },
    Dativ: { phrase: "dem Tee", template: "Wir sprechen begeistert von ___.", translation: "Hablamos del té con entusiasmo." },
    Genitiv: { phrase: "des Tees", template: "Die Farbe ___ ist appetitlich.", translation: "El color del té llama la atención." },
  }},
  { id: "c65", noun: "Saft", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Saft", template: "___ ist noch warm.", translation: "El zumo todavía está caliente." },
    Akkusativ: { phrase: "den Saft", template: "Sie kocht ___ jeden Tag.", translation: "Ella cocina el zumo todos los días." },
    Dativ: { phrase: "dem Saft", template: "Das passt gut zu ___.", translation: "Eso combina bien con el zumo." },
    Genitiv: { phrase: "des Saftes", template: "Der Preis ___ ist günstig.", translation: "El precio del zumo es razonable." },
  }},
  { id: "c66", noun: "Honig", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Honig", template: "___ riecht sehr lecker.", translation: "La miel huele muy bien." },
    Akkusativ: { phrase: "den Honig", template: "Ich probiere ___ zum ersten Mal.", translation: "Pruebo la miel por primera vez." },
    Dativ: { phrase: "dem Honig", template: "Ich füge etwas Salz zu ___ hinzu.", translation: "Le añado un poco de sal a la miel." },
    Genitiv: { phrase: "des Honigs", template: "Die Qualität ___ ist hoch.", translation: "La calidad de la miel es alta." },
  }},
  { id: "c67", noun: "Joghurt", gender: "der", category: "comida", cases: {
    Nominativ: { phrase: "der Joghurt", template: "___ ist sehr gesund.", translation: "El yogur es muy saludable." },
    Akkusativ: { phrase: "den Joghurt", template: "Wir genießen ___ langsam.", translation: "Disfrutamos del yogur despacio." },
    Dativ: { phrase: "dem Joghurt", template: "Neben ___ liegt eine Gabel.", translation: "Junto al yogur hay un tenedor." },
    Genitiv: { phrase: "des Joghurts", template: "Der Duft ___ ist verlockend.", translation: "El aroma del yogur es tentador." },
  }},
  { id: "c68", noun: "Nudel", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Nudel", template: "___ ist schon kalt.", translation: "La pasta ya se ha enfriado." },
    Akkusativ: { phrase: "die Nudel", template: "Wir teilen ___ zu zweit.", translation: "Compartimos la pasta entre dos." },
    Dativ: { phrase: "der Nudel", template: "Das Rezept gehört zu ___.", translation: "La receta pertenece a la pasta." },
    Genitiv: { phrase: "der Nudel", template: "Die Herkunft ___ ist bekannt.", translation: "El origen de la pasta es conocido." },
  }},
  { id: "c69", noun: "Pizza", gender: "die", category: "comida", cases: {
    Nominativ: { phrase: "die Pizza", template: "___ schmeckt sehr gut.", translation: "La pizza sabe muy bien." },
    Akkusativ: { phrase: "die Pizza", template: "Ich esse ___ gern.", translation: "Como la pizza con gusto." },
    Dativ: { phrase: "der Pizza", template: "Ich rieche gern an ___.", translation: "Me gusta el olor de la pizza." },
    Genitiv: { phrase: "der Pizza", template: "Der Geschmack ___ ist einzigartig.", translation: "El sabor de la pizza es único." },
  }},
  { id: "c70", noun: "Straße", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Straße", template: "___ ist sehr modern.", translation: "La calle es muy actual." },
    Akkusativ: { phrase: "die Straße", template: "Wir besuchen ___ heute.", translation: "Visitamos la calle hoy." },
    Dativ: { phrase: "der Straße", template: "Wir treffen uns vor ___.", translation: "Nos encontramos delante de la calle." },
    Genitiv: { phrase: "der Straße", template: "Der Eingang ___ ist groß.", translation: "La entrada de la calle es grande." },
  }},
  { id: "c71", noun: "Bahnhof", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Bahnhof", template: "___ ist gut besucht.", translation: "La estación recibe muchas visitas." },
    Akkusativ: { phrase: "den Bahnhof", template: "Ich suche ___ seit Stunden.", translation: "Busco la estación desde hace horas." },
    Dativ: { phrase: "dem Bahnhof", template: "Ich arbeite in ___.", translation: "Trabajo en la estación." },
    Genitiv: { phrase: "des Bahnhofs", template: "Die Adresse ___ ist bekannt.", translation: "La dirección de la estación es conocida." },
  }},
  { id: "c72", noun: "Geschäft", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Geschäft", template: "___ liegt im Zentrum.", translation: "La tienda está en el centro." },
    Akkusativ: { phrase: "das Geschäft", template: "Wir finden ___ schnell.", translation: "Encontramos la tienda rápido." },
    Dativ: { phrase: "dem Geschäft", template: "Der Bus hält vor ___.", translation: "El autobús se detiene delante de la tienda." },
    Genitiv: { phrase: "des Geschäfts", template: "Das Dach ___ ist neu.", translation: "El tejado de la tienda es nuevo." },
  }},
  { id: "c73", noun: "Kirche", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Kirche", template: "___ wurde vor kurzem renoviert.", translation: "La iglesia se renovó hace poco." },
    Akkusativ: { phrase: "die Kirche", template: "Touristen besuchen ___ gern.", translation: "Los turistas visitan la iglesia con gusto." },
    Dativ: { phrase: "der Kirche", template: "Wir wohnen neben ___.", translation: "Vivimos junto a la iglesia." },
    Genitiv: { phrase: "der Kirche", template: "Die Geschichte ___ ist interessant.", translation: "La historia de la iglesia es interesante." },
  }},
  { id: "c74", noun: "Park", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Park", template: "___ ist immer voll.", translation: "El parque siempre tiene mucha gente." },
    Akkusativ: { phrase: "den Park", template: "Ich erreiche ___ zu Fuß.", translation: "Llego al parque a pie." },
    Dativ: { phrase: "dem Park", template: "Es passiert in ___.", translation: "Sucede en el parque." },
    Genitiv: { phrase: "des Parks", template: "Der Name ___ ist alt.", translation: "El nombre del parque es antiguo." },
  }},
  { id: "c75", noun: "Restaurant", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Restaurant", template: "___ ist sehr bekannt.", translation: "El restaurante es muy popular." },
    Akkusativ: { phrase: "das Restaurant", template: "Wir sehen ___ von hier.", translation: "Vemos el restaurante desde aquí." },
    Dativ: { phrase: "dem Restaurant", template: "Ich warte vor ___.", translation: "Espero delante del restaurante." },
    Genitiv: { phrase: "des Restaurants", template: "Die Lage ___ ist perfekt.", translation: "La ubicación del restaurante es perfecta." },
  }},
  { id: "c76", noun: "Bank", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Bank", template: "___ ist sehr modern.", translation: "El banco es muy actual." },
    Akkusativ: { phrase: "die Bank", template: "Wir besuchen ___ heute.", translation: "Visitamos el banco hoy." },
    Dativ: { phrase: "der Bank", template: "Wir treffen uns vor ___.", translation: "Nos encontramos delante del banco." },
    Genitiv: { phrase: "der Bank", template: "Der Eingang ___ ist groß.", translation: "La entrada del banco es grande." },
  }},
  { id: "c77", noun: "Markt", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Markt", template: "___ ist gut besucht.", translation: "El mercado recibe muchas visitas." },
    Akkusativ: { phrase: "den Markt", template: "Ich suche ___ seit Stunden.", translation: "Busco el mercado desde hace horas." },
    Dativ: { phrase: "dem Markt", template: "Ich arbeite in ___.", translation: "Trabajo en el mercado." },
    Genitiv: { phrase: "des Marktes", template: "Die Adresse ___ ist bekannt.", translation: "La dirección del mercado es conocida." },
  }},
  { id: "c78", noun: "Krankenhaus", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Krankenhaus", template: "___ liegt im Zentrum.", translation: "El hospital está en el centro." },
    Akkusativ: { phrase: "das Krankenhaus", template: "Wir finden ___ schnell.", translation: "Encontramos el hospital rápido." },
    Dativ: { phrase: "dem Krankenhaus", template: "Der Bus hält vor ___.", translation: "El autobús se detiene delante del hospital." },
    Genitiv: { phrase: "des Krankenhauses", template: "Das Dach ___ ist neu.", translation: "El tejado del hospital es nuevo." },
  }},
  { id: "c79", noun: "Brücke", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Brücke", template: "___ wurde vor kurzem renoviert.", translation: "El puente se renovó hace poco." },
    Akkusativ: { phrase: "die Brücke", template: "Touristen besuchen ___ gern.", translation: "Los turistas visitan el puente con gusto." },
    Dativ: { phrase: "der Brücke", template: "Wir wohnen neben ___.", translation: "Vivimos junto al puente." },
    Genitiv: { phrase: "der Brücke", template: "Die Geschichte ___ ist interessant.", translation: "La historia del puente es interesante." },
  }},
  { id: "c80", noun: "Platz", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Platz", template: "___ ist immer voll.", translation: "La plaza siempre tiene mucha gente." },
    Akkusativ: { phrase: "den Platz", template: "Ich erreiche ___ zu Fuß.", translation: "Llego a la plaza a pie." },
    Dativ: { phrase: "dem Platz", template: "Es passiert in ___.", translation: "Sucede en la plaza." },
    Genitiv: { phrase: "des Platzes", template: "Der Name ___ ist alt.", translation: "El nombre de la plaza es antiguo." },
  }},
  { id: "c81", noun: "Rathaus", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Rathaus", template: "___ ist sehr bekannt.", translation: "El ayuntamiento es muy popular." },
    Akkusativ: { phrase: "das Rathaus", template: "Wir sehen ___ von hier.", translation: "Vemos el ayuntamiento desde aquí." },
    Dativ: { phrase: "dem Rathaus", template: "Ich warte vor ___.", translation: "Espero delante del ayuntamiento." },
    Genitiv: { phrase: "des Rathauses", template: "Die Lage ___ ist perfekt.", translation: "La ubicación del ayuntamiento es perfecta." },
  }},
  { id: "c82", noun: "Museum", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Museum", template: "___ ist sehr modern.", translation: "El museo es muy actual." },
    Akkusativ: { phrase: "das Museum", template: "Wir besuchen ___ heute.", translation: "Visitamos el museo hoy." },
    Dativ: { phrase: "dem Museum", template: "Wir treffen uns vor ___.", translation: "Nos encontramos delante del museo." },
    Genitiv: { phrase: "des Museums", template: "Der Eingang ___ ist groß.", translation: "La entrada del museo es grande." },
  }},
  { id: "c83", noun: "Theater", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Theater", template: "___ ist gut besucht.", translation: "El teatro recibe muchas visitas." },
    Akkusativ: { phrase: "das Theater", template: "Ich suche ___ seit Stunden.", translation: "Busco el teatro desde hace horas." },
    Dativ: { phrase: "dem Theater", template: "Ich arbeite in ___.", translation: "Trabajo en el teatro." },
    Genitiv: { phrase: "des Theaters", template: "Die Adresse ___ ist bekannt.", translation: "La dirección del teatro es conocida." },
  }},
  { id: "c84", noun: "Bibliothek", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Bibliothek", template: "___ liegt im Zentrum.", translation: "La biblioteca está en el centro." },
    Akkusativ: { phrase: "die Bibliothek", template: "Wir finden ___ schnell.", translation: "Encontramos la biblioteca rápido." },
    Dativ: { phrase: "der Bibliothek", template: "Der Bus hält vor ___.", translation: "El autobús se detiene delante de la biblioteca." },
    Genitiv: { phrase: "der Bibliothek", template: "Das Dach ___ ist neu.", translation: "El tejado de la biblioteca es nuevo." },
  }},
  { id: "c85", noun: "Apotheke", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Apotheke", template: "___ wurde vor kurzem renoviert.", translation: "La farmacia se renovó hace poco." },
    Akkusativ: { phrase: "die Apotheke", template: "Touristen besuchen ___ gern.", translation: "Los turistas visitan la farmacia con gusto." },
    Dativ: { phrase: "der Apotheke", template: "Wir wohnen neben ___.", translation: "Vivimos junto a la farmacia." },
    Genitiv: { phrase: "der Apotheke", template: "Die Geschichte ___ ist interessant.", translation: "La historia de la farmacia es interesante." },
  }},
  { id: "c86", noun: "Hotel", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Hotel", template: "___ ist immer voll.", translation: "El hotel siempre tiene mucha gente." },
    Akkusativ: { phrase: "das Hotel", template: "Ich erreiche ___ zu Fuß.", translation: "Llego al hotel a pie." },
    Dativ: { phrase: "dem Hotel", template: "Es passiert in ___.", translation: "Sucede en el hotel." },
    Genitiv: { phrase: "des Hotels", template: "Der Name ___ ist alt.", translation: "El nombre del hotel es antiguo." },
  }},
  { id: "c87", noun: "Flughafen", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Flughafen", template: "___ ist sehr bekannt.", translation: "El aeropuerto es muy popular." },
    Akkusativ: { phrase: "den Flughafen", template: "Wir sehen ___ von hier.", translation: "Vemos el aeropuerto desde aquí." },
    Dativ: { phrase: "dem Flughafen", template: "Ich warte vor ___.", translation: "Espero delante del aeropuerto." },
    Genitiv: { phrase: "des Flughafens", template: "Die Lage ___ ist perfekt.", translation: "La ubicación del aeropuerto es perfecta." },
  }},
  { id: "c88", noun: "Hafen", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Hafen", template: "___ ist sehr modern.", translation: "El puerto es muy actual." },
    Akkusativ: { phrase: "den Hafen", template: "Wir besuchen ___ heute.", translation: "Visitamos el puerto hoy." },
    Dativ: { phrase: "dem Hafen", template: "Wir treffen uns vor ___.", translation: "Nos encontramos delante del puerto." },
    Genitiv: { phrase: "des Hafens", template: "Der Eingang ___ ist groß.", translation: "La entrada del puerto es grande." },
  }},
  { id: "c89", noun: "Turm", gender: "der", category: "ciudad", cases: {
    Nominativ: { phrase: "der Turm", template: "___ ist gut besucht.", translation: "La torre recibe muchas visitas." },
    Akkusativ: { phrase: "den Turm", template: "Ich suche ___ seit Stunden.", translation: "Busco la torre desde hace horas." },
    Dativ: { phrase: "dem Turm", template: "Ich arbeite in ___.", translation: "Trabajo en la torre." },
    Genitiv: { phrase: "des Turms", template: "Die Adresse ___ ist bekannt.", translation: "La dirección de la torre es conocida." },
  }},
  { id: "c90", noun: "Denkmal", gender: "das", category: "ciudad", cases: {
    Nominativ: { phrase: "das Denkmal", template: "___ liegt im Zentrum.", translation: "El monumento está en el centro." },
    Akkusativ: { phrase: "das Denkmal", template: "Wir finden ___ schnell.", translation: "Encontramos el monumento rápido." },
    Dativ: { phrase: "dem Denkmal", template: "Der Bus hält vor ___.", translation: "El autobús se detiene delante del monumento." },
    Genitiv: { phrase: "des Denkmals", template: "Das Dach ___ ist neu.", translation: "El tejado del monumento es nuevo." },
  }},
  { id: "c91", noun: "Polizei", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Polizei", template: "___ ist sehr wichtig.", translation: "La policía es muy importante." },
    Akkusativ: { phrase: "die Polizei", template: "Ich plane ___ sorgfältig.", translation: "Planeo la policía con cuidado." },
    Dativ: { phrase: "der Polizei", template: "Wir sprechen von ___.", translation: "Hablamos de la policía." },
    Genitiv: { phrase: "der Polizei", template: "Das Ergebnis ___ ist positiv.", translation: "El resultado de la policía es positivo." },
  }},
  { id: "c92", noun: "Feuerwehr", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Feuerwehr", template: "___ dauert sehr lange.", translation: "Los bomberos dura mucho tiempo." },
    Akkusativ: { phrase: "die Feuerwehr", template: "Wir besprechen ___ morgen.", translation: "Hablamos de los bomberos mañana." },
    Dativ: { phrase: "der Feuerwehr", template: "Das hängt von ___ ab.", translation: "Eso depende de los bomberos." },
    Genitiv: { phrase: "der Feuerwehr", template: "Der Zweck ___ ist klar.", translation: "El propósito de los bomberos está claro." },
  }},
  { id: "c93", noun: "Tankstelle", gender: "die", category: "ciudad", cases: {
    Nominativ: { phrase: "die Tankstelle", template: "___ wurde vor kurzem renoviert.", translation: "La gasolinera se renovó hace poco." },
    Akkusativ: { phrase: "die Tankstelle", template: "Touristen besuchen ___ gern.", translation: "Los turistas visitan la gasolinera con gusto." },
    Dativ: { phrase: "der Tankstelle", template: "Wir wohnen neben ___.", translation: "Vivimos junto a la gasolinera." },
    Genitiv: { phrase: "der Tankstelle", template: "Die Geschichte ___ ist interessant.", translation: "La historia de la gasolinera es interesante." },
  }},
  { id: "c94", noun: "Chef", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Chef", template: "___ ist sehr nett.", translation: "El jefe es muy amable." },
    Akkusativ: { phrase: "den Chef", template: "Ich sehe ___ oft.", translation: "Veo al jefe a menudo." },
    Dativ: { phrase: "dem Chef", template: "Ich helfe ___ gern.", translation: "Ayudo al jefe con gusto." },
    Genitiv: { phrase: "des Chefs", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa del jefe." },
  }},
  { id: "c95", noun: "Arbeit", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Arbeit", template: "___ beginnt morgen.", translation: "El trabajo empieza mañana." },
    Akkusativ: { phrase: "die Arbeit", template: "Ich erledige ___ heute noch.", translation: "Termino el trabajo hoy mismo." },
    Dativ: { phrase: "der Arbeit", template: "Ich bin mit ___ zufrieden.", translation: "Estoy satisfecho con el trabajo." },
    Genitiv: { phrase: "der Arbeit", template: "Die Bedeutung ___ ist groß.", translation: "La importancia del trabajo es grande." },
  }},
  { id: "c96", noun: "Büro", gender: "das", category: "trabajo", cases: {
    Nominativ: { phrase: "das Büro", template: "___ ist immer voll.", translation: "La oficina siempre tiene mucha gente." },
    Akkusativ: { phrase: "das Büro", template: "Ich erreiche ___ zu Fuß.", translation: "Llego a la oficina a pie." },
    Dativ: { phrase: "dem Büro", template: "Es passiert in ___.", translation: "Sucede en la oficina." },
    Genitiv: { phrase: "des Büros", template: "Der Name ___ ist alt.", translation: "El nombre de la oficina es antiguo." },
  }},
  { id: "c97", noun: "Computer", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Computer", template: "___ ist sehr nützlich.", translation: "El ordenador es muy útil." },
    Akkusativ: { phrase: "den Computer", template: "Ich kaufe ___.", translation: "Compro el ordenador." },
    Dativ: { phrase: "dem Computer", template: "Ich sitze neben ___.", translation: "Estoy sentado junto al ordenador." },
    Genitiv: { phrase: "des Computers", template: "Die Farbe ___ ist schön.", translation: "El color del ordenador es bonito." },
  }},
  { id: "c98", noun: "Besprechung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Besprechung", template: "___ ist kompliziert.", translation: "La reunión resulta difícil." },
    Akkusativ: { phrase: "die Besprechung", template: "Sie organisiert ___ allein.", translation: "Ella organiza la reunión sola." },
    Dativ: { phrase: "der Besprechung", template: "Nach ___ folgt eine Pause.", translation: "Después de la reunión hay un descanso." },
    Genitiv: { phrase: "der Besprechung", template: "Der Erfolg ___ ist sicher.", translation: "El éxito de la reunión es seguro." },
  }},
  { id: "c99", noun: "Gehalt", gender: "das", category: "trabajo", cases: {
    Nominativ: { phrase: "das Gehalt", template: "___ läuft gut.", translation: "El sueldo va bien." },
    Akkusativ: { phrase: "das Gehalt", template: "Wir brauchen ___ dringend.", translation: "Necesitamos el sueldo urgentemente." },
    Dativ: { phrase: "dem Gehalt", template: "Ich helfe bei ___.", translation: "Ayudo con el sueldo." },
    Genitiv: { phrase: "des Gehalts", template: "Die Dauer ___ ist kurz.", translation: "La duración del sueldo es corta." },
  }},
  { id: "c100", noun: "Firma", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Firma", template: "___ ist sehr bekannt.", translation: "La empresa es muy popular." },
    Akkusativ: { phrase: "die Firma", template: "Wir sehen ___ von hier.", translation: "Vemos la empresa desde aquí." },
    Dativ: { phrase: "der Firma", template: "Ich warte vor ___.", translation: "Espero delante de la empresa." },
    Genitiv: { phrase: "der Firma", template: "Die Lage ___ ist perfekt.", translation: "La ubicación de la empresa es perfecta." },
  }},
  { id: "c101", noun: "Projekt", gender: "das", category: "trabajo", cases: {
    Nominativ: { phrase: "das Projekt", template: "___ ist schon vorbei.", translation: "El proyecto ya ha terminado." },
    Akkusativ: { phrase: "das Projekt", template: "Ich verstehe ___ nicht ganz.", translation: "No entiendo el proyecto del todo." },
    Dativ: { phrase: "dem Projekt", template: "Wir beginnen mit ___.", translation: "Empezamos con el proyecto." },
    Genitiv: { phrase: "des Projekts", template: "Der Inhalt ___ ist wichtig.", translation: "El contenido del proyecto es importante." },
  }},
  { id: "c102", noun: "Urlaub", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Urlaub", template: "___ ist sehr wichtig.", translation: "Las vacaciones es muy importante." },
    Akkusativ: { phrase: "den Urlaub", template: "Ich plane ___ sorgfältig.", translation: "Planeo las vacaciones con cuidado." },
    Dativ: { phrase: "dem Urlaub", template: "Wir sprechen von ___.", translation: "Hablamos de las vacaciones." },
    Genitiv: { phrase: "des Urlaubs", template: "Das Ergebnis ___ ist positiv.", translation: "El resultado de las vacaciones es positivo." },
  }},
  { id: "c103", noun: "Beruf", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Beruf", template: "___ dauert sehr lange.", translation: "La profesión dura mucho tiempo." },
    Akkusativ: { phrase: "den Beruf", template: "Wir besprechen ___ morgen.", translation: "Hablamos de la profesión mañana." },
    Dativ: { phrase: "dem Beruf", template: "Das hängt von ___ ab.", translation: "Eso depende de la profesión." },
    Genitiv: { phrase: "des Berufs", template: "Der Zweck ___ ist klar.", translation: "El propósito de la profesión está claro." },
  }},
  { id: "c104", noun: "Termin", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Termin", template: "___ beginnt morgen.", translation: "La cita empieza mañana." },
    Akkusativ: { phrase: "den Termin", template: "Ich erledige ___ heute noch.", translation: "Termino la cita hoy mismo." },
    Dativ: { phrase: "dem Termin", template: "Ich bin mit ___ zufrieden.", translation: "Estoy satisfecho con la cita." },
    Genitiv: { phrase: "des Termins", template: "Die Bedeutung ___ ist groß.", translation: "La importancia de la cita es grande." },
  }},
  { id: "c105", noun: "Vertrag", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Vertrag", template: "___ ist kompliziert.", translation: "El contrato resulta difícil." },
    Akkusativ: { phrase: "den Vertrag", template: "Sie organisiert ___ allein.", translation: "Ella organiza el contrato sola." },
    Dativ: { phrase: "dem Vertrag", template: "Nach ___ folgt eine Pause.", translation: "Después del contrato hay un descanso." },
    Genitiv: { phrase: "des Vertrags", template: "Der Erfolg ___ ist sicher.", translation: "El éxito del contrato es seguro." },
  }},
  { id: "c106", noun: "Mitarbeiter", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Mitarbeiter", template: "___ kommt gleich.", translation: "El empleado viene enseguida." },
    Akkusativ: { phrase: "den Mitarbeiter", template: "Ich kenne ___ gut.", translation: "Conozco bien al empleado." },
    Dativ: { phrase: "dem Mitarbeiter", template: "Ich glaube ___ nicht.", translation: "No le creo al empleado." },
    Genitiv: { phrase: "des Mitarbeiters", template: "Der Name ___ ist bekannt.", translation: "El nombre del empleado es conocido." },
  }},
  { id: "c107", noun: "Fabrik", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Fabrik", template: "___ ist sehr modern.", translation: "La fábrica es muy actual." },
    Akkusativ: { phrase: "die Fabrik", template: "Wir besuchen ___ heute.", translation: "Visitamos la fábrica hoy." },
    Dativ: { phrase: "der Fabrik", template: "Wir treffen uns vor ___.", translation: "Nos encontramos delante de la fábrica." },
    Genitiv: { phrase: "der Fabrik", template: "Der Eingang ___ ist groß.", translation: "La entrada de la fábrica es grande." },
  }},
  { id: "c108", noun: "Maschine", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Maschine", template: "___ ist hier.", translation: "La máquina está aquí." },
    Akkusativ: { phrase: "die Maschine", template: "Ich brauche ___ dringend.", translation: "Necesito la máquina urgentemente." },
    Dativ: { phrase: "der Maschine", template: "Die Katze schläft unter ___.", translation: "El gato duerme debajo de la máquina." },
    Genitiv: { phrase: "der Maschine", template: "Der Preis ___ ist hoch.", translation: "El precio de la máquina es alto." },
  }},
  { id: "c109", noun: "Rechnung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Rechnung", template: "___ läuft gut.", translation: "La factura va bien." },
    Akkusativ: { phrase: "die Rechnung", template: "Wir brauchen ___ dringend.", translation: "Necesitamos la factura urgentemente." },
    Dativ: { phrase: "der Rechnung", template: "Ich helfe bei ___.", translation: "Ayudo con la factura." },
    Genitiv: { phrase: "der Rechnung", template: "Die Dauer ___ ist kurz.", translation: "La duración de la factura es corta." },
  }},
  { id: "c110", noun: "Bewerbung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Bewerbung", template: "___ ist schon vorbei.", translation: "La solicitud ya ha terminado." },
    Akkusativ: { phrase: "die Bewerbung", template: "Ich verstehe ___ nicht ganz.", translation: "No entiendo la solicitud del todo." },
    Dativ: { phrase: "der Bewerbung", template: "Wir beginnen mit ___.", translation: "Empezamos con la solicitud." },
    Genitiv: { phrase: "der Bewerbung", template: "Der Inhalt ___ ist wichtig.", translation: "El contenido de la solicitud es importante." },
  }},
  { id: "c111", noun: "Konferenz", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Konferenz", template: "___ ist sehr wichtig.", translation: "La conferencia es muy importante." },
    Akkusativ: { phrase: "die Konferenz", template: "Ich plane ___ sorgfältig.", translation: "Planeo la conferencia con cuidado." },
    Dativ: { phrase: "der Konferenz", template: "Wir sprechen von ___.", translation: "Hablamos de la conferencia." },
    Genitiv: { phrase: "der Konferenz", template: "Das Ergebnis ___ ist positiv.", translation: "El resultado de la conferencia es positivo." },
  }},
  { id: "c112", noun: "Abteilung", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Abteilung", template: "___ ist gut besucht.", translation: "El departamento recibe muchas visitas." },
    Akkusativ: { phrase: "die Abteilung", template: "Ich suche ___ seit Stunden.", translation: "Busco el departamento desde hace horas." },
    Dativ: { phrase: "der Abteilung", template: "Ich arbeite in ___.", translation: "Trabajo en el departamento." },
    Genitiv: { phrase: "der Abteilung", template: "Die Adresse ___ ist bekannt.", translation: "La dirección del departamento es conocida." },
  }},
  { id: "c113", noun: "Lohn", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Lohn", template: "___ dauert sehr lange.", translation: "El salario dura mucho tiempo." },
    Akkusativ: { phrase: "den Lohn", template: "Wir besprechen ___ morgen.", translation: "Hablamos del salario mañana." },
    Dativ: { phrase: "dem Lohn", template: "Das hängt von ___ ab.", translation: "Eso depende del salario." },
    Genitiv: { phrase: "des Lohns", template: "Der Zweck ___ ist klar.", translation: "El propósito del salario está claro." },
  }},
  { id: "c114", noun: "Aufgabe", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Aufgabe", template: "___ beginnt morgen.", translation: "La tarea empieza mañana." },
    Akkusativ: { phrase: "die Aufgabe", template: "Ich erledige ___ heute noch.", translation: "Termino la tarea hoy mismo." },
    Dativ: { phrase: "der Aufgabe", template: "Ich bin mit ___ zufrieden.", translation: "Estoy satisfecho con la tarea." },
    Genitiv: { phrase: "der Aufgabe", template: "Die Bedeutung ___ ist groß.", translation: "La importancia de la tarea es grande." },
  }},
  { id: "c115", noun: "Pause", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Pause", template: "___ ist kompliziert.", translation: "La pausa resulta difícil." },
    Akkusativ: { phrase: "die Pause", template: "Sie organisiert ___ allein.", translation: "Ella organiza la pausa sola." },
    Dativ: { phrase: "der Pause", template: "Nach ___ folgt eine Pause.", translation: "Después de la pausa hay un descanso." },
    Genitiv: { phrase: "der Pause", template: "Der Erfolg ___ ist sicher.", translation: "El éxito de la pausa es seguro." },
  }},
  { id: "c116", noun: "Erfolg", gender: "der", category: "trabajo", cases: {
    Nominativ: { phrase: "der Erfolg", template: "___ läuft gut.", translation: "El éxito va bien." },
    Akkusativ: { phrase: "den Erfolg", template: "Wir brauchen ___ dringend.", translation: "Necesitamos el éxito urgentemente." },
    Dativ: { phrase: "dem Erfolg", template: "Ich helfe bei ___.", translation: "Ayudo con el éxito." },
    Genitiv: { phrase: "des Erfolgs", template: "Die Dauer ___ ist kurz.", translation: "La duración del éxito es corta." },
  }},
  { id: "c117", noun: "Chefin", gender: "die", category: "trabajo", cases: {
    Nominativ: { phrase: "die Chefin", template: "___ lacht viel.", translation: "La jefa se ríe mucho." },
    Akkusativ: { phrase: "die Chefin", template: "Wir besuchen ___ morgen.", translation: "Visitamos a la jefa mañana." },
    Dativ: { phrase: "der Chefin", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo a la jefa." },
    Genitiv: { phrase: "der Chefin", template: "Die Idee ___ ist gut.", translation: "La idea de la jefa es buena." },
  }},
  { id: "c118", noun: "Baum", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Baum", template: "___ ist sehr schön.", translation: "El árbol resulta impresionante." },
    Akkusativ: { phrase: "den Baum", template: "Wir bewundern ___.", translation: "Admiramos el árbol." },
    Dativ: { phrase: "dem Baum", template: "Wir stehen vor ___.", translation: "Estamos delante del árbol." },
    Genitiv: { phrase: "des Baumes", template: "Die Schönheit ___ ist bekannt.", translation: "La belleza del árbol es conocida." },
  }},
  { id: "c119", noun: "Blume", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Blume", template: "___ ist riesig.", translation: "La flor es enorme." },
    Akkusativ: { phrase: "die Blume", template: "Ich fotografiere ___ gern.", translation: "Fotografío la flor con gusto." },
    Dativ: { phrase: "der Blume", template: "Das Dorf liegt unter ___.", translation: "El pueblo está bajo la flor." },
    Genitiv: { phrase: "der Blume", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la flor es impresionante." },
  }},
  { id: "c120", noun: "Berg", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Berg", template: "___ verändert sich langsam.", translation: "La montaña cambia despacio." },
    Akkusativ: { phrase: "den Berg", template: "Man sieht ___ von hier.", translation: "Se ve la montaña desde aquí." },
    Dativ: { phrase: "dem Berg", template: "Wir campen neben ___.", translation: "Acampamos junto a la montaña." },
    Genitiv: { phrase: "des Berges", template: "Die Farbe ___ ist intensiv.", translation: "El color de la montaña es intenso." },
  }},
  { id: "c121", noun: "Sonne", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Sonne", template: "___ ist weit entfernt.", translation: "El sol está muy lejos." },
    Akkusativ: { phrase: "die Sonne", template: "Wir erforschen ___ genau.", translation: "Exploramos el sol a fondo." },
    Dativ: { phrase: "der Sonne", template: "Der Nebel hängt über ___.", translation: "La niebla cubre el sol." },
    Genitiv: { phrase: "der Sonne", template: "Der Anblick ___ ist atemberaubend.", translation: "La vista del sol es espectacular." },
  }},
  { id: "c122", noun: "Wald", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Wald", template: "___ wirkt sehr ruhig.", translation: "El bosque parece muy apacible." },
    Akkusativ: { phrase: "den Wald", template: "Ich beobachte ___ lange.", translation: "Observo el bosque durante mucho tiempo." },
    Dativ: { phrase: "dem Wald", template: "Die Straße führt zu ___.", translation: "La carretera lleva hasta el bosque." },
    Genitiv: { phrase: "des Waldes", template: "Die Ruhe ___ gefällt mir.", translation: "La calma del bosque me gusta." },
  }},
  { id: "c123", noun: "Fluss", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Fluss", template: "___ ist beeindruckend.", translation: "El río es impresionante." },
    Akkusativ: { phrase: "den Fluss", template: "Touristen besuchen ___ oft.", translation: "Los turistas visitan el río a menudo." },
    Dativ: { phrase: "dem Fluss", template: "Nahe ___ gibt es ein Dorf.", translation: "Cerca del río hay un pueblo." },
    Genitiv: { phrase: "des Flusses", template: "Die Kraft ___ ist enorm.", translation: "La fuerza del río es enorme." },
  }},
  { id: "c124", noun: "See", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der See", template: "___ ist sehr schön.", translation: "El lago resulta impresionante." },
    Akkusativ: { phrase: "den See", template: "Wir bewundern ___.", translation: "Admiramos el lago." },
    Dativ: { phrase: "dem See", template: "Wir stehen vor ___.", translation: "Estamos delante del lago." },
    Genitiv: { phrase: "des Sees", template: "Die Schönheit ___ ist bekannt.", translation: "La belleza del lago es conocida." },
  }},
  { id: "c125", noun: "Mond", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Mond", template: "___ ist riesig.", translation: "La luna es enorme." },
    Akkusativ: { phrase: "den Mond", template: "Ich fotografiere ___ gern.", translation: "Fotografío la luna con gusto." },
    Dativ: { phrase: "dem Mond", template: "Das Dorf liegt unter ___.", translation: "El pueblo está bajo la luna." },
    Genitiv: { phrase: "des Mondes", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la luna es impresionante." },
  }},
  { id: "c126", noun: "Stern", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Stern", template: "___ verändert sich langsam.", translation: "La estrella cambia despacio." },
    Akkusativ: { phrase: "den Stern", template: "Man sieht ___ von hier.", translation: "Se ve la estrella desde aquí." },
    Dativ: { phrase: "dem Stern", template: "Wir campen neben ___.", translation: "Acampamos junto a la estrella." },
    Genitiv: { phrase: "des Sterns", template: "Die Farbe ___ ist intensiv.", translation: "El color de la estrella es intenso." },
  }},
  { id: "c127", noun: "Himmel", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Himmel", template: "___ ist weit entfernt.", translation: "El cielo está muy lejos." },
    Akkusativ: { phrase: "den Himmel", template: "Wir erforschen ___ genau.", translation: "Exploramos el cielo a fondo." },
    Dativ: { phrase: "dem Himmel", template: "Der Nebel hängt über ___.", translation: "La niebla cubre el cielo." },
    Genitiv: { phrase: "des Himmels", template: "Der Anblick ___ ist atemberaubend.", translation: "La vista del cielo es espectacular." },
  }},
  { id: "c128", noun: "Wind", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Wind", template: "___ wirkt sehr ruhig.", translation: "El viento parece muy apacible." },
    Akkusativ: { phrase: "den Wind", template: "Ich beobachte ___ lange.", translation: "Observo el viento durante mucho tiempo." },
    Dativ: { phrase: "dem Wind", template: "Die Straße führt zu ___.", translation: "La carretera lleva hasta el viento." },
    Genitiv: { phrase: "des Windes", template: "Die Ruhe ___ gefällt mir.", translation: "La calma del viento me gusta." },
  }},
  { id: "c129", noun: "Regen", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Regen", template: "___ ist beeindruckend.", translation: "La lluvia es impresionante." },
    Akkusativ: { phrase: "den Regen", template: "Touristen besuchen ___ oft.", translation: "Los turistas visitan la lluvia a menudo." },
    Dativ: { phrase: "dem Regen", template: "Nahe ___ gibt es ein Dorf.", translation: "Cerca de la lluvia hay un pueblo." },
    Genitiv: { phrase: "des Regens", template: "Die Kraft ___ ist enorm.", translation: "La fuerza de la lluvia es enorme." },
  }},
  { id: "c130", noun: "Schnee", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Schnee", template: "___ ist sehr schön.", translation: "La nieve resulta impresionante." },
    Akkusativ: { phrase: "den Schnee", template: "Wir bewundern ___.", translation: "Admiramos la nieve." },
    Dativ: { phrase: "dem Schnee", template: "Wir stehen vor ___.", translation: "Estamos delante de la nieve." },
    Genitiv: { phrase: "des Schnees", template: "Die Schönheit ___ ist bekannt.", translation: "La belleza de la nieve es conocida." },
  }},
  { id: "c131", noun: "Wolke", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Wolke", template: "___ ist riesig.", translation: "La nube es enorme." },
    Akkusativ: { phrase: "die Wolke", template: "Ich fotografiere ___ gern.", translation: "Fotografío la nube con gusto." },
    Dativ: { phrase: "der Wolke", template: "Das Dorf liegt unter ___.", translation: "El pueblo está bajo la nube." },
    Genitiv: { phrase: "der Wolke", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la nube es impresionante." },
  }},
  { id: "c132", noun: "Wiese", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Wiese", template: "___ verändert sich langsam.", translation: "La pradera cambia despacio." },
    Akkusativ: { phrase: "die Wiese", template: "Man sieht ___ von hier.", translation: "Se ve la pradera desde aquí." },
    Dativ: { phrase: "der Wiese", template: "Wir campen neben ___.", translation: "Acampamos junto a la pradera." },
    Genitiv: { phrase: "der Wiese", template: "Die Farbe ___ ist intensiv.", translation: "El color de la pradera es intenso." },
  }},
  { id: "c133", noun: "Insel", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Insel", template: "___ ist weit entfernt.", translation: "La isla está muy lejos." },
    Akkusativ: { phrase: "die Insel", template: "Wir erforschen ___ genau.", translation: "Exploramos la isla a fondo." },
    Dativ: { phrase: "der Insel", template: "Der Nebel hängt über ___.", translation: "La niebla cubre la isla." },
    Genitiv: { phrase: "der Insel", template: "Der Anblick ___ ist atemberaubend.", translation: "La vista de la isla es espectacular." },
  }},
  { id: "c134", noun: "Wüste", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Wüste", template: "___ wirkt sehr ruhig.", translation: "El desierto parece muy apacible." },
    Akkusativ: { phrase: "die Wüste", template: "Ich beobachte ___ lange.", translation: "Observo el desierto durante mucho tiempo." },
    Dativ: { phrase: "der Wüste", template: "Die Straße führt zu ___.", translation: "La carretera lleva hasta el desierto." },
    Genitiv: { phrase: "der Wüste", template: "Die Ruhe ___ gefällt mir.", translation: "La calma del desierto me gusta." },
  }},
  { id: "c135", noun: "Strand", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Strand", template: "___ ist beeindruckend.", translation: "La playa es impresionante." },
    Akkusativ: { phrase: "den Strand", template: "Touristen besuchen ___ oft.", translation: "Los turistas visitan la playa a menudo." },
    Dativ: { phrase: "dem Strand", template: "Nahe ___ gibt es ein Dorf.", translation: "Cerca de la playa hay un pueblo." },
    Genitiv: { phrase: "des Strands", template: "Die Kraft ___ ist enorm.", translation: "La fuerza de la playa es enorme." },
  }},
  { id: "c136", noun: "Tier", gender: "das", category: "naturaleza", cases: {
    Nominativ: { phrase: "das Tier", template: "___ ist sehr klug.", translation: "El animal es muy inteligente." },
    Akkusativ: { phrase: "das Tier", template: "Ich rufe ___ an.", translation: "Llamo al animal." },
    Dativ: { phrase: "dem Tier", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al animal." },
    Genitiv: { phrase: "des Tieres", template: "Das Auto ___ ist neu.", translation: "El coche del animal es nuevo." },
  }},
  { id: "c137", noun: "Vogel", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Vogel", template: "___ wohnt hier.", translation: "El pájaro vive aquí." },
    Akkusativ: { phrase: "den Vogel", template: "Ich treffe ___ später.", translation: "Me encuentro con el pájaro más tarde." },
    Dativ: { phrase: "dem Vogel", template: "Das gehört ___.", translation: "Eso le pertenece al pájaro." },
    Genitiv: { phrase: "des Vogels", template: "Die Geschichte ___ ist lang.", translation: "La historia del pájaro es larga." },
  }},
  { id: "c138", noun: "Fisch", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Fisch", template: "___ arbeitet viel.", translation: "El pez trabaja mucho." },
    Akkusativ: { phrase: "den Fisch", template: "Sie mag ___ sehr.", translation: "Ella quiere mucho al pez." },
    Dativ: { phrase: "dem Fisch", template: "Ich danke ___ herzlich.", translation: "Le doy las gracias al pez de corazón." },
    Genitiv: { phrase: "des Fisches", template: "Die Stimme ___ ist laut.", translation: "La voz del pez es fuerte." },
  }},
  { id: "c139", noun: "Stein", gender: "der", category: "naturaleza", cases: {
    Nominativ: { phrase: "der Stein", template: "___ ist sehr schön.", translation: "La piedra resulta impresionante." },
    Akkusativ: { phrase: "den Stein", template: "Wir bewundern ___.", translation: "Admiramos la piedra." },
    Dativ: { phrase: "dem Stein", template: "Wir stehen vor ___.", translation: "Estamos delante de la piedra." },
    Genitiv: { phrase: "des Steins", template: "Die Schönheit ___ ist bekannt.", translation: "La belleza de la piedra es conocida." },
  }},
  { id: "c140", noun: "Erde", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Erde", template: "___ ist riesig.", translation: "La tierra es enorme." },
    Akkusativ: { phrase: "die Erde", template: "Ich fotografiere ___ gern.", translation: "Fotografío la tierra con gusto." },
    Dativ: { phrase: "der Erde", template: "Das Dorf liegt unter ___.", translation: "El pueblo está bajo la tierra." },
    Genitiv: { phrase: "der Erde", template: "Die Größe ___ ist beeindruckend.", translation: "El tamaño de la tierra es impresionante." },
  }},
  { id: "c141", noun: "Luft", gender: "die", category: "naturaleza", cases: {
    Nominativ: { phrase: "die Luft", template: "___ verändert sich langsam.", translation: "El aire cambia despacio." },
    Akkusativ: { phrase: "die Luft", template: "Man sieht ___ von hier.", translation: "Se ve el aire desde aquí." },
    Dativ: { phrase: "der Luft", template: "Wir campen neben ___.", translation: "Acampamos junto al aire." },
    Genitiv: { phrase: "der Luft", template: "Die Farbe ___ ist intensiv.", translation: "El color del aire es intenso." },
  }},
  { id: "c142", noun: "Mädchen", gender: "das", category: "personas", cases: {
    Nominativ: { phrase: "das Mädchen", template: "___ ist sehr nett.", translation: "La niña es muy amable." },
    Akkusativ: { phrase: "das Mädchen", template: "Ich sehe ___ oft.", translation: "Veo a la niña a menudo." },
    Dativ: { phrase: "dem Mädchen", template: "Ich helfe ___ gern.", translation: "Ayudo a la niña con gusto." },
    Genitiv: { phrase: "des Mädchens", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa de la niña." },
  }},
  { id: "c143", noun: "Onkel", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Onkel", template: "___ kommt gleich.", translation: "El tío viene enseguida." },
    Akkusativ: { phrase: "den Onkel", template: "Ich kenne ___ gut.", translation: "Conozco bien al tío." },
    Dativ: { phrase: "dem Onkel", template: "Ich glaube ___ nicht.", translation: "No le creo al tío." },
    Genitiv: { phrase: "des Onkels", template: "Der Name ___ ist bekannt.", translation: "El nombre del tío es conocido." },
  }},
  { id: "c144", noun: "Tante", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Tante", template: "___ lacht viel.", translation: "La tía se ríe mucho." },
    Akkusativ: { phrase: "die Tante", template: "Wir besuchen ___ morgen.", translation: "Visitamos a la tía mañana." },
    Dativ: { phrase: "der Tante", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo a la tía." },
    Genitiv: { phrase: "der Tante", template: "Die Idee ___ ist gut.", translation: "La idea de la tía es buena." },
  }},
  { id: "c145", noun: "Großvater", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Großvater", template: "___ ist sehr klug.", translation: "El abuelo es muy inteligente." },
    Akkusativ: { phrase: "den Großvater", template: "Ich rufe ___ an.", translation: "Llamo al abuelo." },
    Dativ: { phrase: "dem Großvater", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al abuelo." },
    Genitiv: { phrase: "des Großvaters", template: "Das Auto ___ ist neu.", translation: "El coche del abuelo es nuevo." },
  }},
  { id: "c146", noun: "Großmutter", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Großmutter", template: "___ wohnt hier.", translation: "La abuela vive aquí." },
    Akkusativ: { phrase: "die Großmutter", template: "Ich treffe ___ später.", translation: "Me encuentro con la abuela más tarde." },
    Dativ: { phrase: "der Großmutter", template: "Das gehört ___.", translation: "Eso le pertenece a la abuela." },
    Genitiv: { phrase: "der Großmutter", template: "Die Geschichte ___ ist lang.", translation: "La historia de la abuela es larga." },
  }},
  { id: "c147", noun: "Bruder", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Bruder", template: "___ arbeitet viel.", translation: "El hermano trabaja mucho." },
    Akkusativ: { phrase: "den Bruder", template: "Sie mag ___ sehr.", translation: "Ella quiere mucho al hermano." },
    Dativ: { phrase: "dem Bruder", template: "Ich danke ___ herzlich.", translation: "Le doy las gracias al hermano de corazón." },
    Genitiv: { phrase: "des Bruders", template: "Die Stimme ___ ist laut.", translation: "La voz del hermano es fuerte." },
  }},
  { id: "c148", noun: "Schwester", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Schwester", template: "___ ist sehr nett.", translation: "La hermana es muy amable." },
    Akkusativ: { phrase: "die Schwester", template: "Ich sehe ___ oft.", translation: "Veo a la hermana a menudo." },
    Dativ: { phrase: "der Schwester", template: "Ich helfe ___ gern.", translation: "Ayudo a la hermana con gusto." },
    Genitiv: { phrase: "der Schwester", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa de la hermana." },
  }},
  { id: "c149", noun: "Sohn", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Sohn", template: "___ kommt gleich.", translation: "El hijo viene enseguida." },
    Akkusativ: { phrase: "den Sohn", template: "Ich kenne ___ gut.", translation: "Conozco bien al hijo." },
    Dativ: { phrase: "dem Sohn", template: "Ich glaube ___ nicht.", translation: "No le creo al hijo." },
    Genitiv: { phrase: "des Sohnes", template: "Der Name ___ ist bekannt.", translation: "El nombre del hijo es conocido." },
  }},
  { id: "c150", noun: "Tochter", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Tochter", template: "___ lacht viel.", translation: "La hija se ríe mucho." },
    Akkusativ: { phrase: "die Tochter", template: "Wir besuchen ___ morgen.", translation: "Visitamos a la hija mañana." },
    Dativ: { phrase: "der Tochter", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo a la hija." },
    Genitiv: { phrase: "der Tochter", template: "Die Idee ___ ist gut.", translation: "La idea de la hija es buena." },
  }},
  { id: "c151", noun: "Baby", gender: "das", category: "personas", cases: {
    Nominativ: { phrase: "das Baby", template: "___ ist sehr klug.", translation: "El bebé es muy inteligente." },
    Akkusativ: { phrase: "das Baby", template: "Ich rufe ___ an.", translation: "Llamo al bebé." },
    Dativ: { phrase: "dem Baby", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al bebé." },
    Genitiv: { phrase: "des Babys", template: "Das Auto ___ ist neu.", translation: "El coche del bebé es nuevo." },
  }},
  { id: "c152", noun: "Arzt", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Arzt", template: "___ wohnt hier.", translation: "El médico vive aquí." },
    Akkusativ: { phrase: "den Arzt", template: "Ich treffe ___ später.", translation: "Me encuentro con el médico más tarde." },
    Dativ: { phrase: "dem Arzt", template: "Das gehört ___.", translation: "Eso le pertenece al médico." },
    Genitiv: { phrase: "des Arztes", template: "Die Geschichte ___ ist lang.", translation: "La historia del médico es larga." },
  }},
  { id: "c153", noun: "Ärztin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Ärztin", template: "___ arbeitet viel.", translation: "La médica trabaja mucho." },
    Akkusativ: { phrase: "die Ärztin", template: "Sie mag ___ sehr.", translation: "Ella quiere mucho a la médica." },
    Dativ: { phrase: "der Ärztin", template: "Ich danke ___ herzlich.", translation: "Le doy las gracias a la médica de corazón." },
    Genitiv: { phrase: "der Ärztin", template: "Die Stimme ___ ist laut.", translation: "La voz de la médica es fuerte." },
  }},
  { id: "c154", noun: "Verkäufer", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Verkäufer", template: "___ ist sehr nett.", translation: "El vendedor es muy amable." },
    Akkusativ: { phrase: "den Verkäufer", template: "Ich sehe ___ oft.", translation: "Veo al vendedor a menudo." },
    Dativ: { phrase: "dem Verkäufer", template: "Ich helfe ___ gern.", translation: "Ayudo al vendedor con gusto." },
    Genitiv: { phrase: "des Verkäufers", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa del vendedor." },
  }},
  { id: "c155", noun: "Verkäuferin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Verkäuferin", template: "___ kommt gleich.", translation: "La vendedora viene enseguida." },
    Akkusativ: { phrase: "die Verkäuferin", template: "Ich kenne ___ gut.", translation: "Conozco bien a la vendedora." },
    Dativ: { phrase: "der Verkäuferin", template: "Ich glaube ___ nicht.", translation: "No le creo a la vendedora." },
    Genitiv: { phrase: "der Verkäuferin", template: "Der Name ___ ist bekannt.", translation: "El nombre de la vendedora es conocido." },
  }},
  { id: "c156", noun: "Schauspieler", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Schauspieler", template: "___ lacht viel.", translation: "El actor se ríe mucho." },
    Akkusativ: { phrase: "den Schauspieler", template: "Wir besuchen ___ morgen.", translation: "Visitamos al actor mañana." },
    Dativ: { phrase: "dem Schauspieler", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo al actor." },
    Genitiv: { phrase: "des Schauspielers", template: "Die Idee ___ ist gut.", translation: "La idea del actor es buena." },
  }},
  { id: "c157", noun: "Sänger", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Sänger", template: "___ ist sehr klug.", translation: "El cantante es muy inteligente." },
    Akkusativ: { phrase: "den Sänger", template: "Ich rufe ___ an.", translation: "Llamo al cantante." },
    Dativ: { phrase: "dem Sänger", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al cantante." },
    Genitiv: { phrase: "des Sängers", template: "Das Auto ___ ist neu.", translation: "El coche del cantante es nuevo." },
  }},
  { id: "c158", noun: "Sängerin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Sängerin", template: "___ wohnt hier.", translation: "La cantante vive aquí." },
    Akkusativ: { phrase: "die Sängerin", template: "Ich treffe ___ später.", translation: "Me encuentro con la cantante más tarde." },
    Dativ: { phrase: "der Sängerin", template: "Das gehört ___.", translation: "Eso le pertenece a la cantante." },
    Genitiv: { phrase: "der Sängerin", template: "Die Geschichte ___ ist lang.", translation: "La historia de la cantante es larga." },
  }},
  { id: "c159", noun: "Künstler", gender: "der", category: "personas", cases: {
    Nominativ: { phrase: "der Künstler", template: "___ arbeitet viel.", translation: "El artista trabaja mucho." },
    Akkusativ: { phrase: "den Künstler", template: "Sie mag ___ sehr.", translation: "Ella quiere mucho al artista." },
    Dativ: { phrase: "dem Künstler", template: "Ich danke ___ herzlich.", translation: "Le doy las gracias al artista de corazón." },
    Genitiv: { phrase: "des Künstlers", template: "Die Stimme ___ ist laut.", translation: "La voz del artista es fuerte." },
  }},
  { id: "c160", noun: "Künstlerin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Künstlerin", template: "___ ist sehr nett.", translation: "La artista es muy amable." },
    Akkusativ: { phrase: "die Künstlerin", template: "Ich sehe ___ oft.", translation: "Veo a la artista a menudo." },
    Dativ: { phrase: "der Künstlerin", template: "Ich helfe ___ gern.", translation: "Ayudo a la artista con gusto." },
    Genitiv: { phrase: "der Künstlerin", template: "Das ist die Tasche ___.", translation: "Esa es la bolsa de la artista." },
  }},
  { id: "c161", noun: "Nachbarin", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Nachbarin", template: "___ kommt gleich.", translation: "La vecina viene enseguida." },
    Akkusativ: { phrase: "die Nachbarin", template: "Ich kenne ___ gut.", translation: "Conozco bien a la vecina." },
    Dativ: { phrase: "der Nachbarin", template: "Ich glaube ___ nicht.", translation: "No le creo a la vecina." },
    Genitiv: { phrase: "der Nachbarin", template: "Der Name ___ ist bekannt.", translation: "El nombre de la vecina es conocido." },
  }},
  { id: "c162", noun: "Maus", gender: "die", category: "personas", cases: {
    Nominativ: { phrase: "die Maus", template: "___ lacht viel.", translation: "El ratón se ríe mucho." },
    Akkusativ: { phrase: "die Maus", template: "Wir besuchen ___ morgen.", translation: "Visitamos al ratón mañana." },
    Dativ: { phrase: "der Maus", template: "Ich gebe ___ ein Geschenk.", translation: "Le doy un regalo al ratón." },
    Genitiv: { phrase: "der Maus", template: "Die Idee ___ ist gut.", translation: "La idea del ratón es buena." },
  }},
  { id: "c163", noun: "Pferd", gender: "das", category: "personas", cases: {
    Nominativ: { phrase: "das Pferd", template: "___ ist sehr klug.", translation: "El caballo es muy inteligente." },
    Akkusativ: { phrase: "das Pferd", template: "Ich rufe ___ an.", translation: "Llamo al caballo." },
    Dativ: { phrase: "dem Pferd", template: "Ich schreibe ___ eine Nachricht.", translation: "Le escribo un mensaje al caballo." },
    Genitiv: { phrase: "des Pferdes", template: "Das Auto ___ ist neu.", translation: "El coche del caballo es nuevo." },
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

function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // El bloqueador de anuncios o un fallo de carga no debe romper la app
    }
  }, []);

  return (
    <div className="gda-ad-wrap">
      <span className="gda-ad-label">Publicidad</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1984499334892529"
        data-ad-slot="7181561991"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
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
.gda-ad-wrap{ margin-top:24px; padding-top:16px; border-top:1px dashed rgba(255,255,255,0.12); text-align:center; min-height:90px; }
.gda-ad-label{ display:block; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#6b6760; margin-bottom:8px; }
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

          <AdBanner />
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
