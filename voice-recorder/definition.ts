import { defineQuestionType } from "@examplary/apps";

export default defineQuestionType({
  id: "examplary.expansion.voice-recorder",
  name: {
    en: "Voice recorder",
    nl: "Spraakopname",
  },
  description: {
    en: "Ask the student to record a spoken answer.",
    nl: "Vraag de leerling om een gesproken antwoord op te nemen.",
  },
  icon: "./voice-recorder/icon.svg",
  components: {
    assessment: "./voice-recorder/component-assessment.tsx",
    results: "./voice-recorder/component-results.tsx",
  },
  generation: {
    enabled: true,
    instructions: `Use this question type when the student should answer by speaking. The question prompt should clearly tell the student what to explain, describe, pronounce, read aloud, or reflect on.

Settings may include maxDurationSeconds, the maximum recording length in seconds. Keep it reasonable for the task. Use 60-120 seconds for short spoken answers and up to 300 seconds for longer oral explanations.
`,
  },
  grading: {
    enabled: true,
    instructions: `The answer value is an array of \`[url, name, mimeType, durationSeconds]\` for the recording the student made. The audio file itself is attached to the end of this prompt, so listen to it and grade what the student actually said.
Grade on the content of the spoken answer. Only weigh delivery, pronunciation or fluency when the question asks for it. Ignore recording artefacts such as background noise or a slow start, and do not penalise the student for them.
`,
    fileInputs: "=answer.value[0]",
  },
  timeEstimateMinutes: 5,
  settings: [
    {
      id: "maxDurationSeconds",
      name: {
        en: "Maximum recording length",
        nl: "Maximale opnameduur",
      },
      description: "Maximum recording length in seconds.",
      type: "number",
      default: 300,
      min: 10,
      max: 900,
      step: 10,
    },
  ],
  translations: {
    "empty-answer": {
      en: "Empty answer",
      nl: "Leeg antwoord",
    },
    "start-recording": {
      en: "Start recording",
      nl: "Start opname",
    },
    "stop-recording": {
      en: "Stop recording",
      nl: "Stop opname",
    },
    recording: {
      en: "Recording",
      nl: "Neemt op",
    },
    uploading: {
      en: "Uploading recording...",
      nl: "Opname uploaden...",
    },
    "recorded-answer": {
      en: "Recorded answer",
      nl: "Opgenomen antwoord",
    },
    "replace-recording": {
      en: "Replace recording",
      nl: "Vervang opname",
    },
    "remove-recording": {
      en: "Remove recording",
      nl: "Verwijder opname",
    },
    "microphone-unavailable": {
      en: "Microphone recording is not available in this browser.",
      nl: "Microfoonopname is niet beschikbaar in deze browser.",
    },
    "microphone-denied": {
      en: "Could not access the microphone. Check browser permissions and try again.",
      nl: "Geen toegang tot de microfoon. Controleer de browserrechten en probeer opnieuw.",
    },
    "upload-unavailable": {
      en: "Recording upload is not available right now.",
      nl: "Uploaden van opnames is nu niet beschikbaar.",
    },
    "upload-failed": {
      en: "Could not upload the recording. Please try again.",
      nl: "De opname kon niet worden geüpload. Probeer het opnieuw.",
    },
  },
  // Example question and answer per language, the Dutch merged over the English
  metadata: {
    preview: {
      en: {
        question: {
          title: "Read aloud",
          description:
            "Read the following passage aloud, paying attention to pronunciation: “The quick brown fox jumps over the lazy dog.”",
          settings: { maxDurationSeconds: 120 },
        },
        answer: {},
      },
      nl: {
        question: {
          title: "Voorlezen",
          description:
            "Lees de volgende zin hardop voor en let goed op je uitspraak: “Pa’s wijze lynx bezag vroom het fikse aquaduct.”",
        },
      },
    },
  },
  readme: {
    en: "./voice-recorder/README.md",
    nl: "./voice-recorder/README.nl.md",
  },
  previewImage: {
    en: "./voice-recorder/preview.png",
    nl: "./voice-recorder/preview.nl.png",
  },
});
