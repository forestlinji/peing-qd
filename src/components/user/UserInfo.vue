<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="3" align="center">
          <div>用户头像</div>
          <el-link type="primary" @click="changeAvatar">更换头像</el-link>
        </el-col>
        <el-col :span="10">
          <el-avatar
            :size="185"
            shape="square"
            :src="'http://106.14.209.11:8888/user/avatar/'+userInfo.userId"
            :key="'http://106.14.209.11:8888/user/avatar/'+userInfo.userId"
          ></el-avatar>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>用户名</div>
          <el-link type="primary" @click="changeUsername">更改用户名</el-link>
        </el-col>
        <el-col :span="10">
          <el-input v-model="userInfo.username" readonly></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>邮箱</div>
          <el-link type="primary" @click="changeEmail">更改邮箱</el-link>
        </el-col>
        <el-col :span="10">
          <el-input v-model="userInfo.email" readonly></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>密码</div>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="changePassword">修改密码</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>个人简介</div>
          <el-link type="primary" @click="changeIntroduction(userInfo.introduction)">修改个人简介</el-link>
        </el-col>
        <el-col :span="10">
          <el-input v-model="userInfo.introduction" readonly type="textarea" :rows="6"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>是否开启提问箱</div>
        </el-col>
        <el-col :span="10">
          <el-switch
            v-model="userInfo.acceptQuestion"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeQuestion"
          ></el-switch>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>是否激活账户</div>
        </el-col>
        <el-col :span="10">
          <span>{{userInfo.isActive?"是":"否"}}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>是否被封禁</div>
        </el-col>
        <el-col :span="10">
          <span>{{userInfo.isBan?"是":"否"}}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-col :span="3" align="center">
          <div>用户权限级别</div>
        </el-col>
        <el-col :span="10">
          <span v-if="role_root">超级管理员</span>
          <span v-else-if="role_admin">管理员</span>
          <span v-else>普通用户</span>
        </el-col>
      </el-row>
    </el-card>
    <!-- 更改用户名对话框 -->
    <el-dialog
      title="更改用户名"
      :visible.sync="changeUsernameDialogVisible"
      @close="closechangeUsernameForm"
      :close-on-click-modal="false"
    >
      <el-form
        :model="changeUsernameForm"
        :rules="changeUsernameFormRules"
        ref="changeUsernameFormRef"
      >
        <el-form-item label="请输入新的用户名" prop="username">
          <el-input placeholder="用户名在3-16位之间" v-model="changeUsernameForm.username"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closechangeUsernameForm">取 消</el-button>
        <el-button type="primary" @click="changeUsernameSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改邮箱对话框 -->
    <el-dialog
      title="修改邮箱"
      :visible.sync="changeEmailDialogVisible"
      @close="closechangeEmailForm"
      :close-on-click-modal="false"
    >
      <el-form :model="changeEmailForm" :rules="changeEmailFormRules" ref="changeEmailFormRef">
        <el-alert title="警告：修改邮箱需要重新激活账户" type="warning"></el-alert>
        <el-form-item label="登录密码" prop="password">
          <el-input placeholder="登录密码" v-model="changeEmailForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新邮箱" prop="email">
          <el-input placeholder="新邮箱" v-model="changeEmailForm.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closechangeEmailForm">取 消</el-button>
        <el-button type="primary" @click="changeEmailSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVisible"
      @close="closechangePasswordForm"
      :close-on-click-modal="false"
    >
      <el-form
        :model="changePasswordForm"
        :rules="changePasswordFormRules"
        ref="changePasswordFormRef"
      >
        <el-alert title="警告：修改密码需要重新登录" type="warning"></el-alert>
        <el-form-item prop="oldPwd" label="旧密码">
          <el-input v-model="changePasswordForm.oldPwd" type="password" placeholder="请输入您当前的登录密码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input
            v-model="changePasswordForm.password"
            type="password"
            placeholder="密码在6-16位之间，不能是纯数字"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" label="再次新输入密码">
          <el-input v-model="changePasswordForm.checkPwd" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closechangePasswordForm">取 消</el-button>
        <el-button type="primary" @click="changePasswordSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改个人简介对话框 -->
    <el-dialog
      title="更改个人简介"
      :visible.sync="changeIntroductionDialogVisible"
      @close="closechangeIntroductionForm"
      :close-on-click-modal="false"
    >
      <el-form
        :model="changeIntroductionForm"
        :rules="changeIntroductionFormRules"
        ref="changeIntroductionFormRef"
      >
        <el-form-item label="个人简介" prop="introduction">
          <el-input
            placeholder="请输入个人简介"
            v-model="changeIntroductionForm.introduction"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closechangeIntroductionForm">取 消</el-button>
        <el-button type="primary" @click="changeIntroductionSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改头像对话框 -->
    <el-dialog
      title="上传头像"
      :visible.sync="changeAvatarDialogVisible"
      @close="closechangeAvatarForm"
      :close-on-click-modal="false"
    >
      <!-- <el-form :model="changeAvatarForm" :rules="changeAvatarFormRules" ref="changeAvatarFormRef">
        <el-form-item label="问题描述" prop="avatar">
          <el-input placeholder="问题描述" v-model="changeAvatarForm.avatar"></el-input>
        </el-form-item>
      </el-form>-->
      <el-upload
        class="avatar-uploader"
        action="http://106.14.209.11:8888/user/avatar"
        :show-file-list="true"
        :headers="token"
        list-type="picture-card"
        ref="uploadAvatar"
        :before-upload="beforeAvatarUpload"
        :on-success="onSuccess"
        :limit="1"
      >
        <div>
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closechangeAvatarForm">取 消</el-button>
        <!-- <el-button type="primary" @click="changeAvatarSubmit(daoruForm)">确 定</el-button> -->
      </div>
    </el-dialog>
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
    var checkUsername = async (rule, value, cb) => {
      const { data: res } = await this.$http.get("/auth/checkUsername", {
        params: {
          username: value
        }
      });
      if (res.status !== 200) {
        return cb(new Error("用户名重复"));
      }
      cb();
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
      cb();
    };
    var checkPwd = (rule, value, cb) => {
      if (value !== this.changePasswordForm.password) {
        return cb(new Error("两次输入密码不一致"));
      }
      cb();
    };
    return {
      userInfo: {
        userId: "",
        username: "",
        email: "",
        signupDate: "",
        avatar: "",
        introduction: "",
        acceptQuestion: false,
        isBan: false,
        isActive: true,
        roles: []
      },
      role_user: false,
      role_admin: false,
      role_root: false,
      changeUsernameForm: {
        username: ""
      },
      changeUsernameDialogVisible: false,
      changeUsernameFormRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 16, message: "用户名在3-16位之间", trigger: "blur" },
          { validator: checkUsername, message: "用户名重复", trigger: "blur" }
        ]
      },
      changeEmailForm: {
        email: "",
        password: ""
      },
      changeEmailDialogVisible: false,
      changeEmailFormRules: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
          { validator: checkEmail, message: "邮箱重复", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      changePasswordForm: {
        password: "",
        checkPwd: "",
        oldPwd: ""
      },
      changePasswordDialogVisible: false,
      changePasswordFormRules: {
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
        oldPwd: [{ required: true, message: "旧密码不能为空", trigger: "blur" }]
      },
      changeIntroductionForm: {
        introduction: ""
      },
      changeIntroductionDialogVisible: false,
      changeIntroductionFormRules: {
        introduction: [
          { required: true, message: "个人简介不能为空", trigger: "blur" }
        ]
      },
      changeAvatarDialogVisible: false,
      token: {
        Authorization: ""
      }
    };
  },
  created() {
    this.token.Authorization = window.localStorage.getItem("token");
    const user = window.sessionStorage.getItem("user");
    if (!user) {
      this.$message.error("请登录后再访问");
      this.$router.push("/");
    } else {
      this.getUserInfo();
    }
  },
  methods: {
    async getUserInfo() {
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      // console.log(user);
      // this.$http.get(user.userId)
      const { data: res } = await this.$http.get("/user/info");
      if (res.status !== 200) {
        return this.$message.error("获取用户信息失败");
      }
      window.sessionStorage.setItem("user", JSON.stringify(res.data));
      console.log(res.data);
      const roles = res.data.roles;
      console.log(roles);
      switch (roles.length) {
        case 3:
          this.role_root = true;
        case 2:
          this.role_admin = true;
        case 1:
          this.role_user = true;
      }
      this.userInfo = res.data;
    },
    changeUsername() {
      this.changeUsernameDialogVisible = true;
    },
    closechangeUsernameForm() {
      this.changeUsernameDialogVisible = false;
      this.$refs.changeUsernameFormRef.resetFields();
    },
    changeUsernameSubmit() {
      this.$refs.changeUsernameFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/auth/username",
          this.changeUsernameForm
        );
        if (res.status !== 200) {
          this.$message.error("修改失败");
        } else {
          this.$router.go(0);
          this.$message.success("修改成功");
        }
        this.changeUsernameDialogVisible = false;
      });
    },
    changeEmail() {
      this.changeEmailDialogVisible = true;
    },
    closechangeEmailForm() {
      this.changeEmailDialogVisible = false;
      this.$refs.changeEmailFormRef.resetFields();
    },
    changeEmailSubmit() {
      this.$refs.changeEmailFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/auth/email", {
          email: this.changeEmailForm.email,
          password: aesMinEncrypt(this.changeEmailForm.password)
        });
        this.changeEmailDialogVisible = false;
        if (res.status === 202) {
          return this.$message.error("密码错误");
        } else if (res.status !== 200) {
          return this.$message.error("修改邮箱失败");
        } else {
          this.$message.warning("修改成功，请及时前往邮箱重新激活账户");
          window.localStorage.removeItem("token");
          window.sessionStorage.removeItem("user");
          this.$router.go(0);
        }
      });
    },
    changePassword() {
      this.changePasswordDialogVisible = true;
    },
    closechangePasswordForm() {
      this.changePasswordDialogVisible = false;
      this.$refs.changePasswordFormRef.resetFields();
    },
    changePasswordSubmit() {
      this.$refs.changePasswordFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/auth/changePassword", {
          oldPassword: aesMinEncrypt(this.changePasswordForm.oldPwd),
          newPassword: aesMinEncrypt(this.changePasswordForm.password)
        });
        this.changePasswordDialogVisible = false;
        if (res.status === 202) {
          return this.$message.error("旧密码错误");
        } else if (res.status !== 200) {
          return this.$message.error("修改密码失败");
        } else {
          this.$message.success("修改密码成功，请重新登录");
          window.localStorage.removeItem("token");
          window.sessionStorage.removeItem("user");
          this.$router.go(0);
        }
      });
    },
    changeIntroduction(introduction) {
      this.changeIntroductionForm.introduction = introduction
      this.changeIntroductionDialogVisible = true;
    },
    closechangeIntroductionForm() {
      this.changeIntroductionDialogVisible = false;
      this.$refs.changeIntroductionFormRef.resetFields();
    },
    changeIntroductionSubmit() {
      this.$refs.changeIntroductionFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/user/introduction",
          this.changeIntroductionForm
        );
        this.changeIntroductionDialogVisible = false;
        if (res.status !== 200) {
          return this.$message.error("修改个人简介失败");
        } else {
          this.$message.success("修改个人简介成功");
          this.$router.go(0);
        }
      });
    },
    changeAvatar() {
      this.changeAvatarDialogVisible = true;
    },
    closechangeAvatarForm() {
      this.changeAvatarDialogVisible = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是JPG或PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    onSuccess(response) {
      console.log(response);
      if (response.status !== 200) {
        this.$message.error("上传头像失败");
      } else {
        this.$message.success("更改头像成功");
        this.changeAvatarDialogVisible = false;
        this.$router.go(0);
      }
    },
    async changeQuestion() {
      console.log(this.userInfo.acceptQuestion);
      const { data: res } = await this.$http.get("/question/changeState", {
        params: {
          acceptQuestion: this.userInfo.acceptQuestion
        }
      });
      if (res.status !== 200) {
        this.userInfo.acceptQuestion = !this.userInfo.acceptQuestion;
        return this.$message.error("修改提问箱状态失败");
      } else {
        return this.$message.success("修改提问箱状态成功");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>