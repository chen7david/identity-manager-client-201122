<template>
    <FlexCenter>
        <template v-slot:container>
            <FormCard>
                <template v-slot:title>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <div class="overline">device authorization login</div>
                        </v-list-item-content>
                    </v-list-item>  
                </template>

                <template v-slot:image>      
                    <v-col>
                        <v-avatar color="blue" size="180">
                            <div v-if="validQR">
                                <v-icon size="100px" v-if="QRAuthInfo.isDesktop">mdi-desktop-mac</v-icon>
                                <v-icon size="100px" v-if="QRAuthInfo.isTablet">mdi-tablet-ipad</v-icon>
                                <v-icon size="100px" v-if="QRAuthInfo.isiPhone">mdi-cellphone-iphone</v-icon>
                                <v-icon size="100px" v-if="QRAuthInfo.isBot">mdi-memory</v-icon>
                                <v-icon size="100px" v-if="QRAuthInfo.isTV">mdi-monitor</v-icon>
                            </div>
                            <div v-else>
                                <v-icon size="100px">mdi-information</v-icon>
                            </div>

                        </v-avatar>
                        <v-chip v-if="validQR" class="overline mt-5">
                            {{QRAuthInfo.os}}
                            {{QRAuthInfo.platform}}
                            {{QRAuthInfo.browser}}
                            {{QRAuthInfo.version}}
                        </v-chip>
                        <v-chip v-else class="overline mt-5">
                            please refresh the QR code!
                        </v-chip>
                    </v-col>
                </template>

                <template v-slot:actions>      
                    <v-col>
                        <v-btn :disabled="!validQR" :loading="isLoading" large class="mt-0" elevation="0" block @click="qrlogin(code)">login</v-btn>
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
import UA from 'useragent-parser-js'
export default {
    name:'Login',
    data: () => ({
        code: null,
        QRAuthInfo: {},
        validQR: true
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
            // if(this.validQR) 
            this.QRAuthInfo = UA.parse(data && data.useragent || '') 
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