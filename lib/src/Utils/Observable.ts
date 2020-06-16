import generateId from "./IdGenerator";

export default function Observable<T>(initValue: T) {
    let _object = {
        value: initValue
    }

    Object.defineProperties(_object, {
        getValue: {
            get() {
                return this.value
            }
        },
        _subscribersQueue: {
            value: {},
            writable: true
        },
        subscribe: {
            value: function (listener: Function) {
                const id = generateId()
                this._subscribersQueue[id] = listener
                return () => {
                    delete this._subscribersQueue[id]
                }
            }
        },
        setValue: {
            value: function (newValue: T) {
                this.value = newValue
                for (const key in this._subscribersQueue) {
                    const subscriber = this._subscribersQueue[key]
                    subscriber(this.value)
                }
            }
        }
    })
    return _object
}
