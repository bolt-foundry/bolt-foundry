import type { IsographEntrypoint } from '@isograph/react';
import { type BfCurrentViewer__DemoButton__param } from './BfCurrentViewer/DemoButton/param_type.ts';
import { type BfCurrentViewer__Home__param } from './BfCurrentViewer/Home/param_type.ts';
import { type BfCurrentViewerLoggedIn__LoggedInView__param } from './BfCurrentViewerLoggedIn/LoggedInView/param_type.ts';
import { type BfCurrentViewerLoggedOut__LoggedOutView__param } from './BfCurrentViewerLoggedOut/LoggedOutView/param_type.ts';
import { type BfCurrentViewerLoggedOut__LoginAndRegisterForm__param } from './BfCurrentViewerLoggedOut/LoginAndRegisterForm/param_type.ts';
import { type BfCurrentViewerLoggedOut__LoginButton__param } from './BfCurrentViewerLoggedOut/LoginButton/param_type.ts';
import { type BfCurrentViewerLoggedOut__RegisterButton__param } from './BfCurrentViewerLoggedOut/RegisterButton/param_type.ts';
import { type BfCurrentViewerLoggedOut__WelcomeVideo__param } from './BfCurrentViewerLoggedOut/WelcomeVideo/param_type.ts';
import { type Mutation__CheckEmail__param } from './Mutation/CheckEmail/param_type.ts';
import { type Mutation__GetLoginOptions__param } from './Mutation/GetLoginOptions/param_type.ts';
import { type Mutation__JoinWaitlist__param } from './Mutation/JoinWaitlist/param_type.ts';
import { type Mutation__LoginAsDemoPerson__param } from './Mutation/LoginAsDemoPerson/param_type.ts';
import { type Mutation__Login__param } from './Mutation/Login/param_type.ts';
import { type Mutation__Register__param } from './Mutation/Register/param_type.ts';
import { type Mutation__RegistrationOptions__param } from './Mutation/RegistrationOptions/param_type.ts';
import { type Query__EntrypointContentFoundryApp__param } from './Query/EntrypointContentFoundryApp/param_type.ts';
import { type Query__EntrypointHome__param } from './Query/EntrypointHome/param_type.ts';
import { type Query__EntrypointTwitterIdeatorWorkshopPermalink__param } from './Query/EntrypointTwitterIdeatorWorkshopPermalink/param_type.ts';
import { type Query__entrypointTwitterIdeatorResearchPermalink__param } from './Query/entrypointTwitterIdeatorResearchPermalink/param_type.ts';
import entrypoint_Mutation__CheckEmail from '../__isograph/Mutation/CheckEmail/entrypoint.ts';
import entrypoint_Mutation__GetLoginOptions from '../__isograph/Mutation/GetLoginOptions/entrypoint.ts';
import entrypoint_Mutation__JoinWaitlist from '../__isograph/Mutation/JoinWaitlist/entrypoint.ts';
import entrypoint_Mutation__LoginAsDemoPerson from '../__isograph/Mutation/LoginAsDemoPerson/entrypoint.ts';
import entrypoint_Mutation__Login from '../__isograph/Mutation/Login/entrypoint.ts';
import entrypoint_Mutation__Register from '../__isograph/Mutation/Register/entrypoint.ts';
import entrypoint_Mutation__RegistrationOptions from '../__isograph/Mutation/RegistrationOptions/entrypoint.ts';
import entrypoint_Query__EntrypointContentFoundryApp from '../__isograph/Query/EntrypointContentFoundryApp/entrypoint.ts';
import entrypoint_Query__EntrypointHome from '../__isograph/Query/EntrypointHome/entrypoint.ts';
import entrypoint_Query__EntrypointTwitterIdeatorWorkshopPermalink from '../__isograph/Query/EntrypointTwitterIdeatorWorkshopPermalink/entrypoint.ts';
import entrypoint_Query__entrypointTwitterIdeatorResearchPermalink from '../__isograph/Query/entrypointTwitterIdeatorResearchPermalink/entrypoint.ts';

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
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewer.DemoButton', T>
): IdentityWithParamComponent<BfCurrentViewer__DemoButton__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewer.Home', T>
): IdentityWithParamComponent<BfCurrentViewer__Home__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedIn.LoggedInView', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedIn__LoggedInView__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedOut.LoggedOutView', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedOut__LoggedOutView__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedOut.LoginAndRegisterForm', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedOut__LoginAndRegisterForm__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedOut.LoginButton', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedOut__LoginButton__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedOut.RegisterButton', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedOut__RegisterButton__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedOut.WelcomeVideo', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedOut__WelcomeVideo__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.CheckEmail', T>
): IdentityWithParam<Mutation__CheckEmail__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.GetLoginOptions', T>
): IdentityWithParam<Mutation__GetLoginOptions__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.JoinWaitlist', T>
): IdentityWithParam<Mutation__JoinWaitlist__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.LoginAsDemoPerson', T>
): IdentityWithParamComponent<Mutation__LoginAsDemoPerson__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.Login', T>
): IdentityWithParam<Mutation__Login__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.Register', T>
): IdentityWithParamComponent<Mutation__Register__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.RegistrationOptions', T>
): IdentityWithParam<Mutation__RegistrationOptions__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointContentFoundryApp', T>
): IdentityWithParam<Query__EntrypointContentFoundryApp__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointHome', T>
): IdentityWithParam<Query__EntrypointHome__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointTwitterIdeatorWorkshopPermalink', T>
): IdentityWithParam<Query__EntrypointTwitterIdeatorWorkshopPermalink__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.entrypointTwitterIdeatorResearchPermalink', T>
): IdentityWithParam<Query__entrypointTwitterIdeatorResearchPermalink__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.CheckEmail', T>
): typeof entrypoint_Mutation__CheckEmail;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.GetLoginOptions', T>
): typeof entrypoint_Mutation__GetLoginOptions;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.JoinWaitlist', T>
): typeof entrypoint_Mutation__JoinWaitlist;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.LoginAsDemoPerson', T>
): typeof entrypoint_Mutation__LoginAsDemoPerson;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.Login', T>
): typeof entrypoint_Mutation__Login;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.Register', T>
): typeof entrypoint_Mutation__Register;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.RegistrationOptions', T>
): typeof entrypoint_Mutation__RegistrationOptions;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointContentFoundryApp', T>
): typeof entrypoint_Query__EntrypointContentFoundryApp;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointHome', T>
): typeof entrypoint_Query__EntrypointHome;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointTwitterIdeatorWorkshopPermalink', T>
): typeof entrypoint_Query__EntrypointTwitterIdeatorWorkshopPermalink;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.entrypointTwitterIdeatorResearchPermalink', T>
): typeof entrypoint_Query__entrypointTwitterIdeatorResearchPermalink;

