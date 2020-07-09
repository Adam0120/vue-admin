<template>
<div class="login_contaner">
<div class="login_box">
    <!-- 头像区 -->
    <div class="avater_box">
        <img src="../assets/logo.png" alt="">
    </div>
    <!-- 表单 :ref 拿到表单的实例对象 :rules 表单验证规则-->
    <el-form ref="loginFormRef" :rules="loginFormRule" :model="loginForm" label-width="130px" class="login_form">
        <!-- prop 表单验证字段 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item label="密码 :" prop="password">
        <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="restLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
</div>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则
      loginFormRule: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置按钮
    restLoginForm () {
      // 表单重置
      this.$refs.loginFormRef.resetFields()
    },
    // 登录功能
    login () {
      // 登录验证,表单不合法返回false,不发送登录请求
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        // 合法发送请求,携带表单数据    只获取data数据发送
        // await 可以直接从后台接收数据,但只能是使用在 asyuc 中
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 状态码不等于200表示登录失败,返回提示信息
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        // console.log(res)
        // 保存tocken到客户端的sessionStorage中
        window.sessionStorage.setItem('tocken', res.data.tocken)
        // 跳转路由到 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<!-- scoped  防止组件样式渲染到别的页面 -->
<style lang="less" scoped>
.login_form{
    position: absolute;
    bottom: 0;
}
.login_contaner{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    //移动元素自身宽高的位置
    transform: translate(-50%,-50%);
    .avater_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: white;
        img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
        }
    }
}
</style>
