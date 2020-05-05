import axios from 'axios'
import store from '../../store'
import directiveHandler from './directiveHandler'

const http = axios.create({
    baseURL: 'http://192.168.50.149:5000',
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


// let subscribers = []
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

    console.log(`api-response-error-object -> ${data}`)

    const { isCargo, details, directives, payload } = data

    /* REFRESHING STEP */
    if(
        !isRefreshing && 
        !config.url.includes('/refresh') &&
        status === 401 && 
        details.message.includes('expired access-token')
    ){  
        isRefreshing = true
        const response = await store.dispatch('refreshAccessToken')
        const { status, data:{ accessToken } } = response
        if(status === 200){
            isRefreshing = false
            localStorage.setItem('access-token', accessToken)
            return Promise.resolve(http(config))
        }
    }

    if(isCargo) {
        if(details.state == 'validation'){
            await store.dispatch('setValidation', details)
        }else{
            if(details.message.includes('invalid refresh-token!'))
                await store.dispatch('logout', '/login')
            await store.dispatch('setSnackbar', details)
        }
        if(directives) await directiveHandler(directives, payload)
    }
    await store.dispatch('isLoading', false)
    return Promise.reject(error)
})
export default http