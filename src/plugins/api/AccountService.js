import http from './http'

export default {
    register: async (registerInfo) => {
        return await http.post('/register', registerInfo)
    },
}