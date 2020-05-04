<template>
  <FlexCenter>
    <template v-slot:container>
    <FormCard>
      <template v-slot:title>
          <v-list-item two-line>
            <v-list-item-content>
                <div class="overline">login</div>
                <v-list-item-subtitle>QRLogin Supported on this device</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>  
          <v-btn v-if="QRLogin" icon fab @click="QRLogin = !QRLogin">
              <v-icon>mdi-qrcode</v-icon>
          </v-btn>
      </template>

      <template v-if="!QRLogin" v-slot:image>      
          <v-col @click="QRLogin = !QRLogin">
            <QRCode :value="QRURL" size="200"/>
          </v-col>
      </template>

      <template v-if="QRLogin" v-slot:form>      
          <v-col>
            <v-text-field
              :error-messages="validate('username')"
              label="Username"
              name="username"
              outlined
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
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              hint="At least 6 characters"
              @click:append="show = !show"
              v-model="authInfo.password"
            ></v-text-field>
          </v-col>

      </template>

      <template v-slot:actions>      
          <v-col>
            <v-btn v-if="QRLogin" :loading="isLoading" large class="mt-0" elevation="0" block @click="login({authInfo, redirect})">login</v-btn>
            <v-divider v-if="QRLogin" class="my-5"></v-divider>
            <v-btn v-if="QRLogin" large elevation="0" block router to="/register">register</v-btn>
          </v-col>
      </template>
    </FormCard>
    </template>
  </FlexCenter>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import QRCode from 'qrcode.vue'
import FlexCenter from './../components/layout/FlexCenter'
import FormCard from './../components/layout/FormCard'
import { isMobileOnly } from 'mobile-device-detect'
import url from 'url'
export default {
    name:'Login',
    data: () => ({
        authInfo: {},
        show: false,
        QRLogin: isMobileOnly,
        code: null,
        redirect: null,
        isMobileOnly: !isMobileOnly,
        
    }),
    components: {
        QRCode,
        FlexCenter,
        FormCard
    },
    computed: {
        ...mapGetters([
            'validate',
            'isLoading'
        ]),
        QRURL(){
          const URL = {
            protocol: 'http',
            hostname: '192.168.50.149',
            port: 8080,
            pathname: 'qrlogin',
            query: {code: this.code}
          }
          return url.format(URL)
        }
    },
    methods: {
        ...mapActions([
            'login',
            'qrSetLogin'
        ])
    },
    mounted(){
       this.code = this.$socket.client.id
       this.redirect = this.$route.query.redirect
    }
}
</script>