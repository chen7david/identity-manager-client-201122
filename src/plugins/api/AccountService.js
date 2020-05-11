import http from './http'

export default {

    /* ACCOUNT MANAGEMENT */

    register: async (registerInfo) => {
        return await http.post('/register', registerInfo)
    },

    requestPasswordRecovery: async (requestPasswordRecoveryInfo) => {
        return await http.post('/request-password-recovery', requestPasswordRecoveryInfo)
    },

    recoverPassword: async (recoverPasswordInfo) => {
        return await http.patch('/recover-password', recoverPasswordInfo)
    },

    updateEmail: async (updateEmialInfo) => {
        return await http.patch('/update-email', updateEmialInfo)
    },

    resendEmail: async (resendEmialInfo) => {
        return await http.post('/update-email', resendEmialInfo)
    },

    confirmEmail: async (resendEmialInfo) => {
        return await http.patch('/update-email', resendEmialInfo)
    },

    /* AUTHENTICATION */
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

    /* AUTHENTICATION */
}