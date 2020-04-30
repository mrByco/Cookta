export function ProcessPromiseResponse(controllerObj: any, promise: Promise<any> | any, response: any, next: any){
    return Promise.resolve(promise)
        .then((data: any) => {
            let statusCode = 200;
            response.status(200).json(data);
        })
        .catch((error: any) => next(error));
}
