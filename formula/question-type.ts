import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import Results from "./component-results";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.expansion.formula",
  name: {
    en: "Formula",
    nl: "Formule",
  },
  description: {
    en: "A question that requires a mathematical expression as response.",
    nl: "Een vraag die een wiskundige uitdrukking als antwoord vereist.",
  },
  generation: {
    enabled: true,
    instructions: "The answer to this question is a LaTeX math expression entered by the student using a math input field. Make sure to provide the correct answer in LaTeX format as well, so that the system can compare the student's answer to the correct answer semantically. Expressions like `\\frac{2}{4}` and `\\frac{1}{2}` should be considered equivalent in most cases.\n",
  },
  grading: {
    enabled: true,
    instructions: "The student's answer is a LaTeX math expression. Compare it to the correct answer semantically — expressions like `\\frac{2}{4}` and `\\frac{1}{2}` should be considered equivalent in most cases.\n",
  },
  scanning: {
    instructions: "The answer should be a LaTeX/MathJAX math expression. Use simple MathJAX type expressions if possible. Unlike other answers, don't wrap math expressions in <inline-math>. Only return the LaTeX math expression itself, without any additional text or formatting. For example, return `\\frac{1}{2}` (correct) instead of `<inline-math>\\frac{1}{2}</inline-math>` (wrong).\n",
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
  icon,
  previewData: preview,
  previewImage,
  readme,
  components: {
    assessment: Assessment,
    print: Print,
    results: Results,
  },
});
