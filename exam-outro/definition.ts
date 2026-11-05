import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.default.exam-outro",
  name: {
    en: "Outro",
    nl: "Afronding",
  },
  description: {
    en: "Final text shown to the student after the test.",
    nl: "Laatste tekst na afloop van de toets.",
  },
  icon: "./exam-outro/icon.svg",
  settings: [],
  backgroundColor: "#e2f3e6",
  generation: {
    enabled: true,
  },
  hideSettings: true,
  index: -1000,
  defaultPinned: true,
  enforcePosition: "end",
  enforceTitle: {
    en: "Outro",
    nl: "Afronding",
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Outro",
          description:
            "You have reached the end of the exam. Take a moment to review your answers before submitting. Once you submit, you can no longer make changes.",
          settings: {},
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Afronding",
          description:
            "Je bent aan het einde van de toets. Neem even de tijd om je antwoorden na te lopen voordat je inlevert. Na het inleveren kun je niets meer wijzigen.",
        },
      },
    },
  },
  readme: { en: "./exam-outro/README.md", nl: "./exam-outro/README.nl.md" },
  previewImage: {
    en: "./exam-outro/preview.png",
    nl: "./exam-outro/preview.nl.png",
  },
});
