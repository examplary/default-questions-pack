import { FrontendResultsComponent, RichTextDisplay } from "@examplary/ui";

import { OptionFeedback } from "./components/option-feedback";

const ResultsComponent: FrontendResultsComponent = ({
  question,
  answer,
  feedback,
}) => {
  if (!answer.value) return null;

  let values = answer.value as string[];
  if (!Array.isArray(answer.value)) {
    values = [answer.value as string];
  }

  return (
    <div className="flex flex-col gap-2">
      {values.map((value) => {
        const index = question.settings?.options?.indexOf(value);
        const hasIndex = index !== undefined && index !== -1;

        return (
          <div key={value} className="flex gap-1">
            {answer?.context?._scanned && hasIndex ? (
              <span className="font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
            ) : null}
            <div className="flex-1">
              <RichTextDisplay>{value}</RichTextDisplay>
              <OptionFeedback feedback={feedback?.byValue?.[value]} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsComponent;
