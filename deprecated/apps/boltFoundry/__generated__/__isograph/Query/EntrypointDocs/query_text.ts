export default 'query EntrypointDocs ($slug: String) {\
  id,\
  documentsBySlug____slug___v_slug: documentsBySlug(slug: $slug) {\
    id,\
    content,\
  },\
}';