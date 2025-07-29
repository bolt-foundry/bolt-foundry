export default 'query EntrypointBlog ($slug: String) {\
  id,\
  blogPost____slug___v_slug: blogPost(slug: $slug) {\
    id,\
    author,\
    content,\
    heroImage,\
    publishedAt,\
    tags,\
    title,\
  },\
  blogPosts____first___l_10____sortDirection___s_DESC: blogPosts(first: 10, sortDirection: "DESC") {\
    edges {\
      cursor,\
      node {\
        id,\
        author,\
        excerpt,\
        heroImage,\
        publishedAt,\
        tags,\
        title,\
      },\
    },\
    pageInfo {\
      endCursor,\
      hasNextPage,\
      hasPreviousPage,\
      startCursor,\
    },\
  },\
}';