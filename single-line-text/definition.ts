import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.default.single-line-text",
  name: {
    en: "Short answer",
    nl: "Kort antwoord",
  },
  description: {
    en: "A question that requires a short text response.",
    nl: "Een vraag die een kort tekstantwoord vereist.",
  },
  icon: "./single-line-text/icon.svg",
  components: {
    assessment: "./single-line-text/component-assessment.tsx",
    print: "./single-line-text/component-print.tsx",
  },
  generation: {
    enabled: true,
  },
  grading: {
    enabled: true,
  },
  timeEstimateMinutes: 2,
  settings: [
    {
      id: "maxLength",
      type: "number",
      name: {
        en: "Maximum length",
        nl: "Maximale lengte",
      },
      min: 1,
      max: 1000,
      step: 1,
      required: false,
      description:
        "The maximum number of characters allowed in the answer - optional. Don't include unless relevant.",
    },
  ],
  shortcut: "1",
  index: 100,
  defaultPinned: true,
  export: {
    qti3: {
      interaction: {
        type: "TextEntryInteraction",
        options: {
          expectedLength: "=$.question.settings.maxLength",
        },
      },
    },
  },
  import: {
    qti3: {
      interaction: {
        type: "TextEntryInteraction",
      },
      settings: {
        expectedLength: "=$.interaction.expectedLength ?? 50",
        placeholder:
          "=$.interaction.placeholderText ? $.interaction.placeholderText",
      },
    },
  },
  translations: {
    placeholder: {
      en: "Type your answer...",
      nl: "Typ je antwoord...",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Chemical symbols",
          description: "What is the chemical symbol for gold?",
          settings: { maxLength: 10 },
        },
        answer: { value: "Au" },
      },
      nl: {
        question: {
          title: "Scheikundige symbolen",
          description: "Wat is het scheikundige symbool voor goud?",
        },
      },
    },
  },
  readme: {
    en: "./single-line-text/README.md",
    nl: "./single-line-text/README.nl.md",
  },
  previewImage: {
    en: "./single-line-text/preview.png",
    nl: "./single-line-text/preview.nl.png",
  },
});
