import { interfaceType, objectType } from "nexus";

export const GraphQLMediaType = interfaceType({
  name: "Media",
  definition(t) {
    t.url("url");
    t.int("duration");
  },
});

export const GraphQLVideoType = interfaceType({
  name: "Video",
  definition(t) {
    t.implements(GraphQLMediaType);
  },
});

export const GraphQLVideoPreviewableType = objectType({
  name: "VideoPreviewable",
  definition(t) {
    t.implements(GraphQLVideoType);
  },
});

export const GraphQLVideoDownloadableType = objectType({
  name: "VideoDownloadable",
  definition(t) {
    t.implements(GraphQLVideoType);
    t.boolean("ready");
    t.float("percentageRendered");
  },
});
