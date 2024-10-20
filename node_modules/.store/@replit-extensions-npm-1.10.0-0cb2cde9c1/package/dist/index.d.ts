import * as Comlink from 'comlink';
import Comlink__default, { ProxyMarked } from 'comlink';

/**
 * A Filesystem node type
 */
declare enum FsNodeType {
    File = "FILE",
    Directory = "DIRECTORY"
}
/**
 * A base interface for nodes, just includes
 * the type of the node and the path, This interface
 * does not expose the node's content/children
 */
interface FsNode {
    path: string;
    type: FsNodeType;
}
/**
 * An array of Filesystem Nodes
 */
type FsNodeArray = Array<FsNode>;
/**
 * A directory child node - a file or a folder.
 */
interface DirectoryChildNode {
    filename: string;
    type: FsNodeType;
}
/**
 * A file change event type
 */
declare enum ChangeEventType {
    Create = "CREATE",
    Move = "MOVE",
    Delete = "DELETE",
    Modify = "MODIFY"
}
/**
 * Fired when a file is moved
 */
interface MoveEvent {
    eventType: ChangeEventType.Move;
    node: FsNode;
    to: string;
}
/**
 * Fired when a file is deleted
 */
interface DeleteEvent {
    eventType: ChangeEventType.Delete;
    node: FsNode;
}
/**
 * Fires when a non-text file is changed
 */
type WatchFileOnChangeListener<T extends string | Blob = string> = (newContent: T) => void;
/**
 * Fires when watching a non-text file fails
 */
type WatchFileOnErrorListener = (error: string) => void;
/**
 * Fires when a non-text file is moved or deleted
 */
type WatchFileOnMoveOrDeleteListener = (moveOrDeleteEvent: MoveEvent | DeleteEvent) => void;
/**
 * A set of listeners for watching a non-text file
 */
interface WatchFileListeners<T extends string | Blob = string> {
    onChange: WatchFileOnChangeListener<T>;
    onError?: WatchFileOnErrorListener;
    onMoveOrDelete?: WatchFileOnMoveOrDeleteListener;
}
/**
 * A written text change for the WriteChange function exposed by WatchTextFileListeners.onReady
 */
interface TextChange {
    from: number;
    to?: number;
    insert?: string;
}
/**
 * Writes a change to a watched file using the TextChange interface
 */
type WriteChange = (changes: TextChange | Array<TextChange>) => void;
/**
 * Returns the latest content of a watched file as a string
 */
type GetLatestContent = () => string;
/**
 * A set of listeners and values exposed by WatchTextFileListeners.onReady
 */
interface TextFileReadyEvent {
    writeChange: WriteChange;
    getLatestContent: GetLatestContent;
    initialContent: string;
}
/**
 * Signifies a change when a text file's text content is updated
 */
interface TextFileOnChangeEvent {
    changes: Array<TextChange>;
    latestContent: string;
}
/**
 * Fires when a text file watcher is ready
 */
type WatchTextFileOnReadyListener = (readyEvent: TextFileReadyEvent) => void;
/**
 * Fires when a watched text file's text content is updated
 */
type WatchTextFileOnChangeListener = (changeEvent: TextFileOnChangeEvent) => void;
/**
 * Fires when watching a text file fails
 */
type WatchTextFileOnErrorListener = (error: string) => void;
/**
 * Fires when a watched text file is moved or deleted
 */
type WatchTextFileOnMoveOrDeleteListener = (moveOrDeleteEvent: MoveEvent | DeleteEvent) => void;
/**
 * A set of listeners for watching a text file
 */
interface WatchTextFileListeners {
    onReady: WatchTextFileOnReadyListener;
    onChange?: WatchTextFileOnChangeListener;
    onError?: WatchTextFileOnErrorListener;
    onMoveOrDelete?: WatchTextFileOnMoveOrDeleteListener;
}
/**
 * Fires when watching a directory fails
 */
type WatchDirOnErrorListener = (err: Error, extraInfo?: Record<string, any>) => void;
/**
 * Fires when a directory's child nodes change
 */
type WatchDirOnChangeListener = (children: FsNodeArray) => void;
/**
 * Fires when a watched directory is moved or deleted
 */
type WatchDirOnMoveOrDeleteListener = (event: DeleteEvent | MoveEvent) => void;
/**
 * A set of listeners for watching a directory
 */
interface WatchDirListeners {
    onChange: WatchDirOnChangeListener;
    onMoveOrDelete?: WatchDirOnMoveOrDeleteListener;
    onError: WatchDirOnErrorListener;
}

/**
 * A Replit user
 */
interface User {
    id: number;
    username: string;
    image: string;
    bio?: string;
    url?: string;
    socials?: Array<UserSocial>;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    fullName?: string;
    followCount?: number;
    followerCount?: number;
    isUserHacker?: boolean;
    isUserPro?: boolean;
    roles?: Array<UserRole>;
}
/**
 * Extended values for the current user
 */
interface CurrentUser extends User {
}
/**
 * A user social media link
 */
interface UserSocial {
    id: number;
    url: string;
    type: UserSocialType;
}
/**
 * An enumerated type of social media links
 */
