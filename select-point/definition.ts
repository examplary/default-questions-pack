import { QuestionType } from "@examplary/apps";

import responseProcessing from "./response-processing";

export default new QuestionType({
  id: "examplary.expansion.select-point",
  name: {
    en: "Select point",
    nl: "Punt aanwijzen",
  },
  description: {
    en: "Students click the right spot on an image, like a place on a map.",
    nl: "Leerlingen klikken op de juiste plek in een afbeelding, zoals een plaats op een kaart.",
  },
  icon: "./select-point/icon.svg",
  components: {
    assessment: "./select-point/component-assessment.tsx",
    print: "./select-point/component-print.tsx",
    results: "./select-point/component-results.tsx",
    "settings-area": "./select-point/component-settings-area.tsx",
  },
  generation: {
    enabled: false,
  },
  scanning: {
    instructions: `The answer should be an array of strings, one "x,y" string for each point the student marked on the image, in the
coordinates of the \`width\` and \`height\` settings (or the image's own size), e.g. ["191,393"].
`,
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
      description:
        "Optional width of the image's coordinate space, which points and areas are given in. Defaults to the image's own width.",
      hidden: true,
    },
    {
      id: "height",
      type: "number",
      name: "Height",
      description:
        "Optional height of the image's coordinate space. Defaults to the image's own height.",
      hidden: true,
    },
    {
      id: "areas",
      type: "custom",
      name: "Correct areas",
      description:
        'The areas the student has to click, e.g. `[{"shape": "circle", "coords": [191, 393, 10]}]`. A circle has coords [x, y, radius], a rect [left, top, right, bottom].',
      hidden: true,
      required: true,
      schema: {
        type: "array",
        items: {
          type: "object",
          required: ["shape", "coords"],
          properties: {
            shape: {
              type: "string",
              enum: ["circle", "rect"],
            },
            coords: {
              type: "array",
              description:
                "For a circle [x, y, radius], for a rect [left, top, right, bottom], in the image's coordinate space.",
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
      description:
        "The number of points a student can place at most, 0 for no limit.",
      min: 0,
      default: 1,
    },
  ],
  responseProcessing,
  import: {
    qti3: {
      interaction: {
        type: "SelectPointInteraction",
      },
      settings: {
        image: "=$.interaction.object.data",
        width: "=$.interaction.object.width",
        height: "=$.interaction.object.height",
        areas:
          "=[$.response.areaMapping.entries[shape in ['circle', 'rect']].{ 'shape': shape, 'coords': $map($split(coords, ','), $number) }]",
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
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Population density",
          description:
            "Click the country in Europe with the highest population density.",
          settings: {
            image: "https://mirri.link/QlItU4i3-",
            width: 600,
            height: 513,
            areas: [{ shape: "circle", coords: [191, 393, 10] }],
            maxChoices: 1,
          },
        },
        answer: { value: ["192,391"] },
      },
      nl: {
        question: {
          title: "Bevolkingsdichtheid",
          description:
            "Klik op het land in Europa met de hoogste bevolkingsdichtheid.",
        },
      },
    },
  },
  readme: { en: "./select-point/README.md", nl: "./select-point/README.nl.md" },
  previewImage: {
    en: "./select-point/preview.png",
    nl: "./select-point/preview.nl.png",
  },
});
