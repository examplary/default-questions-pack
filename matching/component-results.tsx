import { cn, FrontendResultsComponent, RichTextDisplay } from "@examplary/ui";

import { findLabel, getMatchingData, splitPair } from "./shared";

const ResultsComponent: FrontendResultsComponent = ({ answer, question }) => {
  if (!answer.value) return null;

  if (typeof answer.value === "string") {
    return <RichTextDisplay>{answer.value}</RichTextDisplay>;
  }

  const { left, right, correctAnswer } = getMatchingData(question.settings);
  const leftValues = left.map((option) => option.value);
  const horizontal =
    question.settings.layout === "horizontal" && left.length <= 4;

  return (
    <div className={cn("flex flex-col gap-2", horizontal && "md:flex-row!")}>
      {answer.value?.map?.((option: string, index: number) => {
        const pair = splitPair(option, leftValues);
        const incorrect =
          correctAnswer.length > 0 && !correctAnswer.includes(option);

        return (
          <div
            className={cn(
              "flex items-center",
              horizontal && "flex-1 md:flex-col",
            )}
            data-type="matching-option"
            key={index}
          >
            <div className="flex-1 w-full border border-border print:border-black rounded-xl p-1.5 px-3 overflow-hidden">
              <RichTextDisplay>{findLabel(left, pair.left)}</RichTextDisplay>
            </div>
            <div
              className={cn(
                "h-0 w-5 border-t border-border print:border-black",
                horizontal && "md:h-5 md:w-0 md:border-t-0 md:border-l",
              )}
            />
            <div
              className={cn(
                "flex-1 w-full border border-border print:border-black rounded-xl p-1.5 px-3 overflow-hidden",
                incorrect && "bg-red-100 border-red-100",
              )}
            >
              <RichTextDisplay>{findLabel(right, pair.right)}</RichTextDisplay>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsComponent;
