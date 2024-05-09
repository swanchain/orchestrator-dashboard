<template>
  <div class="wrapper" id="wrapper" ref="area">
    <el-container>
      <el-header>
        <v-head></v-head>
      </el-header>
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
import vHead from './Header.vue';
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
    vHead, vFoot
  }
})
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100vh;
  .content {
    .el-backtop {
      background-color: @white-color;
      color: #7c2d8a;
    }
  }
  .el-container {
    padding: 0.1rem 0 1rem;
    .el-header,
    .el-footer {
      height: auto;
      padding: 0;
    }
    .el-header,
    .el-main,
    .el-footer {
      width: calc(100% - 0.9rem);
      padding: 0 0.45rem;
      margin: auto;
      @media (min-width: 576px) {
        max-width: 590px;
      }
      @media (min-width: 768px) {
        max-width: 770px;
      }
      @media (min-width: 800px) {
        max-width: 800px;
      }
      @media (min-width: 992px) {
        max-width: 900px;
      }
      @media (min-width: 1024px) {
        max-width: 929px;
      }
      @media (min-width: 1200px) {
        max-width: 1024px;
      }
      @media (min-width: 1440px) {
        max-width: 1190px;
      }
      @media (min-width: 1800px) {
        max-width: 1360px;
      }
      @media (min-width: 1920px) {
        max-width: 1440px;
      }
      @media (max-width: 600px) {
        width: calc(100% - 0.32rem);
        padding: 0 0.16rem;
      }
    }
  }
}
</style>

<style lang="less">
.el-loading-mask {
  background-color: rgba(29, 29, 29, 0.9);
  .el-loading-spinner .path {
    stroke: @theme-color;
  }
}

.wrongNet {
  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.9);
  }
}

.mt-border {
  margin: 0.3rem auto;
  border-top: 2px solid #868688;
}

.describe {
  font-size: 16px;
  @media screen and (max-width: 1600px) {
    font-size: 14px;
  }
  a {
    color: @theme-color;
    &:hover {
      text-decoration: underline;
    }
  }
}

.flex-row {
  display: flex;
  align-items: center;
  &.space-between {
    justify-content: space-between;
  }
  &.center {
    justify-content: center;
  }
  &.flex-start {
    justify-content: flex-start;
  }
  &.flex-end {
    justify-content: flex-end;
  }
  &.nowrap {
    flex-wrap: nowrap;
  }
  &.baseline {
    align-items: baseline;
  }
}

.width-icon {
  display: block;
  width: 24px;
  height: 24px;
  color: #fff;
  fill: #fff;
  &.small {
    width: 20px;
    height: 20px;
  }
  &.min-small {
    width: 16px !important;
    height: 16px;
  }
  &.minimum-small {
    width: 14px;
    height: 14px;
  }
  &.big {
    width: 35px;
    height: 35px;
  }
  svg {
    width: inherit;
    height: inherit;
  }
}

.el-popper {
  .el-table-filter__list {
    .el-table-filter__list-item {
      color: #000;
      &.is-active {
        color: #fff;
      }
    }
  }
}
</style>

