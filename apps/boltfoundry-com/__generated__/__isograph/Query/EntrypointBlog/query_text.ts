export default 'query EntrypointBlog  {\
  id,\
  blogPosts____first___l_10: blogPosts(first: 10) {\
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