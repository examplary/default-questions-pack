import { defineQuestionType } from "@examplary/apps";

import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.default.paragraph",
  name: {
    en: "Paragraph",
    nl: "Alinea",
  },
  description: {
    en: "Some text to provide context or instructions to the student.",
    nl: "Tekst om context of instructies te geven aan de leerling.",
  },
  backgroundColor: "#deeafc",
  generation: {
    enabled: true,
    instructions: "Used to insert a page of text, graphs, tables, documents, links and/or images to provide context or instructions to the student. This is especially useful to introduce a new section of the test. The content should be relevant to the subject matter and help the student understand the questions better. Never use this for the 'intro' or 'outro' of the exam, or as a 'welcome' page. It also doesn't have an answer field.\n",
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
  icon,
  previewData: preview,
  previewImage,
  readme,
});
