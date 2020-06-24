import Router from "../dist";

const config = {
    mode: 'history',
    routes: [
        {
            name: 'Route1',
            path: '/route1',
            component: () => 'route1'
        }
    ]
}

let windowSpy

describe('Basic funcs', () => {
    let router

    beforeEach(() => {
        windowSpy = jest.spyOn(global, 'window', 'get')
    })

    afterEach(() => {
        windowSpy.mockRestore();
    });

    it('Should throw error if no config passed', () => {
        expect(() => {
            router = new Router()
        }).toThrowError()
    })

    it('Creates instance', () => {
        expect(() => {
            router = new Router(config)
        }).not.toThrowError()
    })

    it('Returns empty string if base url is nullable', () => {
        expect(router.base).toBe('')
    })
})