declare enum UserSocialType {
    twitter = "twitter",
    github = "github",
    linkedin = "linkedin",
    website = "website",
    youtube = "youtube",
    twitch = "twitch",
    facebook = "facebook",
    discord = "discord"
}
/**
 * A user role
 */
interface UserRole {
    id: number;
    name: string;
    key: string;
    tagline: string;
}
/**
 * A Repl
 */
interface Repl {
    id: string;
    url: string;
    title: string;
    description: string;
    timeCreated: string;
    slug: string;
    isPrivate: boolean;
    likeCount?: number;
    publicForkCount?: number;
    runCount?: number;
    commentCount?: number;
    tags?: Array<Tag>;
    iconUrl?: string;
    imageUrl?: string;
    comments?: ReplCommentConnection;
    owner?: ReplOwner;
    multiplayers?: Array<User>;
}
/**
 * A Repl Owner, can be either a User or a Team
 */
interface ReplOwner {
    id: number;
    username: string;
    image: string;
    __typename: string;
    description?: string;
}
/**
 * A Repl tag
 */
interface Tag {
    id: string;
    isOfficial: boolean;
}
/**
 * A Repl Comment
 */
interface ReplComment {
    id: number;
    body: string;
    user: User;
}
/**
 * An array of ReplComments as items
 */
interface ReplCommentConnection {
    items: Array<ReplComment>;
}
/**
 * Editor Preferences
 */
interface EditorPreferences {
    __typename: string;
    fontSize: number;
    indentIsSpaces: boolean;
    indentSize: number;
    keyboardHandler: string;
    wrapping: boolean;
    codeIntelligence: boolean;
    codeSuggestion: boolean;
    multiselectModifierKey: string;
    minimapDisplay: string;
}
/**
 * Options for user queries
 */
interface UserDataInclusion {
    includeSocialData?: boolean;
    includeRoles?: boolean;
    includePlan?: boolean;
}
/**
 * Options for the currentUser query
 */
interface CurrentUserDataInclusion {
    includeSocialData?: boolean;
    includeRoles?: boolean;
    includePlan?: boolean;
}
/**
 * Options for repl queries
 */
interface ReplDataInclusion {
    includeSocialData?: boolean;
    includeComments?: boolean;
    includeOwner?: boolean;
    includeMultiplayers?: boolean;
}
/**
 * A graphql response
 */
type GraphResponse<T> = Promise<T | never>;
/**
 * A graphql response for the repl query
 */
type ReplQueryOutput = GraphResponse<{
    repl: Repl;
}>;
/**
 * A graphql response for the userByUsername query
 */
type UserByUsernameQueryOutput = GraphResponse<{
    userByUsername: User;
}>;
/**
 * A graphql response for the user query
 */
type UserQueryOutput = GraphResponse<{
    user: User;
}>;
/**
 * A graphql response for the currentUser query
 */
type CurrentUserQueryOutput = GraphResponse<{
    user: CurrentUser;
}>;

/**
 * Alias for strings
 */
type CssColor = string;
/**
 * Global theme values interface
 */
interface ThemeValuesGlobal {
    __typename?: string;
    backgroundRoot: CssColor;
    backgroundDefault: CssColor;
    backgroundHigher: CssColor;
    backgroundHighest: CssColor;
    backgroundOverlay: CssColor;
    foregroundDefault: CssColor;
    foregroundDimmer: CssColor;
    foregroundDimmest: CssColor;
    outlineDimmest: CssColor;
    outlineDimmer: CssColor;
    outlineDefault: CssColor;
    outlineStronger: CssColor;
    outlineStrongest: CssColor;
    accentPrimaryDimmest: CssColor;
    accentPrimaryDimmer: CssColor;
    accentPrimaryDefault: CssColor;
    accentPrimaryStronger: CssColor;
    accentPrimaryStrongest: CssColor;
    accentPositiveDimmest: CssColor;
    accentPositiveDimmer: CssColor;
    accentPositiveDefault: CssColor;
    accentPositiveStronger: CssColor;
    accentPositiveStrongest: CssColor;
    accentNegativeDimmest: CssColor;
    accentNegativeDimmer: CssColor;
    accentNegativeDefault: CssColor;
    accentNegativeStronger: CssColor;
    accentNegativeStrongest: CssColor;
    redDimmest: CssColor;
    redDimmer: CssColor;
    redDefault: CssColor;
    redStronger: CssColor;
    redStrongest: CssColor;
    orangeDimmest: CssColor;
    orangeDimmer: CssColor;
    orangeDefault: CssColor;
    orangeStronger: CssColor;
    orangeStrongest: CssColor;
    yellowDimmest: CssColor;
    yellowDimmer: CssColor;
    yellowDefault: CssColor;
    yellowStronger: CssColor;
    yellowStrongest: CssColor;
    limeDimmest: CssColor;
    limeDimmer: CssColor;
    limeDefault: CssColor;
    limeStronger: CssColor;
    limeStrongest: CssColor;
    greenDimmest: CssColor;
    greenDimmer: CssColor;
    greenDefault: CssColor;
    greenStronger: CssColor;
    greenStrongest: CssColor;
    tealDimmest: CssColor;
    tealDimmer: CssColor;
    tealDefault: CssColor;
    tealStronger: CssColor;
    tealStrongest: CssColor;
    blueDimmest: CssColor;
    blueDimmer: CssColor;
    blueDefault: CssColor;
    blueStronger: CssColor;
    blueStrongest: CssColor;
    blurpleDimmest: CssColor;
    blurpleDimmer: CssColor;
    blurpleDefault: CssColor;
    blurpleStronger: CssColor;
    blurpleStrongest: CssColor;
    purpleDimmest: CssColor;
    purpleDimmer: CssColor;
    purpleDefault: CssColor;
    purpleStronger: CssColor;
    purpleStrongest: CssColor;
    magentaDimmest: CssColor;
    magentaDimmer: CssColor;
    magentaDefault: CssColor;
    magentaStronger: CssColor;
    magentaStrongest: CssColor;
    pinkDimmest: CssColor;
    pinkDimmer: CssColor;
    pinkDefault: CssColor;
    pinkStronger: CssColor;
    pinkStrongest: CssColor;
    greyDimmest: CssColor;
    greyDimmer: CssColor;
    greyDefault: CssColor;
    greyStronger: CssColor;
    greyStrongest: CssColor;
    brownDimmest: CssColor;
    brownDimmer: CssColor;
    brownDefault: CssColor;
    brownStronger: CssColor;
    brownStrongest: CssColor;
    black: CssColor;
    white: CssColor;
}
/**
 * Enumerated Color Scheme
 */
