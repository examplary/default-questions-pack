import { defineQuestionType } from "@examplary/apps";

export default defineQuestionType({
  id: "examplary.expansion.math-notebook",
  name: {
    en: "Math notebook",
    nl: "Rekenschrift",
  },
  description: {
    en: "A question where students show their work across multiple lines of math, with the final line as the answer.",
    nl: "Een vraag waarbij leerlingen hun werk tonen over meerdere regels wiskunde, met de laatste regel als antwoord.",
  },
  icon: "./math-notebook/icon.svg",
  components: {
    assessment: "./math-notebook/component-assessment.tsx",
    print: "./math-notebook/component-print.tsx",
    results: "./math-notebook/component-results.tsx",
  },
  capabilities: {
    "answer-scanning": true,
  },
  generation: {
    enabled: true,
    instructions: `The answer to this question involves multiple steps of mathematical reasoning.
The student enters each step as a separate line of LaTeX math expressions in a notebook-style interface, with the final line being the answer.
Provide the correct answer as a LaTeX expression, along with the intermediate steps if possible.
Expressions like \`\\frac{2}{4}\` and \`\\frac{1}{2}\` should be considered equivalent.
`,
  },
  grading: {
    enabled: true,
    instructions: `The student's answer is an array of strings containing LaTeX math expressions.
The last element is the final answer; all preceding elements are intermediate work steps.
Grade primarily based on the final answer, but consider partial credit for correct intermediate steps.
Compare expressions semantically — \`\\frac{2}{4}\` and \`\\frac{1}{2}\` should be considered equivalent.
`,
  },
  scanning: {
    instructions: `The answer should contain multiple lines of LaTeX/MathJAX math expressions representing the student's work,
with the last expression being the final answer.
Return an array of strings, where each string represents a line.
No need to wrap anything in <inline-math>, since everything is math —
just return the LaTeX math expressions themselves.
For example: [\`\\\\frac{1}{2} + \\\\frac{1}{3} = \\\\frac{5}{6}\`, \`\\\\frac{5}{6}\`].
`,
  },
  timeEstimateMinutes: 6,
  settings: [
    {
      id: "initialLines",
      name: {
        en: "Initial number of lines",
        nl: "Beginaantal regels",
      },
      description:
        "The number of empty lines shown to the student at the start, including the final answer line. Students can add more lines, and printed sheets show exactly this many. Set it to roughly the number of steps the worked solution needs.",
      type: "number",
      default: 4,
      step: 1,
    },
  ],
  index: 515,
  translations: {
    calculation: {
      en: "Calculation",
      nl: "Berekening",
    },
    answer: {
      en: "Answer:",
      nl: "Antwoord:",
    },
    addMoreLines: {
      en: "Add more lines",
      nl: "Meer regels toevoegen",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Solve step by step",
          description:
            "Solve <inline-math>2x + 3 = 7</inline-math>. Show every step of your reasoning on a separate line, ending with the final answer.",
          settings: { initialLines: 4 },
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Stap voor stap oplossen",
          description:
            "Los <inline-math>2x + 3 = 7</inline-math> op. Zet elke stap van je berekening op een aparte regel, en eindig met het eindantwoord.",
        },
      },
    },
  },
  readme: {
    en: "./math-notebook/README.md",
    nl: "./math-notebook/README.nl.md",
  },
  previewImage: {
    en: "./math-notebook/preview.png",
    nl: "./math-notebook/preview.nl.png",
  },
});
