import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.default.picture-choice",
  name: {
    en: "Picture choice",
    nl: "Afbeeldingskeuze",
  },
  description: {
    en: "Students select one of a set of images as the correct answer.",
    nl: "Studenten selecteren een van de afbeeldingen als het juiste antwoord.",
  },
  icon: "./picture-choice/icon.svg",
  components: {
    assessment: "./picture-choice/component-assessment.tsx",
    print: "./picture-choice/component-print.tsx",
    results: "./picture-choice/component-results.tsx",
    "settings-area": "./picture-choice/component-settings-area.tsx",
  },
  hasSimpleScoring: true,
  timeEstimateMinutes: 2,
  index: 300,
  scanning: {
    instructions: `The answer should be a single string: one of the image URLs from the \`options\` setting, copied exactly.
The printed sheet labels the pictures with letters, so the student will usually mark a letter: 'A' for the first option (index 0), 'B' for the second (index 1), etc. Convert that letter to the corresponding option URL. If the answer is not a letter that corresponds to one of the options, leave it as is.
`,
  },
  settings: [
    {
      id: "options",
      type: "string-array",
      name: "Picture choice answer options",
      description:
        "An array of image URL strings that represent the choices to the student.",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string",
      name: "Correct answer",
      description:
        "The correct answer. Must be an exact copy of one of the image URLs in `options`.",
      hidden: true,
      required: true,
    },
  ],
  responseProcessing: {
    condition: `=$.answer.value = $.question.settings.correctAnswer
`,
    testCases: [
      {
        question: {
          settings: {
            options: ["https://x.test/a.jpg", "https://x.test/b.jpg"],
            correctAnswer: "https://x.test/b.jpg",
          },
        },
        answer: {
          value: "https://x.test/b.jpg",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: ["https://x.test/a.jpg", "https://x.test/b.jpg"],
            correctAnswer: "https://x.test/b.jpg",
          },
        },
        answer: {
          value: "https://x.test/a.jpg",
        },
        expectedOutcome: false,
      },
    ],
  },
  export: {
    qti3: {
      interaction: {
        type: "ChoiceInteraction",
        options: {
          shuffle: "=$.question.settings.shuffleAnswers",
          choices:
            "=$map($.question.settings.options, function($option, $index) { { 'identifier': $option, 'content': '<img src=\"' & $option & '\" />' } })",
          minChoices: 1,
          maxChoices: 1,
        },
      },
    },
  },
  translations: {
    "upload-image": {
      en: "Upload image",
      nl: "Afbeelding uploaden",
    },
    "change-image": {
      en: "Change image",
      nl: "Afbeelding wijzigen",
    },
    "option-remove": {
      en: "Remove option",
      nl: "Optie verwijderen",
    },
    options: {
      en: "Picture options",
      nl: "Afbeeldingsopties",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Shapes",
          description: "Which picture shows a triangle?",
          settings: {
            options: [
              "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22440%22%20height%3D%22300%22%3E%3Crect%20width%3D%22440%22%20height%3D%22300%22%20fill%3D%22%23dbeafe%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22180%22%20font-size%3D%2296%22%20text-anchor%3D%22middle%22%3E%F0%9F%94%B5%3C%2Ftext%3E%3C%2Fsvg%3E",
              "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22440%22%20height%3D%22300%22%3E%3Crect%20width%3D%22440%22%20height%3D%22300%22%20fill%3D%22%23fef3c7%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22180%22%20font-size%3D%2296%22%20text-anchor%3D%22middle%22%3E%F0%9F%94%BA%3C%2Ftext%3E%3C%2Fsvg%3E",
              "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22440%22%20height%3D%22300%22%3E%3Crect%20width%3D%22440%22%20height%3D%22300%22%20fill%3D%22%23dcfce7%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22180%22%20font-size%3D%2296%22%20text-anchor%3D%22middle%22%3E%F0%9F%9F%A9%3C%2Ftext%3E%3C%2Fsvg%3E",
              "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22440%22%20height%3D%22300%22%3E%3Crect%20width%3D%22440%22%20height%3D%22300%22%20fill%3D%22%23fce7f3%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22180%22%20font-size%3D%2296%22%20text-anchor%3D%22middle%22%3E%E2%AD%90%3C%2Ftext%3E%3C%2Fsvg%3E",
            ],
            correctAnswer:
              "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22440%22%20height%3D%22300%22%3E%3Crect%20width%3D%22440%22%20height%3D%22300%22%20fill%3D%22%23fef3c7%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22180%22%20font-size%3D%2296%22%20text-anchor%3D%22middle%22%3E%F0%9F%94%BA%3C%2Ftext%3E%3C%2Fsvg%3E",
          },
        },
        answer: {
          value:
            "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22440%22%20height%3D%22300%22%3E%3Crect%20width%3D%22440%22%20height%3D%22300%22%20fill%3D%22%23fef3c7%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22180%22%20font-size%3D%2296%22%20text-anchor%3D%22middle%22%3E%F0%9F%94%BA%3C%2Ftext%3E%3C%2Fsvg%3E",
        },
      },
      nl: {
        question: {
          title: "Vormen",
          description: "Op welke afbeelding staat een driehoek?",
        },
      },
    },
  },
  readme: {
    en: "./picture-choice/README.md",
    nl: "./picture-choice/README.nl.md",
  },
  previewImage: {
    en: "./picture-choice/preview.png",
    nl: "./picture-choice/preview.nl.png",
  },
});
