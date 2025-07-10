export type Maybe<T> = T | null;

declare const __nominal__type: unique symbol;
export type Nominal<Type, Identifier> = Type & {
  readonly [__nominal__type]: Identifier;
};

export type BfGid = Nominal<string, "BfGid">;
export type Unixtime = Nominal<number, "Unixtime">;
export type JsUnixtime = Nominal<number, "JsUnixtime">;

export function convertJsUnixtimeToUnixtime(value: JsUnixtime): Unixtime {
  const unixtime = value / 1000;
  return unixtime as Unixtime;
}

export function convertUnixtimeToJsUnixtime(value: Unixtime): JsUnixtime {
  const jsUnixtime = value * 1000;
  return jsUnixtime as JsUnixtime;
}

export type PartialJson<T> = {
  [P in keyof T]?: Exclude<T[P], undefined>;
};

export type NonUndefined<T> = T extends undefined ? never : T;

export type StrictPartialJson<T> = {
  [K in keyof T]?: NonUndefined<T[K]>;
};
