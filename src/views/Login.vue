<template>
  <FlexCenter>
    <template v-slot:container>
    <FormCard>
      <template v-slot:title>
          <v-list-item two-line>
            <v-list-item-content>
                <div class="overline">login</div>
                <v-list-item-subtitle>Scan QR with your phone to login.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>  
          <v-btn v-if="QRLogin" icon fab @click="QRLogin = !QRLogin">
              <v-icon>mdi-qrcode</v-icon>
          </v-btn>
      </template>

      <template v-if="!QRLogin" v-slot:image>      
          <v-col @click="QRLogin = !QRLogin" class="mb-5">
            <QRCode :value="QRURL" size="250"/>
          </v-col>
      </template>

      <template v-if="QRLogin" v-slot:form>      
          <v-col>
            <v-text-field
              :error-messages="validate('username')"
              label="Username"
              name="username"
              outlined
              clearable
              hint="At least 1 character, no spaces"
              v-model="authInfo.username"
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
              v-model="authInfo.password"
            ></v-text-field>
          </v-col>

      </template>

      <template v-slot:actions>      
          <v-col v-if="QRLogin">
            <v-btn :loading="isLoading" large class="mt-0" elevation="0" block @click="login({authInfo, redirect})">login</v-btn>
            <v-divider class="my-5"></v-divider>
            <v-btn :loading="isLoading" dark color="warning" v-if="invalidPassword" large elevation="0" block @click="sendPasswordRevoceryEmail(authInfo.username)">recover password</v-btn>
            <v-btn v-else large elevation="0" block router to="/register">register</v-btn>
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
import QRCode from 'qrcode.vue'
import { isMobileOnly } from 'mobile-device-detect'
import url from 'url'

export default {
    name:'Login',
    data: () => ({
        authInfo: {
          username: 'david',
          password: '888888'
        },
        show: false,
        QRLogin: isMobileOnly,
        code: null,
        redirect: null,
    }),
    components: {
        QRCode,
        FlexCenter,
        FormCard
    },
    computed: {
        ...mapGetters([
            'validate',
            'isLoading',
            'config'
        ]),

        QRURL(){
          const URL = Object.assign(this.config.client, {
              pathname: 'qrauth',
              query: {code: this.code}
          })
          if(this.redirect) URL.query.redirect = this.redirect
          return url.format(URL)
        }, 
        invalidPassword(){
          return this.validate('password') != null
        }
    },
    methods: {
        ...mapActions([
            'login',
            'handleQRLogin',
            'sendPasswordRevoceryEmail'
        ]), 
    },
    sockets:{
      connect(){
        console.log('socket connected', this.$socket.client.id)
        this.code = this.$socket.client.id
      },
      qrlogin(data){
        console.log('socket qrlogin', data)
        this.handleQRLogin({authState: data})
      }
    },
    mounted(){
       this.code = this.$socket.client.id
       this.redirect = this.$route.query.redirect
    }
}
</script>