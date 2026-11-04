import { defineQuestionType } from "@examplary/apps";

export default defineQuestionType({
  id: "examplary.default.essay",
  name: {
    en: "Essay",
    nl: "Essay",
  },
  description: {
    en: "Prompt the student to write a long answer, often using headings and text formatting.",
    nl: "Vraag de leerling om een lang antwoord te schrijven, vaak met gebruik van kopjes en tekstopmaak.",
  },
  icon: "./essay/icon.svg",
  components: {
    assessment: "./essay/component-assessment.tsx",
    print: "./essay/component-print.tsx",
  },
  generation: {
    enabled: true,
    instructions: `The answer to this question is a long-form essay. The student may use headings and text formatting to structure their answer. Settings minWords and maxWords are optional. Set them to 0 if you don't want to use them; they must be finite numbers, since the settings are stored as JSON, which has no Infinity.
`,
  },
  grading: {
    enabled: true,
  },
  timeEstimateMinutes: 15,
  index: 500,
  settings: [
    {
      id: "minWords",
      name: {
        en: "Minimum word count",
        nl: "Minimaal aantal woorden",
      },
      type: "number",
      placeholder: "0",
      step: 50,
    },
    {
      id: "maxWords",
      name: {
        en: "Maximum word count",
        nl: "Maximaal aantal woorden",
      },
      type: "number",
      placeholder: "0",
      step: 50,
    },
  ],
  export: {
    qti3: {
      interaction: {
        type: "ExtendedTextInteraction",
        options: {},
      },
    },
  },
  translations: {
    "word-count_one": {
      en: "{{count}} word",
      nl: "{{count}} woord",
    },
    "word-count_other": {
      en: "{{count}} words",
      nl: "{{count}} woorden",
    },
    "word-count-min": {
      en: "of {{min}} required",
      nl: "van {{min}} vereist",
    },
    "word-count-max": {
      en: "({{max}} maximum)",
      nl: "({{max}} maximum)",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "The Industrial Revolution",
          description:
            "Write an essay about the social impact of the Industrial Revolution on working-class families in Europe. Use headings to structure your answer.",
          settings: { minWords: 150, maxWords: 600 },
        },
        answer: {
          value:
            "<h2>A changing society</h2><p>The Industrial Revolution transformed European society in profound ways. Families that had worked the land for generations moved into rapidly growing cities, where factory work replaced agricultural labour.</p><p>Working conditions were often harsh, and child labour was common until reforms in the late nineteenth century began to improve daily life.</p>",
        },
      },
      nl: {
        question: {
          title: "De Industriële Revolutie",
          description:
            "Schrijf een essay over de sociale gevolgen van de Industriële Revolutie voor arbeidersgezinnen in Europa. Gebruik kopjes om je antwoord te structureren.",
        },
        answer: {
          value:
            "<h2>Een veranderende samenleving</h2><p>De Industriële Revolutie veranderde de Europese samenleving ingrijpend. Gezinnen die al generaties lang het land bewerkten, trokken naar snelgroeiende steden, waar fabriekswerk de plaats innam van werk op het land.</p><p>De arbeidsomstandigheden waren vaak zwaar, en kinderarbeid was gebruikelijk tot hervormingen aan het einde van de negentiende eeuw het dagelijks leven begonnen te verbeteren.</p>",
        },
      },
    },
  },
  readme: { en: "./essay/README.md", nl: "./essay/README.nl.md" },
  previewImage: { en: "./essay/preview.png", nl: "./essay/preview.nl.png" },
});
