import { defineQuestionType } from "@examplary/apps";

import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.default.exam-outro",
  name: {
    en: "Outro",
    nl: "Afronding",
  },
  description: {
    en: "Final text shown to the student after the test.",
    nl: "Laatste tekst na afloop van de toets.",
  },
  settings: [],
  backgroundColor: "#e2f3e6",
  generation: {
    enabled: true,
  },
  hideSettings: true,
  index: -1000,
  enforcePosition: "end",
  enforceTitle: {
    en: "Outro",
    nl: "Afronding",
  },
  icon,
  previewData: preview,
  previewImage,
  readme,
});
