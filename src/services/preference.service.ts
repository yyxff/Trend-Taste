import { getPreferenceById } from "../repositories/preference.repo";

export async function fetchUserPreferredLanguage(channelId: string) {
    const preference = await getPreferenceById(channelId);
    return preference?.language;
}