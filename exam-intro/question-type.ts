import { defineQuestionType } from "@examplary/apps";

import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.default.exam-intro",
  name: {
    en: "Introduction",
    nl: "Introductie",
  },
  description: {
    en: "Text shown to the student at the start of the test.",
    nl: "Tekst die aan de student wordt getoond aan het begin van de test.",
  },
  settings: [],
  backgroundColor: "#f9dafc",
  generation: {
    enabled: true,
  },
  hideSettings: true,
  index: -3000,
  enforcePosition: "start",
  enforceTitle: {
    en: "Introduction",
    nl: "Introductie",
  },
  icon,
  previewData: preview,
  previewImage,
  readme,
});
