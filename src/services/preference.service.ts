import { getPreferenceById } from "../repositories/preference.repo";
import { Language } from "../constants/language";

export async function fetchUserPreferredLanguage(channelId: string) {
    const preference = await getPreferenceById(channelId);
    return preference?.language;
}
