<template>
  <el-header>
    <div class="l-content">
      <!-- 图标的展示 -->
      <el-button size="small" plain @click="handleCollapse">
        <el-icon>
          <Menu />
        </el-icon>
      </el-button>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userValue.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="clickUser('user')"
              >个人中心</el-dropdown-item
            >
            <el-dropdown-item @click="clickUser('login')"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { ArrowDown } from "@element-plus/icons-vue"
import { computed, defineComponent } from "vue"
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from "axios"
export default defineComponent({
  setup () {
    let store = useStore()
    const router = useRouter()
    let handleCollapse = () => {
      store.commit('updateIsCollapse')
    }
    const clickUser = (item) => {
      router.push({
        name: item
      })
      if (item == "login") {
        $cookies.remove('userval')
        store.commit('removeStorage')
      }
    }
    return {
      handleCollapse,
      clickUser
    }
  },
  data () {
    return {
      userValue: '',
    }
  },
  methods: {
    userValueBtn () {
      this.userValue = this.$cookies.get('userval')
    }
  },
  mounted () {
    this.userValueBtn()
  }
})
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown-link:focus {
  outline: none !important;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom-style: inset;
}
</style>