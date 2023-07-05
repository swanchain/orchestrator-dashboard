<template>
    <div class="wrapper" id="wrapper" ref="area">
        <el-container>
            <el-main>
                <div class="content">
                    <router-view v-slot="{ Component }">
                        <transition name="move" mode="out-in">
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        </transition>
                    </router-view>
                    <el-backtop :right="20" :bottom="20" />
                </div>
            </el-main>
            <el-footer>
                <v-foot></v-foot>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import vFoot from './Footer.vue';
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

        onMounted(() => { })
        return {}
    },
    components: {
        vFoot
    }
})
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  .content {
    .el-backtop {
      background-color: #c37af9;
      color: #fff;
    }
  }
  .el-container {
    padding: 0.5rem 0 1rem;
    .el-header,
    .el-footer {
      height: auto;
      padding: 0;
    }
    .el-main,
    .el-footer {
      width: calc(100% - 0.4rem);
      padding: 0 0.2rem;
      margin: auto;
      @media (min-width: 576px) {
        max-width: 540px;
      }
      @media (min-width: 768px) {
        max-width: 720px;
      }
      @media (min-width: 992px) {
        max-width: 960px;
      }
      @media (min-width: 1200px) {
        max-width: 1140px;
      }
    }
  }
}
</style>

<style lang="scss">
.mt-border {
  margin: 0.3rem auto;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
}

.describe {
  font-size: 16px;
  @media screen and (max-width: 1600px) {
    font-size: 14px;
  }
  a {
    color: #c37af9;
    &:hover {
      text-decoration: underline;
    }
  }
}

.flex-row {
  display: flex;
  align-items: center;
}
</style>

