import * as run from "./task/run";
import * as set_language from "./task/set-language";
import * as set_type from "./task/set-type";
import * as set_schedule from "./task/set-schedule";
import * as enable from "./task/enable";
import * as disable from "./task/disable";
import * as info from "./task/info";
import * as help from "./help";

export const commands = {
    enable,
    disable,
    run,
    info,
    help,
    "set-language": set_language,
    "set-type": set_type,
    "set-schedule": set_schedule,
}