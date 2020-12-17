<template>
  <div style="padding:20px" v-loading="loading">
    <!-- 页头 -->
    <!-- <el-page-header @back="goBack" content="添加材料"> </el-page-header> -->
    <!-- 搜索 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="">
        <el-input
          v-model.trim="formInline.search"
          placeholder="物资名称或型号"
          clearable
          prefix-icon="el-icon-search"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch()">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 表单 -->
    <p style="color:#606266">搜索结果：</p>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物资名称" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Model }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实时数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
            >领料</el-button
          >
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

    <!-- 无数据提示跳转添加材料 -->
    <div class="tips-add" v-show="tableData.length == 0">
      没找到对应材料？尝试 
      <!-- <el-link type="primary" >添加材料</el-link>吧. -->
      <router-link class="tips-href" :to="{ name: 'MaterialAdd'}">添加材料</router-link> 吧。
    </div>

    <!-- 操作说明 -->
    <div>
      <p>操作说明：</p>
      <p>1. 搜索待领料物资</p>
      <p>2. 在搜索结果中【操作】栏点击【领料】</p>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "ReceiveInfo",
  data() {
    return {
      currentPage: 1,
      total: 0,

      places: [], //所有货架位置
      formInline: {
        search: ""
      },
      tableData: [],

      loading: false
    };
  },
  methods: {
    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       this.loading = true;
    //       request({
    //         method: "post",
    //         url: "/material",
    //         data: {
    //           name: this.form.name,
    //           model: this.form.model,
    //           nick_name: this.form.nickname,

    //           place_id: this.form.placeID,
    //           floor: this.form.floor,
    //           location: this.form.location,

    //           count: this.form.count,
    //           prepare_count: this.form.prepareCount,
    //           warn_count: this.form.warnCount,

    //           marks: this.form.marks
    //         }
    //       })
    //         .then(res => {
    //           this.loading = false;
    //           this.$message({
    //             message: "添加成功",
    //             type: "success"
    //           });

    //           setTimeout(() => {
    //             this.goBack();
    //           }, 100);
    //         })
    //         .catch(e => {
    //           this.loading = false;
    //         });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 搜索物资
    onSearch() {
      if (this.formInline.search === "") {
        this.$message({
          message: "请输入关键字",
          type: "warning"
        });
        return;
      }

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
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 点击下一页
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.onSearch(val);
    },

    // 跳转发料页
    handleEdit(row) {
      console.log(row);
      this.$router.push({
        name: "ReceiveAdd",
        query: { id: row.ID },
        params: { key: this.formInline.search, page: this.currentPage }
      });
    }
    // 重置
    // reset() {
    //   this.form = {
    //     name: "", //名称
    //     model: "", //型号
    //     nickname: "", //俗称

    //     placeID: "", //货架id
    //     floor: 0, //层
    //     location: 0, //位

    //     count: 0, //数量
    //     prepareCount: 0, //常备数量
    //     warnCount: 0, //报警数量

    //     marks: "" //备注
    //   };
    // },

    // 获取货架
    // getPlaceAll() {
    //   request({
    //     method: "get",
    //     url: "/placesall"
    //   })
    //     .then(res => {
    //       // console.log(res);
    //       if (res.code === 2000) {
    //         this.places = res.data.reverse();
    //       } else {
    //         this.$message({
    //           message: "获取货架失败",
    //           type: "warn"
    //         });
    //       }
    //     })
    //     .catch(e => {});
    // }
  },
  created() {
    // this.getPlaceAll();
    if (this.$route.params.key) {
      this.formInline.search = this.$route.params.key;
      this.currentPage = this.$route.params.page;
      this.onSearch();
    }
  }
};
</script>
<style scoped>
.mytip {
  color: #c0c4cc;
  margin: 10px 0 10px 0;
  padding-left: 80px;
}

.tips-add{
  color: #909399;
  margin-top: 20px;
}

.tips-add .tips-href{
  color: #409eff;
  text-decoration: underline;
}
</style>
