import { FrontendPrintComponent } from "@examplary/ui";

import { PointImage } from "./shared";

const PrintComponent: FrontendPrintComponent = ({ question }) => (
  <div className="mt-2">
    <PointImage settings={question.settings} />
  </div>
);

export default PrintComponent;
