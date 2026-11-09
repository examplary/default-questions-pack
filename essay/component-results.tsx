import { FrontendResultsComponent, RichTextDisplay } from "@examplary/ui";
import stripTags from "striptags";
import count from "word-count";

const ResultsComponent: FrontendResultsComponent = ({ answer, t }) => {
  const value = (answer.value as string) || "";
  const wordCount = count(stripTags(value));

  if (!value)
    return (
      <span className="text-zinc-500 bg-zinc-100 rounded p-1 px-2 font-medium text-sm">
        {t("empty-answer")}
      </span>
    );

  return (
    <>
      <RichTextDisplay>{value}</RichTextDisplay>
      {wordCount ? (
        <div className="text-gray-500 text-sm mt-2 select-none">
          {t("word-count", { count: wordCount })}
        </div>
      ) : null}
    </>
  );
};

export default ResultsComponent;
