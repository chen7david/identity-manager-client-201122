import axios from 'axios'
import store from '../../store'
import directiveHandler from './directiveHandler'
import url from 'url'
import config from './../../../config/default'
const http = axios.create({
    baseURL: url.format(config.server),
    timeout: 12000
})

let isRefreshing = false

/* REQUEST INTERCEPTOR */
http.interceptors.request.use(async (config) => {
    config.url = encodeURI(config.url)
    let accessToken = localStorage.getItem('access-token')
    if(accessToken != null) config.headers.Authorization = `Bearer ${accessToken}`
    if(isRefreshing) {
        let refreshToken = localStorage.getItem('refresh-token')
        if(refreshToken != null) config.headers['x-refresh-token'] = `Bearer ${refreshToken}` 
    }
    await store.dispatch('isLoading', true)
    return config
},async (error) => {
    await store.dispatch('isLoading', false)
    console.log({'req-error->': error})
    return Promise.reject(error)
})

/* RESPONSE INTERCEPTOR */

http.interceptors.response.use(async (response) => {
    const { isCargo, payload, details } = response.data
    isRefreshing = false
    if(isCargo) {
        response.data = payload
        if(details) await store.dispatch('setSnackbar', details)
    }
    await store.dispatch('isLoading', false)
    await store.dispatch('setValidation', null)

    return response
}, async (error) => {
    const { config, response: { status, data } } = error

    console.log({data, error})

    const { isCargo, details, directives, payload } = data

    /* REFRESHING ACCESSTOKEN */
    
    if(
        !isRefreshing && 
        status === 401 && 
        details.message.includes('expired access-token')
    ){  
        try {
            isRefreshing = true
            const { status, data: { accessToken } } = await store.dispatch('refreshAccessToken')
            isRefreshing = false
            if(status === 200 && !config.url.includes('/refresh')){
                localStorage.setItem('access-token', accessToken)
                return Promise.resolve(http(config))
            }
        } catch (err) {
            isRefreshing = false
            if(err.response.data.details.message.includes('refresh-token')){
                await store.dispatch('logout', '/login')
            }
        }
    }

    /* ERROR HANDLING */

    if(isCargo) {
        if(details.state == 'validation'){
            await store.dispatch('setValidation', details)
        }else{
            await store.dispatch('setSnackbar', details)
        }
        if(directives) await directiveHandler(directives, payload)
    }
    await store.dispatch('isLoading', false)
    return Promise.reject(error)
})
export default http