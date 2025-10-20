import type * as locales from ".";
import { LocaleKey } from "./LocaleKey";

export type Locale = (typeof locales)[LocaleKey];
