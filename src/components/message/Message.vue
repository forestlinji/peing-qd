<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息</el-breadcrumb-item>
      <el-breadcrumb-item>查看消息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="messageList"
        style="width: 100%"
        border
        @expand-change="expandChange"
        :expand-row-keys="expands"
        :row-key="getRowKeys"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-card>
              <el-row>消息标题</el-row>
              <el-row>
                <el-input v-model="messageInfo.title" readonly></el-input>
              </el-row>
              <el-row style="margin-top:30px">消息内容</el-row>
              <el-row>
                <el-input v-model="messageInfo.content" readonly type="textarea"></el-input>
              </el-row>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="标题" prop="title" width="600px"></el-table-column>
        <el-table-column label="发布时间" prop="publishDate" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="状态" prop="isRead">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.isRead">已读</el-tag>
                <el-tag type="danger" v-else>未读</el-tag>
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
      messageList: [],
      expands: [],
      getRowKeys(row) {
        return row.messageId;
      },
      messageInfo: {}
    };
  },
  created() {
    this.getMessageList();
  },
  methods: {
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.pageInfo.pageSize = newSize;
      this.getMessageList();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.pageInfo.pageNum = newPage;
      this.getMessageList();
    },
    async getMessageList() {
      this.expands = [];
      const { data: res } = await this.$http.get("/message/getAll", {
        params: this.pageInfo
      });
      if (res.status !== 200) {
        return this.$message.error("获取消息列表失败");
      }
      console.log(res);
      this.messageList = res.data.records;
      this.total = res.data.total
    },
    async expandChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.messageId); // 每次push进去的是每行的ID
          const { data: res } = await this.$http.get(
            `/message/getMessageInfo`,
            {
              params: {
                messageId: row.messageId
              }
            }
          );
          if (res.status !== 200) {
            return this.$message.error("获取消息详情失败");
          }
          console.log(res.data);
          if(!row.isRead){
              this.$emit('changeMessageState')
          }
          row.isRead = true
          this.messageInfo = res.data;
        }
      } else {
        this.expands = []; // 默认不展开
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>