export enum Language {
  EN = "EN",
  ZH = "ZH",
}

export const languagePromptMap: Record<Language, string> = {
  [Language.EN]: "Provide the response in English.",
  [Language.ZH]: "提供中文的回答。",
};
