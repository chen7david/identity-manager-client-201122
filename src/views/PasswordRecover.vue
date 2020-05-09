<template>
  <FlexCenter>
    <template v-slot:container>
    <FormCard>
      <template v-slot:title>
          <v-list-item two-line>
            <v-list-item-content>
                <div class="overline">Password Recovery</div>
                <v-list-item-subtitle>Recover Password.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
      </template>

      <template v-slot:form>      
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
              v-model="recoverPasswordInfo.password"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              :error-messages="validate('passwordConfirm')"
              label="Password Confirm"
              name="passwordConfirm"
              outlined
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              hint="At least 6 characters"
              @click:append="show = !show"
              v-model="recoverPasswordInfo.passwordConfirm"
            ></v-text-field>
          </v-col>

      </template>

      <template v-slot:actions>      
          <v-col>
            <v-btn :loading="isLoading" large class="mt-0" elevation="0" block @click="recoverPassword(recoverPasswordInfo)">recover password</v-btn>
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
    components: {
        FlexCenter,
        FormCard
    },
    data: () => ({
        recoverPasswordInfo: {},
        show: false,
    }),
    computed: {
        ...mapGetters([
            'validate',
            'isLoading'
        ]), 
    },
    methods: {
        ...mapActions([
            'recoverPassword',
        ]), 
    },
    mounted(){
       this.recoverPasswordInfo.code = this.$route.query.code
    }
}
</script>