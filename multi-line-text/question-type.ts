import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

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
  icon,
  previewData: preview,
  previewImage,
  readme,
  components: {
    assessment: Assessment,
    print: Print,
  },
});
