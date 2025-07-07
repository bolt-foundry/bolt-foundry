export default 'query EntrypointDocs ($slug: String) {\
  documentsBySlug____slug___v_slug: documentsBySlug(slug: $slug) {\
    id,\
    content,\
  },\
}';