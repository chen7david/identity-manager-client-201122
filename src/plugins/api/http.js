import axios from 'axios'
import store from '../../store'
import directiveHandler from './directiveHandler'
const http = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 12000
})

/* REQUEST INTERCEPTOR */
http.interceptors.request.use(async (config) => {
    config.url = encodeURI(config.url)
    let accessToken = localStorage.getItem('access-token')
    if(accessToken != null) config.headers.Authorization = `Bearer ${accessToken}`
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

    if(isCargo) {
        response.data = payload
        if(details) await store.dispatch('setSnackbar', details)
    }
    await store.dispatch('isLoading', false)
    await store.dispatch('setValidation', null)
    
    return response
}, async (error) => {
    console.log(`api-response-error-object -> ${error}`)
    const { isCargo, details, directives, payload } = error.response.data
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