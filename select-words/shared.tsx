import { cn, RichTextDisplay } from "@examplary/ui";
import type { KeyboardEvent, MouseEvent } from "react";

const PART = /\[([^\]]+)\]/g;
const INLINE_MATH = /(<inline-math\b[\s\S]*?<\/inline-math>)/;

// Replaces each [part] with `replace(part)`, leaving math alone
const replaceParts = (text: string, replace: (part: string) => string) =>
  text
    .split(INLINE_MATH)
    .map((chunk, i) =>
      i % 2 ? chunk : chunk.replace(PART, (_, part) => replace(part)),
    )
    .join("");

export const getParts = (text: string) => {
  const parts: string[] = [];
  replaceParts(text, (part) => {
    parts.push(part);
    return part;
  });
  return parts;
};

export const toggle = (selected: string[], part: string) =>
  selected.includes(part)
    ? selected.filter((p) => p !== part)
    : [...selected, part];

// Swaps each [part] for a span, so the selection can be shown through data
// attributes while the surrounding rich text stays a single document
const withParts = (text: string, selected: string[], correct: string[]) => {
  let index = 0;
  return replaceParts(text, (part) => {
    const attributes = [
      `data-part="${index++}"`,
      selected.includes(part) && "data-selected",
      correct.includes(part) && "data-correct",
    ];
    return `<span ${attributes.filter(Boolean).join(" ")} role="button" tabindex="0">${part}</span>`;
  });
};

// Shows the text with its [parts] selectable; clicking a part calls
// `onToggle`. With `showParts` off, nothing gives the parts away until they
// are selected.
export const SelectableText = ({
  text,
  selected = [],
  correct = [],
  showParts = true,
  onToggle,
}: {
  text: string;
  selected?: string[];
  correct?: string[];
  showParts?: boolean;
  onToggle?: (part: string) => void;
}) => {
  const handleToggle = (event: MouseEvent | KeyboardEvent) => {
    const part = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-part]",
    );
    if (!part || !onToggle) return;
    event.preventDefault();
    onToggle(getParts(text)[Number(part.dataset.part)]);
  };

  return (
    <div
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleToggle(event);
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
