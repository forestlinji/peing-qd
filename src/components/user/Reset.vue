<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>重置密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form
        :model="resetForm"
        :rules="dataRule"
        ref="resetFormRef"
        @keyup.enter.native="resetFormSubmit()"
        status-icon
      >
        <el-form-item prop="password" label="密码">
          <el-input v-model="resetForm.password" type="password" placeholder="密码在6-16位之间，不能是纯数字"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" label="再次输入密码">
          <el-input v-model="resetForm.checkPwd" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-button class="login-btn-submit" type="primary" @click="resetFormSubmit()">重置密码</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { aesMinEncrypt } from "@/utils";

export default {
  data() {
    var isNum = (rule, value, cb) => {
      if (/^\d+$/.test(value)) {
        return cb(new Error("密码不能是纯数字"));
      }
      cb();
    };
    var checkPwd = (rule, value, cb) => {
      if (value !== this.resetForm.password) {
        return cb(new Error("两次输入密码不一致"));
      }
      cb();
    };
    return {
      changeToken: this.$route.query.changeToken,
      userId: this.$route.query.userId,
      resetForm: {
        password: "",
        checkPwd: ""
      },
      dataRule: {
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
        ]
      }
    };
  },
  methods: {
    resetFormSubmit() {
      this.$refs.resetFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.changeToken)
        const { data: res } = await this.$http.post("/auth/reset", {
          password: aesMinEncrypt(this.resetForm.password),
          changeToken: this.changeToken,
          userId: this.userId
        });
        if (res.status !== 200) {
          return this.$message.error("重置密码失败");
        }
        this.$message.success("重置密码成功，返回首页");
        this.$router.push("/");
      });
    }
  }
};
</script>

<style>
</style>