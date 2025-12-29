import * as ping from "./ping";
import * as language from "./language";
import * as github_trending from "./github-trending";
import * as set_type from "./task/set-type";

export const commands = {
    ping,
    language,
    "github-trending": github_trending,
    "set-type": set_type,
}