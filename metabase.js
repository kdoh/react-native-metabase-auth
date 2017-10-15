/* @flow */
import { AsyncStorage } from 'react-native'

async function getItem (key:string) {
    return await AsyncStorage.getItem(key)
}

async function setItem(key:string, value:string) {
    return await AsyncStorage.setItem(key, value)
}

const DEFAULT_REQUEST_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

/**
 * The main metabase object
 * @exports Metabase
 * @namespace metabase
*/
const Metabase = {
    /**
     * Get an existing token from the store
     * @method fetchSessionTokenFromStorage
     * @example Metabase.fetchSessionTokenFromStorage()
     * @memberof metabase
    */
    fetchSessionTokenFromStorage: async (): string => {
        const token = await getItem('metabaseSessionToken')
        return token
    },
    /**
     * Log in a user with details
     * @example Metabase.login({
     * username: 'kyle@metabase.com',
     * metabaseUrl: 'metabase.mycompany.com',
     * password: '12341234'
     * })
     * @memberof metabase
    */
    login: async ({ username, password, metabaseUrl }): string => {
        try {
            const request = await fetch(`https://${metabaseUrl}/api/session`, {
                method: 'POST',
                headers: DEFAULT_REQUEST_HEADERS,
                body: JSON.stringify({
                    username,
                    password
                })
            })
            const { id } = await request.json()
            await setItem('metabaseSessionToken', id)
            await setItem('metabaseUrl', metabaseUrl)
            return id
        } catch (error) {
            console.error(error)
            return false
        }
    },
    /**
     * Make requests to Metabase resources using the stored session token and Metabase url
     * @example
     * Get the currently logged in user
     * Metabase.request('user/current')
     * Update a user
     * Metabase.request('user, {
     * method: PUT,
     * body: {
     * first_name: 'New Kyle'
     * }
     * })
     * @memberof metabase
    */
    request: async (
        resource: string,
        requestParams: object = {
            method: 'GET',
            headers: DEFAULT_REQUEST_HEADERS
        }
    ): object => {
        const token = await Metabase.fetchSessionTokenFromStorage()
        const urlPrefix = await getItem('metabaseUrl')
        if(!token) {
            return false
        }
        if(!urlPrefix) {
            return false
        }
        const params = {
            ...requestParams,
            headers: {
                ...requestParams.headers,
                'X-Metabase-Session': token
            }
        }

        try {
            const request = await fetch(`https://${urlPrefix}/api/${resource}`, params)
            const response = await request.json()
            return response
        } catch (error) {
            console.error(error)
        }
    },
    /**
     * Destroy the session and remove the stored session token
     * @example Metabase.logout()
     * @memberof metabase
    */
    logout: async (): void => {
        await Metabase.request('session', {
            method: 'DELETE'
        })
        await AsyncStorage.removeItem('metabaseSessionToken')
    }
}

export default Metabase
