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
        <el-row :gutter="20">
          <el-col :span="8">
              <!-- 搜索时查询列表,并清空时查询 -->
       <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
           <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
         </el-input></el-col>
          <el-col :span="4">
              <el-button type="primary" @click="addDialogShow">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="userlist" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email" width="150px"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <!-- 作用域插槽 -->
            <el-table-column label="状态" width="80px">
                <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                </el-switch>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialoglog(scope.row.id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                <!-- 分配权限 -->
                <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                      <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>

                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
    </el-card>

    <!-- 添加用户得对话框 -->
    <el-dialog
      title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFormRoles" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
       </el-form>
          <!-- 底部区域 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
    </el-dialog>

    <!-- 修改用户得对话框 -->
    <el-dialog
      title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="editForm" :rules="editFormRoles" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
       </el-form>
          <!-- 底部区域 -->
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([\w-])+@([\w-])+(\.[\w-])+/

      if (regEmail.test(value)) {
        // 通过
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13|14|15|16|17|18|19)\d{9}$/

      if (regMobile.test(value)) {
        // 通过
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
    /// /获取用户列表参数对象
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前每页显示几条
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制用户添加对话框得显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则
      addFormRoles: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名在3-10位字符' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码在6-15位字符' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户对话框
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则
      editFormRoles: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期函数,页面创建时调用
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // 失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败')
      }
      // 成功
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pagesize事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变事件
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    // 监听状态开关
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新状态失败!')
      }
      // 成功
      this.$message.success('更新状态成功!')
      // console.log(res)
    },
    // 用户添加对话框
    addDialogShow () {
      this.addDialogVisible = !this.addDialogVisible
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose () {
      // 清空表单数据
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户,规则效验
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 通过时发送表单添加请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败!')
        }
        // 隐藏用户添加对话框
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
        this.$message.success('添加用户成功!')
      })
    },
    // 展示修改用户的对话框
    async showDialoglog (id) {
      // console.log(id)
      // 获取用户数据
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败!')
      }
      // this.$message.success('查询用户成功!')
      // 用户数据保存到本地
      this.editForm = res.data
      // 展示用户修改页面
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClose () {
      // 清空表单数据
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 通过时发送表单修改请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败!')
        }
        // 隐藏用户修改对话框
        this.editDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
        this.$message.success('修改用户成功!')
      })
    },
    // 根据id删除用户的信息
    removeUserById (id) {
      // 询问用户是否删除数据
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
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
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    font-size: 15px;
}
</style>
