import type { FeedbackRecommendationsQuiz } from "@/shared/entities/FeedbackRecommendations";
import type { Question } from "@/shared/entities/questions";
import type { QuizQuestion } from "@/shared/entities/quizQuestions";
import TriviaModal from "../organisms/TriviaModal/TriviaModal";

const TriviaPage = () => {
  const questions: QuizQuestion = {
    Microfrontends: [
      {
        id: 1,
        question: "¿Qué son los microfrontends?",
        options: [
          "Una técnica para dividir una aplicación frontend en múltiples partes independientes",
          "Un framework de JavaScript para construir interfaces de usuario",
          "Una estrategia de diseño para mejorar la experiencia de usuario",
          "Un patrón de seguridad para proteger aplicaciones web",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "¿Cuál es una de las principales ventajas de los microfrontends?",
        options: [
          "Permiten que equipos trabajen de forma independiente en diferentes partes de la aplicación",
          "Reducen la cantidad de código en el frontend",
          "Eliminan completamente la necesidad de un backend",
          "No requieren integración entre módulos",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "¿Qué patrón de arquitectura sigue la idea de los microfrontends?",
        options: ["Monolito", "Microservicios", "MVC (Model-View-Controller)", "Serverless"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "¿Cuál de las siguientes tecnologías se usa comúnmente para integrar microfrontends?",
        options: ["Web Components", "CSS Grid", "GraphQL", "SQL"],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "¿Qué problema resuelven los microfrontends en comparación con los frontends monolíticos?",
        options: [
          "Facilitan el despliegue y mantenimiento de partes independientes de la aplicación",
          "Eliminan la necesidad de un backend",
          "Hacen que las aplicaciones sean más rápidas sin importar la arquitectura",
          "Permiten escribir todo el código en un solo lenguaje de programación",
        ],
        correctAnswer: 0,
      },
      {
        id: 6,
        question: "¿Cuál de estas estrategias se usa para comunicar microfrontends entre sí?",
        options: [
          "Eventos del navegador (Custom Events)",
          "Llamadas AJAX directas entre microfrontends",
          "Uso de `localStorage` para almacenar datos compartidos",
          "Cada microfrontend trabaja de forma completamente aislada sin comunicación",
        ],
        correctAnswer: 0,
      },
      {
        id: 7,
        question: "¿Cómo pueden los microfrontends compartir estilos sin generar conflictos?",
        options: [
          "Usando CSS encapsulado con Shadow DOM",
          "Evitando el uso de estilos en los microfrontends",
          "Escribiendo todo el CSS en línea",
          "No es posible compartir estilos en microfrontends",
        ],
        correctAnswer: 0,
      },
      {
        id: 8,
        question: "¿Cuál de las siguientes herramientas se usa para la carga remota de microfrontends en Webpack?",
        options: ["Module Federation", "Code Splitting", "Tree Shaking", "Lazy Loading"],
        correctAnswer: 0,
      },
      {
        id: 9,
        question: "¿Cuál es una desventaja potencial de los microfrontends?",
        options: [
          "Mayor complejidad en la integración y mantenimiento",
          "No permiten el uso de frameworks modernos",
          "No escalan bien en grandes aplicaciones",
          "Obligan a usar un solo lenguaje de programación",
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        question: "¿Qué enfoque puede utilizarse para montar múltiples microfrontends en una misma página?",
        options: ["Single-SPA", "JQuery", "Bootstrap", "Next.js"],
        correctAnswer: 0,
      },
    ],
    "JavaScript técnico": [
      {
        id: 11,
        question: "¿Qué método de JavaScript se usa para convertir un array en una cadena de texto?",
        options: ["join()", "toString()", "concat()", "split()"],
        correctAnswer: 0,
      },
      {
        id: 12,
        question: "¿Qué palabra clave en JavaScript se usa para declarar una variable con un alcance de bloque?",
        options: ["var", "let", "const", "static"],
        correctAnswer: 1,
      },
      {
        id: 13,
        question: "¿Cuál de estas funciones de array modifica el array original?",
        options: ["map()", "filter()", "slice()", "splice()"],
        correctAnswer: 3,
      },
      {
        id: 14,
        question: "¿Cuál es el valor de 'typeof null' en JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'string'"],
        correctAnswer: 2,
      },
      {
        id: 15,
        question: "¿Qué operador se usa para verificar si un objeto tiene una propiedad específica?",
        options: ["in", "has", "contains", "exists"],
        correctAnswer: 0,
      },
      {
        id: 16,
        question: "¿Qué hace la función 'setTimeout' en JavaScript?",
        options: [
          "Retrasa la ejecución de una función por un tiempo específico",
          "Ejecuta una función de inmediato",
          "Llama a una función en cada ciclo del event loop",
          "Detiene la ejecución de un script por un tiempo determinado",
        ],
        correctAnswer: 0,
      },
      {
        id: 17,
        question: "¿Cuál de las siguientes afirmaciones sobre 'async/await' es correcta?",
        options: [
          "'await' solo puede usarse dentro de funciones declaradas con 'async'",
          "'await' puede usarse en cualquier parte del código",
          "'async' detiene la ejecución de la función hasta que la promesa se resuelva",
          "'async/await' es una alternativa obsoleta a las promesas",
        ],
        correctAnswer: 0,
      },
      {
        id: 18,
        question: "¿Qué método se usa para combinar dos objetos en JavaScript?",
        options: ["Object.assign()", "mergeObjects()", "concat()", "combine()"],
        correctAnswer: 0,
      },
      {
        id: 19,
        question: "¿Cuál de las siguientes opciones es una diferencia entre '==' y '===' en JavaScript?",
        options: [
          "'==' compara valores sin considerar el tipo, mientras que '===' compara valor y tipo",
          "'===' compara valores sin considerar el tipo, mientras que '==' compara valor y tipo",
          "Ambos operadores funcionan igual en todos los casos",
          "'===' se usa solo en JavaScript moderno",
        ],
        correctAnswer: 0,
      },
      {
        id: 20,
        question: "¿Qué devuelve el método 'Array.prototype.reduce()'?",
        options: [
          "Un único valor acumulado",
          "Un nuevo array con los elementos filtrados",
          "Un nuevo array con los elementos transformados",
          "Una copia exacta del array original",
        ],
        correctAnswer: 0,
      },
    ],
  };

  const tips: FeedbackRecommendationsQuiz = {
    Microfrontends: {
      excellent: {
        title: "¡Eres un experto en Microfrontends!",
        description: "Dominas los conceptos clave. Puedes profundizar en estrategias avanzadas como:",
        resources: [
          { name: "Microfrontends en producción", url: "https://micro-frontends.org/" },
          { name: "Integración de Web Components", url: "https://developer.mozilla.org/en-US/docs/Web/Web_Components" },
          { name: "Module Federation en Webpack", url: "https://webpack.js.org/concepts/module-federation/" },
        ],
      },
      good: {
        title: "¡Muy buen conocimiento!",
        description: "Tienes una buena base. Refuerza tu aprendizaje con estos recursos:",
        resources: [
          { name: "Single-SPA para microfrontends", url: "https://single-spa.js.org/" },
          {
            name: "Patrones de diseño en microfrontends",
            url: "https://martinfowler.com/articles/micro-frontends.html",
          },
          { name: "Cómo compartir estado entre microfrontends", url: "https://medium.com/" },
        ],
      },
      better: {
        title: "Vas por buen camino",
        description: "Aún hay conceptos por mejorar. Te sugerimos explorar:",
        resources: [
          { name: "Introducción a Microfrontends", url: "https://medium.com/" },
          {
            name: "Usando Web Components en aplicaciones modernas",
            url: "https://developer.mozilla.org/en-US/docs/Web/Web_Components",
          },
          { name: "Webpack para principiantes", url: "https://webpack.js.org/guides/getting-started/" },
        ],
      },
      low: {
        title: "¡No te preocupes, sigue aprendiendo!",
        description: "Empieza con lo básico de microfrontends:",
        resources: [
          { name: "Qué son los Microfrontends", url: "https://micro-frontends.org/" },
          { name: "HTML, CSS y JavaScript básicos", url: "https://www.w3schools.com/" },
          { name: "Conceptos clave de arquitectura de software", url: "https://martinfowler.com/" },
        ],
      },
    },
    "JavaScript técnico": {
      excellent: {
        title: "¡Nivel experto en JavaScript!",
        description: "Tienes un conocimiento profundo. Aquí tienes algunos retos avanzados:",
        resources: [
          {
            name: "Patrones de diseño en JavaScript",
            url: "https://addyosmani.com/resources/essentialjsdesignpatterns/book/",
          },
          { name: "JavaScript Performance", url: "https://web.dev/learn/performance/" },
          { name: "Estructuras de datos y algoritmos en JavaScript", url: "https://www.freecodecamp.org/learn/" },
        ],
      },
      good: {
        title: "¡Gran trabajo con JavaScript!",
        description: "Conoces muy bien JavaScript, pero puedes mejorar con estos recursos:",
        resources: [
          {
            name: "Closures y Scope en JavaScript",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
          },
          {
            name: "Manejo avanzado de Promesas",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
          },
          { name: "ES6+ y más allá", url: "https://exploringjs.com/es6/" },
        ],
      },
      better: {
        title: "Sigue practicando JavaScript",
        description: "Tienes bases sólidas, pero hay margen de mejora. Intenta aprender:",
        resources: [
          { name: "Fundamentos de JavaScript moderno", url: "https://javascript.info/" },
          { name: "Ejercicios prácticos de JS", url: "https://eloquentjavascript.net/" },
          {
            name: "Diferencias entre '==' y '==='",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness",
          },
        ],
      },
      low: {
        title: "¡Sigue aprendiendo JavaScript!",
        description: "JavaScript puede ser desafiante al inicio, pero estos recursos te ayudarán:",
        resources: [
          { name: "Curso de JavaScript desde cero", url: "https://www.freecodecamp.org/learn/" },
          { name: "Guía básica de JavaScript", url: "https://www.w3schools.com/js/" },
          {
            name: "Conceptos fundamentales de programación",
            url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript",
          },
        ],
      },
    },
  };

  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  const genNewPositions = (length: number) => {
    const newPositions: number[] = [];
    while (newPositions.length < length) {
      const position = getRandomInt(length);
      const encontrado = newPositions.find((item) => item === position);

      if (!encontrado && encontrado !== 0) {
        newPositions.push(position);
      }
    }

    return newPositions;
  };

  const mixQuestions = (quiz: Question[]): Question[] => {
    return quiz.map((question) => {
      const answer = question.options[question.correctAnswer];
      const sortAnswer = new Array(question.options.length);

      const positions = genNewPositions(question.options.length);

      for (let i = 0; i < question.options.length; i++) {
        sortAnswer[i] = question.options[positions[i]];
      }

      return { ...question, options: sortAnswer, correctAnswer: sortAnswer.findIndex((item) => item === answer) };
    });
  };

  return (
    <div>
      {Object.entries(questions).map(([key, value]) => (
        <TriviaModal user="Anderson Castaño" title={key} questions={mixQuestions(value)} tips={tips[key]} />
      ))}
    </div>
  );
};

export default TriviaPage;