declare enum ColorScheme {
    Light = "light",
    Dark = "dark"
}
/**
 * Custom Theme GraphQL type
 */
interface CustomTheme {
    author: User;
    colorScheme: ColorScheme;
    hasUnpublishedChanges: boolean;
    id: number;
    isCurrentUserThemeAuthor: boolean;
    isInstalledByCurrentUser: boolean;
    latestThemeVersion: ThemeVersion;
    numInstalls?: number;
    slug?: string;
    status?: "public" | "private";
    title?: string;
}
/**
 * Theme Syntax Highlighting Tag
 */
interface ThemeSyntaxHighlightingTag {
    __typename: string;
    name: string;
    modifiers: null | Array<string>;
}
/**
 * Theme Syntax Highlighting Modifier
 */
interface ThemeSyntaxHighlightingModifier {
    textDecoration?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
}
/**
 * Theme Editor Syntax Highlighting
 */
interface ThemeEditorSyntaxHighlighting {
    __typename: string;
    tags: Array<ThemeSyntaxHighlightingTag>;
    values: ThemeSyntaxHighlightingModifier;
}
/**
 * Editor Theme Values, an array of ThemeEditorSyntaxHighlighting
 */
interface ThemeValuesEditor {
    syntaxHighlighting: Array<ThemeEditorSyntaxHighlighting>;
}
/**
 * Both global and editor theme values
 */
interface ThemeValues {
    __typename?: string;
    editor: ThemeValuesEditor;
    global: ThemeValuesGlobal;
}
/**
 * Theme Version GraphQL type
 */
interface ThemeVersion {
    __typename?: string;
    id: number;
    hue: number;
    lightness: number;
    saturation: number;
    timeUpdated?: string;
    description?: string;
    customTheme?: CustomTheme;
    values?: ThemeValues;
}
/**
 * Fires with the new theme values when the current theme changes
 */
type OnThemeChangeValuesListener = (values: ThemeValuesGlobal) => void;
/**
 * Fires with the new theme data when the current theme changes
 */
type OnThemeChangeListener = (theme: ThemeVersion) => void;

/**
 * Fires when the current user switches to a different file/tool in the workspace.  Returns null if the current file/tool cannot be found in the filesystem.
 */
type OnActiveFileChangeListener = (file: string | null) => void;

type Primitive = string | boolean | number | null | undefined | never;
interface ObjectType {
    [n: string | number]: Serializable;
}
interface NumericIndexType {
    [n: number]: Serializable;
}
type Serializable = ObjectType | Primitive | NumericIndexType;
type Data = Record<string, Serializable>;
/**
 * Logs information to the Extension Devtools
 */
declare function info(message: string, data?: Data): Promise<void>;
/**
 * Logs a warning to the extension devtools
 */
declare function warn(message: string, data?: Data): Promise<void>;
/**
 * Logs an error message to the extension devtools
 */
declare function error(message: string, data?: Data): Promise<void>;
declare const log: typeof info;

type debug_Data = Data;
type debug_NumericIndexType = NumericIndexType;
type debug_ObjectType = ObjectType;
type debug_Primitive = Primitive;
type debug_Serializable = Serializable;
declare const debug_error: typeof error;
declare const debug_info: typeof info;
declare const debug_log: typeof log;
declare const debug_warn: typeof warn;
declare namespace debug {
  export {
    debug_Data as Data,
    debug_NumericIndexType as NumericIndexType,
    debug_ObjectType as ObjectType,
    debug_Primitive as Primitive,
    debug_Serializable as Serializable,
    debug_error as error,
    debug_info as info,
    debug_log as log,
    debug_warn as warn,
  };
}

/**
 * Surfaces that a command can appear in.
 */
