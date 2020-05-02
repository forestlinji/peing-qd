<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>查找用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="searchForm" :rules="searchFormRules" ref="searchFormRef" label-width="100px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户名" prop="username">
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
            <el-card>
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
                    :rows="2"
                    placeholder="该用户暂无自我介绍"
                    v-model="expandUserInfo.introduction"
                    :autosize="inputSize"
                    readonly
                  ></el-input>
                </el-col>
              </el-row>
              <!-- 提问按钮 -->
              <el-button
                type="primary"
                v-if="expandUserInfo.acceptQuestion&&!unLogin&&!expandUserInfo.isBan"
                @click="addQuestion"
              >发起提问</el-button>
              <div v-if="expandUserInfo.acceptQuestion && !expandUserInfo.isBan">
                <!-- 问题列表 -->
                <el-card
                  v-for="question in questionList"
                  :key="question.questionId"
                  style="margin-bottom:15px"
                >
                  <div>
                    <el-row>提问时间:{{question.questionDate}}</el-row>
                    <el-input
                      type="textarea"
                      :rows="1"
                      placeholder="提问信息"
                      v-model="question.content"
                      :autosize="inputSize"
                      readonly
                    ></el-input>
                  </div>
                  <div>
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
                </el-card>
                <!-- 分页区域 -->
                <el-pagination
                  @size-change="handleQSizeChange"
                  @current-change="handleQCurrentChange"
                  :current-page="questionInfo.pageNum"
                  :page-sizes="[1, 3, 5, 8]"
                  :page-size="questionInfo.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalQuestion"
                ></el-pagination>
              </div>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="个人简介" prop="introduction" :show-overflow-tooltip="true"></el-table-column>
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
    <!-- 提问对话框 -->
    <el-dialog
      title="向他/她提问"
      :visible.sync="addDialogVisible"
      @close="closeAddForm"
      :close-on-click-modal="false"
    >
      <el-form :model="addQuestionForm" :rules="addQuestionFormRules" ref="addQuestionFormRef">
        <el-form-item label="问题描述" prop="question">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="问题描述"
            v-model="addQuestionForm.question"
            :autosize="inputSize"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddForm">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
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
      searchInfo: {
        username: "",
        pageSize: 5,
        pageNum: 1
      },
      totalSearch: 0,
      userList: [],
      questionInfo: {
        userId: "",
        pageSize: 5,
        pageNum: 1
      },
      totalQuestion: 0,
      questionList: [],
      searchForm: {
        username: ""
      },
      searchFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            validator: checkNull,
            trigger: "blur"
          }
        ]
      },
      expands: [],
      getRowKeys(row) {
        return row.userId;
      },
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
      unLogin: true,
      addQuestionForm: {
        question: ""
      },
      addDialogVisible: false,
      addQuestionFormRules: {
        question: [
          {
            required: true,
            message: "请输入问题",
            trigger: "blur"
          },
          {
            validator: checkNull,
            message: "问题不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    searchUser() {
      // this.searchInfo = this.searchForm.username

      this.$refs.searchFormRef.validate(async valid => {
        if (!valid) return;
        //   this.
        this.expands = [];
        this.searchInfo.username = this.searchForm.username.trim();
        const { data: res } = await this.$http.get("/user/selectUser", {
          params: this.searchInfo
        });
        if (res.status !== 200) {
          return this.$message.error("搜索用户失败");
        }
        this.totalSearch = res.data.total;
        this.userList = res.data.records;
      });
    },
    async expandChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.userId); // 每次push进去的是每行的ID
          const { data: res } = await this.$http.get(`/user/${row.userId}`);
          if (res.status !== 200) {
            return this.$message.error("获取用户详细信息失败");
          }
          console.log(res.data);
          this.expandUserInfo = res.data;
          if (
            this.expandUserInfo.acceptQuestion.length !== 0 &&
            !this.expandUserInfo.isBan
          ) {
            this.getQuestionList();
          }
        }
      } else {
        this.expands = []; // 默认不展开
      }
    },
    async getQuestionList() {
      this.questionInfo.userId = this.expandUserInfo.userId;
      const { data: questions } = await this.$http.get(
        "/question/getOtherQuestion",
        {
          params: this.questionInfo
        }
      );
      if (questions.status !== 200) {
        return this.$message.error("获取提问信息失败");
      }
      // console.log(questions.data)
      this.totalQuestion = questions.data.total;
      this.questionList = questions.data.records;
    },
    // 监听 pagesize 改变
    handleQSizeChange(newSize) {
      this.questionInfo.pageSize = newSize;
      this.getQuestionList();
    },
    // 监听 pagenum 改变
    handleQCurrentChange(newPage) {
      this.questionInfo.pageNum = newPage;
      this.getQuestionList();
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
    addQuestion() {
      this.addDialogVisible = true;
    },
    closeAddForm() {
      this.addDialogVisible = false;
      this.$refs.addQuestionFormRef.resetFields();
    },
    addSubmit() {
      this.$refs.addQuestionFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/question/addQuestion", {
          questionedId: this.expandUserInfo.userId,
          content: this.addQuestionForm.question
        });
        if (res.status === 410) {
          this.$message.error("您已被对方拉黑");
        } else if (res.status !== 200) {
          this.$message.error("发起提问失败");
        } else {
          this.$message.success("提问成功");
        }
        this.addDialogVisible = false;
      });
    },
    getAvatar(id) {
      return "http://106.14.209.11:8888/user/avatar/" + id;
    }
  },
  created() {
    const user = window.sessionStorage.getItem("user");
    if (user) this.unLogin = false;
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
.el-button {
  margin-bottom: 20px;
}
</style>