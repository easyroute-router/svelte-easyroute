import generateId from './IdGenerator'

type ObservableListener = (value: any) => void

export default function Observable<T>(initValue: T) {
  const _object = {
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
      value: function (listener: ObservableListener) {
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
