<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <common-aside />
      <el-container class="r-container">
        <common-header />
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CommonHeader from "../components/CommonHeader.vue"
import CommonAside from "../components/CommonAside.vue"
export default ({
  comments: {
    CommonHeader,
    CommonAside
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse

    }
  }
})
</script>
<style lang="less" scoped>
.r-container {
  flex-wrap: wrap;
}
</style>

