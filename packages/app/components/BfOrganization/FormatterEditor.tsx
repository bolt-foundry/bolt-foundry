import { iso } from "packages/app/__generated__/__isograph/iso.ts";
// import { useRouter } from "packages/app/contexts/RouterContext.tsx";
import { getLogger } from "packages/logger.ts";
import { EditorProvider } from "packages/app/contexts/EditorContext.tsx";
const _logger = getLogger(import.meta);

export const FormatterEditor = iso(`
  field BfOrganization.FormatterEditor @component {
    FormatterSidebar
    FormatterEditorPanel
    BlogRevisionsSidebar
  }
`)(
  function FormatterEditor(
    { data },
  ) {
    // const routerProps = useRouter();
    // const { editorSlug } = routerProps.routeParams;

    // if (editorSlug) {
    //   logger.debug("FormatterEditor slug is ", editorSlug);
    // }
    const FormatterSidebar = data.FormatterSidebar;
    const FormatterEditorPanel = data.FormatterEditorPanel;
    const BlogRevisionsSidebar = data.BlogRevisionsSidebar;
    return (
      <EditorProvider>
        <div className="flexRow editor-container">
          {FormatterSidebar && <FormatterSidebar />}
          {FormatterEditorPanel && <FormatterEditorPanel />}
          {BlogRevisionsSidebar && <BlogRevisionsSidebar />}
        </div>
      </EditorProvider>
    );
  },
);
