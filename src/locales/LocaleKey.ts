import type * as locales from "./index";

type StringKeyof<TType> = keyof TType extends string ? keyof TType : never;

export type LocaleKey = StringKeyof<typeof locales>;
