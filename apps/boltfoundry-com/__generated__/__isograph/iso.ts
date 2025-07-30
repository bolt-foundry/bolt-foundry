import type { IsographEntrypoint } from '@isograph/react';
import { type BlogPost__BlogPostView__param } from './BlogPost/BlogPostView/param_type.ts';
import { type CurrentViewer__LoginPage__param } from './CurrentViewer/LoginPage/param_type.ts';
import { type CurrentViewer__RlhfHome__param } from './CurrentViewer/RlhfHome/param_type.ts';
import { type Mutation__JoinWaitlist__param } from './Mutation/JoinWaitlist/param_type.ts';
import { type Query__Blog__param } from './Query/Blog/param_type.ts';
import { type Query__EntrypointBlog__param } from './Query/EntrypointBlog/param_type.ts';
import { type Query__EntrypointEval__param } from './Query/EntrypointEval/param_type.ts';
import { type Query__EntrypointHome__param } from './Query/EntrypointHome/param_type.ts';
import { type Query__EntrypointLogin__param } from './Query/EntrypointLogin/param_type.ts';
import { type Query__EntrypointRlhf__param } from './Query/EntrypointRlhf/param_type.ts';
import { type Query__Eval__param } from './Query/Eval/param_type.ts';
import { type Query__Home__param } from './Query/Home/param_type.ts';
import { type Query__RlhfInterface__param } from './Query/RlhfInterface/param_type.ts';
import { type QueryBlogPostsConnection__BlogPostList__param } from './QueryBlogPostsConnection/BlogPostList/param_type.ts';
import entrypoint_Mutation__JoinWaitlist from '../__isograph/Mutation/JoinWaitlist/entrypoint.ts';
import entrypoint_Query__EntrypointBlog from '../__isograph/Query/EntrypointBlog/entrypoint.ts';
import entrypoint_Query__EntrypointEval from '../__isograph/Query/EntrypointEval/entrypoint.ts';
import entrypoint_Query__EntrypointHome from '../__isograph/Query/EntrypointHome/entrypoint.ts';
import entrypoint_Query__EntrypointLogin from '../__isograph/Query/EntrypointLogin/entrypoint.ts';
import entrypoint_Query__EntrypointRlhf from '../__isograph/Query/EntrypointRlhf/entrypoint.ts';

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
  param: T & MatchesWhitespaceAndString<'field BlogPost.BlogPostView', T>
): IdentityWithParamComponent<BlogPost__BlogPostView__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field CurrentViewer.LoginPage', T>
): IdentityWithParamComponent<CurrentViewer__LoginPage__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field CurrentViewer.RlhfHome', T>
): IdentityWithParamComponent<CurrentViewer__RlhfHome__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Mutation.JoinWaitlist', T>
): IdentityWithParam<Mutation__JoinWaitlist__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.Blog', T>
): IdentityWithParamComponent<Query__Blog__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointBlog', T>
): IdentityWithParam<Query__EntrypointBlog__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointEval', T>
): IdentityWithParam<Query__EntrypointEval__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointHome', T>
): IdentityWithParam<Query__EntrypointHome__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointLogin', T>
): IdentityWithParam<Query__EntrypointLogin__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.EntrypointRlhf', T>
): IdentityWithParam<Query__EntrypointRlhf__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.Eval', T>
): IdentityWithParamComponent<Query__Eval__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.Home', T>
): IdentityWithParamComponent<Query__Home__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.RlhfInterface', T>
): IdentityWithParamComponent<Query__RlhfInterface__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field QueryBlogPostsConnection.BlogPostList', T>
): IdentityWithParamComponent<QueryBlogPostsConnection__BlogPostList__param>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Mutation.JoinWaitlist', T>
): typeof entrypoint_Mutation__JoinWaitlist;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointBlog', T>
): typeof entrypoint_Query__EntrypointBlog;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointEval', T>
): typeof entrypoint_Query__EntrypointEval;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointHome', T>
): typeof entrypoint_Query__EntrypointHome;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointLogin', T>
): typeof entrypoint_Query__EntrypointLogin;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.EntrypointRlhf', T>
): typeof entrypoint_Query__EntrypointRlhf;

export function iso(isographLiteralText: string):
  | IdentityWithParam<any>
  | IdentityWithParamComponent<any>
  | IsographEntrypoint<any, any, any>
{
  switch (isographLiteralText) {
    case 'entrypoint Mutation.JoinWaitlist':
      return entrypoint_Mutation__JoinWaitlist;
    case 'entrypoint Query.EntrypointBlog':
      return entrypoint_Query__EntrypointBlog;
    case 'entrypoint Query.EntrypointEval':
      return entrypoint_Query__EntrypointEval;
    case 'entrypoint Query.EntrypointHome':
      return entrypoint_Query__EntrypointHome;
    case 'entrypoint Query.EntrypointLogin':
      return entrypoint_Query__EntrypointLogin;
    case 'entrypoint Query.EntrypointRlhf':
      return entrypoint_Query__EntrypointRlhf;
  } 
  return (clientFieldResolver: any) => clientFieldResolver;
}