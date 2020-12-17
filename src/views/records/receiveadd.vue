<template>
  <div style="padding:20px">
    <!-- 页头 -->
    <el-page-header @back="goBack" content="领料详细"> </el-page-header>

    <!-- 表单 -->
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      label-width="80px"
      style="margin-top:20px;max-width:500px"
    >
      <el-form-item label="物资ID" prop="id">
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>

      <el-form-item label="物资名称" prop="name">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="库存数" prop="count">
        <el-input v-model="form.count" disabled></el-input>
      </el-form-item>

      <el-form-item label="领料数量" prop="changeCount">
        <el-input-number v-model="form.changeCount" :min="1"></el-input-number>
        <!-- <el-input v-model="form.changeCount"></el-input> -->
      </el-form-item>

      <el-form-item label="备注" prop="marks">
        <el-input v-model="form.marks"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">立即领料</el-button>
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "ReceiveAdd",
  data() {
    return {
      loading: false,
      form: {
        id: "",
        name: "",
        changeCount: "",
        count: "",
        marks: ""
      }
    };
  },
  methods: {
    submitForm(formName) {
      // this.$refs[formName].validate(valid => {
      // if (valid) {
      this.loading = true;
      request({
        method: "post",
        url: "/record",
        data: {
          id: this.form.id,
          changeCount: this.form.changeCount,
          marks: this.form.marks,
          action: "receive"
        }
      })
        .then(res => {
          this.loading = false;
          this.$message({
            message: "领料成功",
            type: "success"
          });

          setTimeout(() => {
            this.goBack();
          }, 100);
        })
        .catch(e => {
          this.loading = false;
        });
      // } else {
      //   return false;
      // }
      // );
    },
    // 返回上一页
    goBack() {
      // this.$router.go(-1);
      this.$router.push({
        name: "ReceiveInfo",
        params: { page: this.$route.params.page, key: this.$route.params.key }
      });
    },
    // 重置
    reset() {
      this.form = {
        changeCount: "",
        marks: ""
      };
    },
    // 获取物资详情
    getMaterial() {
      let id = this.$route.query.id || 0;
      this.loading = true;
      request({
        method: "get",
        url: `/material/id/${id}`
      })
        .then(res => {
          this.loading = false;
          //   this.material = res.data;
          this.form.id = res.data.ID;
          this.form.name = res.data.Name;
          this.form.count = res.data.Count;
          // console.log(res);
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    }
  },
  created() {
    this.getMaterial();
  }
};
</script>
<style scoped></style>
