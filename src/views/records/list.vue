<template>
  <div style="padding:20px" v-loading="loading">
    <!-- 搜索 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item>
        <el-date-picker
          v-model="formInline.dateTime"
          type="daterange"
          value-format="timestamp"
          @change="getUser"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.chooseType"
          placeholder="选择动作"
          @change="getUser"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :size="'mini'"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="ID" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ID }}</span>
        </template>
      </el-table-column>

      <el-table-column label="日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateAt | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <el-tooltip
            effect="dark"
            :content="'俗称：' + scope.row.Material.NickName"
            :disabled="!scope.row.Material.NickName"
          >
            <span>{{ scope.row.Material.Name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="型号" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.Material.Model }}</span>
        </template>
      </el-table-column>

      <el-table-column label="动作" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.Type | formateType }}</span>
        </template>
      </el-table-column>

      <el-table-column label="领用/发出数量" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.CountChange }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实时数量" align="center">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span>{{ scope.row.Material.Count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Material.Marks }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          > -->
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
      @size-change="handleSizeChange"
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
import { parseTime } from "@/utils";

export default {
  name: "RecordInfo",
  data() {
    return {
      currentPage: 1,
      total: 0,

      typeOptions: [
        {
          value: "",
          label: "发料&领料"
        },
        {
          value: "send",
          label: "发料"
        },
        {
          value: "receive",
          label: "领料"
        }
      ],

      loading: false,
      formInline: {
        search: "",
        chooseType: "",
        dateTime: ""
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
    // 表格设置状态
    tableRowClassName({ row, rowIndex }) {
      // console.log(row, rowIndex);
      if (row.Type == "send") {
        return "send-row";
      } else if (row.Type == "receive") {
        return "receive-row";
      }
      return "";
    },
    // 删除材料
    async handleDelete(index, row) {
      this.loading = true;
      await request({
        url: `/record/id/${row.ID}`,
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
    onSearch() {
      console.log("submit!");
    },
    onAddUser() {
      this.$router.push({
        name: "MaterialAdd",
        params: { page: this.currentPage }
      });
    },
    // 获取材料列表
    async getUser() {
      this.loading = true;
      await request({
        url: `/record`,
        method: "get",
        params: {
          page: this.currentPage,
          per_page: 8,
          type: this.formInline.chooseType,
          start_time: this.formInline.dateTime
            ? this.formInline.dateTime[0]
            : 0,
          stop_time: this.formInline.dateTime
            ? this.formInline.dateTime[1] + 86400000 - 1000
            : 0
        }
      })
        .then(res => {
          // console.log(res.data);
          this.tableData = res.data.records;
          this.total = res.data.count;
          this.currentPage = res.data.page;
        })
        .catch(e => {});

      this.loading = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //   console.log(`当前页: ${val}`);
      this.getUser();
    }
  },
  filters: {
    // 格式化时间戳
    formatDate(t) {
      // t = t / 1e6;
      // console.log(t);
      var date = new Date(t);

      var YY = date.getFullYear() + "-";
      var MM =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hh =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var mm =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var ss =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return YY + MM + DD + " " + hh + mm + ss;
    },
    // 格式化操作动作 出库/入库
    formateType(t) {
      if (t === "send") {
        return "发料";
      } else if (t === "receive") {
        return "领料";
      } else {
        return "Error";
      }
    }
  },
  created() {
    if (this.$route.params.page) {
      this.currentPage = this.$route.params.page;
    }
    this.getUser();
  }
};
</script>

<style scoped>
.el-table >>> .receive-row {
  background: #409eff3b !important;
}

.el-table >>> .send-row {
  background: #67c23a2e !important;
}
</style>
