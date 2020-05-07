import AccountService from '../../plugins/api/AccountService'
import router from '../../router'

export default {
    
    state: {
        $user: JSON.parse(localStorage.getItem('user')),
    },

    getters: {
        isAuth: (state) => state.$user != null,
        $user: (state) => state.$user ? state.$user : {},
        me: (state) => state.$user ? state.$user : {},
    },

    mutations: {
        $SET_USER: (state, user) => state.$user = user,
    },
    actions: {

        async register(_, registerInfo){
            const user = await AccountService.register(registerInfo)
            console.log({user})
            router.push({
                name: 'EmailManagement',
                query: {
                    username: registerInfo.email
                }
            })
        },

        async login({commit}, {authInfo, redirect}){
            const { data } = await AccountService.login(authInfo)
            localStorage.setItem('access-token', data.accessToken)
            localStorage.setItem('refresh-token', data.refreshToken)
            localStorage.setItem('user', JSON.stringify(data.user))
            commit('$SET_USER', data.user) 
            router.push(redirect || '/profile')
        },

        async handleQRLogin({commit}, { authState, redirect}){
            localStorage.setItem('access-token', authState.accessToken)
            localStorage.setItem('refresh-token', authState.refreshToken)
            localStorage.setItem('user', JSON.stringify(authState.user))
            commit('$SET_USER', authState.user) 
            router.push(redirect || '/profile')
        },

        async refreshAccessToken(){
            return await AccountService.refreshAccessToken() 
        },

        async updateEmail(_, updateInfo){
            await AccountService.emailCorrection(updateInfo)
            router.push({
                path: 'email-management',
                query: {
                    username: updateInfo.email
                }
            })
        },

        async patchEmail(_, updateInfo){
            await AccountService.emailUpdate(updateInfo)
            router.push({
                name: 'EmailManagement',
                query: {
                    username: updateInfo.email
                }
            })
        },

        async qrlogin(_, code){
            const { data } = await AccountService.qrlogin({code}) 
            console.log({data})
        },

        async qrSetLogin({commit}, payload){
            const { user, accessToken, refreshToken } = payload
            localStorage.setItem('access-token', accessToken)
            localStorage.setItem('refresh-token', refreshToken)
            localStorage.setItem('user', JSON.stringify(user))
            commit('$SET_USER', user)
            router.push('/profile')
        },

        async refresh(){
            await AccountService.refresh()
        },

        async logout({commit}, redirect){
            if(localStorage.getItem('access-token'))
                await AccountService.logout()
            localStorage.removeItem('access-token')
            localStorage.removeItem('refresh-token')
            localStorage.removeItem('user') 
            commit('$SET_USER', null)
            router.push(redirect || '/')
        },

        async resendConfirmationEmail(_, username){
            await AccountService.resendEmailConfirmation({ username })
        },

        async confirmEmail({commit}, code){
            const { data } = await AccountService.confirmEmail({ code })
            commit('$SET_USER', data.user)
            router.push('/profile')
        },

        async getMe({commit}){
            const { data } = await AccountService.getMe()
            commit('$SET_USER', data) 
        },

        async sendPasswordRevoceryEmail(_, username){
            await AccountService.sendPasswordRecoveryEmail({username})
        },

        async revocerPassword({commit}, user){
            const { data } = await AccountService.recoverPassword(user)
            commit('$SET_USER', data.user) 
        },  
    },
  }