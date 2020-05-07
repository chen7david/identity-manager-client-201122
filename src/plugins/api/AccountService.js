import http from './http'

export default {

    register: async (registerInfo) => {
        return await http.post('/register', registerInfo)
    },

    login: async (auth) => {
        return await http.post('/login', auth)
    },

    logout: async (refreshToken) => {
        console.log({refreshToken})
        if(refreshToken) http.defaults.headers.common['x-refresh-token'] = `Bearer ${refreshToken}`
        return await http.delete('/logout')
    },

    qrlogin: async (authInfo) => {
        return await http.post('/qrlogin', authInfo)
    },

    refreshAccessToken: async () => {
        return await http.patch('/refresh')
    },
}