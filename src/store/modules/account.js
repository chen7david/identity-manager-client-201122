import AccoutService from './../../plugins/api/AccountService'

export default {
    state: {

    },
    getters: {

    }, 
    mutations: {

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