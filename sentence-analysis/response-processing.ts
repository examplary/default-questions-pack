import type { QuestionTypeResponseProcessingType } from "@examplary/schemas";

const responseProcessing: QuestionTypeResponseProcessingType = {
  condition: `=$join($.answer.value, '|') = $join($append($map($.question.settings.correctAnswer.segments, function($s) { $string($s.startToken) & '-' & $string($s.endToken) & ':' & $s.label }), $.question.settings.requirePersoonsvorm = false or $.question.settings.correctAnswer.persoonsvorm = null ? [] : ['PV:' & $string($.question.settings.correctAnswer.persoonsvorm.startToken) & '-' & $string($.question.settings.correctAnswer.persoonsvorm.endToken)]), '|')
`,
  testCases: [
    {
      question: {
        settings: {
          sentence: "Vandaag maken wij de jaarplanner voor klas 2.",
          requirePersoonsvorm: true,
          correctAnswer: {
            raw: "Vandaag maken wij de jaarplanner voor klas 2.",
            tokens: [
              {
                index: 0,
                text: "Vandaag",
                start: 0,
                end: 7,
              },
              {
                index: 1,
                text: "maken",
                start: 8,
                end: 13,
              },
              {
                index: 2,
                text: "wij",
                start: 14,
                end: 17,
              },
              {
                index: 3,
                text: "de",
                start: 18,
                end: 20,
              },
              {
                index: 4,
                text: "jaarplanner",
                start: 21,
                end: 32,
              },
              {
                index: 5,
                text: "voor",
                start: 33,
                end: 37,
              },
              {
                index: 6,
                text: "klas",
                start: 38,
                end: 42,
              },
              {
                index: 7,
                text: "2.",
                start: 43,
                end: 45,
              },
            ],
            segments: [
              {
                startToken: 0,
                endToken: 0,
                label: "BWB",
              },
              {
                startToken: 1,
                endToken: 1,
                label: "WG",
              },
              {
                startToken: 2,
                endToken: 2,
                label: "OW",
              },
              {
                startToken: 3,
                endToken: 4,
                label: "LV",
              },
              {
                startToken: 5,
                endToken: 7,
                label: "BWB",
              },
            ],
            persoonsvorm: {
              startToken: 1,
              endToken: 1,
            },
          },
        },
      },
      answer: {
        value: ["0-0:BWB", "1-1:WG", "2-2:OW", "3-4:LV", "5-7:BWB", "PV:1-1"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          sentence: "Vandaag maken wij de jaarplanner voor klas 2.",
          requirePersoonsvorm: true,
          correctAnswer: {
            segments: [
              {
                startToken: 0,
                endToken: 0,
                label: "BWB",
              },
              {
                startToken: 1,
                endToken: 1,
                label: "WG",
              },
            ],
            persoonsvorm: {
              startToken: 1,
              endToken: 1,
            },
          },
        },
      },
      answer: {
        value: ["0-0:OW", "1-1:WG", "PV:1-1"],
      },
      expectedOutcome: false,
    },
  ],
};

export default responseProcessing;
