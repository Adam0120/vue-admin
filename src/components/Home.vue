<template>
<el-container class="home-contenter">
    <!-- 头部区域 -->
      <el-header>
          <div>
              <img src="../assets/images/logo.png" alt="">
              <span>电商后台管理系统</span>
          </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
      <!-- 主体区域 -->
      <el-container>
          <!-- 侧边栏 -->
        <el-aside :width="isCloospse ? '64px' : '200px'">
            <div class="toffle-button" @click="toggleColler">|||</div>
            <!-- 侧边栏菜单区域 只展开一个菜单 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" :unique-opened="true" :collapse="isCloospse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 :动态绑定 int转字符串 + '' -->
                  <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
                      <!-- 一级菜单模板 -->
                    <template slot="title">
                        <!-- 一级菜单图标 -->
                      <i :class="iconsObj[item.id]"></i>
                      <!-- 一级菜单文本 -->
                      <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <!-- 跳转路由地址加 / + path -->
                    <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/'+subitem.path)">
                            <!-- 二级菜单模板 -->
                          <template slot="title">
                              <!-- 二级菜单图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 二级菜单文本 -->
                            <span>{{subitem.authName}}</span>
                          </template>
                    </el-menu-item>
                   </el-submenu>
                </el-menu>
        </el-aside>
        <!-- 右侧主体区域 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  // 生命周期函数,页面创建时调用
  created () {
    this.getMenunList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      // 左侧菜单图标
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-edit',
        101: 'el-icon-s-goods',
        102: 'el-icon-tickets',
        145: 'el-icon-s-tools'
      },
      // 是否折叠菜单
      isCloospse: false,
      // 激活的值
      activePath: ''
    }
  },
  methods: {
    logout () {
      // 清除本地token
      window.sessionStorage.clear()
      // 跳转到登录页面
      this.$router.push('/login')
    }, // 页面打开时获取后台数据
    async getMenunList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮折叠菜单
    toggleColler () {
      this.isCloospse = !this.isCloospse
    },
    // 保持连接激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<!-- scoped  防止组件样式渲染到别的页面 -->
<style lang="less" scoped>
.toffle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: white;
    text-align: center;
    //文字间隔
    letter-spacing: 0.2em;
    //悬浮是展示小手
    cursor: pointer;
}
.el-menu{
    border: 0;
}
.home-contenter{
    height: 100%;
}
.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: white;
    font-size: 20px;
    >div {
        display: flex;
        align-items: center;
    }
    img{
        width: 50px;
        height: 50px;
        margin-right: 15px;
        margin-left: 20px;
    }
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #eaedf1;
}
</style>
