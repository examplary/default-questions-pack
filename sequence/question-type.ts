import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import Results from "./component-results";
import SettingsArea from "./component-settings-area";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.expansion.sequence",
  name: {
    en: "Sequence",
    nl: "Volgorde",
  },
  description: {
    en: "Arrange items in the correct order.",
    nl: "Zet items in de juiste volgorde.",
  },
  generation: {
    enabled: true,
    instructions: "Generate settings that look like this: {\"options\": [\"First\", \"Second\", \"Third\", \"Fourth\", \"Fifth\"]}.\nwhere `options` contains the items that the student should rearrange (can contain simple HTML markup), in the correct order.\n",
  },
  scanning: {
    instructions: "The answer should be an array of strings, in the format of [\"First\", \"Second\", \"Third\", \"Fourth\", \"Fifth\"].\nEach value should exactly match one of the options specified in the settings, including punctuation and capitalisation. If the answer is close to one of the options, change it to match the option exactly. Only do this if the answer is very close to the option, otherwise leave it as is. The order of the answers is what gets scored, so keep the order the student specified, even when it is wrong.\nThe student might instead use letters to specify their answer, eg. 'A' for the first option (index 0), 'B' for the second (index 1), etc. In that case, convert the letters to the corresponding options, keeping the order in which the student wrote them. Only do this if the answer is in the format of letters that correspond to the options, otherwise leave it as is.\n",
  },
  timeEstimateMinutes: 2,
  hasSimpleScoring: true,
  settings: [
    {
      id: "options",
      type: "string-array",
      name: "Options",
      description: "The items that the student should rearrange, in the correct order. Can contain simple HTML markup.",
      hidden: true,
      required: true,
    },
  ],
  responseProcessing: {
    condition: "=$join($.answer.value, '|') = $join($.question.settings.options, '|')\n",
    testCases: [
      {
        question: {
          settings: {
            options: [
              "First",
              "Second",
              "Third",
              "Fourth",
              "Fifth",
            ],
          },
        },
        answer: {
          value: [
            "First",
            "Second",
            "Third",
            "Fourth",
            "Fifth",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: [
              "First",
              "Second",
              "Third",
              "Fourth",
              "Fifth",
            ],
          },
        },
        answer: {
          value: [
            "First",
            "Third",
            "Second",
            "Fourth",
            "Fifth",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            options: [
              "First",
              "Second",
              "Third",
              "Fourth",
              "Fifth",
            ],
          },
        },
        answer: {
          value: [
            "First",
            "Second",
            "Third",
            "Fifth",
            "Fourth",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            options: [
              "First",
              "Second",
              "Third",
              "Fourth",
              "Fifth",
            ],
          },
        },
        answer: {
          value: [
            "Fifth",
            "Fourth",
            "Third",
            "Second",
            "First",
          ],
        },
        expectedOutcome: false,
      },
    ],
  },
  export: {
    qti3: {
      interaction: {
        type: "OrderInteraction",
        options: {
          choices: "=$map($.question.settings.options, function($option, $index) { { 'identifier': $option, 'content': $option } })",
        },
      },
    },
  },
  translations: {
    options: {
      en: "Items to arrange",
      nl: "Items om te rangschikken",
    },
    help: {
      en: "Arrange the items in the correct order. They will be shown in a random order to the student.",
      nl: "Rangschik de items in de juiste volgorde. Ze worden in een willekeurige volgorde aan de student getoond.",
    },
    placeholder: {
      en: "Type option...",
      nl: "Typ optie...",
    },
    insert: {
      en: "Add item",
      nl: "Item toevoegen",
    },
  },
  icon,
  previewData: preview,
  previewImage,
  readme,
  components: {
    assessment: Assessment,
    print: Print,
    results: Results,
    settingsArea: SettingsArea,
  },
});
