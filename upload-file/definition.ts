import { QuestionType } from "@examplary/apps";

export default new QuestionType({
  id: "examplary.expansion.upload-file",
  name: {
    en: "Upload file",
    nl: "Upload bestand",
  },
  description: {
    en: "Requires student to upload a file.",
    nl: "Vraagt de student om een bestand te uploaden.",
  },
  icon: "./upload-file/icon.svg",
  components: {
    assessment: "./upload-file/component-assessment.tsx",
    results: "./upload-file/component-results.tsx",
  },
  generation: {
    enabled: true,
  },
  grading: {
    enabled: true,
    instructions: `The answer value is an array of \`[url, name]\` for the file the student uploaded. The file itself is attached to the end of this prompt, so grade its contents directly rather than following the link.
`,
    fileInputs: "=answer.value[0]",
  },
  timeEstimateMinutes: 20,
  settings: [
    {
      id: "acceptFileTypes",
      type: "enum",
      name: {
        en: "Accepted file types",
        nl: "Geaccepteerde bestandstypen",
      },
      description:
        "The types of files that students are allowed to upload. Should be one of the enum values specified below.",
      options: [
        {
          value: "*/*",
          label: {
            en: "All file types",
            nl: "Alle bestandstypen",
          },
        },
        {
          value: "application/pdf",
          label: {
            en: "Only PDF documents",
            nl: "Alleen PDF-documenten",
          },
        },
        {
          value:
            ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          label: {
            en: "Only Word documents",
            nl: "Alleen Word-documenten",
          },
        },
        {
          value: "image/*",
          label: {
            en: "Only images",
            nl: "Alleen afbeeldingen",
          },
        },
      ],
      default: "*/*",
    },
  ],
  export: {
    qti3: {
      interaction: {
        type: "UploadInteraction",
        options: {
          type: "=$.question.settings.acceptFileTypes",
        },
      },
    },
  },
  translations: {
    "select-file": {
      en: "Select a file",
      nl: "Selecteer een bestand",
    },
    uploading: {
      en: "Uploading...",
      nl: "Uploaden...",
    },
    "remove-file": {
      en: "Remove file",
      nl: "Verwijder bestand",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Lab report",
          description:
            "Upload your completed lab report for the titration experiment as a PDF file.",
          settings: {},
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Practicumverslag",
          description:
            "Upload je afgeronde practicumverslag van het titratie-experiment als pdf-bestand.",
        },
      },
    },
  },
  readme: { en: "./upload-file/README.md", nl: "./upload-file/README.nl.md" },
  previewImage: {
    en: "./upload-file/preview.png",
    nl: "./upload-file/preview.nl.png",
  },
});
