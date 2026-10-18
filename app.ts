import { defineApp } from "@examplary/apps";

import dateYear from "./date-year/question-type";
import essay from "./essay/question-type";
import examIntro from "./exam-intro/question-type";
import examOutro from "./exam-outro/question-type";
import fillInBlank from "./fill-in-blank/question-type";
import formula from "./formula/question-type";
import matching from "./matching/question-type";
import mathNotebook from "./math-notebook/question-type";
import multiLineText from "./multi-line-text/question-type";
import multipleChoiceMultipleAnswers from "./multiple-choice-multiple-answers/question-type";
import multipleChoiceSingleAnswer from "./multiple-choice-single-answer/question-type";
import paragraph from "./paragraph/question-type";
import personaChat from "./persona-chat/question-type";
import pictureChoice from "./picture-choice/question-type";
import selectPoint from "./select-point/question-type";
import selectWords from "./select-words/question-type";
import sentenceAnalysis from "./sentence-analysis/question-type";
import sequence from "./sequence/question-type";
import singleLineText from "./single-line-text/question-type";
import trueFalse from "./true-false/question-type";
import uploadFile from "./upload-file/question-type";
import voiceRecorder from "./voice-recorder/question-type";

export default defineApp({
  id: "examplary.default-questions",
  version: "1.0.0",
  public: true,
  preinstalled: true,
  name: { en: "Default questions", nl: "Standaardvragen" },
  description: {
    en: "The question types every Examplary workspace starts with, from multiple choice to essays, formulas and voice recordings.",
    nl: "De vraagtypes waar elke Examplary-werkruimte mee begint, van meerkeuze tot essays, formules en spraakopnames.",
  },
  website: "https://github.com/examplary/default-questions-pack",
  questionTypes: [
    dateYear,
    essay,
    examIntro,
    examOutro,
    fillInBlank,
    formula,
    matching,
    mathNotebook,
    multiLineText,
    multipleChoiceMultipleAnswers,
    multipleChoiceSingleAnswer,
    paragraph,
    personaChat,
    pictureChoice,
    selectPoint,
    selectWords,
    sentenceAnalysis,
    sequence,
    singleLineText,
    trueFalse,
    uploadFile,
    voiceRecorder,
  ],
});
