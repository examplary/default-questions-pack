import { defineQuestionType } from "@examplary/apps";

import Assessment from "./component-assessment";
import Print from "./component-print";
import SettingsArea from "./component-settings-area";
import Results from "./component-results";
import icon from "./icon.svg";
import preview from "./preview.yml";
import previewImage from "./preview.png";
import readme from "./README.md";

export default defineQuestionType({
  id: "examplary.default.multiple-choice-multiple-answers",
  name: {
    en: "Checkboxes",
    nl: "Meerdere antwoorden",
  },
  description: {
    en: "A question where students can select multiple correct answers from the available options.",
    nl: "Een vraag waarbij studenten meerdere juiste antwoorden kunnen selecteren uit de beschikbare opties.",
  },
  generation: {
    enabled: true,
    instructions: "Settings should look like this: {\"options\": [\"Option 1\", \"Option 2\", \"Option 3\"], \"correctAnswer\": [\"Option 2\", \"Option 3\"]}.\nMake sure the `correctAnswer` is always set, and EXACTLY matches the corresponding values from the `options` array, and that all options are unique.\nDo not include any distractors or incorrect options in the `correctAnswer` array.\nAlso include exactly one scoring criteria, which should just be 'Correct answer selected', and be worth at least one point unless specified otherwise.\nIf the option is a math equation, it should be formatted like such: <inline-math>2x + 3 = 7</inline-math> - this ensures it will be displayed LaTeX-like.\nJust using LaTeX formatting without the <inline-math> tags will not render the equation correctly.\n",
  },
  scanning: {
    instructions: "The answer should be an array of strings, in the format of [\"Option 2\", \"Option 3\"].\nEach value should exactly match one of the options specified in the settings, including punctuation and capitalisation. If the answer is close to one of the options, change it to match the option exactly. Only do this if the answer is very close to the option, otherwise leave it as is. The order of the answers does not matter.\nThe student might instead use letters to specify their answer, eg. 'A' for the first option (index 0), 'B' for the second (index 1), etc. In that case, convert the letters to the corresponding options. Only do this if the answer is in the format of letters that correspond to the options, otherwise leave it as is.\n",
  },
  hasSimpleScoring: true,
  timeEstimateMinutes: 1,
  index: 201,
  settings: [
    {
      id: "options",
      type: "string-array",
      name: "Multiple choice answer options",
      description: "An array of option strings that represent the choices to the student. Each value can contain HTML and <inline-math> tags.",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string-array",
      name: "Correct answer(s)",
      description: "The correct answers; there can be more than one. Each entry must be an exact copy of one of the strings in `options`, including punctuation, capitalisation and any HTML or <inline-math> tags, because scoring compares the strings directly.",
      hidden: true,
      required: true,
    },
    {
      id: "shuffleAnswers",
      type: "boolean",
      name: {
        en: "Shuffle answer options",
        nl: "Willekeurige volgorde",
      },
      description: "Whether to show the answer options in random order each time.",
      default: false,
    },
  ],
  responseProcessing: {
    condition: "=$join($sort($.answer.value), '|') = $join($sort($.question.settings.correctAnswer), '|')\n",
    testCases: [
      {
        question: {
          settings: {
            options: [
              "A",
              "B",
              "C",
              "D",
            ],
            correctAnswer: [
              "B",
              "C",
            ],
          },
        },
        answer: {
          value: [
            "B",
            "C",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: [
              "A",
              "B",
              "C",
              "D",
            ],
            correctAnswer: [
              "B",
              "C",
            ],
          },
        },
        answer: {
          value: [
            "C",
            "B",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: [
              "A",
              "B",
              "C",
              "D",
            ],
            correctAnswer: [
              "B",
              "C",
            ],
          },
        },
        answer: {
          value: [
            "B",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            options: [
              "A",
              "B",
              "C",
              "D",
            ],
            correctAnswer: [
              "B",
              "C",
            ],
          },
        },
        answer: {
          value: [
            "B",
            "C",
            "D",
          ],
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
          choices: "=$map($.question.settings.options, function($option, $index) { { 'identifier': $option, 'content': $option } })",
          minChoices: 1,
          maxChoices: "=$count($.question.settings.options)",
        },
      },
    },
  },
  translations: {
    "option-placeholder": {
      en: "Add option...",
      nl: "Optie toevoegen...",
    },
    "option-remove": {
      en: "Remove option",
      nl: "Optie verwijderen",
    },
    "correct-answer": {
      en: "Correct answer",
      nl: "Correct antwoord",
    },
    options: {
      en: "Answer options",
      nl: "Antwoordopties",
    },
  },
  icon,
  previewData: preview,
  previewImage,
  readme,
  components: {
    assessment: Assessment,
    print: Print,
    settingsArea: SettingsArea,
    results: Results,
  },
});
