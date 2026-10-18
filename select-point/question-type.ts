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
  id: "examplary.expansion.select-point",
  name: {
    en: "Select point",
    nl: "Punt aanwijzen",
  },
  description: {
    en: "Students click the right spot on an image, like a place on a map.",
    nl: "Leerlingen klikken op de juiste plek in een afbeelding, zoals een plaats op een kaart.",
  },
  generation: {
    enabled: false,
  },
  scanning: {
    instructions: "The answer should be an array of strings, one \"x,y\" string for each point the student marked on the image, in the\ncoordinates of the `width` and `height` settings (or the image's own size), e.g. [\"191,393\"].\n",
  },
  timeEstimateMinutes: 1,
  hasSimpleScoring: true,
  settings: [
    {
      id: "image",
      type: "string",
      name: "Image",
      description: "URL of the image the student clicks on.",
      hidden: true,
      required: true,
    },
    {
      id: "width",
      type: "number",
      name: "Width",
      description: "Optional width of the image's coordinate space, which points and areas are given in. Defaults to the image's own width.",
      hidden: true,
    },
    {
      id: "height",
      type: "number",
      name: "Height",
      description: "Optional height of the image's coordinate space. Defaults to the image's own height.",
      hidden: true,
    },
    {
      id: "areas",
      type: "custom",
      name: "Correct areas",
      description: "The areas the student has to click, e.g. `[{\"shape\": \"circle\", \"coords\": [191, 393, 10]}]`. A circle has coords [x, y, radius], a rect [left, top, right, bottom].",
      hidden: true,
      required: true,
      schema: {
        type: "array",
        items: {
          type: "object",
          required: [
            "shape",
            "coords",
          ],
          properties: {
            shape: {
              type: "string",
              enum: [
                "circle",
                "rect",
              ],
            },
            coords: {
              type: "array",
              description: "For a circle [x, y, radius], for a rect [left, top, right, bottom], in the image's coordinate space.",
              items: {
                type: "number",
              },
            },
          },
        },
      },
    },
    {
      id: "maxChoices",
      type: "number",
      name: {
        en: "Maximum number of points",
        nl: "Maximaal aantal punten",
      },
      description: "The number of points a student can place at most, 0 for no limit.",
      min: 0,
      default: 1,
    },
  ],
  responseProcessing: {
    condition: "=(\n  $inside := function($point, $area) {\n    $area.shape = \"circle\"\n      ? $power($point.x - $area.coords[0], 2) + $power($point.y - $area.coords[1], 2) <= $power($area.coords[2], 2)\n      : $point.x >= $area.coords[0] and $point.x <= $area.coords[2] and $point.y >= $area.coords[1] and $point.y <= $area.coords[3]\n  };\n  $points := $map($.answer.value, function($point) {\n    ($xy := $split($point, \",\"); { \"x\": $number($xy[0]), \"y\": $number($xy[1]) })\n  });\n  $areas := $.question.settings.areas;\n  $maxChoices := $exists($.question.settings.maxChoices) ? $.question.settings.maxChoices : 1;\n  $needed := $maxChoices > 0 and $maxChoices < $count($areas) ? $maxChoices : $count($areas);\n  $hitsArea := function($point) { $count($filter($areas, function($area) { $inside($point, $area) })) > 0 };\n  $isHit := function($area) { $count($filter($points, function($point) { $inside($point, $area) })) > 0 };\n  $count($points) > 0\n    and $count($filter($points, $hitsArea)) = $count($points)\n    and $count($filter($areas, $isHit)) >= $needed\n)\n",
    testCases: [
      {
        question: {
          settings: {
            areas: [
              {
                shape: "circle",
                coords: [
                  191,
                  393,
                  10,
                ],
              },
            ],
          },
        },
        answer: {
          value: [
            "195,390",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            areas: [
              {
                shape: "circle",
                coords: [
                  191,
                  393,
                  10,
                ],
              },
            ],
          },
        },
        answer: {
          value: [
            "220,390",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            areas: [
              {
                shape: "rect",
                coords: [
                  0,
                  0,
                  50,
                  50,
                ],
              },
            ],
          },
        },
        answer: {
          value: [
            "10,40",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            areas: [
              {
                shape: "circle",
                coords: [
                  191,
                  393,
                  10,
                ],
              },
              {
                shape: "rect",
                coords: [
                  0,
                  0,
                  50,
                  50,
                ],
              },
            ],
            maxChoices: 2,
          },
        },
        answer: {
          value: [
            "191,393",
          ],
        },
        expectedOutcome: false,
      },
      {
        question: {
          settings: {
            areas: [
              {
                shape: "circle",
                coords: [
                  206,
                  318,
                  34,
                ],
              },
              {
                shape: "circle",
                coords: [
                  501,
                  505,
                  34,
                ],
              },
              {
                shape: "circle",
                coords: [
                  647,
                  317,
                  34,
                ],
              },
            ],
            maxChoices: 1,
          },
        },
        answer: {
          value: [
            "511,507",
          ],
        },
        expectedOutcome: true,
      },
      {
        question: {
          settings: {
            areas: [
              {
                shape: "circle",
                coords: [
                  191,
                  393,
                  10,
                ],
              },
              {
                shape: "rect",
                coords: [
                  0,
                  0,
                  50,
                  50,
                ],
              },
            ],
            maxChoices: 0,
          },
        },
        answer: {
          value: [
            "191,393",
            "10,10",
          ],
        },
        expectedOutcome: true,
      },
    ],
  },
  import: {
    qti3: {
      interaction: {
        type: "SelectPointInteraction",
      },
      settings: {
        image: "=$.interaction.object.data",
        width: "=$.interaction.object.width",
        height: "=$.interaction.object.height",
        areas: "=[$.response.areaMapping.entries[shape in ['circle', 'rect']].{ 'shape': shape, 'coords': $map($split(coords, ','), $number) }]",
        maxChoices: "=$.interaction.maxChoices",
      },
    },
  },
  translations: {
    image: {
      en: "Image",
      nl: "Afbeelding",
    },
    help: {
      en: "Click the image to add an area students have to click, and click an area to remove it.",
      nl: "Klik op de afbeelding om een gebied toe te voegen waar leerlingen op moeten klikken, en klik op een gebied om het te verwijderen.",
    },
    "upload-image": {
      en: "Upload image",
      nl: "Afbeelding uploaden",
    },
    "change-image": {
      en: "Change image",
      nl: "Afbeelding wijzigen",
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
