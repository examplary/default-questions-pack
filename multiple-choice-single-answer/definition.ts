import { QuestionType } from "@examplary/apps";

import validateQuestion from "./functions/validate-question";

const multipleChoice = new QuestionType({
  id: "examplary.default.multiple-choice-single-answer",
  name: {
    en: "Multiple choice",
    nl: "Meerkeuze",
  },
  description: {
    en: "A question where students select one correct answer from multiple options.",
    nl: "Een vraag waarbij studenten één correct antwoord selecteren uit meerdere opties.",
  },
  icon: "./multiple-choice-single-answer/icon.svg",
  components: {
    assessment: "./multiple-choice-single-answer/component-assessment.tsx",
    print: "./multiple-choice-single-answer/component-print.tsx",
    "settings-area":
      "./multiple-choice-single-answer/component-settings-area.tsx",
    results: "./multiple-choice-single-answer/component-results.tsx",
  },
  generation: {
    enabled: true,
    instructions: `Settings should look like this: {"options": ["Option 1", "Option 2", "Option 3"], "correctAnswer": "Option 2"}.
Make sure the \`correctAnswer\` is always set, exactly matches one of the options strings, and that all options are unique.
The correct answer must not stand out from the distractors by its form: all options should have a similar length, level of detail and grammatical structure.
The correct answer should not be noticeably longer, more precise or more qualified than the distractors, and should not be the only option that repeats wording from the question.
To achieve this, write the correct answer first, then write each distractor to match its length and level of detail. Finally, check that a student without subject knowledge could not pick out the correct answer based on its form alone.
Vary the position of the correct answer in the \`options\` array across questions.
Also include exactly one scoring criteria, which should just be 'Correct answer selected', and be worth at least one point unless specified otherwise.
If the option is a math equation, it should be formatted like such: <inline-math>2x + 3 = 7</inline-math> - this ensures it will be displayed LaTeX-like.
Just using LaTeX formatting without the <inline-math> tags will not render the equation correctly.
`,
  },
  scanning: {
    instructions: `The answer should be a single string, in the format of "Option 2".
Each value should exactly match one of the options specified in the settings, including punctuation and capitalisation. If the answer is close to one of the options, change it to match the option exactly. Only do this if the answer is very close to the option, otherwise leave it as is.
The student might instead use letters to specify their answer, eg. 'A' for the first option (index 0), 'B' for the second (index 1), etc. In that case, convert the letters to the corresponding options. Only do this if the answer is in the format of letters that correspond to the options, otherwise leave it as is.
`,
  },
  hasSimpleScoring: true,
  timeEstimateMinutes: 1,
  shortcut: "3",
  index: 200,
  defaultPinned: true,
  settings: [
    {
      id: "options",
      type: "string-array",
      name: "Multiple choice answer options",
      description:
        "An array of option strings that represent the choices to the student. Each value can contain HTML and <inline-math> tags.",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string",
      name: "Correct answer",
      description:
        "The correct answer. Must be an exact copy of one of the strings in `options`, including punctuation, capitalisation and any HTML or <inline-math> tags, because scoring compares the strings directly.",
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
      description:
        "Whether to show the answer options in random order each time.",
      default: false,
    },
  ],
  responseProcessing: {
    condition: `=$.answer.value = $.question.settings.correctAnswer
`,
    testCases: [
      {
        question: {
          settings: {
            options: ["Red", "Green", "Blue"],
            correctAnswer: "Green",
          },
        },
        answer: {
          value: "Green",
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: ["Red", "Green", "Blue"],
            correctAnswer: "Green",
          },
        },
        answer: {
          value: "Red",
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            options: ["Red", "Green", "Blue"],
            correctAnswer: "Green",
          },
        },
        answer: {
          value: "green",
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
          choices:
            "=$map($.question.settings.options, function($option, $index) { { 'identifier': $option, 'content': $option } })",
          minChoices: 1,
          maxChoices: 1,
        },
      },
    },
  },
  import: {
    qti3: {
      interaction: {
        type: "ChoiceInteraction",
      },
      condition: "=$.interaction.maxChoices = 1",
      settings: {
        options: "=[$.interaction.choices.(content ?? '')]",
        correctAnswer: `=(
  $correct := $.correctResponse;
  $.interaction.choices[identifier in $correct][0].content ?? ''
)
`,
        shuffleAnswers: "=$.interaction.shuffle = true",
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
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Capital of Australia",
          description: "What is the capital city of Australia?",
          settings: {
            options: ["Sydney", "Canberra", "Melbourne", "Perth"],
            correctAnswer: "Canberra",
          },
        },
        answer: { value: "Canberra" },
      },
      nl: {
        question: {
          title: "Hoofdstad van Australië",
          description: "Wat is de hoofdstad van Australië?",
        },
      },
    },
  },
  readme: {
    en: "./multiple-choice-single-answer/README.md",
    nl: "./multiple-choice-single-answer/README.nl.md",
  },
  previewImage: {
    en: "./multiple-choice-single-answer/preview.png",
    nl: "./multiple-choice-single-answer/preview.nl.png",
  },
});

multipleChoice.addValidator(validateQuestion);

export default multipleChoice;
