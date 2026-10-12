import { FrontendResultsComponent } from "@examplary/ui";

import { Point, PointImage } from "./shared";

const ResultsComponent: FrontendResultsComponent = ({ question, answer }) => {
  if (!answer.value) return null;

  return (
    <PointImage
      settings={question.settings}
      points={answer.value as Point[]}
      areas={question.settings.areas}
    />
  );
};

export default ResultsComponent;
