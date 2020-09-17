<template>
  <div style="padding:20px">
    <!-- 页头 -->
    <el-page-header @back="goBack" content="添加用户"> </el-page-header>

    <!-- 表单 -->
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="margin-top:20px;max-width:500px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pwd">
        <el-input
          type="password"
          v-model="form.pwd"
          :autocomplete="'new-password'"
        ></el-input>
      </el-form-item>

      <el-form-item label="用户角色">
        <el-select v-model="form.role" placeholder="请选择用户角色">
          <el-option label="普通用户" value="user"></el-option>
          <el-option label="管理员" value="editor"></el-option>
          <el-option label="超级管理员" value="admin"></el-option>
        </el-select>
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
  name: "UserAdd",
  data() {
    return {
      loading: false,
      form: {
        name: "",
        phone: "",
        pwd: "",
        role: "user"
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          {
            required: true,
            min: 11,
            max: 11,
            message: "请输入11位手机号",
            trigger: "change"
          }
        ],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
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
            url: "/users",
            data: {
              phone: this.form.phone,
              name: this.form.name,
              pwd: this.form.pwd,
              role: this.form.role
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
        name: "",
        phone: "",
        pwd: "",
        role: "user"
      };
    }
  },
  created() {}
};
</script>
<style scoped></style>
