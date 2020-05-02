<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>注册</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h1 class="pageH">peing注册</h1>
      <el-form
        :model="signupForm"
        :rules="dataRule"
        ref="signupFormRef"
        @keyup.enter.native="signupFormSubmit()"
        status-icon
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="signupForm.username" placeholder="用户名在3-16位之间"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="signupForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="signupForm.password" type="password" placeholder="密码在6-16位之间，不能是纯数字"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" label="再次输入密码">
          <el-input v-model="signupForm.checkPwd" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="signupForm.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" class="login-captcha">
              <img :src="captchaPath" @click="getCaptcha()" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn-submit" type="primary" @click="signupFormSubmit()">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getUUID, aesMinEncrypt } from "@/utils";
export default {
  data() {
    var isNum = (rule, value, cb) => {
      if (/^\d+$/.test(value)) {
        return cb(new Error("密码不能是纯数字"));
      }
      cb();
    };
    var checkUsername = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/auth/checkUsername", {
        params: {
          username: value
        }
      });
      if (res.status !== 200) {
        return cb(new Error("用户名重复"));
      }
      cb()
    };
    var checkEmail = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/auth/checkEmail", {
        params: {
          email: value
        }
      });
      if (res.status !== 200) {
        return cb(new Error("邮箱重复"));
      }
      cb()
    };
    var checkPwd = (rule, value, cb) => {
      if (value !== this.signupForm.password) {
        return cb(new Error("两次输入密码不一致"));
      }
      cb();
    };
    return {
      signupForm: {
        username: "",
        email: "",
        password: "",
        checkPwd: "",
        uuid: "111",
        code: ""
      },
      dataRule: {
        username: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
          { min: 3, max: 16, message: "用户名在3-16位之间", trigger: "blur" },
          { validator: checkUsername, message: "用户名重复", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
          { validator: checkEmail, message: "邮箱重复", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码在6-16位之间", trigger: "blur" },
          { validator: isNum, message: "密码不能是纯数字", trigger: "blur" }
        ],
        checkPwd: [
          { required: true, message: "重复密码不能为空", trigger: "blur" },
          {
            validator: checkPwd,
            message: "两次输入密码不一致",
            trigger: "blur"
          }
        ],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }]
      },
      captchaPath: ""
    };
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.signupForm.uuid = getUUID();
      this.captchaPath = `http://106.14.209.11:8888/auth/captcha.jpg?uuid=${this.signupForm.uuid}`;
    },
    signupFormSubmit() {
      this.$refs.signupFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/auth/signup", {
          username: this.signupForm.username,
          email: this.signupForm.email,
          password: aesMinEncrypt(this.signupForm.password),
          uuid: this.signupForm.uuid,
          code: this.signupForm.code
        });
        if (res.status === 203) {
          this.getCaptcha();
          this.signupForm.code = "";
          return this.$message.error("验证码错误");
        }
        if (res.status !== 200) {
          return this.$message.error("注册失败");
        }
        this.$router.push("/");
        return this.$message.success("注册成功，请及时前往您的邮箱激活账号");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.pageH {
  text-align: center;
  font-size: 30px;
}
</style>