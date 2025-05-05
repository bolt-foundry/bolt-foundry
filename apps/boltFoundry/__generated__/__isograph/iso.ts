import type { IsographEntrypoint } from '@isograph/react';
import { type CurrentViewer__LoginWithGoogleButton__param } from './CurrentViewer/LoginWithGoogleButton/param_type.ts';
import { type Mutation__JoinWaitlist__param } from './Mutation/JoinWaitlist/param_type.ts';
import { type Mutation__LoginWithEmailDevCurrentViewer__param } from './Mutation/LoginWithEmailDevCurrentViewer/param_type.ts';
import { type Mutation__LoginWithGoogleCurrentViewer__param } from './Mutation/LoginWithGoogleCurrentViewer/param_type.ts';
import { type Query__EntrypointHome__param } from './Query/EntrypointHome/param_type.ts';
import { type Query__EntrypointLogin__param } from './Query/EntrypointLogin/param_type.ts';
import { type Query__Home__param } from './Query/Home/param_type.ts';
import { type Query__LoginPage__param } from './Query/LoginPage/param_type.ts';
import entrypoint_Mutation__JoinWaitlist from '../__isograph/Mutation/JoinWaitlist/entrypoint.ts';
import entrypoint_Mutation__LoginWithEmailDevCurrentViewer from '../__isograph/Mutation/LoginWithEmailDevCurrentViewer/entrypoint.ts';
import entrypoint_Mutation__LoginWithGoogleCurrentViewer from '../__isograph/Mutation/LoginWithGoogleCurrentViewer/entrypoint.ts';
import entrypoint_Query__EntrypointHome from '../__isograph/Query/EntrypointHome/entrypoint.ts';
import entrypoint_Query__EntrypointLogin from '../__isograph/Query/EntrypointLogin/entrypoint.ts';

// This is the type given to regular client fields.
// This means that the type of the exported iso literal is exactly
// the type of the passed-in function, which takes one parameter
// of type TParam.
type IdentityWithParam<TParam extends object> = <TClientFieldReturn>(
  clientField: (param: TParam) => TClientFieldReturn
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
  clientComponentField: (data: TParam, componentProps: TComponentProps) => TClientFieldReturn
) => (data: TParam, componentProps: TComponentProps) => TClientFieldReturn;

type WhitespaceCharacter = ' ' | '\t' | '\n';
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
  T
> = Whitespace<T> extends `${TString}${string}` ? T : never;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field CurrentViewer.LoginWithGoogleButton', T>
): IdentityWithParamComponent<CurrentViewer__LoginWithGoogleButton__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.JoinWaitlist', T>
): IdentityWithParam<Mutation__JoinWaitlist__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.LoginWithEmailDevCurrentViewer', T>
): IdentityWithParam<Mutation__LoginWithEmailDevCurrentViewer__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.LoginWithGoogleCurrentViewer', T>
): IdentityWithParam<Mutation__LoginWithGoogleCurrentViewer__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointHome', T>
): IdentityWithParam<Query__EntrypointHome__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointLogin', T>
): IdentityWithParam<Query__EntrypointLogin__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.Home', T>
): IdentityWithParamComponent<Query__Home__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.LoginPage', T>
): IdentityWithParamComponent<Query__LoginPage__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.JoinWaitlist', T>
): typeof entrypoint_Mutation__JoinWaitlist;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.LoginWithEmailDevCurrentViewer', T>
): typeof entrypoint_Mutation__LoginWithEmailDevCurrentViewer;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.LoginWithGoogleCurrentViewer', T>
): typeof entrypoint_Mutation__LoginWithGoogleCurrentViewer;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointHome', T>
): typeof entrypoint_Query__EntrypointHome;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointLogin', T>
): typeof entrypoint_Query__EntrypointLogin;

export function iso(isographLiteralText: string):
  | IdentityWithParam<any>
  | IdentityWithParamComponent<any>
  | IsographEntrypoint<any, any, any>
{
  switch (isographLiteralText) {
    case 'entrypoint Mutation.JoinWaitlist':
      return entrypoint_Mutation__JoinWaitlist;
    case 'entrypoint Mutation.LoginWithEmailDevCurrentViewer':
      return entrypoint_Mutation__LoginWithEmailDevCurrentViewer;
    case 'entrypoint Mutation.LoginWithGoogleCurrentViewer':
      return entrypoint_Mutation__LoginWithGoogleCurrentViewer;
    case 'entrypoint Query.EntrypointHome':
      return entrypoint_Query__EntrypointHome;
    case 'entrypoint Query.EntrypointLogin':
      return entrypoint_Query__EntrypointLogin;
  } 
  return (clientFieldResolver: any) => clientFieldResolver;
}