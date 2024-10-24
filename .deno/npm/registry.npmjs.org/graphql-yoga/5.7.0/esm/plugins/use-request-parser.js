const DEFAULT_MATCHER = () => true;
export function useRequestParser(options) {
    const matchFn = options.match || DEFAULT_MATCHER;
    return {
        onRequestParse({ request, setRequestParser }) {
            if (matchFn(request)) {
                setRequestParser(options.parse);
            }
        },
    };
}
