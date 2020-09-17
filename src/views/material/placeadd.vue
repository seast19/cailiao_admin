<template>
  <div style="padding:20px">
    <!-- 页头 -->
    <el-page-header @back="goBack" content="添加货架"> </el-page-header>

    <!-- 表单 -->
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="margin-top:20px;max-width:500px"
    >
      <el-form-item label="货架位置" prop="position">
        <el-input v-model="form.position" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>

     

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')"
          >立即创建</el-button
        >
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "PlaceAdd",
  data() {
    return {
      loading: false,
      form: {
        position: "",
        remark: "",
       
      },
      rules: {
        position: [{ required: true, message: "请输入位置", trigger: "blur" }],
       
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          request({
            method: "post",
            url: "/places",
            data: {
              position: this.form.position,
              remarks: this.form.remark,
             
            }
          })
            .then(res => {
              this.loading = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });

              setTimeout(() => {
                this.goBack();
              }, 100);
            })
            .catch(e => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },
    // 重置
    reset() {
      this.form = {
        position:'',
        remark:""
      };
    }
  },
  created() {}
};
</script>
<style scoped></style>
