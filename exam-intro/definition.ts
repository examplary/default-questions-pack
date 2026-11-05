import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.default.exam-intro",
  name: {
    en: "Introduction",
    nl: "Introductie",
  },
  description: {
    en: "Text shown to the student at the start of the test.",
    nl: "Tekst die aan de student wordt getoond aan het begin van de test.",
  },
  icon: "./exam-intro/icon.svg",
  settings: [],
  backgroundColor: "#f9dafc",
  generation: {
    enabled: true,
  },
  hideSettings: true,
  index: -3000,
  defaultPinned: true,
  enforcePosition: "start",
  enforceTitle: {
    en: "Introduction",
    nl: "Introductie",
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Introduction",
          description:
            "Welcome to this exam! You have 90 minutes to complete all questions. Read each question carefully before answering, and keep an eye on the timer in the corner. Good luck!",
          settings: {},
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Introductie",
          description:
            "Welkom bij deze toets! Je hebt 90 minuten om alle vragen te maken. Lees elke vraag goed voordat je antwoordt, en houd de timer in de hoek in de gaten. Succes!",
        },
      },
    },
  },
  readme: { en: "./exam-intro/README.md", nl: "./exam-intro/README.nl.md" },
  previewImage: {
    en: "./exam-intro/preview.png",
    nl: "./exam-intro/preview.nl.png",
  },
});
