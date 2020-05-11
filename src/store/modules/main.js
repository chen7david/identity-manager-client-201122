import url from 'url'
import config from './../../../config/default'
export default {
    state: {
      isLoading: false,
      validation: null,
      snackbar: null,
      baseURL: url.format(config.client),
      config,
    },
    getters: {
      baseURL: (state) => state.baseURL,
      config: (state) => state.config,
      validate: (state) => (key) => {
        let error = state.validation ? state.validation.messages.filter(el => el.key == key)[0] : null
        error = error ? error : {}
        return error.message
      },
      snackbar: (state) => state.snackbar ? state.snackbar : {},
      isLoading: (state) => state.isLoading,
    },
    mutations: {
      SET_LOADING: (state, isLoading) => state.isLoading = isLoading,
      SET_VALIDATION: (state, details) => state.validation = details,
      SET_SNACKBAR: (state, details) => state.snackbar = {
        show: true,
        text: details.message, 
        color: details.state || 'dark',
        timeout: details.timeout
      },
    },
    actions: {
      setValidation: ({commit}, details) => commit('SET_VALIDATION', details),
      setSnackbar: ({commit}, details) => commit('SET_SNACKBAR', details),
      isLoading: ({commit}, boolean) => commit('SET_LOADING', boolean)
    },
  }