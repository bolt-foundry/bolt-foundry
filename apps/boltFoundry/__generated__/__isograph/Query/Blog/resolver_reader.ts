import type {
  ComponentReaderArtifact,
  ExtractSecondParam,
  ReaderAst,
} from "@isograph/react";
import { Query__Blog__param } from "./param_type.ts";
import { Blog as resolver } from "../../../../components/Blog.tsx";
import BlogPost__BlogPostView__resolver_reader from "../../BlogPost/BlogPostView/resolver_reader.ts";
import BlogPostConnection__BlogList__resolver_reader from "../../BlogPostConnection/BlogList/resolver_reader.ts";

const readerAst: ReaderAst<Query__Blog__param> = [
  {
    kind: "Linked",
    fieldName: "blogPost",
    alias: null,
    arguments: [
      [
        "slug",
        { kind: "Variable", name: "slug" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Resolver",
        alias: "BlogPostView",
        arguments: null,
        readerArtifact: BlogPost__BlogPostView__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
  },
  {
    kind: "Linked",
    fieldName: "blogPosts",
    alias: null,
    arguments: [
      [
        "first",
        { kind: "Literal", value: 10 },
      ],

      [
        "sortDirection",
        { kind: "String", value: "DESC" },
      ],
    ],
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Resolver",
        alias: "BlogList",
        arguments: null,
        readerArtifact: BlogPostConnection__BlogList__resolver_reader,
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
