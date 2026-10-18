import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import Results from "./component-results";
import SettingsArea from "./component-settings-area";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.expansion.select-words",
  name: {
    en: "Select words",
    nl: "Woorden selecteren",
  },
  description: {
    en: "Students select the correct words or phrases in a text.",
    nl: "Leerlingen selecteren de juiste woorden of zinsdelen in een tekst.",
  },
  generation: {
    enabled: true,
    instructions: "Generate settings that look like this: {\"text\": \"<p>The [cat] [sat] on the [mat].</p>\", \"correctAnswer\": [\"sat\"]}\nPut every word or phrase the student can select in square brackets, including the wrong ones, and make each bracketed part\nunique. `correctAnswer` lists the bracketed parts that should be selected, written exactly as between the brackets.\nAsk what to select in the description, not in the text. Avoid duplicate words as selectable parts.\n",
  },
  scanning: {
    instructions: "The answer should be an array of strings: the bracketed parts in the `text` setting that the student circled or marked,\nwritten exactly as between the brackets, e.g. [\"sat\"].\n",
  },
  timeEstimateMinutes: 1,
  hasSimpleScoring: true,
  settings: [
    {
      id: "text",
      type: "string",
      name: "Text with selectable parts",
      description: "The text (HTML) with each part the student can select in square brackets, e.g. `<p>The [cat] [sat] on the [mat].</p>`.",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string-array",
      name: "Correct answer",
      description: "The bracketed parts that should be selected, written exactly as between the brackets, e.g. `[\"sat\"]`.",
      hidden: true,
      required: true,
    },
    {
      id: "showParts",
      type: "boolean",
      name: {
        en: "Show selectable words",
        nl: "Selecteerbare woorden tonen",
      },
      description: "Whether the selectable parts are shown in boxes. When disabled, they read as plain text, so students have to find them themselves.",
      default: true,
    },
  ],
  responseProcessing: {
    condition: "=$join($sort($distinct($.answer.value)), \"|\") = $join($sort($distinct($.question.settings.correctAnswer)), \"|\")\n",
    testCases: [
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: [
              "sat",
            ],
          },
        },
        answer: {
          value: [
            "sat",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: [
              "cat",
              "mat",
            ],
          },
        },
        answer: {
          value: [
            "mat",
            "cat",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: [
              "cat",
              "mat",
            ],
          },
        },
        answer: {
          value: [
            "cat",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: [
              "sat",
            ],
          },
        },
        answer: {
          value: [
            "sat",
            "mat",
          ],
        },
        expectedOutcome: false,
      },
    ],
  },
  import: {
    qti3: {
      hottext: true,
      settings: {
        text: "=$.text",
        correctAnswer: "=$.answers",
        showParts: "=$not($.selectableHidden)",
      },
    },
  },
  translations: {
    text: {
      en: "Text",
      nl: "Tekst",
    },
    placeholder: {
      en: "The [cat] [sat] on the [mat].",
      nl: "De [kat] [zat] op de [mat].",
    },
    help: {
      en: "Put each word or phrase students can select in [square brackets].",
      nl: "Zet elk woord of zinsdeel dat leerlingen kunnen selecteren tussen [vierkante haken].",
    },
    "correct-answer": {
      en: "Correct answer",
      nl: "Juiste antwoord",
    },
    "correct-answer-help": {
      en: "Click the parts students should select.",
      nl: "Klik op de delen die leerlingen moeten selecteren.",
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
    settingsArea: SettingsArea,
  },
});
