import { FrontendAssessmentComponent } from "@examplary/ui";

import { formatPoints, parsePoints, Point, PointImage } from "./shared";

const AssessmentComponent: FrontendAssessmentComponent = ({
  question,
  answer,
  saveAnswer,
  reviewMode,
}) => {
  const points = parsePoints(answer?.value);
  const maxChoices = question.settings.maxChoices ?? 1;

  const save = (value: Point[]) =>
    saveAnswer({ value: formatPoints(value), completed: value.length > 0 });

  return (
    <PointImage
      settings={question.settings}
      points={points}
      areas={reviewMode ? question.settings.areas : []}
      // With the maximum reached, a new point replaces the earliest one
      onClick={(point) =>
        save([...points, point].slice(maxChoices > 0 ? -maxChoices : 0))
      }
      onPointClick={(index) => save(points.filter((_, i) => i !== index))}
    />
  );
};

export default AssessmentComponent;
