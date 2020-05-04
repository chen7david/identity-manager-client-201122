import http from './http'

export default {

    register: async (registerInfo) => {
        return await http.post('/register', registerInfo)
    },

    login: async (auth) => {
        return await http.post('/login', auth)
    },

    qrlogin: async (authInfo) => {
        return await http.post('/qrlogin', authInfo)
    },
}