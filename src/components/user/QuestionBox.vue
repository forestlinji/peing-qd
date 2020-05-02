<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>我的提问箱</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="收到的提问" name="first">
          <el-tabs v-model="childActiveName" type="card" @tab-click="childHandleClick">
            <el-tab-pane label="未回复" name="first">
              <el-card
                v-for="question in questionList"
                :key="question.questionId"
                style="margin-bottom:15px"
              >
                <div>
                  <el-row>
                    <el-col :span="6">提问时间:{{question.questionDate}}</el-col>
                    <el-col :span="1">操作：</el-col>
                    <el-col :span="1">
                      <el-link type="primary" @click="reply(question.questionId)">回复</el-link>
                    </el-col>
                    <el-col :span="1">
                      <el-link type="warning" @click="deleteQuestion(question.questionId)">删除</el-link>
                    </el-col>
                    <el-col :span="1">
                      <el-link type="danger" @click="banQuestion(question.questionId)">拉黑</el-link>
                    </el-col>
                    <el-col :span="1">
                      <el-link type="danger" @click="report(question.questionId)">举报</el-link>
                    </el-col>
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
              </el-card>
              <!-- 分页区域 -->
              <el-pagination
                @size-change="handleQSizeChange"
                @current-change="handleQCurrentChange"
                :current-page="questionPageInfo.pageNum"
                :page-sizes="[1, 3, 5, 8]"
                :page-size="questionPageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalQuestion"
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="已回复" name="second">
              <el-card
                v-for="question in questionList"
                :key="question.questionId"
                style="margin-bottom:15px"
              >
                <div>
                  <el-row>
                    <el-col :span="6">提问时间:{{question.questionDate}}</el-col>
                    <el-col :span="1">操作：</el-col>
                    <el-col :span="1">
                      <el-link type="primary" @click="reply(question.questionId,question.reply)">修改</el-link>
                    </el-col>
                    <el-col :span="1">
                      <el-link type="warning" @click="deleteQuestion(question.questionId)">删除</el-link>
                    </el-col>
                    <el-col :span="1">
                      <el-link type="danger" @click="banQuestion(question.questionId)">拉黑</el-link>
                    </el-col>
                    <el-col :span="1">
                      <el-link type="danger" @click="report(question.questionId)">举报</el-link>
                    </el-col>
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
                :current-page="questionPageInfo.pageNum"
                :page-sizes="[1, 3, 5, 8]"
                :page-size="questionPageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalQuestion"
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="已删除" name="third">
              <el-card>
                <el-table :data="deletedQuestionList" style="width: 100%">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column prop="questionDate" label="提问时间" width="180"></el-table-column>
                  <el-table-column
                    prop="content"
                    label="提问内容"
                    width="650"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column prop="deleteDate" label="删除时间" width="180"></el-table-column>
                  <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-edit"
                        @click="resume(scope.row.questionId)"
                      >恢复</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页区域 -->
                <el-pagination
                  @size-change="handleDSizeChange"
                  @current-change="handleDCurrentChange"
                  :current-page="deletedQuestionPageInfo.pageNum"
                  :page-sizes="[1, 3, 5, 8]"
                  :page-size="deletedQuestionPageInfo.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalDeleted"
                ></el-pagination>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="发起的提问" name="second">
          <el-card
            v-for="question in myQuestionList"
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
                <el-col :span="2" v-if="!question.reply">
                  <el-link type="warning" @click="regret(question.questionId)">撤回提问</el-link>
                </el-col>
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
          <!-- 分页区域 -->
          <el-pagination
            @size-change="handleMSizeChange"
            @current-change="handleMCurrentChange"
            :current-page="myQuestionPageInfo.pageNum"
            :page-sizes="[1, 3, 5, 8]"
            :page-size="myQuestionPageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalMyQuestion"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="拉黑列表" name="third">
          <el-card>
            <el-table :data="banQuestionList" style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="questionDate" label="提问时间" width="180"></el-table-column>
              <el-table-column
                prop="content"
                label="提问内容"
                width="650"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column prop="deleteDate" label="拉黑时间" width="180"></el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="cancelBan(scope.row.questionId)"
                  >取消拉黑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
              @size-change="handleBSizeChange"
              @current-change="handleBCurrentChange"
              :current-page="banQuestionPageInfo.pageNum"
              :page-sizes="[1, 3, 5, 8]"
              :page-size="banQuestionPageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalBan"
            ></el-pagination>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 回复对话框 -->
    <el-dialog
      title="进行回复"
      :visible.sync="replyDialogVisible"
      @close="closereplyForm"
      :close-on-click-modal="false"
    >
      <el-form :model="replyForm" :rules="replyFormRules" ref="replyFormRef">
        <el-form-item label="回复" prop="reply">
          <el-input placeholder="请输入回复" v-model="replyForm.reply" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closereplyForm">取 消</el-button>
        <el-button type="primary" @click="replySubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 举报对话框 -->
    <el-dialog
      title="进行举报"
      :visible.sync="reportDialogVisible"
      @close="closereportForm"
      :close-on-click-modal="false"
    >
      <el-form :model="reportForm" :rules="reportFormRules" ref="reportFormRef">
        <el-form-item label="举报理由" prop="report">
          <el-input placeholder="请输入举报理由" v-model="reportForm.reason" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closereportForm">取 消</el-button>
        <el-button type="primary" @click="reportSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      childActiveName: "first",
      questionPageInfo: {
        state: 0,
        pageNum: 1,
        pageSize: 5
      },
      questionList: [],
      totalQuestion: 0,
      inputSize: {
        minRows: 2,
        maxRows: 6
      },
      deletedQuestionPageInfo: {
        pageNum: 1,
        pageSize: 5
      },
      deletedQuestionList: [],
      totalDeleted: 0,
      replyForm: {
        questionId: "",
        reply: ""
      },
      replyDialogVisible: false,
      replyFormRules: {
        reply: [{ required: true, message: "回复不能为空", trigger: "blur" }]
      },
      reportForm: {
        questionId: "",
        reason: ""
      },
      reportDialogVisible: false,
      reportFormRules: {
        reason: [{ required: true, message: "回复不能为空", trigger: "blur" }]
      },
      myQuestionPageInfo: {
        pageNum: 1,
        pageSize: 5
      },
      myQuestionList: [],
      totalMyQuestion: 0,
      banQuestionPageInfo: {
        pageNum: 1,
        pageSize: 5
      },
      banQuestionList: [],
      totalBan: 0
    };
  },
  created() {
    this.getQuestionList();
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      if (this.activeName === "first") {
        this.childActiveName = "first";
        this.getQuestionList();
      } else if (this.activeName === "second") {
        this.getMyQueationList();
      } else {
        this.getBanQuestionList();
      }
    },
    childHandleClick(tab, event) {
      if (this.childActiveName === "first") {
        this.questionPageInfo.state = 0;
        this.getQuestionList();
      } else if (this.childActiveName === "second") {
        this.questionPageInfo.state = 1;
        this.getQuestionList();
      } else {
        this.getDeletedQuestion();
      }
    },
    async getQuestionList() {
      const { data: res } = await this.$http.get("/question/getMyQuestioned", {
        params: this.questionPageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取问题列表失败");
      } else {
        console.log(res.data);
        this.questionList = res.data.records;
        this.totalQuestion = res.data.total;
      }
    },
    // 监听 pagesize 改变
    handleQSizeChange(newSize) {
      this.questionPageInfo.pageSize = newSize;
      this.getQuestionList();
    },
    // 监听 pagenum 改变
    handleQCurrentChange(newPage) {
      this.questionPageInfo.pageNum = newPage;
      this.getQuestionList();
    },
    // 监听 pagesize 改变
    handleDSizeChange(newSize) {
      this.deletedQuestionPageInfo.pageSize = newSize;
      this.getDeletedQuestion();
    },
    // 监听 pagenum 改变
    handleDCurrentChange(newPage) {
      this.deletedQuestionPageInfo.pageNum = newPage;
      this.getDeletedQuestion();
    },
    async getDeletedQuestion() {
      const { data: res } = await this.$http.get("/question/getDeleted", {
        params: this.deletedQuestionPageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取已删除问题列表失败");
      } else {
        // console.log(res.data);
        this.deletedQuestionList = res.data.records;
        this.totalDeleted = res.data.total;
      }
    },
    reply(id,reply) {
      this.replyForm.reply = reply
      this.replyForm.questionId = id;
      this.replyDialogVisible = true;
    },
    closereplyForm() {
      this.replyDialogVisible = false;
      this.$refs.replyFormRef.resetFields();
    },
    replySubmit() {
      this.$refs.replyFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/question/reply",
          this.replyForm
        );
        this.replyDialogVisible = false;
        if (res.status !== 200) {
          return this.$message.error("回复失败");
        } else {
          this.$message.success("回复成功");
          this.getQuestionList();
        }
      });
    },
    async deleteQuestion(id) {
      const confirmResult = await this.$confirm(
        "此操作将删除该提问, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除！");
      }
      const { data: res } = await this.$http.delete(`/question/${id}`);
      if (res.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getQuestionList();
    },
    async banQuestion(id) {
      const confirmResult = await this.$confirm("是否拉黑该提问者?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.get(`/user/reject`, {
        params: {
          questionId: id
        }
      });
      if (res.status !== 200) {
        return this.$message.error("拉黑失败");
      }
      this.$message.success("拉黑成功");
      this.getQuestionList();
    },
    report(id) {
      this.reportForm.questionId = id;
      this.reportForm.reason = "";
      this.reportDialogVisible = true;
    },
    closereportForm() {
      this.reportDialogVisible = false;
      this.$refs.reportFormRef.resetFields();
    },
    reportSubmit() {
      this.$refs.reportFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/user/report",
          this.reportForm
        );
        this.reportDialogVisible = false;
        if (res.status === 304) {
          return this.$message.warning("您已经举报过这个问题");
        } else if (res.status !== 200) {
          return this.$message.error("举报失败");
        } else {
          this.$message.success("举报成功");
          this.getQuestionList();
        }
      });
    },
    async resume(id) {
      const confirmResult = await this.$confirm("是否恢复该提问?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.get("/question/resume", {
        params: {
          questionId: id
        }
      });
      if (res.status !== 200) {
        return this.$message.error("恢复失败");
      } else {
        this.$message.success("恢复成功");
        this.getDeletedQuestion();
      }
    },
    async getMyQueationList() {
      const { data: res } = await this.$http.get("/question/getMyQuestion", {
        params: this.myQuestionPageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取提问失败");
      }
      this.myQuestionList = res.data.records;
      this.totalMyQuestion = res.data.total;
    },
    handleMSizeChange(newSize) {
      this.myQuestionPageInfo.pageSize = newSize;
      this.getMyQueationList();
    },
    // 监听 pagenum 改变
    handleMCurrentChange(newPage) {
      this.myQuestionPageInfo.pageNum = newPage;
      this.getMyQueationList();
    },
    getAvatar(id) {
      return `http://106.14.209.11:8888/user/avatar/${id}`;
    },
    async regret(id) {
      const confirmResult = await this.$confirm(
        "该操作将永久撤回提问",
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
      const { data: res } = await this.$http.delete("/question/regret", {
        params: {
          questionId: id
        }
      });
      if (res.status !== 200) {
        this.$message.error("撤回提问失败");
      }
      this.$message.success("撤回提问成功");
      this.getMyQueationList();
    },
    // 监听 pagesize 改变
    handleBSizeChange(newSize) {
      this.banQuestionPageInfo.pageSize = newSize;
      this.getBanQuestionList();
    },
    // 监听 pagenum 改变
    handleBCurrentChange(newPage) {
      this.banQuestionPageInfo.pageNum = newPage;
      this.getBanQuestionList();
    },
    async getBanQuestionList() {
      const { data: res } = await this.$http.get("/user/getUserBanList", {
        params: this.banQuestionPageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取拉黑列表失败");
      }
      this.banQuestionList = res.data.records;
      this.totalBan = res.data.total;
    },
    async cancelBan(id) {
      const confirmResult = await this.$confirm("是否取消拉黑", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.get("/user/cancelBan", {
        params: {
          questionId: id
        }
      });
      if (res.status !== 200) {
        return this.$message.error("取消拉黑失败");
      }
      this.$message.success("取消拉黑成功");
      this.getBanQuestionList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>