/* esm.sh - esbuild bundle(@anthropic-ai/sdk@0.22.0) denonext production */
import*as i from"/v135/@anthropic-ai/sdk@0.22.0/denonext/core.js";import*as r from"/v135/@anthropic-ai/sdk@0.22.0/denonext/error.js";import*as a from"/v135/@anthropic-ai/sdk@0.22.0/denonext/uploads.js";import*as E from"/v135/@anthropic-ai/sdk@0.22.0/denonext/resources.js";var l,o=class extends i.APIClient{constructor({baseURL:t=i.readEnv("ANTHROPIC_BASE_URL"),apiKey:e=i.readEnv("ANTHROPIC_API_KEY")??null,authToken:n=i.readEnv("ANTHROPIC_AUTH_TOKEN")??null,...h}={}){let s={apiKey:e,authToken:n,...h,baseURL:t||"https://api.anthropic.com"};super({baseURL:s.baseURL,timeout:s.timeout??6e5,httpAgent:s.httpAgent,maxRetries:s.maxRetries,fetch:s.fetch}),this.completions=new E.Completions(this),this.messages=new E.Messages(this),this._options=s,this.apiKey=e,this.authToken=n}defaultQuery(){return this._options.defaultQuery}defaultHeaders(t){return{...super.defaultHeaders(t),"anthropic-version":"2023-06-01",...this._options.defaultHeaders}}validateHeaders(t,e){if(!(this.apiKey&&t["x-api-key"])&&e["x-api-key"]!==null&&!(this.authToken&&t.authorization)&&e.authorization!==null)throw new Error('Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted')}authHeaders(t){let e=this.apiKeyAuth(t),n=this.bearerAuth(t);return e!=null&&!i.isEmptyObj(e)?e:n!=null&&!i.isEmptyObj(n)?n:{}}apiKeyAuth(t){return this.apiKey==null?{}:{"X-Api-Key":this.apiKey}}bearerAuth(t){return this.authToken==null?{}:{Authorization:`Bearer ${this.authToken}`}}};l=o;o.Anthropic=l;o.HUMAN_PROMPT=`

Human:`;o.AI_PROMPT=`

Assistant:`;o.AnthropicError=r.AnthropicError;o.APIError=r.APIError;o.APIConnectionError=r.APIConnectionError;o.APIConnectionTimeoutError=r.APIConnectionTimeoutError;o.APIUserAbortError=r.APIUserAbortError;o.NotFoundError=r.NotFoundError;o.ConflictError=r.ConflictError;o.RateLimitError=r.RateLimitError;o.BadRequestError=r.BadRequestError;o.AuthenticationError=r.AuthenticationError;o.InternalServerError=r.InternalServerError;o.PermissionDeniedError=r.PermissionDeniedError;o.UnprocessableEntityError=r.UnprocessableEntityError;o.toFile=a.toFile;o.fileFromPath=a.fileFromPath;var{HUMAN_PROMPT:p,AI_PROMPT:A}=o,{AnthropicError:P,APIError:m,APIConnectionError:c,APIConnectionTimeoutError:d,APIUserAbortError:f,NotFoundError:I,ConflictError:C,RateLimitError:y,BadRequestError:R,AuthenticationError:U,InternalServerError:b,PermissionDeniedError:T,UnprocessableEntityError:_}=r,x=a.toFile,v=a.fileFromPath;(function(u){u.Completions=E.Completions,u.Messages=E.Messages})(o||(o={}));var F=o;export{A as AI_PROMPT,c as APIConnectionError,d as APIConnectionTimeoutError,m as APIError,f as APIUserAbortError,o as Anthropic,P as AnthropicError,U as AuthenticationError,R as BadRequestError,C as ConflictError,p as HUMAN_PROMPT,b as InternalServerError,I as NotFoundError,T as PermissionDeniedError,y as RateLimitError,_ as UnprocessableEntityError,F as default,v as fileFromPath,x as toFile};
//# sourceMappingURL=sdk.mjs.map