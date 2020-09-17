<template>
  <div style="padding:20px">
    <!-- 页头 -->
    <el-page-header @back="goBack" content="编辑用户"> </el-page-header>

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
          autocomplete="off"
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
          >立即更新</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "UserEdit",
  data() {
    return {
      loading: false,
      form: {
        id: "",
        name: "",
        phone: "",
        pwd: "",
        role: "user"
      },
      rules: {
        phone: [
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "change" }
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
            url: `/users/${this.form.id}`,
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
        url: `/users/${id}`
      })
        .then(res => {
          this.loading = false;
          this.form = {
            id: res.data.user.ID,
            name: res.data.user.RealName,
            phone: res.data.user.Phone,
            pwd: "",
            role: res.data.user.Role
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
