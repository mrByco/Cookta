export interface HttpResponse {
    subscribe: (onOk: (body: any) => void, onError: (error: any) => void) => void
}

export interface IHttpCaller {
    GET: (url: string) => Promise<HttpResponse>;
    DELETE: (url: string) => Promise<HttpResponse>;
    POST: (url: string, body?: any, file?: any) => Promise<HttpResponse>;
    PUT: (url: string, body?: any) => Promise<HttpResponse>;
}
