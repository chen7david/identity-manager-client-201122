<template>
    <FlexCenter>
        <template v-slot:container>
            <FormCard>
                <template v-slot:title>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <div class="overline">device authorization login</div>
                            <v-list-item-subtitle>Authorize device for QR-login:{{code}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>  
                </template>

                <template v-slot:image>      
                    <v-col>
                        :{{QRAuthInfo}}
                            :{{validQR}}
                            :{{device}}
                        <v-avatar color="blue" size="180">
                        </v-avatar>
                    </v-col>
                </template>

                <template v-slot:actions>      
                    <v-col>
                        <v-btn :loading="isLoading" large class="mt-0" elevation="0" block @click="qrlogin(code)">login</v-btn>
                        <v-divider class="my-5"></v-divider>
                        <v-btn large elevation="0" block router to="/register">cancel</v-btn>
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
    name:'Login',
    data: () => ({
        code: null,
        QRAuthInfo: null,
        validQR: true,
        device: null
    }),
    components: {
        FlexCenter,
        FormCard
    },
    computed: {
        ...mapGetters([
            'isLoading'
        ]),
        valid(){
          return this.code != 'undefined'
        },
    },
    sockets:{
        qrauthinfo(data){
            this.validQR = data ? true : false
            this.QRAuthInfo = data ? data : {}
        }
    },
    methods: {
        ...mapActions([
          'qrlogin'
        ]),
    },
    mounted(){
       this.code = this.$route.query.code
       this.$socket.client.emit('getqrauthinfo', {code: this.code})
    },
}
</script>