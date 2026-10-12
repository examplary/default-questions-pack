import { FrontendResultsComponent } from "@examplary/ui";

import { parsePoints, PointImage } from "./shared";

const ResultsComponent: FrontendResultsComponent = ({ question, answer }) => {
  if (!answer.value) return null;

  return (
    <PointImage
      settings={question.settings}
      points={parsePoints(answer.value)}
      areas={question.settings.areas}
    />
  );
};

export default ResultsComponent;
