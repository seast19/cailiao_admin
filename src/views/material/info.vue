<template>
  <div style="padding:20px" v-loading="loading">
    <!-- 搜索 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="">
        <el-input
          v-model.trim="formInline.search"
           clearable
          placeholder="材料名称或型号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onAddUser">添加材料</el-button>
      </el-form-item>
      <el-form-item>
        <el-button disabled>批量导入</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="true"
      :size="'mini'"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称" width="130" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <el-tooltip
            effect="dark"
            :content="'俗称：' + scope.row.NickName"
            :disabled="!scope.row.NickName"
          >
            <span>{{ scope.row.Name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="型号" width="150" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.Model }}</span>
        </template>
      </el-table-column>

      <el-table-column label="位置" width="130" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <p style="margin:0">{{ scope.row.Place.Position }}</p>
          <span> ({{ scope.row.Floor }}层 {{ scope.row.Location }}位)</span>
        </template>
      </el-table-column>
      <el-table-column label="实时数量" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <strong>{{ scope.row.Count }}</strong>
        </template>
      </el-table-column>
      <el-table-column label="常备数量" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.PrepareCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警数量" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.WarnCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Marks }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="真的删除吗？"
            @onConfirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button size="mini" type="danger" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="8"
      layout="total,  prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "MaterialInfo",
  data() {
    return {
      currentPage: 1,
      total: 0,

      loading: false,
      formInline: {
        search: ""
      },
      tableData: []
    };
  },
  methods: {
    // 跳转编辑材料界面
    handleEdit(index, row) {
      this.$router.push({
        name: "MaterialEdit",
        query: { id: row.ID },
        params: { page: this.currentPage }
      });
    },
    // 删除材料
    async handleDelete(index, row) {
      this.loading = true;
      await request({
        url: `/material/id/${row.ID}`,
        method: "delete"
      })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });

          this.getUser(this.currentPage);
        })
        .catch(e => {
          console.log(e);
        });

      this.loading = false;
    },
    // 搜索
    onSearch() {
      this.loading = true;
      request({
        method: "get",
        url: "/material/s",
        params: {
          key: this.formInline.search,
          page: this.currentPage,
          per_page: 8
        }
      })
        .then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.total = res.count;
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    },
    // 跳转添加页面
    onAddUser() {
      this.$router.push({
        name: "MaterialAdd",
        params: { page: this.currentPage }
      });
    },
    // 获取材料列表
    // getUser() {
    //   this.loading = true;
    //   request({
    //     url: `/material`,
    //     method: "get",
    //     params: {
    //       page: this.currentPage,
    //       per_page: 8,
    //       place_id: 0
    //     }
    //   })
    //     .then(res => {
    //       // console.log(res.data);
    //       this.tableData = res.data.materials;
    //       this.total = res.data.count;
    //       this.currentPage = res.data.page;
    //     })
    //     .catch(e => {});

    //   this.loading = false;
    // },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    handleCurrentChange(val) {
      this.currentPage = val;
      //   console.log(`当前页: ${val}`);
      this.onSearch();
      // this.getUser();
    }
  },
  created() {
    if (this.$route.params.page) {
      this.currentPage = this.$route.params.page || 1;
    }
    // this.getUser();
    this.onSearch();
  }
};
</script>

<style scoped></style>
