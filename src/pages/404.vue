<template>
  <el-col :sm="24" :lg="24" class="container">
    <el-result icon="warning" title="404提示" sub-title="您找的页面不存在哦">
      <template #extra>
        <el-button type="primary" @click="$router.push('/')"
          >返回首页</el-button
        >
      </template>
    </el-result>
  </el-col>
</template>
<style scoped>
.container {
  text-align: center;
}
</style>