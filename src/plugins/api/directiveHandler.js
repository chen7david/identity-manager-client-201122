import store from '../../store'
import router from '../../router'

const directiveHandler = async (directive, payload) => {
    console.log({directive})
    if(directive == 'to-login') await router.push('/login')
    if(directive == 'logout') await store.dispatch('logout')

    if(directive == 'confirm-email') await router.push({
        name: 'EmailConfirm',
        query: {
            username: payload.email
        }
    })

}

export default async (directives, payload) => {
    for(let directive of directives){
        await directiveHandler(directive, payload)
    } 
}