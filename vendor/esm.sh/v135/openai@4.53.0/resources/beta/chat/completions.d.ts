import * as Core from "../../../core.d.ts";
import { APIResource } from "../../../resource.d.ts";
import { ChatCompletionRunner, ChatCompletionFunctionRunnerParams } from "../../../lib/ChatCompletionRunner.d.ts";
export { ChatCompletionRunner, ChatCompletionFunctionRunnerParams } from "../../../lib/ChatCompletionRunner.d.ts";
import { ChatCompletionStreamingRunner, ChatCompletionStreamingFunctionRunnerParams } from "../../../lib/ChatCompletionStreamingRunner.d.ts";
export { ChatCompletionStreamingRunner, ChatCompletionStreamingFunctionRunnerParams, } from "../../../lib/ChatCompletionStreamingRunner.d.ts";
import { BaseFunctionsArgs } from "../../../lib/RunnableFunction.d.ts";
export { RunnableFunction, RunnableFunctions, RunnableFunctionWithParse, RunnableFunctionWithoutParse, ParsingFunction, ParsingToolFunction, } from "../../../lib/RunnableFunction.d.ts";
import { ChatCompletionToolRunnerParams } from "../../../lib/ChatCompletionRunner.d.ts";
export { ChatCompletionToolRunnerParams } from "../../../lib/ChatCompletionRunner.d.ts";
import { ChatCompletionStreamingToolRunnerParams } from "../../../lib/ChatCompletionStreamingRunner.d.ts";
export { ChatCompletionStreamingToolRunnerParams } from "../../../lib/ChatCompletionStreamingRunner.d.ts";
import { ChatCompletionStream, type ChatCompletionStreamParams } from "../../../lib/ChatCompletionStream.d.ts";
export { ChatCompletionStream, type ChatCompletionStreamParams } from "../../../lib/ChatCompletionStream.d.ts";
export declare class Completions extends APIResource {
    /**
     * @deprecated - use `runTools` instead.
     */
    runFunctions<FunctionsArgs extends BaseFunctionsArgs>(body: ChatCompletionFunctionRunnerParams<FunctionsArgs>, options?: Core.RequestOptions): ChatCompletionRunner;
    runFunctions<FunctionsArgs extends BaseFunctionsArgs>(body: ChatCompletionStreamingFunctionRunnerParams<FunctionsArgs>, options?: Core.RequestOptions): ChatCompletionStreamingRunner;
    /**
     * A convenience helper for using tool calls with the /chat/completions endpoint
     * which automatically calls the JavaScript functions you provide and sends their
     * results back to the /chat/completions endpoint, looping as long as the model
     * requests function calls.
     *
     * For more details and examples, see
     * [the docs](https://github.com/openai/openai-node#automated-function-calls)
     */
    runTools<FunctionsArgs extends BaseFunctionsArgs>(body: ChatCompletionToolRunnerParams<FunctionsArgs>, options?: Core.RequestOptions): ChatCompletionRunner;
    runTools<FunctionsArgs extends BaseFunctionsArgs>(body: ChatCompletionStreamingToolRunnerParams<FunctionsArgs>, options?: Core.RequestOptions): ChatCompletionStreamingRunner;
    /**
     * Creates a chat completion stream
     */
    stream(body: ChatCompletionStreamParams, options?: Core.RequestOptions): ChatCompletionStream;
}
//# sourceMappingURL=completions.d.ts.map
