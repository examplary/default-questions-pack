import {
  cn,
  FrontendAssessmentComponent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@examplary/ui";

import { BlankText, countBlanks, parseChoices } from "./shared";

const AssessmentComponent: FrontendAssessmentComponent = ({
  question,
  answer,
  saveAnswer,
  reviewMode,
  t,
}) => {
  const text = question.settings.text || "";
  const choices = parseChoices(question.settings.choices);
  const value = (answer?.value as string[]) || [];
  const blankCount = countBlanks(text);

  const setValue = (index: number, newValue: string) => {
    // Build the array from the blank count rather than from the existing
    // answer: skipping a blank would otherwise leave a hole, which serialises
    // to null and makes responseProcessing error out on it
    const newAnswer = Array.from(
      { length: blankCount },
      (_, i) => value[i] ?? "",
    );
    newAnswer[index] = newValue;
    saveAnswer({
      value: newAnswer,
      completed:
        newAnswer.filter((v) => v && v.trim().length > 0).length >= blankCount,
    });
  };

  return (
    <BlankText
      text={text}
      renderBlank={(index) =>
        choices[index]?.length ? (
          <Select
            value={value[index] || ""}
            onValueChange={(newValue) => setValue(index, newValue)}
          >
            <SelectTrigger
              className="w-auto min-w-32 h-8 py-0 m-0.5 mx-1 inline-flex rounded-lg"
              data-index={index}
            >
              <SelectValue
                placeholder={
                  reviewMode
                    ? question.settings.correctAnswer?.[index]
                    : t("choose")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {choices[index].map((choice, choiceIndex) => (
                <SelectItem key={choiceIndex} value={choice}>
                  {choice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            className={cn(
              "w-48 px-1.5 py-0 m-0.5 rounded-lg h-8 inline-flex mx-1",
              reviewMode && "placeholder:text-green-800/50",
            )}
            value={value[index] || ""}
            data-index={index}
            placeholder={
              reviewMode ? question.settings.correctAnswer?.[index] : undefined
            }
            onChange={(event) => setValue(index, event.currentTarget.value)}
          />
        )
      }
    />
  );
};

export default AssessmentComponent;
