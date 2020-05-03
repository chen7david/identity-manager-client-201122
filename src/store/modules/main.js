import AccountService from './../../plugins/api/AccountService'

export default {
    state: {
        isLoading: false
    },
    getters: {
        isLoading: (state) => state.isLoading
    }, 
    mutations: {
        SET_LOADING: (state, boolean) => state.isLoading = boolean
    },
    actions: {
        async register(_, registerInfo){
            const user = await AccountService.register(registerInfo)
            console.log({user})
            // router.push({
            //     name: 'EmailManagement',
            //     query: {
            //         username: registerInfo.email
            //     }
            // })
        },
    }
}