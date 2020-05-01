export function ProcessPromiseResponse(controllerObj: any, promise: Promise<any> | any, response: any, next: any, onError: (error) => void) {
    return Promise.resolve(promise)
        .then((data: any) => {
            let statusCode = 200;
            response.status(200).json(data);
        })
        .catch((error: any) => {
            console.error(error);
            onError({...error});
            error.stack = undefined;
            error.status = error.status || 500;
            next(new Error('Internal server error (500)'));
        });
}

//Returns the user
export function authenticationReqMiddleware(anoMethod: (req, anonymousEnabled, permissions) => Promise<any> | any, req: any, resp: any, anonymousEnabled: boolean, permissions: string[], onError: (error) => void): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        anoMethod(req, anonymousEnabled, permissions).then((u) => {
            resolve(u);
        }).catch((error) => {
            resp.status(error.status || 401);
            reject(error);
        });
    });
}
