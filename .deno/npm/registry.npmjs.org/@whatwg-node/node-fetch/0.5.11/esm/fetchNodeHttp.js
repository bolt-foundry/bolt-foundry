import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { PassThrough, Readable } from 'stream';
import { createBrotliDecompress, createGunzip, createInflate } from 'zlib';
import { PonyfillAbortError } from './AbortError.js';
import { PonyfillRequest } from './Request.js';
import { PonyfillResponse } from './Response.js';
import { PonyfillURL } from './URL.js';
import { getHeadersObj, isNodeReadable } from './utils.js';
function getRequestFnForProtocol(url) {
    if (url.startsWith('http:')) {
        return httpRequest;
    }
    else if (url.startsWith('https:')) {
        return httpsRequest;
    }
    throw new Error(`Unsupported protocol: ${url.split(':')[0] || url}`);
}
export function fetchNodeHttp(fetchRequest) {
    return new Promise((resolve, reject) => {
        try {
            const requestFn = getRequestFnForProtocol(fetchRequest.url);
            const nodeReadable = (fetchRequest.body != null
                ? isNodeReadable(fetchRequest.body)
                    ? fetchRequest.body
                    : Readable.from(fetchRequest.body)
                : null);
            const headersSerializer = fetchRequest.headersSerializer || getHeadersObj;
            const nodeHeaders = headersSerializer(fetchRequest.headers);
            const nodeRequest = requestFn(fetchRequest.url, {
                method: fetchRequest.method,
                headers: nodeHeaders,
                signal: fetchRequest['_signal'] ?? undefined,
                agent: fetchRequest.agent,
            });
            nodeRequest.once('response', nodeResponse => {
                let responseBody = nodeResponse;
                const contentEncoding = nodeResponse.headers['content-encoding'];
                switch (contentEncoding) {
                    case 'x-gzip':
                    case 'gzip':
                        responseBody = nodeResponse.pipe(createGunzip());
                        break;
                    case 'x-deflate':
                    case 'deflate':
                        responseBody = nodeResponse.pipe(createInflate());
                        break;
                    case 'br':
                        responseBody = nodeResponse.pipe(createBrotliDecompress());
                        break;
                }
                if (nodeResponse.headers.location) {
                    if (fetchRequest.redirect === 'error') {
                        const redirectError = new Error('Redirects are not allowed');
                        reject(redirectError);
                        nodeResponse.resume();
                        return;
                    }
                    if (fetchRequest.redirect === 'follow') {
                        const redirectedUrl = new PonyfillURL(nodeResponse.headers.location, fetchRequest.url);
                        const redirectResponse$ = fetchNodeHttp(new PonyfillRequest(redirectedUrl, fetchRequest));
                        resolve(redirectResponse$.then(redirectResponse => {
                            redirectResponse.redirected = true;
                            return redirectResponse;
                        }));
                        nodeResponse.resume();
                        return;
                    }
                }
                if (responseBody === nodeResponse) {
                    responseBody = nodeResponse.pipe(new PassThrough());
                    responseBody.on('pause', () => {
                        nodeResponse.pause();
                    });
                    responseBody.on('resume', () => {
                        nodeResponse.resume();
                    });
                    responseBody.on('close', () => {
                        nodeResponse.destroy();
                    });
                    fetchRequest['_signal']?.addEventListener('abort', () => {
                        if (!nodeResponse.destroyed) {
                            responseBody.emit('error', new PonyfillAbortError());
                        }
                    });
                }
                nodeResponse.once('error', reject);
                const ponyfillResponse = new PonyfillResponse(responseBody, {
                    status: nodeResponse.statusCode,
                    statusText: nodeResponse.statusMessage,
                    headers: nodeResponse.headers,
                    url: fetchRequest.url,
                });
                resolve(ponyfillResponse);
            });
            nodeRequest.once('error', reject);
            if (nodeReadable) {
                nodeReadable.pipe(nodeRequest);
            }
            else {
                nodeRequest.end();
            }
        }
        catch (e) {
            reject(e);
        }
    });
}
