import { type BfCurrentViewer__DemoButton__output_type } from '../../BfCurrentViewer/DemoButton/output_type.ts';
import { type BfCurrentViewerLoggedOut__LoginAndRegisterForm__output_type } from '../../BfCurrentViewerLoggedOut/LoginAndRegisterForm/output_type.ts';
import { type BfCurrentViewerLoggedOut__WelcomeVideo__output_type } from '../../BfCurrentViewerLoggedOut/WelcomeVideo/output_type.ts';

export type BfCurrentViewerLoggedOut__LoggedOutView__param = {
  readonly data: {
    readonly WelcomeVideo: BfCurrentViewerLoggedOut__WelcomeVideo__output_type,
    readonly DemoButton: BfCurrentViewer__DemoButton__output_type,
    readonly LoginAndRegisterForm: BfCurrentViewerLoggedOut__LoginAndRegisterForm__output_type,
  },
  readonly parameters: Record<PropertyKey, never>,
};
