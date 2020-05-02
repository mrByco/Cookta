export function NotFoundError(): Error {
    let error = new Error('Not found');
    error['code'] = 404
    return error;
}
