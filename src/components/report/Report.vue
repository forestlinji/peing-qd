<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>举报中心</el-breadcrumb-item>
      <el-breadcrumb-item>举报列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="reportList" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row>被举报的问题</el-row>
            <el-input placeholder="该问题可能已被删除" v-model="scope.row.content" readonly type="textarea"></el-input>
            <el-row>举报理由</el-row>
            <el-input placeholder="举报理由" v-model="scope.row.reason" readonly type="textarea"></el-input>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="举报时间" prop="reportDate"></el-table-column>
        <el-table-column label="举报者" prop="reporterName"></el-table-column>
        <el-table-column label="被举报者" prop="reportedName"></el-table-column>
        <el-table-column label="举报理由" prop="reason" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="处理结果" prop="status" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.result===0">未处理</span>
            <span v-else-if="scope.row.result===1">封禁</span>
            <span v-else>不封禁</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.result===0">
              <el-button type="danger" size="mini" @click="dealReport(scope.row.reportId,1)">封禁</el-button>
              <el-button type="primary" size="mini" @click="dealReport(scope.row.reportId,2)">不封禁</el-button>
            </div>
            <div v-else>已处理</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5
      },
      total: 0
    };
  },
  created() {
    this.getReportList();
  },
  methods: {
    async getReportList() {
      const { data: res } = await this.$http.get("/user/reportList", {
        params: this.pageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取举报列表失败");
      }
      this.reportList = res.data.records;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getReportList();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getReportList();
    },
    async dealReport(reportId, result) {
      let msg = "";
      if (result === 1) {
        msg = "是否封禁该用户";
      } else {
        msg = "是否不封禁该用户";
      }
      const confirmResult = await this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return;
      }
      const {data:res} = await this.$http.post('/user/dealReport',{
        reportId: reportId,
        status: result
      })
      if(res.status===205){
        this.$message.error('不能封禁管理员')
      }else if(res.status!==200){
        this.$message.error('处理失败')
      }else{
        this.$message.success('处理成功')
      }
      this.getReportList()
    }
  }
};
</script>

<style lang="less" scoped>
</style>