declare enum ContributionType {
    CommandBar = "commandbar",
    FiletreeContextMenu = "filetree-context-menu",
    SidebarSearch = "sidebar-search",
    EditorContextMenu = "editor-context-menu"
}
type CommandFnArgs = {
    /**
     * Whether the command is currently active. That is, the user has selected this command in the command bar.
     *
     * Subcommands are computed even if the command is not active, so that the command bar can show people helpful suggestions of what they can do next
     */
    active: boolean;
    /**
     * The current search query. This is the text that the user has typed into the command bar.
     */
    search: string;
    /**
     * The current path. This is the path of commands that the user has selected in the command bar.
     *
     * The first element of the array is the "root" which contains contextual information about the command. It varies depending on the surface.
     */
    path: SerializableValue[];
};
type CommandsFn = (args: CommandFnArgs) => Promise<Array<CommandProxy | CommandArgs>>;
type CreateCommand = (args: CommandFnArgs) => CommandProxy | Promise<CommandProxy> | CommandArgs | Promise<CommandArgs> | null;
type Run = () => any;
type SerializableValue = string | number | boolean | null | undefined | SerializableValue[] | {
    [key: string]: SerializableValue;
};
type BaseCommandArgs = {
    /**
     * The command's label. This is the primary text that represents your command in the Commandbar.
     */
    label: string;
    /**
     * The command's description. This is the secondary text that appears next to the label in the Commandbar.
     */
    description?: string;
    /**
     * The command's icon. This is a relative path to the icon that will be displayed next to the label in the Commandbar.
     *
     * For example, if `public` is your statically served directory and you have an icon at `./public/icons/cmd.svg`, you would set this to `/icons/cmd.svg`
     */
    icon?: string;
};
type ActionCommandArgs = BaseCommandArgs & {
    /**
     * The function that will be called when someone choses to run this command.
     */
    run: Run;
};
type ContextCommandArgs = BaseCommandArgs & {
    /**
     * The function that will be called to compute 'subcommands' for this command. The subcommands can be any number of commands,
     * and even computed dynamically in response to the different arguments passed to this function or some other external state.
     */
    commands: CommandsFn;
};
type CommandArgs = ActionCommandArgs | ContextCommandArgs;
declare const CommandSymbol: unique symbol;
declare function isCommandProxy(cmd: object): cmd is CommandProxy;
/**
 * This function validates a command and wraps it in a proxy so that it can be sent over the wire
 *
 * It:
 * - Validates the command's arguments, separates serializable and non-serializable arguments
 * - Wraps the command in a proxy so that it can be sent over the wire
 * - Wraps the command's `commands` function to ensure that all subcommands are also Command() wrapped
 * - Adds a symbol to the command to identify a wrapped command
 */
declare function Command(cmdArgs: CommandArgs): CommandProxy;
type CommandProxy = ({
    data: {
        type: "action";
        label: string;
        description?: string;
        icon?: string;
    };
    run?: Run;
} & ProxyMarked & {
    [CommandSymbol]: true;
}) | ({
    data: {
        type: "context";
        label: string;
        description?: string;
        icon?: string;
    };
    commands?: (args: CommandFnArgs) => Promise<Array<CommandProxy>>;
} & ProxyMarked & {
    [CommandSymbol]: true;
});

type OutputStrCallback = (output: string) => void;
interface BaseSpawnOptions {
    /** The command and arguments, as an array. This does not spawn with a shell */
    args: string[];
    /** any environment variables to add to the execution context */
    env?: Record<string, string>;
    /** whether to keep stdout and standard error outputs separate */
    splitStderr?: boolean;
}
interface SplitStderrSpawnOptions extends BaseSpawnOptions {
    splitStderr: true;
    onStdOut?: OutputStrCallback;
    onStdErr?: OutputStrCallback;
}
interface CombinedStderrSpawnOptions extends BaseSpawnOptions {
    splitStderr?: false;
    onOutput?: (output: string) => void;
}
type SpawnOptions = SplitStderrSpawnOptions | CombinedStderrSpawnOptions;
interface SpawnResult {
    exitCode: number;
    error: string | null;
}
interface SpawnOutput {
    dispose: () => void;
    resultPromise: Promise<SpawnResult>;
}
interface ExecResult {
    output: string;
    exitCode: number;
}

interface AuthenticatedInstallation {
    id: string;
    extensionId: string;
}
interface AuthenticatedUser {
    id: number;
}
interface AuthenticateResult {
    user: AuthenticatedUser;
    installation: AuthenticatedInstallation;
}

/**
 * An enumerated set of values for the Handshake between the workspace and an extension
 */
declare enum HandshakeStatus {
    Ready = "ready",
    Error = "error",
    Loading = "loading"
}
/**
 * The Replit init() function arguments
 */
interface ReplitInitArgs {
    timeout?: number;
}
/**
 * The output of the Replit init() function
 */
interface ReplitInitOutput {
    dispose: () => void;
    status: HandshakeStatus;
}
/**
 * A cleanup/disposer function (void)
 */
type DisposerFunction = () => void;
/**
 * The Extension Port
 */
