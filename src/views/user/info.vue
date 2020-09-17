<template>
  <div style="padding:20px" v-loading="loading">
    <!-- 搜索 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label>
        <el-input v-model="formInline.search" placeholder="姓名或手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onAddUser">添加用户</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.RealName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-popconfirm title="真的删除吗？" @onConfirm="handleDelete(scope.$index, scope.row)">
            <el-button size="mini" type="danger" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="8"
      layout="total,  prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "UserInfo",
  data() {
    return {
      currentPage: 1,
      total: 0,

      loading: false,
      formInline: {
        search: "",
      },
      tableData: [],
    };
  },
  methods: {
    // 跳转编辑用户界面
    handleEdit(index, row) {
      this.$router.push({ name: "UserEdit", params: { id: row.ID } });
    },
    // 删除用户
    async handleDelete(index, row) {
      this.loading = true;
      await request({
        url: `/users/${row.ID}`,
        method: "delete",
      })
        .then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });

          this.getUser(this.currentPage);
        })
        .catch((e) => {
          console.log(e);
        });

      this.loading = false;
    },
    onSearch() {
      console.log("submit!");
    },
    onAddUser() {
      this.$router.push("/user/add");
    },
    // 获取用户列表
    async getUser(e) {
      let page = e || 1;
      this.loading = true;
      await request({
        url: `/users`,
        method: "get",
        params: {
          page: page,
          per_page: 8,
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.tableData = res.data.users;
          this.total = res.data.count;
          this.currentPage = res.data.page;
        })
        .catch((e) => {});

      this.loading = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.getUser(val);
    },
  },
  created() {
    this.getUser();
  },
};
</script>

<style scoped></style>
