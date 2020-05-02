<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>忘记密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h1 class="pageH">忘记密码</h1>
      <el-form
        :model="forgetForm"
        :rules="dataRule"
        ref="forgetFormRef"
        @keyup.enter.native="forgetFormSubmit()"
        status-icon
      >
        <el-form-item prop="email" label="您的注册邮箱">
          <el-input v-model="forgetForm.email" placeholder="请输入您的注册邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="forgetFormSubmit()">重置密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/auth/checkEmail", {
        params: {
          email: value
        }
      });
      if (res.status === 200) {
        return cb(new Error("该邮箱未注册"));
      }
      cb();
    };
    return {
      forgetForm: {
        email: ""
      },
      dataRule: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
          { validator: checkEmail, message: "邮箱未注册", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    forgetFormSubmit() {
      this.$refs.forgetFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/auth/forgetPassword",
          this.forgetForm
        );
        if (res.status !== 200) {
          return this.$message.error("重置密码失败");
        }
        this.$message.warning("已经向该邮箱发出邮件，请及时重置密码");
        this.$router.push("/");
      });
    },
    
  }
};
</script>

<style lang="less" scoped>
.pageH {
  text-align: center;
  font-size: 30px;
}
</style>