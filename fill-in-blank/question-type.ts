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
  id: "examplary.expansion.fill-in-blank",
  name: {
    en: "Fill in the blanks",
    nl: "Aanvullen",
  },
  description: {
    en: "Requires student to fill in one or more blanks with a short text answer. Also known as 'cloze' questions.",
    nl: "Vraagt de student om een of meer lege plekken in te vullen met een kort tekstantwoord. Ook wel 'cloze' vragen genoemd.",
  },
  generation: {
    enabled: true,
    instructions: "Generate settings that look like this: {\"text\": \"The capital of France is ___ and the capital of Spain is ___\", \"correctAnswer\": [\"Paris\", \"Madrid\"]}\nThere needs to be at least one blank (___) in the text, and the correctAnswer array needs to have the same number of entries as there are blanks in the text. \nOnly include the text with blanks in the `text` field in the settings. Do not add it to the description, and do not give away the correct answers other than \nin the `correctAnswer` field in the settings. Do not include underscores within <inline-math> expressions.\nSince this question type is either always good or wrong, by default make sure this question has a 1 point value, unless otherwise specified.\n",
  },
  scanning: {
    instructions: "The answer should be an array of strings, with one entry for each blank in the text. \nFor example, if the text has two blanks, the answer should look like [\"Paris\", \"Madrid\"]. \nMake sure to return only the array of strings as the answer, without any additional text or formatting.\nEach entry is compared to the correct answer for its blank, so it should contain only what the student wrote in that blank, in the order of the blanks.\n\nExample: If the `text` setting is \"The capital of France is ___ and the capital of Spain is ___\", and the student has \nwritten \"The capital of France is Paris and the capital of Spain is Madrid\", then the answer value should be [\"Paris\", \"Madrid\"].\n",
  },
  timeEstimateMinutes: 2,
  hasSimpleScoring: true,
  settings: [
    {
      id: "text",
      type: "string",
      name: "The question text with blanks",
      description: "The text of the question (string), with blanks represented by ___",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string-array",
      name: "Correct answer",
      description: "The correct answer(s) to the question, that represent the blanks. There needs to be the same number of entries as there are blanks in the text.",
      hidden: true,
      required: true,
    },
    {
      id: "choices",
      type: "custom",
      name: "Choices per blank",
      description: "Optional. For each blank, the options the student picks from in a dropdown, e.g. `[[\"is\", \"are\"], []]`. An empty list (or no entry) makes the blank a free text input. The correct answer for a dropdown blank must be one of its options.",
      hidden: true,
      schema: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
    {
      id: "exactValuesCaseInsensitive",
      type: "boolean",
      name: {
        en: "Ignore spaces/capitals",
        nl: "Negeer spaties/hoofdletters",
      },
      description: "Leading/trailing whitespace is always ignored when comparing the student's answer to the correct answer. When this is enabled, letter casing is ignored too.",
      default: true,
    },
    {
      id: "exactOrder",
      type: "boolean",
      name: {
        en: "Exact order",
        nl: "Exacte volgorde",
      },
      description: "When enabled, every blank has to be filled in with the correct answer configured for that blank. When disabled, any of the correct answers is accepted in any blank, as long as each correct answer is used exactly once.",
      default: true,
    },
  ],
  responseProcessing: {
    condition: "=(\n  $caseInsensitive := $.question.settings.exactValuesCaseInsensitive = true;\n  $normalise := function($v) { $caseInsensitive ? $trim($lowercase($v)) : $trim($v) };\n  $given := $map($.answer.value, $normalise);\n  $expected := $map($.question.settings.correctAnswer, $normalise);\n  $.question.settings.exactOrder = false\n    ? $join($sort($given), '|') = $join($sort($expected), '|')\n    : $join($given, '|') = $join($expected, '|')\n)\n",
    testCases: [
      {
        question: {
          settings: {
            text: "Capital of France is ___ and Spain is ___",
            correctAnswer: [
              "Paris",
              "Madrid",
            ],
          },
        },
        answer: {
          value: [
            "Paris",
            "Madrid",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___ and Spain is ___",
            correctAnswer: [
              "Paris",
              "Madrid",
            ],
          },
        },
        answer: {
          value: [
            "Madrid",
            "Paris",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___",
            correctAnswer: [
              "Paris",
            ],
          },
        },
        answer: {
          value: [
            "paris",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___",
            correctAnswer: [
              "Paris",
            ],
          },
        },
        answer: {
          value: [
            "  Paris ",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___",
            correctAnswer: [
              "Paris",
            ],
            exactValuesCaseInsensitive: true,
          },
        },
        answer: {
          value: [
            "  paris ",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___ and Spain is ___",
            correctAnswer: [
              "Paris",
              "Madrid",
            ],
            exactOrder: true,
          },
        },
        answer: {
          value: [
            "Madrid",
            "Paris",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___ and Spain is ___",
            correctAnswer: [
              "Paris",
              "Madrid",
            ],
            exactOrder: false,
          },
        },
        answer: {
          value: [
            "Madrid",
            "Paris",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___ and Spain is ___",
            correctAnswer: [
              "Paris",
              "Madrid",
            ],
            exactOrder: false,
          },
        },
        answer: {
          value: [
            "Paris",
            "Paris",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___ and Spain is ___",
            correctAnswer: [
              "Paris",
              "Madrid",
            ],
            exactOrder: false,
          },
        },
        answer: {
          value: [
            "Paris",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            text: "Capital of France is ___ and Spain is ___",
            correctAnswer: [
              "Paris",
              "Madrid",
            ],
            exactOrder: false,
            exactValuesCaseInsensitive: true,
          },
        },
        answer: {
          value: [
            " madrid",
            "paris ",
          ],
        },
        expectedOutcome: true,
      },
    ],
  },
  export: {
    qti3: {
      gaps: {
        text: "=$.question.settings.text",
        answers: "=$.question.settings.correctAnswer",
        caseInsensitive: "=$.question.settings.exactValuesCaseInsensitive",
        anyOrder: "=$.question.settings.exactOrder = false",
      },
    },
  },
  import: {
    qti3: {
      gaps: true,
      settings: {
        text: "=$.text",
        correctAnswer: "=$.answers",
        choices: "=$.choices",
        exactValuesCaseInsensitive: "=$.caseInsensitive",
        exactOrder: "=$not($.anyOrder)",
      },
    },
  },
  translations: {
    text: {
      en: "Text to complete",
      nl: "Tekst om in te vullen",
    },
    placeholder: {
      en: "The capital of France is ___",
      nl: "De hoofdstad van Frankrijk is ___",
    },
    help: {
      en: "Use three underscores (___) to indicate a blank.",
      nl: "Gebruik drie onderstrepingstekens (___) om een lege plek aan te geven.",
    },
    "insert-blank": {
      en: "Insert blank",
      nl: "Lege plek invoegen",
    },
    "correct-answer": {
      en: "Correct answer",
      nl: "Correct antwoord",
    },
    "correct-answers": {
      en: "Correct answers",
      nl: "Correct antwoorden",
    },
    choices: {
      en: "Dropdown options (optional)",
      nl: "Keuzemenu-opties (optioneel)",
    },
    "choices-placeholder": {
      en: "is; are",
      nl: "is; zijn",
    },
    "answer-not-in-choices": {
      en: "The correct answer must be one of the dropdown options.",
      nl: "Het correcte antwoord moet een van de keuzemenu-opties zijn.",
    },
    choose: {
      en: "Choose...",
      nl: "Kies...",
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
