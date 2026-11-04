import {
  cn,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@examplary/ui";
import { ChevronDownIcon, PlusIcon, XIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { BLANK } from "./shared";

type T = (key: string | string[], options?: any) => string;

const sameValues = (a: string[], b: string[]) => {
  const clean = (list: string[]) =>
    list.map((value) => value.trim()).filter(Boolean);
  return clean(a).join("\n") === clean(b).join("\n");
};

// A list of text fields that can grow and shrink. The rows are kept locally,
// so a newly added row stays visible while it is still empty. When closed,
// only the label is shown.
const InputList = ({
  label,
  value,
  onChange,
  addLabel,
  isInvalid,
  autoFocus,
  open = true,
  openWith,
  t,
}: {
  label: ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
  addLabel: string;
  isInvalid?: (value: string) => boolean;
  autoFocus?: boolean;
  open?: boolean;
  // The rows to start with when the list is opened
  openWith?: string[];
  t: T;
}) => {
  const [rows, setRows] = useState(value.length ? value : [""]);
  const [focusIndex, setFocusIndex] = useState(autoFocus ? 0 : -1);

  // Starts over when reopened, as the rows left over from before may have
  // been cleared in the meantime
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const next = openWith ?? (value.length ? value : [""]);
      setRows(next);
      setFocusIndex(Math.max(next.indexOf(""), 0));
    }
  }

  // Picks up changes made elsewhere, such as an answer that's saved after the
  // list was shown. Changes from typing here only differ in empty rows and
  // spaces, which are kept.
  const [prevValue, setPrevValue] = useState(value);
  if (!sameValues(value, prevValue)) {
    setPrevValue(value);
    if (!sameValues(value, rows)) setRows(value.length ? value : [""]);
  }

  const update = (next: string[]) => {
    setRows(next);
    onChange(next);
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between min-h-6",
          open && "mb-1",
        )}
      >
        {typeof label === "string" ? (
          <Label className="mb-0 text-[13px]">{label}</Label>
        ) : (
          label
        )}
        {open && (
          <button
            type="button"
            className="p-1 text-zinc-400 hover:text-black cursor-pointer"
            title={addLabel}
            onClick={() => {
              setFocusIndex(rows.length);
              update([...rows, ""]);
            }}
          >
            <PlusIcon className="size-3.5" />
          </button>
        )}
      </div>
      {open && (
        <div
          className={cn(
            "border border-border overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black/10 transition",
            rows.length === 1 ? "rounded-2xl" : "rounded-lg",
          )}
        >
          {rows.map((row, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center group border-b border-border last:border-b-0!",
                isInvalid?.(row) && "bg-red-50 text-red-700",
              )}
            >
              <Input
                value={row}
                onChange={(e) =>
                  update(rows.map((r, i) => (i === index ? e.target.value : r)))
                }
                aria-invalid={isInvalid?.(row) || undefined}
                className="h-8 px-3 text-[13px] border-0 rounded-none bg-transparent dark:bg-transparent text-inherit focus-visible:ring-0"
                autoFocus={index === focusIndex}
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  className="p-1 mr-1 text-zinc-400 hover:text-red-600 cursor-pointer"
                  title={t("remove")}
                  onClick={() => update(rows.filter((_, i) => i !== index))}
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type BlankProps = {
  answers: string[];
  choices: string[];
  isMissingFromChoices: (answer: string) => boolean;
  onAnswersChange: (value: string[]) => void;
  onChoicesChange: (value: string[]) => void;
  defaultOpen?: boolean;
  t: T;
};

export const Blank = ({
  answers,
  choices,
  isMissingFromChoices,
  onAnswersChange,
  onChoicesChange,
  defaultOpen,
  t,
}: BlankProps) => {
  const [answer = "", ...alternatives] = answers;
  const answerMissingFromChoices = answers.some(isMissingFromChoices);
  const invalid =
    !answer.trim() || answer === BLANK || answerMissingFromChoices;
  const [showChoices, setShowChoices] = useState(choices.length > 0);

  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger
        className={cn(
          "mx-0.5 px-2 min-w-16 text-center rounded-3xl border leading-6 cursor-pointer inline-flex items-center justify-center gap-1",
          invalid
            ? "border-red-300 bg-red-50 text-red-700"
            : "border-zinc-300 bg-zinc-100",
        )}
      >
        {answer || <>&nbsp;</>}
        {alternatives.length > 0 && (
          <span className="text-xs text-zinc-500">+{alternatives.length}</span>
        )}
        {choices.length > 0 && <ChevronDownIcon className="size-3" />}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 space-y-3">
        <InputList
          label={t(answers.length > 1 ? "correct-answers" : "correct-answer")}
          value={answers}
          onChange={onAnswersChange}
          addLabel={t("add-answer")}
          isInvalid={isMissingFromChoices}
          autoFocus
          t={t}
        />
        <div className="mt-3">
          <InputList
            label={
              <Label className="mb-0 text-[13px]">
                <Switch
                  size="sm"
                  checked={showChoices}
                  onCheckedChange={(checked) => {
                    setShowChoices(checked);
                    // Starts off with the correct answer as an option, and
                    // without choices the blank is a free text input again
                    onChoicesChange(
                      checked && answer.trim() ? [answer.trim()] : [],
                    );
                  }}
                />
                {t("show-as-dropdown")}
              </Label>
            }
            open={showChoices}
            openWith={[answer.trim(), "", ""]}
            value={choices}
            // Empty options can't be picked from the dropdown
            onChange={(value) =>
              onChoicesChange(
                value.map((choice) => choice.trim()).filter(Boolean),
              )
            }
            addLabel={t("add-option")}
            t={t}
          />
        </div>
        {answerMissingFromChoices && (
          <p className="text-xs text-red-600">{t("answer-not-in-choices")}</p>
        )}
      </PopoverContent>
    </Popover>
  );
};
