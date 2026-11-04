import { defineQuestionType } from "@examplary/apps";

export default defineQuestionType({
  id: "examplary.default.multi-line-text",
  name: {
    en: "Long answer",
    nl: "Uitgebreid antwoord",
  },
  description: {
    en: "A question that requires a multi-line text response.",
    nl: "Een vraag met een lang antwoord.",
  },
  icon: "./multi-line-text/icon.svg",
  components: {
    assessment: "./multi-line-text/component-assessment.tsx",
    print: "./multi-line-text/component-print.tsx",
  },
  capabilities: {
    "answer-scanning": true,
  },
  settings: [],
  export: {
    qti3: {
      interaction: {
        type: "ExtendedTextInteraction",
        options: {},
      },
    },
  },
  translations: {
    placeholder: {
      en: "Type your answer...",
      nl: "Typ je antwoord...",
    },
  },
  generation: {
    enabled: true,
  },
  grading: {
    enabled: true,
  },
  timeEstimateMinutes: 5,
  shortcut: "2",
  index: 101,
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "The water cycle",
          description:
            "Describe the main stages of the water cycle in a few sentences.",
          settings: {},
        },
        answer: {
          value:
            "Water evaporates from oceans and lakes, condenses into clouds, and falls back to the surface as precipitation. It then flows back to the sea through rivers and groundwater, completing the cycle.",
        },
      },
      nl: {
        question: {
          title: "De waterkringloop",
          description:
            "Beschrijf in een paar zinnen de belangrijkste fasen van de waterkringloop.",
        },
        answer: {
          value:
            "Water verdampt uit oceanen en meren, condenseert tot wolken en valt als neerslag terug naar het aardoppervlak. Via rivieren en grondwater stroomt het daarna terug naar zee, en de kringloop is rond.",
        },
      },
    },
  },
  readme: {
    en: "./multi-line-text/README.md",
    nl: "./multi-line-text/README.nl.md",
  },
  previewImage: {
    en: "./multi-line-text/preview.png",
    nl: "./multi-line-text/preview.nl.png",
  },
});
