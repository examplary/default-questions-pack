import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.default.single-line-text",
  name: {
    en: "Short answer",
    nl: "Kort antwoord",
  },
  description: {
    en: "A question that requires a short text response.",
    nl: "Een vraag die een kort tekstantwoord vereist.",
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
      description: "The maximum number of characters allowed in the answer - optional. Don't include unless relevant.",
    },
  ],
  shortcut: "1",
  index: 100,
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
  translations: {
    placeholder: {
      en: "Type your answer...",
      nl: "Typ je antwoord...",
    },
  },
  icon,
  previewData: preview,
  previewImage,
  readme,
  components: {
    assessment: Assessment,
    print: Print,
  },
});
