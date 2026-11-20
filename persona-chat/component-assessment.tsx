import { useEffect, useRef, useState } from "react";

import {
  Button,
  ChatInput,
  type FrontendAssessmentComponent,
} from "@examplary/ui";

import { ChatTranscript } from "./lib/chat-transcript";
import { schema } from "./schema";
import {
  type Chat,
  countAssistantTurns,
  getMaxTurns,
  isFinalTurn,
  resolveTurn,
  transcriptValue,
} from "./shared";
import { finalTurnNote, systemPrompt } from "./system-prompt";

const AssessmentComponent: FrontendAssessmentComponent = ({
  question,
  saveAnswer,
  answer,
  isPreview,
  reviewMode,
  api,
  i18n,
  t,
}) => {
  const [loading, setLoading] = useState(false);
  // The chat to send again when the AI failed to reply to it
  const [failedChat, setFailedChat] = useState<Chat | null>(null);
  const started = useRef(false);

  const maxTurns = getMaxTurns(question.settings);

  const [complete, setComplete] = useState(answer?.completed || false);
  const [chat, setChat] = useState<Chat>(
    () =>
      answer?.context?.chat || [
        {
          role: "system",
          content: systemPrompt(question, i18n?.language),
        },
      ],
  );

  // Auto-start the conversation if the AI is set to start
  useEffect(() => {
    if (
      question.settings?.aiStarts &&
      chat.length === 1 &&
      !complete &&
      !reviewMode
    ) {
      if (started.current) return;
      if (!question.settings?.instructions) return;
      started.current = true;
      // oxlint-disable-next-line react/immutability -- runs in an effect, after nextStep is defined
      nextStep(chat);
    }
  }, []);

  const nextStep = async (newChat: Chat) => {
    if (loading) return;

    setLoading(true);
    setFailedChat(null);

    const priorAssistantTurns = countAssistantTurns(newChat);
    const messages: Chat = [...newChat];

    if (messages.length === 1) {
      messages.push({
        role: "user",
        content: "(conversation started)",
        hidden: true,
      });
      newChat = messages.slice();
    }

    // Warn the model that it is about to run out of turns, so it wraps up
    // itself instead of being cut off halfway through a question
    if (isFinalTurn({ priorAssistantTurns, maxTurns })) {
      messages.push({ role: "user", content: finalTurnNote, hidden: true });
    }

    let response;
    try {
      response = await (api as any).ai.generate({ messages, schema });
    } catch (error) {
      console.error(error);
      setFailedChat(newChat);
      return;
    } finally {
      setLoading(false);
    }

    response = resolveTurn(response, { priorAssistantTurns, maxTurns });

    const updatedChat: Chat = [...newChat, { role: "assistant", ...response }];

    setChat(updatedChat);

    if (response.completed) setComplete(true);

    saveAnswer({
      value: transcriptValue(updatedChat),
      context: { chat: updatedChat },
      completed: response.completed,
    });
  };

  const submit = async (message: string) => {
    const newChat: Chat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    nextStep(newChat);
  };

  if (!api) {
    return (
      <div className="bg-red-50 text-red-900 p-5 rounded-lg w-full text-sm text-center">
        {t("error-no-api")}
      </div>
    );
  }

  return (
    <div className="w-full">
      <ChatTranscript messages={chat} typing={loading && !complete} t={t} />

      {failedChat && !loading && (
        <div
          className="bg-red-50 text-red-900 mt-4 p-4 rounded-lg w-full text-sm flex items-center justify-between gap-4"
          role="alert"
        >
          {t("error-no-reply")}
          <Button variant="secondary" onClick={() => nextStep(failedChat)}>
            {t("try-again")}
          </Button>
        </div>
      )}

      {complete ? (
        <div
          className="bg-green-100 mt-10 p-4 rounded-xl text-center font-semibold w-full text-sm"
          key="done"
        >
          {t("completed")}
        </div>
      ) : (
        <ChatInput
          loading={loading}
          submit={submit}
          autoFocus={!isPreview}
          placeholder={
            chat.length < 2 ? t("start-placeholder") : t("response-placeholder")
          }
        />
      )}
    </div>
  );
};

export default AssessmentComponent;
