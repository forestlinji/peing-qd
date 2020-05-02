<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="adminList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="cancalAdmin(scope.row.userId)" v-if="scope.row.userId!=='0'">取消管理员</el-button>
            <span v-else>超级管理员</span>
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
      pageInfo: {
        pageNum: 1,
        pageSize: 5
      },
      total: 0,
      adminList: []
    };
  },
  created() {
    this.getAdminList();
  },
  methods: {
    async getAdminList() {
      const { data: res } = await this.$http.get("/user/admin/getAdminList");
      if (res.status !== 200) {
        return this.$message.error("获取管理员列表失败");
      }
      this.adminList = res.data.records;
      this.total = res.data.total;
    },
    async cancalAdmin(id) {
      const confirmResult = await this.$confirm(
        "是否取消该用户的管理员权限",
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
      const { data: res } = await this.$http.delete(`/user/admin/${id}`);
      if (res.status !== 200) {
        this.$message.error("删除管理员失败");
      } else {
        this.$message.success("删除管理员成功");
      }
      this.getAdminList();
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getAdminList();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getAdminList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>