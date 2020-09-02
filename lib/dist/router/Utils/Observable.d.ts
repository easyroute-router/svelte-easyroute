declare type ObservableListener = (value: any) => void;
export default class Observable<T> {
    private value;
    private _subscribersQueue;
    constructor(value: T);
    get getValue(): T;
    subscribe(listener: ObservableListener): () => void;
    setValue(newValue: T): void;
}
export {};
