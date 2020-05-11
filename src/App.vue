<template>
  <v-app>
    <Navbar/>
    <v-content>
      <Snackbar/>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Navbar from './components/Navbar'
import Snackbar from './components/Snackbar'
export default {
  name: 'App',

  components: {
      Navbar,
      Snackbar
  },

  data: () => ({
    //
  }),
  computed: {
    ...mapGetters([
      'socket',
      'baseURL'
    ])
  },
  methods: {
    ...mapActions([
      'qrSetLogin',
      'setSocket'
    ])
  }

}
</script>
