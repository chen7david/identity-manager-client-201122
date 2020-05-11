<template>
  <FlexCenter>
    <template v-slot:container>
    <FormCard>
      <template v-slot:title>
          <v-list-item two-line>
            <v-list-item-content>
                <div class="overline">email confirmation</div>
                <v-list-item-subtitle>An email was sent to the address below.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
      </template>

        
      <template v-slot:form>      
          <v-col>
            <v-text-field
              :error-messages="validate('email')"
              label="Email"
              name="email"
              single-line
              solo
              prepend-inner-icon="mdi-email"
              hint="no spaces"
              v-model="email"
            ></v-text-field>
          </v-col>

         <v-col>
            <v-text-field
              :error-messages="validate('code')"
              label="code"
              name="code"
              outlined
              hint="At least 1 character, no spaces"
              v-model="code"
            ></v-text-field>
          </v-col>
      </template>

      <template v-slot:actions>      
          <v-col>
            <v-btn v-if="showConfirm" dark color="blue" :loading="isLoading" large class="mt-0" elevation="0" block @click="confirmEmail(code)">confirm email</v-btn>
            <v-btn v-else dark color="warning" :loading="isLoading" large class="mt-0" elevation="0" block @click="resendConfirmation(username, email)">resend email</v-btn>
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
    name:'EmailConfirm',
    components: {
        FlexCenter,
        FormCard
    },
    data: () => ({
        username: null,
        email: null,
        code: null,
        show: false,
    }),
    computed: {
        ...mapGetters([
            'validate',
            'isLoading'
        ]), 
        showConfirm(){
            return this.code && this.code.length > 0
        }
    },
    methods: {
        ...mapActions([
            'confirmEmail',
            'patchEmail',
            'resendConfirmationEmail'
        ]),
        async resendConfirmation(username, email){
          if(username != email){
            await this.patchEmail({username, email})
          }else{
            await this.resendConfirmationEmail(email)
          }
          this.setState()
        },
        setState(){
          this.code = this.$route.query.code
          this.username = this.$route.query.username
          this.email = this.$route.query.username
        }
    },
    mounted(){
       this.setState()
    }   
}
</script>