<template>
  <div style="padding:20px">
    <!-- 页头 -->
    <el-page-header @back="goBack" content="添加材料"> </el-page-header>

    <!-- 表单 -->
    <el-form
      size="small"
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="margin-top:20px;"
    >
      <el-row>
        <el-col :md="12">
          <p class="mytip">物资信息</p>

          <el-form-item label="物资名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="型号" prop="model">
            <el-input v-model="form.model"></el-input>
          </el-form-item>
          <el-form-item label="计量单位" prop="model">
            <el-input v-model="form.unit"></el-input>
          </el-form-item>

          <el-form-item label="俗称" prop="nickname">
            <el-input
              v-model="form.nickname"
              placeholder="如：锤子榔头羊角锤"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="marks">
            <el-input v-model="form.marks" placeholder="备注"></el-input>
          </el-form-item>

          <p class="mytip">数量信息</p>
          <el-form-item label="实时数量" prop="count">
            <el-input-number v-model="form.count" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="常备数量" prop="prepareCount">
            <el-input-number
              v-model="form.prepareCount"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="报警数量" prop="warnCount">
            <el-input-number
              v-model="form.warnCount"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <p class="mytip">位置信息</p>

          <el-form-item label="货架" prop="placeID">
            <el-select v-model="form.placeID" placeholder="请选择货架">
              <el-option
                :label="place.Position"
                :value="place.ID"
                v-for="place in places"
                :key="place.ID"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="层数" prop="floor">
            <el-input-number
              v-model="form.floor"
              :min="-1"
              :max="10"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="位数" prop="location">
            <el-input-number
              v-model="form.location"
              :min="0"
              :max="200"
            ></el-input-number> </el-form-item
        ></el-col>
        <el-col :md="24">
          <p style="color:#f56c6c">常用符号：×</p>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')"
              >立即创建</el-button
            >
            <el-button @click="reset()">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "MaterialAdd",
  data() {
    return {
      places: [], //所有货架位置

      loading: false,
      form: {
        name: "", //名称
        model: "", //型号
        unit:"",//单位
        nickname: "", //俗称

        placeID: "", //货架id
        floor: 0, //层
        location: 0, //位

        count: 0, //数量
        prepareCount: 0, //常备数量
        warnCount: 0, //报警数量

        marks: "" //备注
      },
      rules: {
        name: [{ required: true, message: "请输入物资名称", trigger: "blur" }],

        placeID: [{ required: true, message: "请选择货架", trigger: "blur" }],
        floor: [{ required: true, message: "请输入层数", trigger: "blur" }]
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
            url: "/material",
            data: {
              name: this.form.name,
              model: this.form.model,
              unit:this.form.unit,
              nick_name: this.form.nickname,

              place_id: this.form.placeID,
              floor: this.form.floor,
              location: this.form.location,

              count: this.form.count,
              prepare_count: this.form.prepareCount,
              warn_count: this.form.warnCount,

              marks: this.form.marks
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
      this.$router.push({
        name: "MaterialInfo",
        params: { page: this.$route.params.page }
      });
    },
    // 重置
    reset() {
      this.form = {
        name: "", //名称
        model: "", //型号
        unit:'',
        nickname: "", //俗称

        placeID: "", //货架id
        floor: 0, //层
        location: 0, //位

        count: 0, //数量
        prepareCount: 0, //常备数量
        warnCount: 0, //报警数量

        marks: "" //备注
      };
    },

    // 获取货架
    getPlaceAll() {
      request({
        method: "get",
        url: "/placesall"
      })
        .then(res => {
          // console.log(res);
          if (res.code === 2000) {
            this.places = res.data.reverse();
          } else {
            this.$message({
              message: "获取货架失败",
              type: "warn"
            });
          }
        })
        .catch(e => {});
    }
  },
  created() {
    this.getPlaceAll();
  }
};
</script>
<style scoped>
.mytip {
  color: #c0c4cc;
  margin: 10px 0 10px 0;
  padding-left: 80px;
}
</style>