type ExtensionPortAPI = {
    handshake: (handshakeArgs: {
        clientName: string;
        clientVersion: string;
    }) => {
        success: true;
    };
    readFile: (path: string, encoding: "utf8" | "binary" | null) => Promise<{
        content: string;
    } | {
        error: string;
    }>;
    writeFile: (path: string, content: string | Blob) => Promise<{
        success: boolean;
    } | {
        error: string;
    }>;
    readDir: (path: string) => Promise<{
        children: Array<DirectoryChildNode>;
        error: string;
    }>;
    createDir: (path: string) => Promise<{
        success: boolean;
        error: string | null;
    }>;
    deleteFile: (path: string) => Promise<{} | {
        error: string;
    }>;
    deleteDir: (path: string) => Promise<{} | {
        error: string;
    }>;
    move: (path: string, to: string) => Promise<{
        success: boolean;
        error: string | null;
    }>;
    copyFile: (path: string, to: string) => Promise<{
        success: boolean;
        error: string | null;
    }>;
    watchFile: (path: string, watcher: WatchFileListeners, encoding: "utf8" | "binary" | null) => DisposerFunction;
    watchTextFile: (path: string, watcher: WatchTextFileListeners) => () => void;
    watchDir: (path: string, watcher: WatchDirListeners) => DisposerFunction;
    setReplDbValue: (key: string, value: string) => Promise<void>;
    getReplDbValue: (key: string) => {
        error: string | null;
    } | string;
    listReplDbKeys: (prefix: string) => Promise<{
        keys: string[];
    } | {
        error: string;
    }>;
    deleteReplDbKey: (key: string) => Promise<void>;
    activatePane: () => Promise<void>;
    getCurrentThemeValues: () => Promise<ThemeValuesGlobal>;
    onThemeChangeValues: (callback: OnThemeChangeValuesListener) => Promise<DisposerFunction>;
    getCurrentTheme: () => Promise<ThemeVersion>;
    onThemeChange: (callback: OnThemeChangeListener) => Promise<DisposerFunction>;
    filePath: string;
    showConfirm: (text: string, length?: number) => string;
    showError: (text: string, length?: number) => string;
    showNotice: (text: string, length?: number) => string;
    showWarning: (text: string, length?: number) => string;
    hideMessage: (id: string) => void;
    hideAllMessages: () => void;
    currentUser: (args: CurrentUserDataInclusion) => CurrentUserQueryOutput;
    userById: (args: {
        id: number;
    } & UserDataInclusion) => UserQueryOutput;
    userByUsername: (args: {
        username: string;
    } & UserDataInclusion) => UserByUsernameQueryOutput;
    currentRepl: (args: ReplDataInclusion) => ReplQueryOutput;
    replById: (args: {
        id: string;
    } & ReplDataInclusion) => ReplQueryOutput;
    replByUrl: (args: {
        url: string;
    } & ReplDataInclusion) => ReplQueryOutput;
    watchActiveFile: (callback: OnActiveFileChangeListener) => DisposerFunction;
    getActiveFile: () => Promise<string | null>;
    commands: {
        registerCommand: (command: CommandProxy) => void;
        registerCreateCommand: (data: {
            commandId: string;
            contributions: Array<string>;
        }, create: (createArgs: CommandFnArgs) => Promise<CommandProxy | null>) => void;
    };
    experimental: ExperimentalAPI;
    internal: InternalAPI;
    debug: DebugAPI;
    exec: (args: {
        splitStderr?: boolean;
        args: Array<string>;
        env?: {
            [key: string]: string;
        };
        onOutput: (output: string) => void;
        onStdErr: (stderr: string) => void;
        onError: (error: string) => void;
    }) => Promise<{
        dispose: () => void;
        promise: Promise<{
            exitCode: number;
            error: string | null;
        }>;
    }>;
};
type ExperimentalAPI = {
    editor: {
        getPreferences: () => Promise<EditorPreferences>;
    };
    auth: {
        getAuthToken: () => Promise<string>;
    };
};
type DebugAPI = {
    info: (message: string, data?: Data) => Promise<void>;
    warn: (message: string, data?: Data) => Promise<void>;
    error: (message: string, data?: Data) => Promise<void>;
};
type InternalAPI = {};
type Promisify<T> = T extends Promise<unknown> ? T : Promise<T>;
type RemoteProperty<T> = T extends Function | Comlink__default.ProxyMarked ? Comlink__default.Remote<T> : T extends object ? T : Promisify<T>;
type RemoteObject<T> = {
    [P in keyof T]: RemoteProperty<T[P]>;
};
type ExtensionPort = RemoteObject<ExtensionPortAPI>;

declare const extensionPort: RemoteObject<ExtensionPortAPI>;
declare const proxy: typeof Comlink.proxy;

/**
 * Reads the file specified at `path` and returns an object containing the contents, or an object containing an error if there was one. Required [permissions](/extensions/api/manifest#scopetype): `read`.
 */
declare function readFile(path: string, encoding?: "utf8" | "binary" | null): Promise<{
    content: string;
} | {
    error: string;
}>;
/**
 * Writes the file specified at `path` with the contents `content`. Required [permissions](/extensions/api/manifest#scopetype): `read`, `write-exec`.
 */
declare function writeFile(path: string, content: string | Blob): Promise<{
    success: boolean;
} | {
    error: string;
}>;
/**
 * Reads the directory specified at `path` and returns an object containing the contents, or an object containing an error if there was one. Required [permissions](/extensions/api/manifest#scopetype): `read`.
 */
