import http from './http'

export default {

    register: async (registerInfo) => {
        return await http.post('/register', registerInfo)
    },

    login: async (auth) => {
        return await http.post('/login', auth)
    },

    logout: async (accessToken) => {
        if(accessToken) http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        return await http.delete('/logout')
    },

    qrlogin: async (authInfo) => {
        return await http.post('/qrlogin', authInfo)
    },

    refreshAccessToken: async () => {
        return await http.patch('/refresh')
    },
}