import * as ping from "./ping";
import * as set_language from "./task/set-language";
import * as github_trending from "./github-trending";
import * as set_type from "./task/set-type";

export const commands = {
    ping,
    "set-language": set_language,
    "github-trending": github_trending,
    "set-type": set_type,
}