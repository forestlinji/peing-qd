<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>查询用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="searchForm" :rules="searchFormRules" ref="searchFormRef" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名或邮箱" prop="username" label-width="120px">
              <el-input v-model="searchForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="searchUser">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="userList"
        style="width: 100%"
        @expand-change="expandChange"
        :expand-row-keys="expands"
        :row-key="getRowKeys"
        border
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 用户信息展示 -->
            <el-row>
              <el-col :span="6">
                <el-avatar
                  :size="185"
                  shape="square"
                  :src="'http://106.14.209.11:8888/user/avatar/'+scope.row.userId"
                  :key="'http://106.14.209.11:8888/user/avatar/'+scope.row.userId"
                ></el-avatar>
              </el-col>
              <el-col :span="18">
                <!-- <el-row>用户名:{{scope.row.username}}</el-row>
                  <el-row>111</el-row>
                  <el-row>111</el-row>
                <el-row>111</el-row>-->
                <div class="info-container">
                  <div class="info-detail">
                    <span class="detailLabel">用户名</span>
                    <div class="detailValue">
                      <span>{{scope.row.username}}</span>
                    </div>
                  </div>
                  <div class="info-detail">
                    <span class="detailLabel">邮箱</span>
                    <div class="detailValue">
                      <span>{{expandUserInfo.email}}</span>
                    </div>
                  </div>
                  <div class="info-detail">
                    <span class="detailLabel">注册日期</span>
                    <div class="detailValue">
                      <span>{{expandUserInfo.signupDate}}</span>
                    </div>
                  </div>
                  <div class="info-detail">
                    <span class="detailLabel">是否接受提问</span>
                    <div class="detailValue">
                      <span>{{expandUserInfo.acceptQuestion ?'是':'否'}}</span>
                    </div>
                  </div>
                  <div class="info-detail">
                    <span class="detailLabel">是否激活账户</span>
                    <div class="detailValue">
                      <span>{{expandUserInfo.isActive ?'是':'否'}}</span>
                    </div>
                  </div>
                  <div class="info-detail">
                    <span class="detailLabel">是否被封禁</span>
                    <div class="detailValue">
                      <span>{{expandUserInfo.isBan ?'是':'否'}}</span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 自我介绍 -->
            <el-row>
              <el-col :span="5">
                <span>
                  <strong style="font-size=13px">自我介绍</strong>
                </span>
              </el-col>
              <el-col>
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="该用户暂无自我介绍"
                  v-model="expandUserInfo.introduction"
                  readonly
                ></el-input>
              </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="收到的提问" name="first">
                <!-- 问题列表 -->
                <el-card
                  v-for="question in questionList"
                  :key="question.questionId"
                  style="margin-bottom:20px"
                >
                  <div>
                    <el-row style="margin-bottom:20px">
                      <span>提问人:</span>
                      <el-avatar
                        :size="35"
                        shape="square"
                        :src="'http://106.14.209.11:8888/user/avatar/'+question.questionerId"
                        :key="'http://106.14.209.11:8888/user/avatar/'+question.questionerId"
                        style="margin-left:20px"
                      ></el-avatar>
                      <span style="margin-right:20px">{{question.questionerName}}</span>
                    </el-row>
                    <el-row>
                      <el-col :span="6">提问时间:{{question.questionDate}}</el-col>
                    </el-row>
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="提问信息"
                      v-model="question.content"
                      :autosize="inputSize"
                      readonly
                    ></el-input>
                  </div>
                  <div v-if="question.reply">
                    <el-row>回复时间:{{question.replyDate}}</el-row>
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="提问信息"
                      v-model="question.reply"
                      :autosize="inputSize"
                      readonly
                    ></el-input>
                  </div>
                  <div v-else>该提问还没有被回复</div>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="发起的提问" name="second">
                <!-- 问题列表 -->
                <el-card
                  v-for="question in questionList"
                  :key="question.questionId"
                  style="margin-bottom:20px"
                >
                  <div>
                    <el-row style="margin-bottom:20px">
                      <span>被提问人:</span>
                      <el-avatar
                        :size="35"
                        shape="square"
                        :src="'http://106.14.209.11:8888/user/avatar/'+question.questionedId"
                        :key="'http://106.14.209.11:8888/user/avatar/'+question.questionedId"
                        style="margin-left:20px"
                      ></el-avatar>
                      <span style="margin-right:20px">{{question.questionedName}}</span>
                    </el-row>
                    <el-row>
                      <el-col :span="6">提问时间:{{question.questionDate}}</el-col>
                    </el-row>
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="提问信息"
                      v-model="question.content"
                      :autosize="inputSize"
                      readonly
                    ></el-input>
                  </div>
                  <div v-if="question.reply">
                    <el-row>回复时间:{{question.replyDate}}</el-row>
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="提问信息"
                      v-model="question.reply"
                      :autosize="inputSize"
                      readonly
                    ></el-input>
                  </div>
                  <div v-else>该提问还没有被回复</div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
            <!-- 分页区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="questionPageInfo.pageNum"
              :page-sizes="[1, 3, 5, 8]"
              :page-size="questionPageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalQuestion"
            ></el-pagination>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username" width="160px"></el-table-column>
        <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" width="300px"></el-table-column>
        <el-table-column label="激活" prop="isActive" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.isActive?"是":"否"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="封禁" prop="isBan" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.isBan?"是":"否"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="被提问数" prop="questionedNum" width="80px"></el-table-column>
        <el-table-column label="提问数" prop="questionerNum" width="80px"></el-table-column>
        <el-table-column label="回复数" prop="replyNum" width="80px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="!scope.row.isBan"
              @click="ban(scope.row.userId)"
            >封禁</el-button>
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.isBan"
              @click="cancelBan(scope.row.userId)"
            >解封</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="!scope.row.isBan&&role_root"
              @click="addAdmin(scope.row.userId)"
            >设为管理员</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleUSizeChange"
        @current-change="handleUCurrentChange"
        :current-page="searchInfo.pageNum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="searchInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSearch"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkNull = (rule, value, cb) => {
      if (value.trim().length != 0) {
        return cb();
      }
      cb(new Error("当前项不能为空"));
    };
    return {
      searchForm: {
        username: ""
      },
      searchFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名或邮箱",
            trigger: "blur"
          },
          {
            validator: checkNull,
            trigger: "blur"
          }
        ]
      },
      searchInfo: {
        username: "",
        pageSize: 5,
        pageNum: 1
      },
      totalSearch: 0,
      userList: [],
      getRowKeys(row) {
        return row.userId;
      },
      expands: [],
      expandUserInfo: {
        userId: "",
        username: "",
        email: "",
        signupDate: "",
        avatar: "",
        introduction: "",
        acceptQuestion: false,
        isBan: false,
        isActive: true
      },
      inputSize: {
        minRows: 2,
        maxRows: 6
      },
      activeName: "",
      questionPageInfo: {
        userId: "",
        pageNum: 1,
        pageSize: 3
      },
      questionList: [],
      totalQuestion: 0,
      role_root: false
    };
  },
  created() {
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    if (!user || !user.roles || user.roles.length <= 1) {
      location.href = "/";
      alert("登录失效或权限不足，请重新登录");
    }
    const roles = user.roles;
    this.role_root = roles.length === 3;
  },
  methods: {
    searchUser() {
      // this.searchInfo = this.searchForm.username

      this.$refs.searchFormRef.validate(async valid => {
        if (!valid) return;
        this.expands = [];
        this.searchInfo.username = this.searchForm.username.trim();
        const { data: res } = await this.$http.get("/user/getUserAdminInfo", {
          params: this.searchInfo
        });
        if (res.status !== 200) {
          return this.$message.error("搜索用户失败");
        }
        this.totalSearch = res.data.total;
        this.userList = res.data.records;
        this.activeName = "first";
        this.getQuestionedList();
      });
    },
    // 监听 pagesize 改变
    handleUSizeChange(newSize) {
      this.searchInfo.pageSize = newSize;
      this.searchUser();
    },
    // 监听 pagenum 改变
    handleUCurrentChange(newPage) {
      this.searchInfo.pageNum = newPage;
      this.searchUser();
    },
    async expandChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        this.activeName = "first";

        if (row) {
          this.expands.push(row.userId); // 每次push进去的是每行的ID
          this.questionPageInfo.userId = row.userId;
          const { data: res } = await this.$http.get(`/user/${row.userId}`);
          if (res.status !== 200) {
            return this.$message.error("获取用户详细信息失败");
          }
          console.log(res.data);
          this.expandUserInfo = res.data;
          this.getQuestionedList();
        }
      } else {
        this.expands = []; // 默认不展开
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      this.questionPageInfo.pageNum = 1;
      if (this.activeName === "first") {
        this.getQuestionedList();
      } else if (this.activeName === "second") {
        this.getQueationerList();
      }
    },
    async getQuestionedList() {
      const { data: res } = await this.$http.get("/question/getAll", {
        params: this.questionPageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取问题信息失败");
      }
      this.questionList = res.data.records;
      this.totalQuestion = res.data.total;
    },
    async getQueationerList() {
      const { data: res } = await this.$http.get("/question/getQuestions", {
        params: this.questionPageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取问题信息失败");
      }
      this.questionList = res.data.records;
      this.totalQuestion = res.data.total;
    },
    handleSizeChange(newSize) {
      this.questionPageInfo.pageSize = newSize;
      if (this.activeName == "first") {
        this.getQuestionedList();
      } else {
        this.getQueationerList();
      }
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.questionPageInfo.pageNum = newPage;
      if (this.activeName == "first") {
        this.getQuestionedList();
      } else {
        this.getQueationerList();
      }
    },
    getAvatar(id) {
      return `http://106.14.209.11:8888/user/avatar/${id}`;
    },
    async ban(id) {
      const confirmResult = await this.$confirm("是否要封禁该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.get(`/user/ban/${id}`);
      if (res.status === 205) {
        return this.$message.error("不能封禁管理员");
      } else if (res.status !== 200) {
        return this.$message.error("封禁失败");
      } else {
        this.$message.success("封禁成功");
        this.searchUser();
      }
    },
    async cancelBan(id) {
      const confirmResult = await this.$confirm("是否要解封该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.delete(`/user/ban/${id}`);
      if (res.status !== 200) {
        return this.$message.error("解封失败");
      } else {
        this.$message.success("解封成功");
        this.searchUser();
      }
    },
    async addAdmin(id) {
      const confirmResult = await this.$confirm(
        "是否要将该用户设为管理",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.get(`/user/admin/${id}`);
      if (res.status !== 200) {
        return this.$message.error("添加管理员失败");
      } else {
        this.$message.success("添加管理员成功");
        this.searchUser();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.info-container {
  font-size: 16px;
  .info-detail {
    display: flex;
    margin-bottom: 12px;
    .detailLabel {
      width: 120px;
      margin-right: 37px;
      font-weight: 600;
    }
  }
}
.el-textarea {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>