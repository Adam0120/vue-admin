<template>
  <div>
   <!-- 面包蟹导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>权限管理</el-breadcrumb-item>
     <el-breadcrumb-item>角色列表</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- 卡片视图 -->
   <el-card>
    <!-- 添加按钮 -->
    <el-row>
        <el-col>
            <el-button type="primary" @click="showDialoglog(scope.row.id)">添加角色</el-button>
        </el-col>
    </el-row>
    <!-- 角色列表展示 -->
       <el-table :data="rolesList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
              <!-- 作用域插槽获取角色权限信息 -->
              <template slot-scope="scope">
                  <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id" class="vcenter">
                      <!-- 渲染一级权限 -->
                      <el-col :span="5">
                          <el-tag closable @close="removeRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 渲染二级和三级权限 -->
                      <el-col :span="19">
                          <!-- 通过for渲染二级权限 -->
                          <el-row :class="[i2 === 0 ? '':'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id" class="vcenter">
                              <!-- 二级权限 -->
                              <el-col :span="6">
                                  <el-tag type="success" closable @close="removeRightsById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                  <i class="el-icon-caret-right"></i>
                              </el-col>
                              <!-- 三级权限 -->
                              <el-col :span="18">
                                <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightsById(scope.row,item3.id)">
                                    {{item3.authName}}
                                </el-tag>
                              </el-col>
                          </el-row>
                      </el-col>
                  </el-row>
                  <!-- <pre>{{scope.row}}</pre> -->
              </template>
          </el-table-column>
           <!-- 索引列 -->
           <el-table-column label="#" type="index"></el-table-column>
           <el-table-column label="权限名称" prop="roleName"></el-table-column>
           <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
           <el-table-column label="操作" width="300px">
               <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialoglog(scope.row.id)">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
                <!-- 分配权限 -->
                      <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </el-tooltip>
               </template>
           </el-table-column>
       </el-table>
   </el-card>

   <!-- 分配权限对话框 -->
   <el-dialog
     :visible.sync="setRightDialogVisible"
     width="50%" @close="setRightDialogClosed">
     <!-- 树形控件 默认展开 id默认选中-->
     <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
     <span slot="footer" class="dialog-footer">
       <el-button @click="setRightDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="allotRight">确 定</el-button>
     </span>
   </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表信息
      rolesList: [],
      // 控制分配全新啊对话框得显示与隐藏
      setRightDialogVisible: false,
      // 权限列表对象
      rightList: {},
      // 树形空间得属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点
      defKeys: []
    }
  },
  // 生命周期函数,页面创建时调用
  created () {
    // 获取角色列表信息
    this.getRolesList()
  },
  methods: {
    // 获取角色列表信息
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // 失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败')
      }
      // 成功
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    // 删除标签
    removeRightsById (role, rightId) {
      // 询问用户是否删除数据
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 重新赋值用户权限,不重新渲染页面
        // this.getRolesList()
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配权限方法
    async showSetRightDialog (role) {
      // 获取所有权限列表得数据
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表信息失败!')
      }
      // this.$message.success('获取权限列表信息成功!')
      // 权限列表数据保存到本地
      this.rightList = res.data
      // 递归获取三级几点的id
      this.getLeafKeys(role, this.defKeys)
      // console.log(this.rightList)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获取所有三级权限的id保存到defKeys中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 不是三级节点时递归调用此方法
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭权限管理窗口时清空数据
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    allotRight () {

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
.el-table{
    margin-top: 15px;
}
.el-tag{
margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}//居中对齐
.vcenter{
    display: flex;
    align-items: center;
}
</style>
