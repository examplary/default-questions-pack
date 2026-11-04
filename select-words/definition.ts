import { defineQuestionType } from "@examplary/apps";

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
  icon: "./select-words/icon.svg",
  components: {
    assessment: "./select-words/component-assessment.tsx",
    print: "./select-words/component-print.tsx",
    results: "./select-words/component-results.tsx",
    "settings-area": "./select-words/component-settings-area.tsx",
  },
  generation: {
    enabled: true,
    instructions: `Generate settings that look like this: {"text": "<p>The [cat] [sat] on the [mat].</p>", "correctAnswer": ["sat"]}
Put every word or phrase the student can select in square brackets, including the wrong ones, and make each bracketed part
unique. \`correctAnswer\` lists the bracketed parts that should be selected, written exactly as between the brackets.
Ask what to select in the description, not in the text. Avoid duplicate words as selectable parts.
`,
  },
  scanning: {
    instructions: `The answer should be an array of strings: the bracketed parts in the \`text\` setting that the student circled or marked,
written exactly as between the brackets, e.g. ["sat"].
`,
  },
  timeEstimateMinutes: 1,
  hasSimpleScoring: true,
  settings: [
    {
      id: "text",
      type: "string",
      name: "Text with selectable parts",
      description:
        "The text (HTML) with each part the student can select in square brackets, e.g. `<p>The [cat] [sat] on the [mat].</p>`.",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string-array",
      name: "Correct answer",
      description:
        'The bracketed parts that should be selected, written exactly as between the brackets, e.g. `["sat"]`.',
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
      description:
        "Whether the selectable parts are shown in boxes. When disabled, they read as plain text, so students have to find them themselves.",
      default: true,
    },
  ],
  responseProcessing: {
    condition: `=$join($sort($distinct($.answer.value)), "|") = $join($sort($distinct($.question.settings.correctAnswer)), "|")
`,
    testCases: [
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: ["sat"],
          },
        },
        answer: {
          value: ["sat"],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: ["cat", "mat"],
          },
        },
        answer: {
          value: ["mat", "cat"],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: ["cat", "mat"],
          },
        },
        answer: {
          value: ["cat"],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            text: "The [cat] [sat] on the [mat].",
            correctAnswer: ["sat"],
          },
        },
        answer: {
          value: ["sat", "mat"],
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
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Verbs",
          description: "Select all verbs in the sentence.",
          settings: {
            text: "<p>The [technician] [inspected] the [device] and [replaced] the broken [sensor].</p>",
            correctAnswer: ["inspected", "replaced"],
          },
        },
        answer: { value: ["inspected", "replaced"] },
      },
      nl: {
        question: {
          title: "Werkwoorden",
          description: "Selecteer alle werkwoorden in de zin.",
          settings: {
            text: "<p>De [monteur] [controleerde] het [apparaat] en [verving] de kapotte [sensor].</p>",
            correctAnswer: ["controleerde", "verving"],
          },
        },
        answer: { value: ["controleerde", "verving"] },
      },
    },
  },
  readme: { en: "./select-words/README.md", nl: "./select-words/README.nl.md" },
  previewImage: {
    en: "./select-words/preview.png",
    nl: "./select-words/preview.nl.png",
  },
});
