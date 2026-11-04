import { FrontendResultsComponent } from "@examplary/ui";

import { parseAreas, parsePoints, PointImage } from "./shared";

const ResultsComponent: FrontendResultsComponent = ({ question, answer }) => {
  if (!answer.value) return null;

  return (
    <PointImage
      settings={question.settings}
      points={parsePoints(answer.value)}
      areas={parseAreas(question.settings.areas)}
    />
  );
};

export default ResultsComponent;
