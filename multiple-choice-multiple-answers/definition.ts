import { QuestionType } from "@examplary/apps";

import validateQuestion from "./functions/validate-question";

const multipleChoiceMultipleAnswers = new QuestionType({
  id: "examplary.default.multiple-choice-multiple-answers",
  name: {
    en: "Checkboxes",
    nl: "Meerdere antwoorden",
  },
  description: {
    en: "A question where students can select multiple correct answers from the available options.",
    nl: "Een vraag waarbij studenten meerdere juiste antwoorden kunnen selecteren uit de beschikbare opties.",
  },
  icon: "./multiple-choice-multiple-answers/icon.svg",
  components: {
    assessment: "./multiple-choice-multiple-answers/component-assessment.tsx",
    print: "./multiple-choice-multiple-answers/component-print.tsx",
    "settings-area":
      "./multiple-choice-multiple-answers/component-settings-area.tsx",
    results: "./multiple-choice-multiple-answers/component-results.tsx",
  },
  generation: {
    enabled: true,
    instructions: `Settings should look like this: {"options": ["Option 1", "Option 2", "Option 3"], "correctAnswer": ["Option 2", "Option 3"]}.
Make sure the \`correctAnswer\` is always set, and EXACTLY matches the corresponding values from the \`options\` array, and that all options are unique.
Do not include any distractors or incorrect options in the \`correctAnswer\` array.
The correct answers must not stand out from the distractors by their form: all options should have a similar length, level of detail and grammatical structure.
The correct answers should not be noticeably longer, more precise or more qualified than the distractors, and should not be the only options that repeat wording from the question.
To achieve this, write the correct answers first, then write each distractor to match their length and level of detail. Finally, check that a student without subject knowledge could not pick out the correct answers based on their form alone.
Vary the positions of the correct answers in the \`options\` array across questions.
Also include exactly one scoring criteria, which should just be 'Correct answer selected', and be worth at least one point unless specified otherwise.
If the option is a math equation, it should be formatted like such: <inline-math>2x + 3 = 7</inline-math> - this ensures it will be displayed LaTeX-like.
Just using LaTeX formatting without the <inline-math> tags will not render the equation correctly.
`,
  },
  scanning: {
    instructions: `The answer should be an array of strings, in the format of ["Option 2", "Option 3"].
Each value should exactly match one of the options specified in the settings, including punctuation and capitalisation. If the answer is close to one of the options, change it to match the option exactly. Only do this if the answer is very close to the option, otherwise leave it as is. The order of the answers does not matter.
The student might instead use letters to specify their answer, eg. 'A' for the first option (index 0), 'B' for the second (index 1), etc. In that case, convert the letters to the corresponding options. Only do this if the answer is in the format of letters that correspond to the options, otherwise leave it as is.
`,
  },
  hasSimpleScoring: true,
  timeEstimateMinutes: 1,
  index: 201,
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
      type: "string-array",
      name: "Correct answer(s)",
      description:
        "The correct answers; there can be more than one. Each entry must be an exact copy of one of the strings in `options`, including punctuation, capitalisation and any HTML or <inline-math> tags, because scoring compares the strings directly.",
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
    condition: `=$join($sort($.answer.value), '|') = $join($sort($.question.settings.correctAnswer), '|')
`,
    testCases: [
      {
        question: {
          settings: {
            options: ["A", "B", "C", "D"],
            correctAnswer: ["B", "C"],
          },
        },
        answer: {
          value: ["B", "C"],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: ["A", "B", "C", "D"],
            correctAnswer: ["B", "C"],
          },
        },
        answer: {
          value: ["C", "B"],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            options: ["A", "B", "C", "D"],
            correctAnswer: ["B", "C"],
          },
        },
        answer: {
          value: ["B"],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            options: ["A", "B", "C", "D"],
            correctAnswer: ["B", "C"],
          },
        },
        answer: {
          value: ["B", "C", "D"],
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
          maxChoices: "=$count($.question.settings.options)",
        },
      },
    },
  },
  import: {
    qti3: {
      interaction: {
        type: "ChoiceInteraction",
      },
      // Not `!= 1`, which is false when the item leaves out max-choices
      condition: "=$not($.interaction.maxChoices = 1)",
      settings: {
        options: "=[$.interaction.choices.(content ?? '')]",
        correctAnswer: `=(
  $correct := $.correctResponse;
  [$.interaction.choices[identifier in $correct].(content ?? '')]
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
    "option-feedback": {
      en: "Feedback when chosen",
      nl: "Feedback bij deze keuze",
    },
    "option-feedback-placeholder": {
      en: "Shown to students who pick this option",
      nl: "Getoond aan leerlingen die deze optie kiezen",
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
          title: "Noble gases",
          description:
            "Which of the following elements are noble gases? Select all that apply.",
          settings: {
            options: ["Helium", "Oxygen", "Neon", "Nitrogen"],
            correctAnswer: ["Helium", "Neon"],
          },
        },
        answer: { value: ["Helium", "Neon"] },
      },
      nl: {
        question: {
          title: "Edelgassen",
          description:
            "Welke van de volgende elementen zijn edelgassen? Selecteer alle juiste antwoorden.",
          settings: { options: ["Helium", "Zuurstof", "Neon", "Stikstof"] },
        },
      },
    },
  },
  readme: {
    en: "./multiple-choice-multiple-answers/README.md",
    nl: "./multiple-choice-multiple-answers/README.nl.md",
  },
  previewImage: {
    en: "./multiple-choice-multiple-answers/preview.png",
    nl: "./multiple-choice-multiple-answers/preview.nl.png",
  },
});

multipleChoiceMultipleAnswers.addValidator(validateQuestion);

export default multipleChoiceMultipleAnswers;