declare function readDir(path: string): Promise<{
    children: DirectoryChildNode[];
    error: string;
}>;
/**
 * Creates a directory at the specified path. Required [permissions](/extensions/api/manifest#scopetype): `read`, `write-exec`.
 */
declare function createDir(path: string): Promise<{
    success: boolean;
    error: string | null;
}>;
/**
 * Deletes the file at the specified path. Required [permissions](/extensions/api/manifest#scopetype): `read`, `write-exec`.
 */
declare function deleteFile(path: string): Promise<{} | {
    error: string;
}>;
/**
 * Deletes the directory at the specified path. Required [permissions](/extensions/api/manifest#scopetype): `read`, `write-exec`.
 */
declare function deleteDir(path: string): Promise<{} | {
    error: string;
}>;
/**
 * Moves the file or directory at `from` to `to`. Required [permissions](/extensions/api/manifest#scopetype): `read`, `write-exec`.
 */
declare function move(path: string, to: string): Promise<{
    success: boolean;
    error: string | null;
}>;
/**
 * Copies the file at `from` to `to`. Required [permissions](/extensions/api/manifest#scopetype): `read`, `write-exec`.
 */
declare function copyFile(path: string, to: string): Promise<{
    success: boolean;
    error: string | null;
}>;
/**
 * Watches the file at `path` for changes with the provided `listeners`. Returns a dispose method which cleans up the listeners. Required [permissions](/extensions/api/manifest#scopetype): `read`.
 */
declare function watchFile(path: string, listeners: WatchFileListeners, encoding?: "utf8" | "binary"): Promise<DisposerFunction>;
/**
 * Watches file events (move, create, delete) in the specified directory at the given `path`. Returns a dispose method which cleans up the listeners. Required [permissions](/extensions/api/manifest#scopetype): `read`.
 */
declare function watchDir(path: string, listeners: WatchDirListeners): Promise<DisposerFunction>;
/**
 * Watches a text file at `path` for changes with the provided `listeners`. Returns a dispose method which cleans up the listeners.
 *
 * Use this for watching text files, and receive changes as versioned operational transform (OT) operations annotated with their source.
 *
 * Required [permissions](/extensions/api/manifest#scopetype): `read`.
 */
declare function watchTextFile(path: string, listeners: WatchTextFileListeners): () => void;

declare const index$2_copyFile: typeof copyFile;
declare const index$2_createDir: typeof createDir;
declare const index$2_deleteDir: typeof deleteDir;
declare const index$2_deleteFile: typeof deleteFile;
declare const index$2_move: typeof move;
declare const index$2_readDir: typeof readDir;
declare const index$2_readFile: typeof readFile;
declare const index$2_watchDir: typeof watchDir;
declare const index$2_watchFile: typeof watchFile;
declare const index$2_watchTextFile: typeof watchTextFile;
declare const index$2_writeFile: typeof writeFile;
declare namespace index$2 {
  export {
    index$2_copyFile as copyFile,
    index$2_createDir as createDir,
    index$2_deleteDir as deleteDir,
    index$2_deleteFile as deleteFile,
    index$2_move as move,
    index$2_readDir as readDir,
    index$2_readFile as readFile,
    index$2_watchDir as watchDir,
    index$2_watchFile as watchFile,
    index$2_watchTextFile as watchTextFile,
    index$2_writeFile as writeFile,
  };
}

/**
 * Sets the value for a given key. Required [permissions](/extensions/api/manifest#scopetype): `repldb:read`, `repldb:write`.
 */
declare function set(args: {
    key: string;
    value: any;
}): Promise<void>;
/**
 * Returns a value associated with the given key. Required [permissions](/extensions/api/manifest#scopetype): `repldb:read`.
 */
declare function get(args: {
    key: string;
}): Promise<string | {
    error: string | null;
}>;
/**
 * Lists keys in the replDb. Accepts an optional `prefix`, which filters for keys beginning with the given prefix. Required [permissions](/extensions/api/manifest#scopetype): `repldb:read`.
 */
declare function list(args?: {
    prefix?: string;
}): Promise<{
    keys: string[];
} | {
    error: string;
}>;
/**
 * Deletes a key in the replDb. Required [permissions](/extensions/api/manifest#scopetype): `repldb:read`, `repldb:write`.
 */
declare function del(args: {
    key: string;
}): Promise<void>;

declare const replDb_del: typeof del;
declare const replDb_get: typeof get;
declare const replDb_list: typeof list;
declare const replDb_set: typeof set;
declare namespace replDb {
  export {
    replDb_del as del,
    replDb_get as get,
    replDb_list as list,
    replDb_set as set,
  };
}

/**
 * Returns the path to the current file the extension is opened with, if it is a [File Handler](/extensions/basics/key-concepts#file-handler).
 */
declare function filePath(): Promise<string>;

declare const me_filePath: typeof filePath;
declare namespace me {
  export {
    me_filePath as filePath,
  };
}

/**
 * Returns all metadata on the current theme including syntax highlighting, description, HSL, token values, and more.
 */
declare function getCurrentTheme(): Promise<ThemeVersion>;
/**
 * Returns the current theme's global token values.
 */
