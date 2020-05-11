<template>
    <FlexCenter>
        <template v-slot:container>
        <FormCard>
                <template v-slot:title>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="overline">register</div>
                            <v-list-item-subtitle>create an account</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <template v-slot:form>
                    <v-col>
                        <v-text-field
                            :error-messages="validate('username')"
                            label="Username"
                            name="username"
                            outlined
                            clearable
                            hint="At least 1 character, no spaces"
                            v-model="registerInfo.username"
                        ></v-text-field>
                    </v-col>

                    <v-col>
                        <v-text-field
                            :error-messages="validate('email')"
                            label="Email"
                            name="email"
                            outlined
                            clearable
                            hint="please enter a valid email"
                            v-model="registerInfo.email"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field
                            :error-messages="validate('password')"
                            label="Password"
                            name="password"
                            outlined
                            clearable
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            hint="At least 6 characters"
                            @click:append="show = !show"
                            v-model="registerInfo.password"
                        ></v-text-field>
                    </v-col>    
                </template>
                <template v-slot:actions> 
                    <v-col>
                        <v-btn :loading="isLoading" large elevation="0" @click="register(registerInfo)" block >register</v-btn>
                        <v-divider class="my-5"></v-divider>
                        <v-btn large elevation="0" block router to="/login">login</v-btn>
                    </v-col>
                </template>   
        </FormCard>
        </template>
    </FlexCenter>   
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FlexCenter from './../components/layout/FlexCenter'
import FormCard from './../components/layout/FormCard'
export default {
    name:'Register',
    data: () => ({
        registerInfo: {},
        show: false,
    }),
    components: {
        FlexCenter,
        FormCard
    },
    computed: {
        ...mapGetters([
            'validate',
            'isLoading'
        ])
    },
    methods: {
        ...mapActions([
            'register'
        ])
    },
}
</script>