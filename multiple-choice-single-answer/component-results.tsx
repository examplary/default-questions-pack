import { FrontendResultsComponent, RichTextDisplay } from "@examplary/ui";

import { OptionFeedback } from "./components/option-feedback";

const ResultsComponent: FrontendResultsComponent = ({
  question,
  answer,
  feedback,
}) => {
  if (!answer.value) return null;

  let value = answer.value as string;
  if (Array.isArray(answer.value)) {
    value = (answer.value as string[]).join(", ");
  }

  let index;
  if (question.settings?.options?.includes(value)) {
    index = question.settings.options.indexOf(value);
  }
  const hasIndex = index !== undefined && index !== -1;

  return (
    <div className="flex gap-1">
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
};

export default ResultsComponent;