declare function getCurrentThemeValues(): Promise<ThemeValuesGlobal>;
/**
 * Fires the `callback` parameter function with the updated theme when the user's theme changes.
 */
declare function onThemeChange(callback: OnThemeChangeListener): Promise<DisposerFunction>;
/**
 * Fires the `callback` parameter function with the updated theme values when the user's theme changes.
 */
declare function onThemeChangeValues(callback: OnThemeChangeValuesListener): Promise<DisposerFunction>;

declare const theme_getCurrentTheme: typeof getCurrentTheme;
declare const theme_getCurrentThemeValues: typeof getCurrentThemeValues;
declare const theme_onThemeChange: typeof onThemeChange;
declare const theme_onThemeChangeValues: typeof onThemeChangeValues;
declare namespace theme {
  export {
    theme_getCurrentTheme as getCurrentTheme,
    theme_getCurrentThemeValues as getCurrentThemeValues,
    theme_onThemeChange as onThemeChange,
    theme_onThemeChangeValues as onThemeChangeValues,
  };
}

/**
 * Shows a confirmation toast message within the Replit workspace for `length` milliseconds.  Returns the ID of the message as a UUID
 */
declare const showConfirm: (str: string, length?: number) => Promise<string>;
/**
 * Shows an error toast message within the Replit workspace for `length` milliseconds.  Returns the ID of the message as a UUID
 */
declare const showError: (str: string, length?: number) => Promise<string>;
/**
 * Shows a notice toast message within the Replit workspace for `length` milliseconds.  Returns the ID of the message as a UUID
 */
declare const showNotice: (str: string, length?: number) => Promise<string>;
/**
 * Shows a warning toast message within the Replit workspace for `length` milliseconds.  Returns the ID of the message as a UUID
 */
declare const showWarning: (str: string, length?: number) => Promise<string>;
/**
 * Hides a message by its IDs
 */
declare const hideMessage: (id: string) => Promise<void>;
/**
 * Hides all toast messages visible on the screens
 */
declare const hideAllMessages: () => Promise<void>;

declare const messages_hideAllMessages: typeof hideAllMessages;
declare const messages_hideMessage: typeof hideMessage;
declare const messages_showConfirm: typeof showConfirm;
declare const messages_showError: typeof showError;
declare const messages_showNotice: typeof showNotice;
declare const messages_showWarning: typeof showWarning;
declare namespace messages {
  export {
    messages_hideAllMessages as hideAllMessages,
    messages_hideMessage as hideMessage,
    messages_showConfirm as showConfirm,
    messages_showError as showError,
    messages_showNotice as showNotice,
    messages_showWarning as showWarning,
  };
}

/**
 * Fetches the current user via graphql
 */
declare function currentUser(args?: CurrentUserDataInclusion): Promise<{
    user: CurrentUser;
}>;
/**
 * Fetches a user by their id via graphql
 */
declare function userById(args: {
    id: number;
} & UserDataInclusion): Promise<{
    user: User;
}>;
/**
 * Fetches a user by their username via graphql
 */
declare function userByUsername(args: {
    username: string;
} & UserDataInclusion): Promise<{
    userByUsername: User;
}>;
/**
 * Fetches the current Repl via graphql
 */
declare function currentRepl(args?: ReplDataInclusion): Promise<{
    repl: Repl;
}>;
/**
 * Fetches a Repl by its ID via graphql
 */
declare function replById(args: {
    id: string;
} & ReplDataInclusion): Promise<{
    repl: Repl;
}>;
/**
 * Fetches a Repl by its URL via graphql
 */
declare function replByUrl(args: {
    url: string;
} & ReplDataInclusion): Promise<{
    repl: Repl;
}>;

declare const data_currentRepl: typeof currentRepl;
declare const data_currentUser: typeof currentUser;
declare const data_replById: typeof replById;
declare const data_replByUrl: typeof replByUrl;
declare const data_userById: typeof userById;
declare const data_userByUsername: typeof userByUsername;
declare namespace data {
  export {
    data_currentRepl as currentRepl,
    data_currentUser as currentUser,
    data_replById as replById,
    data_replByUrl as replByUrl,
    data_userById as userById,
    data_userByUsername as userByUsername,
  };
}

/**
 * Sets up a listener to handle when the active file is changed
 */
declare function onActiveFileChange(listener: OnActiveFileChangeListener): DisposerFunction;
/**
 * Returns the current file the user is focusing
 */
declare function getActiveFile(): Promise<string | null>;

declare const session_getActiveFile: typeof getActiveFile;
declare const session_onActiveFileChange: typeof onActiveFileChange;
declare namespace session {
  export {
    session_getActiveFile as getActiveFile,
    session_onActiveFileChange as onActiveFileChange,
  };
}

/**
 * Returns a unique JWT token that can be used to verify that an extension has been loaded on Replit by a particular user
 */
declare function getAuthToken(): Promise<string>;
/**
 * Verifies a provided JWT token and returns the decoded token.
 */
declare function verifyAuthToken(token: string): Promise<{
    payload: any;
    protectedHeader: any;
}>;
/**
 * Performs authentication and returns the user and installation information
 */
