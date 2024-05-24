import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    metaAddress: sessionStorage.getItem('metaAddressSwan') || '',
    accessToken: sessionStorage.getItem('access_token_swan') || '',
    signature: sessionStorage.getItem('signature_swan') || '',
  },
  mutations: {
    SET_METAADDRESS: (state, metaAddress) => {
      state.metaAddress = metaAddress
      sessionStorage.setItem('metaAddressSwan', metaAddress)
    },
    SET_ACCESSTOKEN: (state, accessToken) => {
      state.accessToken = accessToken
      sessionStorage.setItem('access_token_swan', accessToken)
    },
    SET_SIGNATURE: (state, signature) => {
      state.signature = signature
      sessionStorage.setItem('signature_swan', signature)
    },
  },
  actions: {
    setMetaAddress({
      commit
    }, metaAddress) {
      commit('SET_METAADDRESS', metaAddress)
    },
    setAccessToken({
      commit
    }, accessToken) {
      commit('SET_ACCESSTOKEN', accessToken)
    },
    setSignature({
      commit
    }, signature) {
      commit('SET_SIGNATURE', signature)
    }
  },
  modules: {}
})