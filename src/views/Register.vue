<template>
  <div>
    <div class="register-wrap">
      <el-card class="register-card">
        <h1 class="register-title">TT云控系统</h1>
        <el-form
          ref="registerForm"
          :rules="rules"
          :model="registerForm"
          label-position="left"
          label-width="110px"
        >
          <el-form-item prop="username" label="设置用户名 ：">
            <el-input
              style="width: 70%"
              v-model="registerForm.username"
              placeholder="设置用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="设置密码 ：">
            <el-input
              style="width: 70%"
              v-model="registerForm.password"
              placeholder="设置密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="isSamePwd" label="确认密码 ：">
            <el-input
              style="width: 70%"
              v-model="registerForm.isSamePwd"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="flex-jus-space-bet">
          <el-checkbox>勾选并同意<span>《用户服务协议》</span></el-checkbox>
          <p class="fz-14">
            已有账号？
            <router-link to="/login" class="color-18A1FF">马上登录</router-link>
          </p>
        </div>

        <div class="register-bottom">
          <el-button @click="register" class="register-btn">注册</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import rules from "@/config/LoginAndRegisterConfig/formRule.config";
export default {
  name: "TtprojectRegister",

  data() {
    return {
      rules: rules,
      registerForm: {
        username: "",
        password: "",
        isSamePwd: "",
      },
    };
  },

  mounted() {},

  methods: {
    async register() {
      try {
        if (this.registerForm.password !== this.registerForm.isSamePwd) {
          this.$message.error("两次密码输入不一致，请重新输入");
          return false;
        }
        this.$refs["registerForm"].validate((valid) => {
          if (valid) {
            console.log("注册", this.registerForm);
          }
        });
      } catch (error) {
        console.error(error);
        this.$message.error("登陆失败");
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.register-wrap {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #2d2f33;
}

.fz-14 {
  font-size: 14px;
}

.flex-jus-space-bet {
  display: flex;
  justify-content: space-between;
}

.register-card {
  width: 30%;
  height: 40%;
  margin: 0 auto;
}

.register-title {
  font-weight: 500;
  font-size: 22px;
  color: #2d2f33;
  text-align: center;
  margin: 0 auto 20px;
}

.register-operation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  span {
    font-size: 13px;
  }
}

.register-bottom {
  margin-top: 16px;

  p {
    margin-top: 6px;
    text-align: center;
    font-size: 14px;
  }
}

.register-btn {
  width: 100%;
  background-color: #E32626;
  color: #fff;
}

.color-18A1FF {
  color: #18A1FF;
}
</style>