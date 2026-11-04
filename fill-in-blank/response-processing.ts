import type { QuestionTypeResponseProcessingType } from "@examplary/schemas";

const responseProcessing: QuestionTypeResponseProcessingType = {
  condition: `=(
  $caseInsensitive := $.question.settings.exactValuesCaseInsensitive = true;
  /* An empty blank may have been saved as null, and generated answers may be numbers */
  $normalise := function($v) {(
    $text := $type($v) = "null" ? "" : $type($v) = "number" ? $string($v) : $v;
    $caseInsensitive ? $trim($lowercase($text)) : $trim($text)
  )};
  $correctAnswer := $.question.settings.correctAnswer;
  $alternatives := $.question.settings.alternativeAnswers;
  $type($alternatives) != "array" or $count($reduce($alternatives, $append, [])) = 0
    ? (
      /* As before alternative answers were added, so that existing questions are graded exactly as they were */
      $given := $map($.answer.value, $normalise);
      $expected := $map($correctAnswer, $normalise);
      $.question.settings.exactOrder = false
        ? $join($sort($given), '|') = $join($sort($expected), '|')
        : $join($given, '|') = $join($expected, '|')
    )
    : (
      /* Normalised up front, as looking up a null by its index gives nothing */
      $given := $map($.answer.value, $normalise);
      $expected := $map($correctAnswer, $normalise);
      $blanks := $count($correctAnswer);
      $isAccepted := function($value, $blank) {
        $value in $append($expected[$blank], $map($alternatives[$blank], $normalise))
      };
      /* Without exact order, every answer needs its own blank that accepts it */
      $assign := function($i, $used) {
        $i = $blanks or $count($filter([0..$blanks - 1], function($blank) {
          $not($blank in $used) and $isAccepted($given[$i], $blank) and $assign($i + 1, $append($used, $blank))
        })) > 0
      };
      $blanks > 0 and $count($given) = $blanks and (
        $.question.settings.exactOrder = false
          ? $assign(0, [])
          : $count($filter([0..$blanks - 1], function($blank) { $not($isAccepted($given[$blank], $blank)) })) = 0
      )
    )
)
`,
  testCases: [
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
        },
      },
      answer: {
        value: ["Paris", "Madrid"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
        },
      },
      answer: {
        value: ["Madrid", "Paris"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___",
          correctAnswer: ["Paris"],
        },
      },
      answer: {
        value: ["paris"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___",
          correctAnswer: ["Paris"],
        },
      },
      answer: {
        value: ["  Paris "],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___",
          correctAnswer: ["Paris"],
          exactValuesCaseInsensitive: true,
        },
      },
      answer: {
        value: ["  paris "],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          exactOrder: true,
        },
      },
      answer: {
        value: ["Madrid", "Paris"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          exactOrder: false,
        },
      },
      answer: {
        value: ["Madrid", "Paris"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          exactOrder: false,
        },
      },
      answer: {
        value: ["Paris", "Paris"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          exactOrder: false,
        },
      },
      answer: {
        value: ["Paris"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          exactOrder: false,
          exactValuesCaseInsensitive: true,
        },
      },
      answer: {
        value: [" madrid", "paris "],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          alternativeAnswers: [[], []],
          exactOrder: false,
        },
      },
      answer: {
        value: ["Madrid", "Paris"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
        },
      },
      answer: {
        value: ["Paris", null],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Fill in ___ and ___",
          correctAnswer: ["Paris", null],
        },
      },
      answer: {
        value: ["Paris", ""],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "It ended in ___",
          correctAnswer: [1945],
        },
      },
      answer: {
        value: [" 1945 "],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "No blanks",
          correctAnswer: [],
        },
      },
      answer: {
        value: [],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___",
          correctAnswer: ["Paris"],
          alternativeAnswers: [["Parijs", "Paname"]],
        },
      },
      answer: {
        value: ["Paname"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___",
          correctAnswer: ["Paris"],
          alternativeAnswers: [["Parijs"]],
          exactValuesCaseInsensitive: true,
        },
      },
      answer: {
        value: [" PARIJS "],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          alternativeAnswers: [["Parijs"], []],
        },
      },
      answer: {
        value: ["Madrid", "Parijs"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          alternativeAnswers: [["Parijs"], []],
          exactOrder: false,
        },
      },
      answer: {
        value: ["Madrid", "Parijs"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          text: "___, ___ and ___",
          correctAnswer: ["a", "b", "c"],
          alternativeAnswers: [["x"], [], []],
          exactOrder: false,
        },
      },
      answer: {
        value: ["c", "x", "x"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          text: "Capital of France is ___ and Spain is ___",
          correctAnswer: ["Paris", "Madrid"],
          alternativeAnswers: [["Parijs"], []],
        },
      },
      answer: {
        value: ["Parijs", null],
      },
      expectedOutcome: false,
    },
  ],
};

export default responseProcessing;
