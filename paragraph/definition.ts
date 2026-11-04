import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.default.paragraph",
  name: {
    en: "Paragraph",
    nl: "Alinea",
  },
  description: {
    en: "Some text to provide context or instructions to the student.",
    nl: "Tekst om context of instructies te geven aan de leerling.",
  },
  icon: "./paragraph/icon.svg",
  backgroundColor: "#deeafc",
  generation: {
    enabled: true,
    instructions: `Used to insert a page of text, graphs, tables, documents, links and/or images to provide context or instructions to the student. This is especially useful to introduce a new section of the test. The content should be relevant to the subject matter and help the student understand the questions better. Never use this for the 'intro' or 'outro' of the exam, or as a 'welcome' page. It also doesn't have an answer field.
`,
  },
  hideSettings: true,
  index: -2000,
  settings: [],
  export: {
    qti3: {
      interaction: {
        type: "ExtendedTextInteraction",
        options: {},
      },
    },
  },
  titlePlaceholder: {
    en: "Section title...",
    nl: "Sectietitel...",
  },
  untitledPlaceholder: {
    en: "Untitled section",
    nl: "Naamloze sectie",
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Background: the water cycle",
          description:
            "The water cycle describes how water moves between the oceans, the atmosphere, and the land. Energy from the sun drives evaporation from open water, while plants release vapour through transpiration. The questions in this section build on this background — read it carefully before continuing.",
          settings: {},
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Achtergrond: de waterkringloop",
          description:
            "De waterkringloop beschrijft hoe water zich verplaatst tussen de oceanen, de atmosfeer en het land. Energie van de zon zorgt voor verdamping uit open water, terwijl planten waterdamp afgeven via transpiratie. De vragen in dit onderdeel bouwen voort op deze achtergrond, dus lees de tekst goed voordat je verdergaat.",
        },
      },
    },
  },
  readme: { en: "./paragraph/README.md", nl: "./paragraph/README.nl.md" },
  previewImage: {
    en: "./paragraph/preview.png",
    nl: "./paragraph/preview.nl.png",
  },
});
