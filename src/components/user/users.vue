<template>
  <div>
    <!-- 面包蟹导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
       <!--搜索与提添加区域 -->
       <el-input placeholder="请输入内容"  class="input-with-select">
           <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<!-- scoped  防止组件样式渲染到别的页面 -->
<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
.el-card{
    box-shadow: 0 1px rgba(0,0,0,0.15) !important;
}
</style>
