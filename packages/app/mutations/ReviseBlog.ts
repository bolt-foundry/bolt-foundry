import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger.ts";
const logger = getLogger(import.meta);

export const ReviseBlogMutation = iso(`
  field Mutation.ReviseBlog($blogPost: String!) {
    reviseBlog(blogPost: $blogPost){
      BlogRevisionsSidebar
    }
  }
`)(function ReviseBlog({ data }) {
  logger.info("reviseBlogMutation", data);
  return data;
});
