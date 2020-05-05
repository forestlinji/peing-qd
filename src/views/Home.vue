<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>peing提问箱</span>
      </div>
      <div class="unlogin" v-if="unLogin">
        <el-avatar :size="40" shape="square" :src="defaultImageUrl"></el-avatar>

        <el-link type="primary" @click="toLoginPage">登录</el-link>
        <el-link type="primary" @click="toSignupPage">注册</el-link>
      </div>
      <div v-else>
        <el-avatar
          :size="40"
          shape="square"
          :src="'http://106.14.209.11:8888/user/avatar/'+this.userId"
          :key="'http://106.14.209.11:8888/user/avatar/'+this.userId"
        ></el-avatar>
        <span style="margin-right:20px">{{currentUser.username}}</span>
        <el-badge :value="messageNum" class="message" :hidden="!messageNum">
          <el-link type="primary" class="message" @click="toMessagePage">消息</el-link>
        </el-badge>
        <el-badge :value="0" class="message" hidden>
          <el-link type="primary" @click="logout" class="logout">退出</el-link>
        </el-badge>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu index="1">
            <template slot="title">
              <span>提问</span>
            </template>
            <el-menu-item index="/random" @click="saveNavState('/random')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>随便看看</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/search" @click="saveNavState('/search')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>查询用户</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2" v-if="role_user">
            <template slot="title">
              <span>个人信息</span>
            </template>
            <el-menu-item
              index="/userInfo"
              @click="saveNavState('/userInfo')"
              v-if="hasRole('ROLE_USER')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>查看个人信息</span>
              </template>
            </el-menu-item>
            <el-menu-item
              index="/questionBox"
              @click="saveNavState('/questionBox')"
              v-if="hasRole('ROLE_USER')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>我的提问箱</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3" v-if="role_admin">
            <template slot="title">
              <span>用户管理</span>
            </template>
            <el-menu-item index="/AllUser" @click="saveNavState('/AllUser')" v-if="role_admin">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>查询用户</span>
              </template>
            </el-menu-item>
            <el-menu-item
              index="/deleteAdmin"
              @click="saveNavState('/deleteAdmin')"
              v-if="role_root"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>删除管理员</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4" v-if="role_admin">
            <template slot="title">
              <span>举报中心</span>
            </template>
            <el-menu-item
              index="/reportList"
              @click="saveNavState('/reportList')"
              v-if="hasRole('ROLE_ADMIN')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>查看举报列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5" v-if="role_admin">
            <template slot="title">
              <span>消息系统</span>
            </template>
            <el-menu-item
              index="/publish"
              @click="saveNavState('/publish')"
              v-if="hasRole('ROLE_ADMIN')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>发布公告</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view @changeMessageState="changeMessageState"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      unLogin: true,
      userId: "",
      isCollapse: false,
      activePath: "",
      defaultImageUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      role_user: false,
      role_admin: false,
      role_root: false,
      currentUser: {},
      messageNum: 0
    };
  },
  created() {
    this.tryLogin();
  },
  methods: {
    async tryLogin() {
      console.log("try login");
      const token = window.localStorage.getItem("token");
      if (!token) this.unLogin = true;
      else {
        this.unLogin = false;
        const { data: res } = await this.$http.get("/user/info");
        if (res.status !== 200) {
          window.localStorage.removeItem("token");
          return this.$message.error("登录失效，请重新登录");
        }
        // console.log(res.data)
        window.sessionStorage.setItem("user", JSON.stringify(res.data));
        const roles = res.data.roles;
        this.userId = res.data.userId;
        switch (roles.length) {
          case 3:
            this.role_root = true;
          case 2:
            this.role_admin = true;
          case 1:
            this.role_user = true;
        }
        this.currentUser = res.data;
        this.getUnreadMessage();
      }
    },
    async getUnreadMessage() {
      const { data: res } = await this.$http.get("/message/getNum");
      if (res.status !== 200) {
        return this.$message.error("获取未读消息数量失败");
      }
      this.messageNum = res.data;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    hasRole(roleName) {
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      // console.log(user)
      if (!user) return false;
      return user.roles.indexOf(roleName) > -1;
    },
    logout() {
      this.unLogin = true;
      window.localStorage.removeItem("token");
      window.sessionStorage.removeItem("user");
      this.role_root = false;
      this.role_admin = false;
      this.role_user = false;
      location.href = "/";
      this.$message.warning("退出成功");
    },
    toLoginPage() {
      this.$router.push("/login");
    },
    toSignupPage() {
      this.$router.push("/signup");
    },
    toMessagePage() {
      this.$router.push("/message");
    },
    changeMessageState() {
      this.getUnreadMessage();
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.unlogin {
  float: right;
}
.el-avatar {
  margin-right: 15px;
}
.el-link {
  margin-right: 20px;
}
.message {
  margin-right: 0px;
}
.logout {
  margin-left: 20px;
}
</style>
