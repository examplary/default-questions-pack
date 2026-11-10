import { RichTextDisplay } from "@examplary/ui";
import { MessageSquareTextIcon } from "lucide-react";

export const OptionFeedback = ({ feedback }: { feedback?: string }) =>
  feedback ? (
    <div className="mt-1 flex gap-1.5 text-[13px] text-zinc-600">
      <MessageSquareTextIcon className="size-3.5 mt-0.5 shrink-0" />
      <RichTextDisplay>{feedback}</RichTextDisplay>
    </div>
  ) : null;
