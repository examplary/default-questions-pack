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
  id: "examplary.default.picture-choice",
  name: {
    en: "Picture choice",
    nl: "Afbeeldingskeuze",
  },
  description: {
    en: "Students select one of a set of images as the correct answer.",
    nl: "Studenten selecteren een van de afbeeldingen als het juiste antwoord.",
  },
  hasSimpleScoring: true,
  timeEstimateMinutes: 2,
  index: 300,
  scanning: {
    instructions: "The answer should be a single string: one of the image URLs from the `options` setting, copied exactly.\nThe printed sheet labels the pictures with letters, so the student will usually mark a letter: 'A' for the first option (index 0), 'B' for the second (index 1), etc. Convert that letter to the corresponding option URL. If the answer is not a letter that corresponds to one of the options, leave it as is.\n",
  },
  settings: [
    {
      id: "options",
      type: "string-array",
      name: "Picture choice answer options",
      description: "An array of image URL strings that represent the choices to the student.",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string",
      name: "Correct answer",
      description: "The correct answer. Must be an exact copy of one of the image URLs in `options`.",
      hidden: true,
      required: true,
    },
  ],
  responseProcessing: {
    condition: "=$.answer.value = $.question.settings.correctAnswer\n",
    testCases: [
      {
        question: {
          settings: {
            options: [
              "https://x.test/a.jpg",
              "https://x.test/b.jpg",
            ],
            correctAnswer: "https://x.test/b.jpg",
          },
        },
        answer: {
          value: "https://x.test/b.jpg",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: [
              "https://x.test/a.jpg",
              "https://x.test/b.jpg",
            ],
            correctAnswer: "https://x.test/b.jpg",
          },
        },
        answer: {
          value: "https://x.test/a.jpg",
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
          shuffle: "=$.question.settings.shuffleAnswers",
          choices: "=$map($.question.settings.options, function($option, $index) { { 'identifier': $option, 'content': '<img src=\"' & $option & '\" />' } })",
          minChoices: 1,
          maxChoices: 1,
        },
      },
    },
  },
  translations: {
    "upload-image": {
      en: "Upload image",
      nl: "Afbeelding uploaden",
    },
    "change-image": {
      en: "Change image",
      nl: "Afbeelding wijzigen",
    },
    "option-remove": {
      en: "Remove option",
      nl: "Optie verwijderen",
    },
    options: {
      en: "Picture options",
      nl: "Afbeeldingsopties",
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
