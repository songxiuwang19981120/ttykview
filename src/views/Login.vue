<template>
  <div>
    <div class="login-wrap">
      <el-card class="login-card">
        <h1 class="login-title">TT云控系统</h1>
        <el-form
          ref="loginForm"
          :rules="rules"
          :model="loginForm"
          label-position="left"
          label-width="110px"
        >
          <el-form-item prop="username" label="输入用户名 ：">
            <el-input
              clearable
              style="width: 70%"
              v-model="loginForm.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="输入密码 ：">
            <el-input
              clearable
              type="password"
              style="width: 70%"
              v-model="loginForm.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="captcha" label="输入验证码 ：">
            <div class="login-authitem">
              <el-input
                clearable
                class="mr-15"
                style="width: 40%"
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
              ></el-input>
              <img
                class="auth_img"
                :src="AUTH_IMG_URL"
                onClick="this.src=this.src+'?'+Math.random()"
                alt="点击刷新验证码"
              />
            </div>
          </el-form-item>
        </el-form>
        <div class="flex flex-jus-space-bet">
          <p class="fz-14">
            还没账号？
            <router-link to="/register" class="color-18A1FF"
              >马上注册</router-link
            >
          </p>
          <p class="fz-14 color-18A1FF">忘记密码？</p>
        </div>

        <div class="login-bottom">
          <el-button @click="confrim" class="login-btn">登录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import rules from "@/config/LoginAndRegisterConfig/formRule.config";
import base from "@/config/base.config";
const { BASE_URL } = base;
export default {
  name: "TtLogin",
  computed: {
    AUTH_IMG_URL() {
      return `${BASE_URL}/Base/captcha`;
    },
  },
  data() {
    return {
      baseUrl: BASE_URL, 
      rules: rules,
      loginForm: {
        username: "",
        password: "",
        captcha: "",
      },
    };
  },

  mounted() {},

  methods: {
    async confrim() {
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          let data = this.loginForm
          this.$store.dispatch("login", { data });
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.login-authitem {
  display: flex;
}

.flex-jus-space-bet {
  display: flex;
  justify-content: space-between;
}

.fz-14 {
  font-size: 14px;
}

.mr-15 {
  margin-right: 15px;
}

.flex {
  display: flex;
}

.auth_img {
  width: 120px;
  height: 40px;
}

.login-wrap {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #2d2f33;
}

.login-card {
  width: 30%;
  height: 40%;
  margin: 0 auto;
}

.login-title {
  font-weight: 500;
  font-size: 22px;
  color: #2d2f33;
  text-align: center;
  margin: 0 auto 20px;
}

.login-operation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  span {
    font-size: 13px;
  }
}

.login-bottom {
  margin-top: 16px;

  p {
    margin-top: 6px;
    text-align: center;
    font-size: 14px;
  }
}

.login-btn {
  width: 100%;
  background-color: #E32626;
  color: #fff;
}

.color-18A1FF {
  color: #18A1FF;
}
</style>