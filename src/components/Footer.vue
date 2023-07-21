<template>
  <div class="footer mt-border">
    <div class="powered">
      Powered By
      <img :src="lagrangeLogo" class="lagrange-logo" />
    </div>
    <div class="describe">
      Total CPU, Memory and Storage calculated by using active providers on the Network.
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  setup () {
    const store = useStore()
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const lagrangeLogo = require("@/assets/images/icons/logo.png")

    onMounted(() => { })
    return {
      lagrangeLogo
    }
  },
  components: {}
})
</script>
<style  lang="scss" scoped>
.footer {
  position: relative;
  padding: 0.24rem 0 0;
  margin-bottom: 0;
  line-height: 1.6;
  .powered {
    display: flex;
    align-items: center;
    padding: 0 0 0.15rem;
    font-size: 16px;
    @media screen and (max-width: 1600px) {
      font-size: 14px;
    }
    img {
      height: 30px;
      margin: 0 0 0 0.1rem;
      @media screen and (max-width: 1600px) {
        height: 25px;
      }
    }
  }
}
</style>