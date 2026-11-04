import { FrontendPrintComponent } from "@examplary/ui";

import { SelectableText } from "./shared";

const PrintComponent: FrontendPrintComponent = ({ question }) => (
  <div className="mt-2">
    <SelectableText
      text={question.settings.text || ""}
      showParts={question.settings.showParts !== false}
    />
  </div>
);

export default PrintComponent;
