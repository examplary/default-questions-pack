import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import Results from "./component-results";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

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
  capabilities: {
    "answer-scanning": true,
  },
  generation: {
    enabled: true,
    instructions: "The answer to this question involves multiple steps of mathematical reasoning.\nThe student enters each step as a separate line of LaTeX math expressions in a notebook-style interface, with the final line being the answer.\nProvide the correct answer as a LaTeX expression, along with the intermediate steps if possible.\nExpressions like `\\frac{2}{4}` and `\\frac{1}{2}` should be considered equivalent.\n",
  },
  grading: {
    enabled: true,
    instructions: "The student's answer is an array of strings containing LaTeX math expressions.\nThe last element is the final answer; all preceding elements are intermediate work steps.\nGrade primarily based on the final answer, but consider partial credit for correct intermediate steps.\nCompare expressions semantically — `\\frac{2}{4}` and `\\frac{1}{2}` should be considered equivalent.\n",
  },
  scanning: {
    instructions: "The answer should contain multiple lines of LaTeX/MathJAX math expressions representing the student's work,\nwith the last expression being the final answer.\nReturn an array of strings, where each string represents a line.\nNo need to wrap anything in <inline-math>, since everything is math —\njust return the LaTeX math expressions themselves.\nFor example: [`\\\\frac{1}{2} + \\\\frac{1}{3} = \\\\frac{5}{6}`, `\\\\frac{5}{6}`].\n",
  },
  timeEstimateMinutes: 6,
  settings: [
    {
      id: "initialLines",
      name: {
        en: "Initial number of lines",
        nl: "Beginaantal regels",
      },
      description: "The number of empty lines shown to the student at the start, including the final answer line. Students can add more lines, and printed sheets show exactly this many. Set it to roughly the number of steps the worked solution needs.",
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
