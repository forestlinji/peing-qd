<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息</el-breadcrumb-item>
      <el-breadcrumb-item>发布公告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h1>发布公告</h1>
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataFormRef"
        @keyup.enter.native="dataFormSubmit()"
        status-icon
      >
        <el-form-item prop="title" label="公告标题">
          <el-input v-model="dataForm.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="公告内容">
          <el-input v-model="dataForm.content" placeholder="公告内容" type="textarea" rows="10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataFormSubmit()">发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataForm: {
        title: "",
        content: ""
      },
      dataRule: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [{ required: true, message: "内容不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    if (!user || !user.roles || user.roles.length <= 1) {
      location.href = "/";
      alert("登录失效或权限不足，请重新登录");
    }
  },
  methods: {
    dataFormSubmit() {
      this.$refs.dataFormRef.validate(async valid => {
        if (!valid) return;
        const {data:res} = await this.$http.post('/message/postMessage',this.dataForm)
        if(res.status!==200){
          return this.$message('发送公告失败')
        }
        this.$refs.dataFormRef.resetFields()
        this.$emit('changeMessageState')
        return this.$message.success('发送公告成功')
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>