<template>
  <div>
   <!-- 面包蟹导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>权限管理</el-breadcrumb-item>
     <el-breadcrumb-item>权限列表</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- 卡片视图 -->
   <el-card>
       <el-table :data="rightsList" border stripe>
           <el-table-column label="#" type="index"></el-table-column>
           <el-table-column label="权限名称" prop="authName"></el-table-column>
           <el-table-column label="路径" prop="path"></el-table-column>
           <el-table-column label="权限等级" prop="level">
               <template slot-scope="scope">
                <el-tag v-if="scope.row.level == 0">一级</el-tag>
                <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
               </template>
           </el-table-column>

       </el-table>
   </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  // 生命周期函数,页面创建时调用
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      // 失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败')
      }
      // 成功
      this.rightsList = res.data
      // console.log(this.rightsList)
    }
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
