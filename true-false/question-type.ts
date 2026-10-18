import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import Results from "./component-results";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.default.true-false",
  name: {
    en: "True/false",
    nl: "Waar/onwaar",
  },
  description: {
    en: "A question that requires students to choose between true or false.",
    nl: "Een ja/nee-vraag met twee mogelijke antwoorden.",
  },
  hasSimpleScoring: true,
  generation: {
    enabled: true,
  },
  scanning: {
    instructions: "The answer should be a single string, either exactly 'true' or exactly 'false' (case sensitive).\nIf the answer is close to 'true' or 'false', change it to match exactly. Only do this if the answer is very close to 'true' or 'false', otherwise leave it as is.\nIf the student specifies just the letter 'A', that means true, or 'B' for false.\n",
  },
  timeEstimateMinutes: 1,
  index: 400,
  settings: [
    {
      id: "correctAnswer",
      name: {
        en: "Correct answer",
        nl: "Juiste antwoord",
      },
      type: "enum",
      required: true,
      description: "The correct answer to the question, either 'true' or 'false' (as a JSON string!).",
      options: [
        {
          value: "true",
          label: {
            en: "True",
            nl: "Waar",
          },
        },
        {
          value: "false",
          label: {
            en: "False",
            nl: "Onwaar",
          },
        },
      ],
    },
  ],
  responseProcessing: {
    condition: "=$.answer.value = $.question.settings.correctAnswer\n",
    testCases: [
      {
        question: {
          settings: {
            correctAnswer: "true",
          },
        },
        answer: {
          value: "true",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            correctAnswer: "true",
          },
        },
        answer: {
          value: "false",
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            correctAnswer: "false",
          },
        },
        answer: {
          value: "false",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            correctAnswer: "false",
          },
        },
        answer: {
          value: "true",
        },
        expectedOutcome: false,
      },
    ],
  },
  export: {
    qti3: {
      interaction: {
        type: "ChoiceInteraction",
        options: {
          choices: [
            {
              identifier: "true",
              content: "True",
            },
            {
              identifier: "false",
              content: "False",
            },
          ],
          minChoices: 1,
          maxChoices: 1,
        },
      },
    },
  },
  translations: {
    true: {
      en: "True",
      nl: "Waar",
    },
    false: {
      en: "False",
      nl: "Onwaar",
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
  },
});
