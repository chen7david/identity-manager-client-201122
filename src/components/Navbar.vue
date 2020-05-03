<template>
    <v-app-bar app dark>
        <v-btn tile text router to="/">home</v-btn>
        <v-spacer></v-spacer>
        <span v-if="isAuth">
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn min-width="130px" tile text v-on="on">{{$user.username}}</v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in items" :key="index" router :to="item.route">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn @click="logout()" text tile>logout</v-btn>
        </span>
        <div v-else>
            <v-btn tile text router to="/register">register</v-btn>
            <v-btn tile text router to="/login">login</v-btn>
        </div>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name:'Navbar',
    data: () => ({
        loginInfo: {
            username: 'david',
            password: '888888'
        },
        items: [
            { title: 'home', route:'/' },
            { title: 'profile', route:'/profile' },
            { title: 'update password', route:'/password-update' },
            { title: 'update email', route:'/email-update' },
        ]
    }),
    components: {
    },
    computed: {
        ...mapGetters([
            '$user',
            'isAuth'
        ])
    },
    methods: {
        ...mapActions([
            'logout',
            'login'
        ])
    },
}
</script>