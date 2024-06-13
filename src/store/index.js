import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    metaAddress: sessionStorage.getItem('metaAddressSwan') || '',
    accessToken: sessionStorage.getItem('access_token_swan') || '',
    accessKey: sessionStorage.getItem('access_apikey_swan') || '',
    signature: sessionStorage.getItem('signature_swan') || '',
    versionValue: sessionStorage.getItem('version_swan') || 'v1'
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
    SET_ACCESSAPIKEY: (state, accessKey) => {
      state.accessKey = accessKey
      sessionStorage.setItem('access_apikey_swan', accessKey)
    },
    SET_SIGNATURE: (state, signature) => {
      state.signature = signature
      sessionStorage.setItem('signature_swan', signature)
    },
    SET_VERSION: (state, versionValue) => {
      state.versionValue = versionValue
      sessionStorage.setItem('version_swan', versionValue)
    },
  },
  actions: {
    setMetaAddress ({
      commit
    }, metaAddress) {
      commit('SET_METAADDRESS', metaAddress)
    },
    setAccessToken ({
      commit
    }, accessToken) {
      commit('SET_ACCESSTOKEN', accessToken)
    },
    setAccessApiKey ({
      commit
    }, accessKey) {
      commit('SET_ACCESSAPIKEY', accessKey)
    },
    setSignature ({
      commit
    }, signature) {
      commit('SET_SIGNATURE', signature)
    },
    setVersion ({
      commit
    }, versionValue) {
      commit('SET_VERSION', versionValue)
    }
  },
  modules: {}
})