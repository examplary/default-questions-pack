import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.expansion.formula",
  name: {
    en: "Formula",
    nl: "Formule",
  },
  description: {
    en: "A question that requires a mathematical expression as response.",
    nl: "Een vraag die een wiskundige uitdrukking als antwoord vereist.",
  },
  icon: "./formula/icon.svg",
  components: {
    assessment: "./formula/component-assessment.tsx",
    print: "./formula/component-print.tsx",
    results: "./formula/component-results.tsx",
  },
  generation: {
    enabled: true,
    instructions: `The answer to this question is a LaTeX math expression entered by the student using a math input field. Make sure to provide the correct answer in LaTeX format as well, so that the system can compare the student's answer to the correct answer semantically. Expressions like \`\\frac{2}{4}\` and \`\\frac{1}{2}\` should be considered equivalent in most cases.
`,
  },
  grading: {
    enabled: true,
    instructions: `The student's answer is a LaTeX math expression. Compare it to the correct answer semantically — expressions like \`\\frac{2}{4}\` and \`\\frac{1}{2}\` should be considered equivalent in most cases.
`,
  },
  scanning: {
    instructions: `The answer should be a LaTeX/MathJAX math expression. Use simple MathJAX type expressions if possible. Unlike other answers, don't wrap math expressions in <inline-math>. Only return the LaTeX math expression itself, without any additional text or formatting. For example, return \`\\frac{1}{2}\` (correct) instead of \`<inline-math>\\frac{1}{2}</inline-math>\` (wrong).
`,
  },
  timeEstimateMinutes: 4,
  settings: [],
  index: 510,
  translations: {
    placeholder: {
      en: "Enter your answer...",
      nl: "Voer je antwoord in...",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Solve for x",
          description:
            "Solve the equation <inline-math>2x + 3 = 7</inline-math> and enter your final answer as a formula.",
          settings: {},
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Los op voor x",
          description:
            "Los de vergelijking <inline-math>2x + 3 = 7</inline-math> op en vul je eindantwoord in als formule.",
        },
      },
    },
  },
  readme: { en: "./formula/README.md", nl: "./formula/README.nl.md" },
  previewImage: { en: "./formula/preview.png", nl: "./formula/preview.nl.png" },
});
