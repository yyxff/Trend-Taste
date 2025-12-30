import * as ping from "./ping";
import * as run from "./task/run";
import * as set_language from "./task/set-language";
import * as set_type from "./task/set-type";
import * as set_schedule from "./task/set-schedule";
import * as enable from "./task/enable";
import * as disable from "./task/disable";

export const commands = {
    ping,
    enable,
    disable,
    run,
    "set-language": set_language,
    "set-type": set_type,
    "set-schedule": set_schedule,
}