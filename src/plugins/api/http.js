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
http.interceptors.response.use(async (response) => {
    const { isCargo, payload, details } = response.data
    isRefreshing = false
    if(isCargo) {
        response.data = payload
        if(details) await store.dispatch('setSnackbar', details)
    }
    await store.dispatch('isLoading', false)
    await store.dispatch('setValidation', null)
    console.log({isRefreshing})
    return response
}, async (error) => {
    console.log(`api-response-error-object -> ${error}`)
    const { isCargo, details, directives, payload } = error.response.data
    
    if(
        !isRefreshing && 
        error.response.status === 401 && 
        details.message.includes('expired access-token')
    ){
        isRefreshing = true
        let refreshToken = localStorage.getItem('refresh-token')
        error.response.config.headers['x-refresh-token'] = `Bearer ${refreshToken}` 
        console.log({isRefreshing,d:details.message, isLoading: store.getters.isLoading})
        await store.dispatch('refreshAccessToken')
    }

    await store.dispatch('isLoading', false)
    if(isCargo) {
        if(details.state == 'validation'){
            await store.dispatch('setValidation', details)
        }else{
            await store.dispatch('setSnackbar', details)
        }
        if(directives) await directiveHandler(directives, payload)
    }

    return Promise.reject(error)
})
export default http