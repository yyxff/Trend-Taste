import { Language, languagePromptMap } from "../constants/language";

/**
 * Gets the language prompt based on preferred language
 * @param language preferred language
 * @returns language prompt
 */
export function getLanguagePrompt(language: string) {
    return languagePromptMap[language as Language] || languagePromptMap[Language.EN];
}
