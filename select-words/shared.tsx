import { cn, RichTextDisplay } from "@examplary/ui";
import type { KeyboardEvent, MouseEvent } from "react";

const PART = /\[([^\]]+)\]/g;

export const countParts = (text: string) => [...text.matchAll(PART)].length;

// Swaps each [part] for a span, so the selection can be shown through data
// attributes while the surrounding rich text stays a single document
const withParts = (text: string, selected: number[], correct: number[]) => {
  let index = 0;
  return text.replace(PART, (_, part) => {
    const i = index++;
    const attributes = [
      `data-part="${i}"`,
      selected.includes(i) && "data-selected",
      correct.includes(i) && "data-correct",
    ];
    return `<span ${attributes.filter(Boolean).join(" ")} role="button" tabindex="0">${part}</span>`;
  });
};

// Shows the text with its [parts] selectable; clicking a part calls `onToggle`.
// With `showParts` off, nothing gives the parts away until they are selected.
export const SelectableText = ({
  text,
  selected = [],
  correct = [],
  showParts = true,
  onToggle,
}: {
  text: string;
  selected?: number[];
  correct?: number[];
  showParts?: boolean;
  onToggle?: (index: number) => void;
}) => {
  const toggle = (event: MouseEvent | KeyboardEvent) => {
    const part = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-part]",
    );
    if (!part || !onToggle) return;
    event.preventDefault();
    onToggle(Number(part.dataset.part));
  };

  return (
    <div
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") toggle(event);
      }}
      className={cn(
        "[&_[data-part]]:rounded-lg",
        showParts &&
          "[&_[data-part]]:inline-block [&_[data-part]]:my-1 [&_[data-part]]:mx-0.5 [&_[data-part]]:px-2.5 [&_[data-part]]:py-0.5 [&_[data-part]]:border [&_[data-part]]:border-zinc-400",
        showParts &&
          onToggle &&
          "[&_[data-part]]:cursor-pointer [&_[data-part]:hover]:bg-yellow-100",
        "[&_[data-selected]]:bg-yellow-200 [&_[data-selected]]:border-yellow-600",
        "[&_[data-correct]]:underline [&_[data-correct]]:decoration-green-600 [&_[data-correct]]:decoration-2",
      )}
    >
      <RichTextDisplay>{withParts(text, selected, correct)}</RichTextDisplay>
    </div>
  );
};

// Toggles a part, dropping the earliest selection when the limit is reached
export const toggleSelection = (
  selected: number[],
  index: number,
  maxChoices = 0,
) => {
  if (selected.includes(index)) return selected.filter((i) => i !== index);
  const next = [...selected, index];
  return maxChoices > 0 ? next.slice(-maxChoices) : next;
};
