import type { IsographEntrypoint } from '@isograph/react';
import { type BfBlog__BlogPostList__param } from './BfBlog/BlogPostList/param_type.ts';
import { type BfBlogPost__BlogPostListItem__param } from './BfBlogPost/BlogPostListItem/param_type.ts';
import { type BfCurrentViewer__Blog__param } from './BfCurrentViewer/Blog/param_type.ts';
import { type BfCurrentViewerLoggedIn__LoggedInView__param } from './BfCurrentViewerLoggedIn/LoggedInView/param_type.ts';
import { type BfCurrentViewerLoggedIn__YcForm__param } from './BfCurrentViewerLoggedIn/YcForm/param_type.ts';
import { type BfCurrentViewerLoggedOut__DemoButton__param } from './BfCurrentViewerLoggedOut/DemoButton/param_type.ts';
import { type BfCurrentViewerLoggedOut__LoggedOutView__param } from './BfCurrentViewerLoggedOut/LoggedOutView/param_type.ts';
import { type BfCurrentViewerLoggedOut__LoginAndRegisterForm__param } from './BfCurrentViewerLoggedOut/LoginAndRegisterForm/param_type.ts';
import { type BfCurrentViewerLoggedOut__LoginButton__param } from './BfCurrentViewerLoggedOut/LoginButton/param_type.ts';
import { type BfCurrentViewerLoggedOut__RegisterButton__param } from './BfCurrentViewerLoggedOut/RegisterButton/param_type.ts';
import { type BfCurrentViewerLoggedOut__WelcomeVideo__param } from './BfCurrentViewerLoggedOut/WelcomeVideo/param_type.ts';
import { type Mutation__CheckEmail__param } from './Mutation/CheckEmail/param_type.ts';
import { type Mutation__GetLoginOptions__param } from './Mutation/GetLoginOptions/param_type.ts';
import { type Mutation__LoginAsDemoPerson__param } from './Mutation/LoginAsDemoPerson/param_type.ts';
import { type Mutation__Login__param } from './Mutation/Login/param_type.ts';
import { type Mutation__Register__param } from './Mutation/Register/param_type.ts';
import { type Mutation__RegistrationOptions__param } from './Mutation/RegistrationOptions/param_type.ts';
import { type Mutation__SubmitYcForm__param } from './Mutation/SubmitYcForm/param_type.ts';
import { type Query__ContentFoundryApp__param } from './Query/ContentFoundryApp/param_type.ts';
import { type Query__ContentOS__param } from './Query/ContentOS/param_type.ts';
import { type Query__EntrypointBlogPost__param } from './Query/EntrypointBlogPost/param_type.ts';
import { type Query__EntrypointBlog__param } from './Query/EntrypointBlog/param_type.ts';
import { type Query__EntrypointContentFoundryApp__param } from './Query/EntrypointContentFoundryApp/param_type.ts';

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
  param: T & MatchesWhitespaceAndString<'field BfBlog.BlogPostList', T>
): IdentityWithParamComponent<BfBlog__BlogPostList__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfBlogPost.BlogPostListItem', T>
): IdentityWithParamComponent<BfBlogPost__BlogPostListItem__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewer.Blog', T>
): IdentityWithParamComponent<BfCurrentViewer__Blog__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedIn.LoggedInView', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedIn__LoggedInView__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedIn.YcForm', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedIn__YcForm__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field BfCurrentViewerLoggedOut.DemoButton', T>
): IdentityWithParamComponent<BfCurrentViewerLoggedOut__DemoButton__param>;

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
  param: T & MatchesWhitespaceAndString<'field Mutation.LoginAsDemoPerson', T>
): IdentityWithParam<Mutation__LoginAsDemoPerson__param>;

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
  param: T & MatchesWhitespaceAndString<'field Mutation.SubmitYcForm', T>
): IdentityWithParam<Mutation__SubmitYcForm__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.ContentFoundryApp', T>
): IdentityWithParamComponent<Query__ContentFoundryApp__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.ContentOS', T>
): IdentityWithParamComponent<Query__ContentOS__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointBlogPost', T>
): IdentityWithParam<Query__EntrypointBlogPost__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointBlog', T>
): IdentityWithParam<Query__EntrypointBlog__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointContentFoundryApp', T>
): IdentityWithParam<Query__EntrypointContentFoundryApp__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.CheckEmail', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.GetLoginOptions', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.LoginAsDemoPerson', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.Login', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.Register', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.RegistrationOptions', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.SubmitYcForm', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointBlogPost', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointBlog', T>
): void;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointContentFoundryApp', T>
): void;

export function iso(_isographLiteralText: string):
  | IdentityWithParam<any>
  | IdentityWithParamComponent<any>
  | IsographEntrypoint<any, any>
{
  return (clientFieldResolver: any) => clientFieldResolver;
}