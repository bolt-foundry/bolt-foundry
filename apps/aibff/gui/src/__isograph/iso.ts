import type { IsographEntrypoint } from "@isograph/react";
import type { Query__EntrypointHello__param } from "./Query/EntrypointHello/param_type";
import type { Query__Hello__param } from "./Query/Hello/param_type";

// This is the type given to regular client fields.
// This means that the type of the exported iso literal is exactly
// the type of the passed-in function, which takes one parameter
// of type TParam.
type IdentityWithParam<TParam extends object> = <TClientFieldReturn>(
  clientField: (param: TParam) => TClientFieldReturn,
) => (param: TParam) => TClientFieldReturn;

// This is the type given it to client fields with @component.
// This means that the type of the exported iso literal is exactly
// the type of the passed-in function, which takes two parameters.
// The first has type TParam, and the second has type TComponentProps.
//
// TComponentProps becomes the types of the props you must pass
// whenever the @component field is rendered.
type IdentityWithParamComponent<TParam extends object> = <
  TClientFieldReturn,
  TComponentProps = Record<PropertyKey, never>,
>(
  clientComponentField: (
    data: TParam,
    componentProps: TComponentProps,
  ) => TClientFieldReturn,
) => (data: TParam, componentProps: TComponentProps) => TClientFieldReturn;

type WhitespaceCharacter = " " | "\t" | "\n";
type Whitespace<In> = In extends `${WhitespaceCharacter}${infer In}`
  ? Whitespace<In>
  : In;

// This is a recursive TypeScript type that matches strings that
// start with whitespace, followed by TString. So e.g. if we have
// ```
// export function iso<T>(
//   isographLiteralText: T & MatchesWhitespaceAndString<'field Query.foo', T>
// ): Bar;
// ```
// then, when you call
// ```
// const x = iso(`
//   field Query.foo ...
// `);
// ```
// then the type of `x` will be `Bar`, both in VSCode and when running
// tsc. This is how we achieve type safety — you can only use fields
// that you have explicitly selected.
type MatchesWhitespaceAndString<
  TString extends string,
  T,
> = Whitespace<T> extends `${TString}${string}` ? T : never;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<"field Query.EntrypointHello", T>,
): IdentityWithParam<Query__EntrypointHello__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<"field Query.Hello", T>,
): IdentityWithParamComponent<Query__Hello__param>;

export function iso(_isographLiteralText: string): // deno-lint-ignore no-explicit-any
| IdentityWithParam<any>
// deno-lint-ignore no-explicit-any
| IdentityWithParamComponent<any>
// deno-lint-ignore no-explicit-any
| IsographEntrypoint<any, any, any> {
  throw new Error(
    "iso: Unexpected invocation at runtime. Either the Babel transform " +
      "was not set up, or it failed to identify this call site. Make sure it " +
      "is being used verbatim as `iso`. If you cannot use the babel transform, " +
      "set options.no_babel_transform to true in your Isograph config. ",
  );
}