export function iso(isographLiteralText: string):
  | IdentityWithParam<any>
  | IdentityWithParamComponent<any>
  | IsographEntrypoint<any, any, any>
{
  switch (isographLiteralText) {
    case 'entrypoint Mutation.CheckEmail':
      return entrypoint_Mutation__CheckEmail;
    case 'entrypoint Mutation.GetLoginOptions':
      return entrypoint_Mutation__GetLoginOptions;
    case 'entrypoint Mutation.JoinWaitlist':
      return entrypoint_Mutation__JoinWaitlist;
    case 'entrypoint Mutation.LoginAsDemoPerson':
      return entrypoint_Mutation__LoginAsDemoPerson;
    case 'entrypoint Mutation.Login':
      return entrypoint_Mutation__Login;
    case 'entrypoint Mutation.Register':
      return entrypoint_Mutation__Register;
    case 'entrypoint Mutation.RegistrationOptions':
      return entrypoint_Mutation__RegistrationOptions;
    case 'entrypoint Query.EntrypointContentFoundryApp':
      return entrypoint_Query__EntrypointContentFoundryApp;
    case 'entrypoint Query.EntrypointHome':
      return entrypoint_Query__EntrypointHome;
    case 'entrypoint Query.EntrypointTwitterIdeatorWorkshopPermalink':
      return entrypoint_Query__EntrypointTwitterIdeatorWorkshopPermalink;
    case 'entrypoint Query.entrypointTwitterIdeatorResearchPermalink':
      return entrypoint_Query__entrypointTwitterIdeatorResearchPermalink;
  } 
  return (clientFieldResolver: any) => clientFieldResolver;
}