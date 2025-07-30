import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Blog__param } from './param_type.ts';
import { Blog as resolver } from '../../../../components/Blog.tsx';
import QueryBlogPostsConnection__BlogPostList__resolver_reader from '../../QueryBlogPostsConnection/BlogPostList/resolver_reader.ts';

const readerAst: ReaderAst<Query__Blog__param> = [
  {
    kind: "Linked",
    fieldName: "blogPosts",
    alias: null,
    arguments: [
      [
        "first",
        { kind: "Literal", value: 10 },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Resolver",
        alias: "BlogPostList",
        arguments: null,
        readerArtifact: QueryBlogPostsConnection__BlogPostList__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
  },
];

const artifact: ComponentReaderArtifact<
  Query__Blog__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.Blog",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
