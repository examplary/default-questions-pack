import type { QuestionTypeResponseProcessingType } from "@examplary/schemas";

// Correct when no point is outside an area, and the points hit as many areas as the student
// may place points (or every area, without a limit)
const responseProcessing: QuestionTypeResponseProcessingType = {
  condition: `=(
  $inside := function($point, $area) {
    $area.shape = "circle"
      ? $power($point.x - $area.coords[0], 2) + $power($point.y - $area.coords[1], 2) <= $power($area.coords[2], 2)
      : $point.x >= $area.coords[0] and $point.x <= $area.coords[2] and $point.y >= $area.coords[1] and $point.y <= $area.coords[3]
  };
  $points := $map($.answer.value, function($point) {
    ($xy := $split($point, ","); { "x": $number($xy[0]), "y": $number($xy[1]) })
  });
  $areas := $.question.settings.areas;
  $maxChoices := $exists($.question.settings.maxChoices) ? $.question.settings.maxChoices : 1;
  $needed := $maxChoices > 0 and $maxChoices < $count($areas) ? $maxChoices : $count($areas);
  $hitsArea := function($point) { $count($filter($areas, function($area) { $inside($point, $area) })) > 0 };
  $isHit := function($area) { $count($filter($points, function($point) { $inside($point, $area) })) > 0 };
  $count($points) > 0
    and $count($filter($points, $hitsArea)) = $count($points)
    and $count($filter($areas, $isHit)) >= $needed
)
`,
  testCases: [
    {
      question: {
        settings: {
          areas: [
            {
              shape: "circle",
              coords: [191, 393, 10],
            },
          ],
        },
      },
      answer: {
        value: ["195,390"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          areas: [
            {
              shape: "circle",
              coords: [191, 393, 10],
            },
          ],
        },
      },
      answer: {
        value: ["220,390"],
      },
      expectedOutcome: false,
    },
    {
      question: {
        settings: {
          areas: [
            {
              shape: "rect",
              coords: [0, 0, 50, 50],
            },
          ],
        },
      },
      answer: {
        value: ["10,40"],
      },
      expectedOutcome: true,
    },
    {
      question: {
        settings: {
          areas: [
            {
              shape: "circle",
              coords: [191, 393, 10],
            },
            {
              shape: "rect",
              coords: [0, 0, 50, 50],
            },
          ],
          maxChoices: 2,
        },
      },
      answer: {
        value: ["191,393"],
      },
      expectedOutcome: false,
    },
    // One point, several areas: any of them is correct
    {
      question: {
        settings: {
          areas: [
            {
              shape: "circle",
              coords: [206, 318, 34],
            },
            {
              shape: "circle",
              coords: [501, 505, 34],
            },
            {
              shape: "circle",
              coords: [647, 317, 34],
            },
          ],
          maxChoices: 1,
        },
      },
      answer: {
        value: ["511,507"],
      },
      expectedOutcome: true,
    },
    // Without a limit, every area needs a point
    {
      question: {
        settings: {
          areas: [
            {
              shape: "circle",
              coords: [191, 393, 10],
            },
            {
              shape: "rect",
              coords: [0, 0, 50, 50],
            },
          ],
          maxChoices: 0,
        },
      },
      answer: {
        value: ["191,393", "10,10"],
      },
      expectedOutcome: true,
    },
  ],
};

export default responseProcessing;
