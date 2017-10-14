import { AsyncStorage } from 'react-native'

import Metabase from './metabase'

const FAKE_SESSION_TOKEN = '12341234'

describe('metabase', () => {
    describe('login', () => {
        describe('a successful request', () => {
            beforeEach(() =>
                global.fetch = jest.fn().mockImplementation(() => {
                    return new Promise((resolve, reject) => {
                        resolve({
                            json: () => {
                                return { id: FAKE_SESSION_TOKEN }
                            }
                        })
                    })
                })
            )
            it('should set the url and session token in storage', async () => {
                const spy = jest.spyOn(AsyncStorage, 'setItem')

                const loginDetails = {
                    username: 'kyle',
                    password: '12341234',
                    metabaseUrl: 'derp.lerp'
                }
                await Metabase.login(loginDetails)
                expect(spy.mock.calls.length).toBe(2)

                // the first call should set the token
                expect(spy.mock.calls[0]).toEqual(['metabaseSessionToken', FAKE_SESSION_TOKEN])
                // the second call should set the instance url
                expect(spy.mock.calls[1]).toEqual(['metabaseUrl', loginDetails.metabaseUrl])

            })
            afterEach(() => {
                // we have to clear our mocks otherwise the calls to setItem
                // will get picked up in later tests
                jest.clearAllMocks()
            })
        })
        describe('an unsuccessful request', () => {
            let message
            beforeEach(() => {
                message = 'Sorry bad login'
                global.fetch = jest.fn().mockImplementation(() => {
                    return new Promise((resolve, reject) => {
                        reject({
                            error: {
                                message
                            }
                        })
                    })
                })
            })
            it('should error', async () => {
                const spy = jest.spyOn(AsyncStorage, 'setItem')

                await Metabase.login({
                    username: null,
                    password: null,
                    metabaseUrl: null
                })

                // we should not be setting anything in local storage
                expect(spy.mock.calls.length).toBe(0)

            })
        })
    })
    describe('logout', () => {
        it('should remove the token from storage', async () => {
            const spy = jest.spyOn(AsyncStorage, 'removeItem')
            const mbSpy = jest.spyOn(Metabase, 'request')
            await Metabase.logout()

            expect(spy).toHaveBeenCalled()
            expect(mbSpy).toHaveBeenCalled()
        })
    })

    describe('request', () => {
        it('should grab the metabase url and token from storage and use them to form a request', async () => {
            const spy = jest.spyOn(AsyncStorage, 'getItem')

            await Metabase.request('resource')
            expect(spy.mock.calls.length).toBe(2)
        })
    })
})
