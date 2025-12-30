import * as ping from "./ping";
import * as github_trending from "./github-trending";
import * as set_language from "./task/set-language";
import * as set_type from "./task/set-type";
import * as set_schedule from "./task/set-schedule";

export const commands = {
    ping,
    "github-trending": github_trending,
    "set-language": set_language,
    "set-type": set_type,
    "set-schedule": set_schedule,
}