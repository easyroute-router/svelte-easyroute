export class RouterException extends Error {
    constructor(message : string) {
        super(`Easyroute Error :: ${message}`);
    }
}
