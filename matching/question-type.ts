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
  id: "examplary.expansion.matching",
  name: {
    en: "Matching",
    nl: "Combinaties",
  },
  description: {
    en: "Match the correct items with their pairs from two lists.",
    nl: "Koppel de juiste items aan hun tegenhangers uit twee lijsten.",
  },
  generation: {
    enabled: true,
    instructions: "Generate settings that look like this: \n{\n  \"left\": [\"Apple\", \"Banana\", \"Grapes\"],\n  \"right\": [\"Red\", \"Yellow\", \"Purple\"],\n  \"correctAnswer\": [\"Apple = Red\", \"Banana = Yellow\", \"Grapes = Purple\"],\n  \"layout\": \"vertical\",\n  \"shuffle\": false\n}\n\nGenerate between 2 and 5 pairs. Do not include any other fields. Make sure that the left and right arrays contain unique items, and that the correctAnswer\narray contains pairs that EXACTLY match the items in the left and right arrays.\nPut the items in the right array in a different order than their matches in the left array, since printed sheets show both lists in this exact order and the\nanswers should not be guessable from the item positions.\n\nDon't add any distractors/other items in `correctAnswer` that are not in the `left` and `right` arrays. Don't add any items in `left` or `right` that are not in `correctAnswer`. \n\nIf you want to use math in the items, use <inline-math> tags, e.g. <inline-math>x^2 + 3x + 2</inline-math>. This ensures it will be displayed with the correct formatting.\n",
  },
  scanning: {
    instructions: "The answer should be an array of strings, in the format of [\"Apple = Red\", \"Banana = Yellow\", \"Grapes = Purple\"].\nEach string should contain exactly one ` = `. If there are multiple ` = ` in a string, only the first one will be used as the separator between left and right.\nIf an answer is close to one of the pairs in the `correctAnswer` setting, copy over the pair from the settings, eg. if the answer is \"Apple = red\", it should be changed to \"Apple = Red\".\nOnly do this if the answer is very close to the pair in the settings, otherwise leave the answer as is. The order of the pairs in the answer does not matter.\n\nThe student might also use numbers and letters, referring to the printed sheet. The number represents an item from the `left` setting (\"1\" is the first item), the letter an\nitem from the `right` setting (\"A\" is the first item), both in the order they appear in the settings (e.g. with left items [\"Apple\", \"Banana\"] and right items\n[\"Red\", \"Yellow\"], \"2 = A\" means \"Banana = Red\"). In that case, convert the numbers and letters to the corresponding items from the settings. In which case, make sure to\ncopy over all formatting, including <p> tags etc. from the original left/right options.\nOnly do this if the answer is in the format of numbers and letters that correspond to the options, otherwise leave it as is.\n",
  },
  timeEstimateMinutes: 2,
  hasSimpleScoring: true,
  settings: [
    {
      id: "left",
      type: "string-array",
      name: "Left items",
      description: "Array containing the items shown in the left column (or top row). Example: `[\"Apple\", \"Banana\"]`.",
      hidden: true,
      required: true,
    },
    {
      id: "right",
      type: "string-array",
      name: "Right items",
      description: "Array containing the answer options the student can match with, shown in the right column (or bottom row). Example: `[\"Red\", \"Yellow\"]`.",
      hidden: true,
      required: true,
    },
    {
      id: "correctAnswer",
      type: "string-array",
      name: "Correct answer",
      description: "Array containing the correct pairs, where each pair is a string that contains ` = `. The text left of the ` = ` must exactly match an item from `left`, the text right of it an item from `right`. Example: `[\"Apple = Red\", \"Banana = Yellow\"]`.",
      hidden: true,
      required: true,
    },
    {
      id: "layout",
      type: "enum",
      name: {
        en: "Layout",
        nl: "Layout",
      },
      description: "The layout to use for displaying the matching question. `vertical` displays the items in two vertical columns, while `horizontal` displays them in two horizontal rows. Don't use horizontal if there are more than 3 items.",
      options: [
        {
          value: "vertical",
          label: {
            en: "Vertical",
            nl: "Verticaal",
          },
        },
        {
          value: "horizontal",
          label: {
            en: "Horizontal",
            nl: "Horizontaal",
          },
        },
      ],
      default: "vertical",
    },
    {
      id: "shuffle",
      type: "boolean",
      name: {
        en: "Shuffle options",
        nl: "Willekeurige volgorde",
      },
      description: "Whether to show the options in a random order to the student during digital assessments. If disabled, the options in both columns are shown in alphabetical order. Printed sheets always show the items in the order of the settings.",
      default: false,
    },
  ],
  responseProcessing: {
    condition: "=$join($sort($.answer.value), '|') = $join($sort($exists($.question.settings.correctAnswer) ? $.question.settings.correctAnswer : $.question.settings.pairs), '|')\n",
    testCases: [
      {
        question: {
          settings: {
            left: [
              "Apple",
              "Banana",
              "Grapes",
            ],
            right: [
              "Red",
              "Yellow",
              "Purple",
            ],
            correctAnswer: [
              "Apple = Red",
              "Banana = Yellow",
              "Grapes = Purple",
            ],
          },
        },
        answer: {
          value: [
            "Apple = Red",
            "Banana = Yellow",
            "Grapes = Purple",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            left: [
              "Apple",
              "Banana",
              "Grapes",
            ],
            right: [
              "Red",
              "Yellow",
              "Purple",
            ],
            correctAnswer: [
              "Apple = Red",
              "Banana = Yellow",
              "Grapes = Purple",
            ],
          },
        },
        answer: {
          value: [
            "Grapes = Purple",
            "Apple = Red",
            "Banana = Yellow",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            left: [
              "Apple",
              "Banana",
              "Grapes",
            ],
            right: [
              "Red",
              "Yellow",
              "Purple",
            ],
            correctAnswer: [
              "Apple = Red",
              "Banana = Yellow",
              "Grapes = Purple",
            ],
          },
        },
        answer: {
          value: [
            "Apple = Yellow",
            "Banana = Red",
            "Grapes = Purple",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            left: [
              "Apple",
              "Banana",
              "Grapes",
            ],
            right: [
              "Red",
              "Yellow",
              "Purple",
            ],
            correctAnswer: [
              "Apple = Red",
              "Banana = Yellow",
              "Grapes = Purple",
            ],
          },
        },
        answer: {
          value: [
            "Apple = Red",
            "Banana = Yellow",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            pairs: [
              "Apple = Red",
              "Banana = Yellow",
              "Grapes = Purple",
            ],
          },
        },
        answer: {
          value: [
            "Grapes = Purple",
            "Apple = Red",
            "Banana = Yellow",
          ],
        },
        expectedOutcome: true,
      },
    ],
  },
  import: {
    qti3: {
      interaction: {
        type: "MatchInteraction",
      },
      settings: {
        left: "=[$.interaction.sourceChoices.content]",
        right: "=(\n  $slots := $count($.interaction.sourceChoices);\n  [$.interaction.targetChoices.(\n    $content := content;\n    $max := $exists(matchMax) ? matchMax : 1;\n    [1..($max = 0 or $max > $slots ? $slots : $max)].$content\n  )]\n)\n",
        correctAnswer: "=(\n  $choices := $append($.interaction.sourceChoices, $.interaction.targetChoices);\n  $contentOf := function($id) { $choices[identifier = $id].content };\n  [$.correctResponse.(\n    $ids := $split($, \" \");\n    $contentOf($ids[0]) & \" = \" & $contentOf($ids[1])\n  )]\n)\n",
        shuffle: "=$.interaction.shuffle = true",
      },
    },
  },
  translations: {
    pairs: {
      en: "Pairs",
      nl: "Paren",
    },
    "left-column": {
      en: "Left column",
      nl: "Linker kolom",
    },
    "right-column": {
      en: "Right column",
      nl: "Rechter kolom",
    },
    "top-row": {
      en: "Top row",
      nl: "Bovenste rij",
    },
    "bottom-row": {
      en: "Bottom row",
      nl: "Onderste rij",
    },
    "help-vertical": {
      en: "Add the correct combinations. The student will see the left column items, and must match them with the right column items.",
      nl: "Voeg de juiste combinaties toe. De leerling ziet de items in de linker kolom en moet ze koppelen aan de items in de rechter kolom.",
    },
    "help-horizontal": {
      en: "Add the correct combinations. The student will see the top row items, and must match them with the bottom row items.",
      nl: "Voeg de juiste combinaties toe. De leerling ziet de items in de bovenste rij en moet ze koppelen aan de items in de onderste rij.",
    },
    "placeholder-item": {
      en: "Shown item...",
      nl: "Getoond item...",
    },
    "placeholder-answer": {
      en: "Add an item...",
      nl: "Voeg een item toe...",
    },
    "drag-options": {
      en: "Drag these items to the correct matches.",
      nl: "Sleep deze items naar de juiste combinaties.",
    },
    "possible-answers": {
      en: "Possible answers:",
      nl: "Mogelijke antwoorden:",
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