declare function authenticate(): Promise<AuthenticateResult>;

declare const auth_authenticate: typeof authenticate;
declare const auth_getAuthToken: typeof getAuthToken;
declare const auth_verifyAuthToken: typeof verifyAuthToken;
declare namespace auth {
  export {
    auth_authenticate as authenticate,
    auth_getAuthToken as getAuthToken,
    auth_verifyAuthToken as verifyAuthToken,
  };
}

/**
 * Returns the current user's editor preferences.
 */
declare function getPreferences(): Promise<EditorPreferences>;

declare const editor_getPreferences: typeof getPreferences;
declare namespace editor {
  export {
    editor_getPreferences as getPreferences,
  };
}

interface AddCommandArgs {
    /**
     * The command's unique identifier. This is used to identify the command in Replit's command system
     */
    id: string;
    /**
     * The surfaces that this command should appear in. This is an array of strings
     */
    contributions: Array<ContributionType>;
    /**
     * A Command, or, a function that returns a Command.
     */
    command: CommandProxy | CreateCommand;
}
/**
 * Adds a command to the command system.
 *
 * @param id The command's unique identifier. This is used to identify the command in Replit's command system
 * @param contributions The surfaces that this command should appear in. This is an array of strings
 * @param command A Command, or, a function that returns a Command.
 */
declare function add({ id, contributions, command }: AddCommandArgs): void;

type commands_AddCommandArgs = AddCommandArgs;
declare const commands_add: typeof add;
declare namespace commands {
  export {
    commands_AddCommandArgs as AddCommandArgs,
    commands_add as add,
  };
}

declare const index$1_auth: typeof auth;
declare const index$1_commands: typeof commands;
declare const index$1_editor: typeof editor;
declare namespace index$1 {
  export {
    index$1_auth as auth,
    index$1_commands as commands,
    index$1_editor as editor,
  };
}

declare namespace index {
  export {
  };
}

/**
 * Spawns a command, with given arguments and environment variables. Takes in callbacks,
 * and returns an object containing a promise that resolves when the command exits, and
 * a dispose function to kill the process
 */
declare function spawn(options: SpawnOptions): SpawnOutput;
/**
 * Executes a command in the shell, with given arguments and environment variables
 */
declare function exec(command: string, options?: {
    env?: Record<string, string>;
}): Promise<ExecResult>;

declare const exec$1_exec: typeof exec;
declare const exec$1_spawn: typeof spawn;
declare namespace exec$1 {
  export {
    exec$1_exec as exec,
    exec$1_spawn as spawn,
  };
}

var version = "1.10.0";

declare function init(args?: ReplitInitArgs): Promise<ReplitInitOutput>;

export { ActionCommandArgs, AuthenticateResult, AuthenticatedInstallation, AuthenticatedUser, BaseCommandArgs, BaseSpawnOptions, ChangeEventType, ColorScheme, CombinedStderrSpawnOptions, Command, CommandArgs, CommandFnArgs, CommandProxy, CommandSymbol, CommandsFn, ContextCommandArgs, ContributionType, CreateCommand, CssColor, CurrentUser, CurrentUserDataInclusion, CurrentUserQueryOutput, CustomTheme, DebugAPI, DeleteEvent, DirectoryChildNode, DisposerFunction, EditorPreferences, ExecResult, ExperimentalAPI, ExtensionPort, ExtensionPortAPI, FsNode, FsNodeArray, FsNodeType, GetLatestContent, GraphResponse, HandshakeStatus, InternalAPI, MoveEvent, OnActiveFileChangeListener, OnThemeChangeListener, OnThemeChangeValuesListener, OutputStrCallback, Promisify, RemoteObject, RemoteProperty, Repl, ReplComment, ReplCommentConnection, ReplDataInclusion, ReplOwner, ReplQueryOutput, ReplitInitArgs, ReplitInitOutput, Run, SerializableValue, SpawnOptions, SpawnOutput, SpawnResult, SplitStderrSpawnOptions, Tag, TextChange, TextFileOnChangeEvent, TextFileReadyEvent, ThemeEditorSyntaxHighlighting, ThemeSyntaxHighlightingModifier, ThemeSyntaxHighlightingTag, ThemeValues, ThemeValuesEditor, ThemeValuesGlobal, ThemeVersion, User, UserByUsernameQueryOutput, UserDataInclusion, UserQueryOutput, UserRole, UserSocial, UserSocialType, WatchDirListeners, WatchDirOnChangeListener, WatchDirOnErrorListener, WatchDirOnMoveOrDeleteListener, WatchFileListeners, WatchFileOnChangeListener, WatchFileOnErrorListener, WatchFileOnMoveOrDeleteListener, WatchTextFileListeners, WatchTextFileOnChangeListener, WatchTextFileOnErrorListener, WatchTextFileOnMoveOrDeleteListener, WatchTextFileOnReadyListener, WriteChange, commands, copyFile, createDir, data, debug, deleteDir, deleteFile, exec$1 as exec, index$1 as experimental, extensionPort, index$2 as fs, init, index as internal, isCommandProxy, me, messages, move, proxy, readDir, readFile, replDb, session, theme as themes, version, watchDir, watchFile, watchTextFile, writeFile };
