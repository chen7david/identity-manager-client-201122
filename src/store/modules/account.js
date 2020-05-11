import AccountService from '../../plugins/api/AccountService'
import router from '../../router'

export default {
    
    state: {
        $user: JSON.parse(localStorage.getItem('user')),
        rqlogedin: false
    },

    getters: {
        isAuth: (state) => state.$user != null,
        $user: (state) => state.$user ? state.$user : {},
        me: (state) => state.$user ? state.$user : {},
        rqlogedin: (state) => state.rqlogedin ,
    },

    mutations: {
        $SET_USER: (state, user) => state.$user = user,
        $SET_QRLOGEDIN: (state, boolean) => state.rqlogedin = boolean,
    },
    actions: {
        /* MANAGEMENT */

        async register(_, registerInfo){
            const user = await AccountService.register(registerInfo)
            router.push({
                name: 'EmailManagement',
                query: {
                    username: user.email
                }
            })
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
            await AccountService.requestPasswordRecovery({username})
            router.push('/home')
        },

        async recoverPassword({commit}, user){
            const { data } = await AccountService.recoverPassword(user)
            commit('$SET_USER', data.user) 
            router.push('/login')
        },

        async manageEmail(_, manageEmailInfo){
            const { username, email, code } = manageEmailInfo
            console.log({username, email, code})
            // const { data } = await AccountService.getMe()
            // commit('$SET_USER', data) 
        },

        /* AUTHENTICATION */

        async login({commit}, {authInfo, redirect}){
            const { data } = await AccountService.login(authInfo)
            localStorage.setItem('access-token', data.accessToken)
            localStorage.setItem('refresh-token', data.refreshToken)
            localStorage.setItem('user', JSON.stringify(data.user))
            commit('$SET_USER', data.user) 
            router.push(redirect || '/profile')
        },

        async refreshAccessToken(){
            return await AccountService.refreshAccessToken() 
        },

        async handleQRLogin({commit}, { authState, redirect}){
            localStorage.setItem('access-token', authState.accessToken)
            localStorage.setItem('refresh-token', authState.refreshToken)
            localStorage.setItem('user', JSON.stringify(authState.user))
            commit('$SET_USER', authState.user) 
            router.push(redirect || '/profile')
        },

        async qrlogin({commit}, code){
            const { data } = await AccountService.qrlogin({code}) 
            commit('$SET_QRLOGEDIN', true)
            console.log({data})
        },

        async logout({commit}, redirect){
            const refreshToken = localStorage.getItem('refresh-token')
            localStorage.removeItem('access-token')
            localStorage.removeItem('refresh-token')
            localStorage.removeItem('user') 
            commit('$SET_USER', null)
            if(refreshToken) await AccountService.logout(refreshToken)
            router.push(redirect || '/login')
        },  
    },
  }