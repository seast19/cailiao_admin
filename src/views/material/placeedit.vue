<template>
  <div style="padding:20px">
    <!-- 页头 -->
    <el-page-header @back="goBack" content="编辑货架"> </el-page-header>

    <!-- 表单 -->
    <!-- 表单 -->
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="margin-top:20px;max-width:500px"
    >
      <el-form-item label="ID" prop="id">
        <el-input disabled="" v-model="form.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="位置" prop="position">
        <el-input v-model="form.position" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>

     
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')"
          >立即更新</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "PlaceEdit",
  data() {
    return {
      loading: false,
      form: {
        id: "",
        position: "",
        remark: "",
       
      },
      rules: {
        position: [
          { require:true, message: "请输入货架位置", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //   更新用户
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          request({
            method: "put",
            url: `/places/${this.form.id}`,
            data: {
              position: this.form.position,
              remarks: this.form.remark,
             
            }
          })
            .then(res => {
              this.loading = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
            })
            .catch(e => {
              console.log(e);
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    //   获取用户信息
    getUser() {
      let id = this.$route.params.id;
      this.loading = true;
      request({
        method: "get",
        url: `/places/${id}`
      })
        .then(res => {
          this.loading = false;
          this.form = {
            id: res.data.ID,
            position: res.data.Position,
            remark: res.data.Remarks,
           
          };
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    }
  },
  created() {
    this.getUser();
  }
};
</script>

<style scoped></style>
