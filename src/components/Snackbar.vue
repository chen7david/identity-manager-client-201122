<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar.show"
      :multi-line="multiLine"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <v-btn
        dark
        text
        @click="snackbar.show = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name:'Snackbar',
    data: () => ({
      multiLine:true
    }),
    computed:{
        ...mapGetters([
            'snackbar',
        ]),
    },
    methods:{
    }
}
</script>