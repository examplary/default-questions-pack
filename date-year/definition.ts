import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.default.date-year",
  name: {
    en: "Date or year",
    nl: "Datum of jaar",
  },
  description: {
    en: "Ask the student to enter a year (e.g. 1925).",
    nl: "Vraag de leerling om een jaartal in te vullen (bijv. 1925).",
  },
  icon: "./date-year/icon.svg",
  components: {
    assessment: "./date-year/component-assessment.tsx",
    "settings-area": "./date-year/component-settings-area.tsx",
    print: "./date-year/component-print.tsx",
  },
  generation: {
    enabled: true,
    instructions: `The settings should include a 'dateType' field, which can be either 'year' or 'full-date', and a 'correctAnswer' field,
which should be a year (e.g. 1925) if 'dateType' is 'year', or a full date (e.g. 1925-12-31) if 'dateType' is 'full-date'.
Always set \`correctAnswer\`, in the format that matches the dateType.

You don't have to instruct the user on what format to use, the UI will handle that for you. 
Just make sure the correctAnswer is a valid year or date based on the dateType setting.
`,
  },
  scanning: {
    instructions: `If the dateType setting is 'year', the answer should be a 4-digit year (e.g. 1925).
If the dateType setting is 'full-date', the answer should be a full date in the format YYYY-MM-DD (e.g. 1925-12-31).
`,
  },
  hasSimpleScoring: true,
  timeEstimateMinutes: 2,
  index: 600,
  settings: [
    {
      id: "dateType",
      name: {
        en: "Date type",
        nl: "Datumtype",
      },
      description: "The type of date to expect (e.g. year only, full date).",
      type: "enum",
      options: [
        {
          value: "full-date",
          label: "Full date",
        },
        {
          value: "year",
          label: "Year only",
        },
      ],
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      name: {
        en: "Correct answer",
        nl: "Juiste antwoord",
      },
      description:
        "The correct answer to the question, which can be a year (e.g. 1925) or a full date (e.g. 1925-12-31), based on the dateType setting.",
      type: "string",
      hidden: true,
      required: true,
    },
  ],
  responseProcessing: {
    condition: `=$trim($.answer.value) = $trim($.question.settings.correctAnswer)
`,
    testCases: [
      {
        question: {
          settings: {
            dateType: "year",
            correctAnswer: "1925",
          },
        },
        answer: {
          value: "1925",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            dateType: "year",
            correctAnswer: "1925",
          },
        },
        answer: {
          value: "  1925 ",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            dateType: "year",
            correctAnswer: "1925",
          },
        },
        answer: {
          value: "1926",
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            dateType: "full-date",
            correctAnswer: "1925-12-31",
          },
        },
        answer: {
          value: "1925-12-31",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            dateType: "full-date",
            correctAnswer: "1925-12-31",
          },
        },
        answer: {
          value: "1925-12-30",
        },
        expectedOutcome: false,
      },
    ],
  },
  export: {
    qti3: {
      interaction: {
        type: "TextEntryInteraction",
        options: {
          placeholderText:
            "=$.question.settings.dateType = 'year' ? 'YYYY' : 'YYYY-MM-DD'",
          patternMask:
            "=$.question.settings.dateType = 'year' ? '\\\\d{4}' : '\\\\d{4}-\\\\d{2}-\\\\d{2}'",
          expectedLength: "=$.question.settings.dateType = 'year' ? 4 : 10",
        },
      },
    },
  },
  translations: {
    "year-only": {
      en: "Year only",
      nl: "Alleen jaar",
    },
    "full-date": {
      en: "Full date",
      nl: "Volledige datum",
    },
    "correct-answer-placeholder": {
      en: "Enter the correct year or date (e.g. 1925 or 1925-12-31)",
      nl: "Vul het juiste jaar of de juiste datum in (bijv. 1925 of 1925-12-31)",
    },
    "correct-answer": {
      en: "Correct answer",
      nl: "Juiste antwoord",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Start of the French Revolution",
          description: "In which year did the French Revolution begin?",
          settings: { dateType: "year", correctAnswer: "1789" },
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Begin van de Franse Revolutie",
          description: "In welk jaar begon de Franse Revolutie?",
        },
      },
    },
  },
  readme: { en: "./date-year/README.md", nl: "./date-year/README.nl.md" },
  previewImage: {
    en: "./date-year/preview.png",
    nl: "./date-year/preview.nl.png",
  },
});
