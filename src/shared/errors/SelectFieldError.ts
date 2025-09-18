export class SelectFieldError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SelectFieldError';
    }
}
