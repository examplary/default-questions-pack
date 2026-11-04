import { defineApp } from "@examplary/apps";

import DateYear from "./date-year/definition";
import Essay from "./essay/definition";
import ExamIntro from "./exam-intro/definition";
import ExamOutro from "./exam-outro/definition";
import FillInBlank from "./fill-in-blank/definition";
import Formula from "./formula/definition";
import Matching from "./matching/definition";
import MathNotebook from "./math-notebook/definition";
import MultiLineText from "./multi-line-text/definition";
import MultipleChoiceMultipleAnswers from "./multiple-choice-multiple-answers/definition";
import MultipleChoiceSingleAnswer from "./multiple-choice-single-answer/definition";
import Paragraph from "./paragraph/definition";
import PersonaChat from "./persona-chat/definition";
import PictureChoice from "./picture-choice/definition";
import SelectPoint from "./select-point/definition";
import SelectWords from "./select-words/definition";
import SentenceAnalysis from "./sentence-analysis/definition";
import Sequence from "./sequence/definition";
import SingleLineText from "./single-line-text/definition";
import TrueFalse from "./true-false/definition";
import UploadFile from "./upload-file/definition";
import VoiceRecorder from "./voice-recorder/definition";

const app = defineApp({
  id: "examplary.apps.default-question-types",
  name: { en: "Default question types", nl: "Standaard vraagtypen" },
  description: {
    en: "The question types every workspace has",
    nl: "De vraagtypen die elke werkruimte heeft",
  },
  readme: "./README.md",
  public: true,
  preinstalled: true,
  hidden: true,
});

app.addCapability(DateYear);
app.addCapability(Essay);
app.addCapability(ExamIntro);
app.addCapability(ExamOutro);
app.addCapability(FillInBlank);
app.addCapability(Formula);
app.addCapability(Matching);
app.addCapability(MathNotebook);
app.addCapability(MultiLineText);
app.addCapability(MultipleChoiceMultipleAnswers);
app.addCapability(MultipleChoiceSingleAnswer);
app.addCapability(Paragraph);
app.addCapability(PersonaChat);
app.addCapability(PictureChoice);
app.addCapability(SelectPoint);
app.addCapability(SelectWords);
app.addCapability(SentenceAnalysis);
app.addCapability(Sequence);
app.addCapability(SingleLineText);
app.addCapability(TrueFalse);
app.addCapability(UploadFile);
app.addCapability(VoiceRecorder);

export default app;
