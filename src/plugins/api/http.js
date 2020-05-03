import axios from 'axios'
import store from '../../store'

const http = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 12000
})

/* REQUEST INTERCEPTOR */
http.interceptors.request.use((config) => {
    config.url = encodeURI(config.url)
    let accessToken = localStorage.getItem('access-token')
    if(accessToken != null) config.headers.Authorization = `Bearer ${accessToken}`

    store.dispatch('SET_LOADING', true)
    return config
},(error) => {
    store.dispatch('SET_LOADING', false)
    console.log({'req-error': error})
    return Promise.reject(error)
})

/* RESPONSE INTERCEPTOR */
http.interceptors.response.use((response) => {

    const { isCargo, payload, details, directives } = response.data
    console.log({ isCargo, payload, details, directives })
    if(isCargo) {
        response.data = payload
        /* handle login credentials */ 
        if(payload) {
            const { accessToken, refreshToken, user } = payload
            if(accessToken) localStorage.setItem('access-token', accessToken)
            if(refreshToken) {
                localStorage.setItem('refresh-token', refreshToken)
                localStorage.setItem('user', JSON.stringify(user))
            }
        }
        if(details) store.dispatch('setSnackbar', details)
    }

    store.dispatch('isLoading', false)
    // store.dispatch('setValidation', null)
    
    return response
    
},(error) => {
    console.log(`api-response-error-object -> ${error}`)
    const { isCargo, details } = error.response.data
    // , directives, payload
    store.dispatch('isLoading', false)
    
    if(isCargo) {
        if(details.state == 'validation'){
            store.dispatch('setValidation', details)
        }else{
            store.dispatch('setSnackbar', details)
        }
        // if(directives) handelDirective(directives, payload)
    }

    return Promise.reject(error)
})
export default http