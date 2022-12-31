<template>
  <div>
    <el-card class="usercard-wrap">
      <div class="usercard-iconlist">
        <i class="iconfont icon-icon_pk"></i>
        <i class="iconfont icon-jiankong"></i>
        <a target="three" :href="tikTokHerf">
          <i class="iconfont icon-tiktok"></i>
        </a>
      </div>
      <div class="usercard-avatar">
        <el-image
          style="border-radius: 50%; width: 100px; height: 100px"
          :src="avatar"
        ></el-image>
      </div>
      <div class="usercard-desc">
        <p class="usercard-nikname">
          <strong>{{ nikname }}</strong>
        </p>
        <p>TikTokID： {{ unique_id }}</p>
        <p>认证类型： 未认证</p>
      </div>

      <p class="usercard-signature">简介：{{ signature }}</p>
      <p class="text-center">
        <i class="el-icon-alarm-clock"></i>
        生存时间 ： 127天 19小时 35分
      </p>
      <p class="text-center">
        <i class="el-icon-alarm-clock"></i>
        更新时间 ： 2022-11-14 3：22
      </p>
      <div class="btn-wrap">
        <el-button class="update-btn">更新数据</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "TtprojectUserCard",
  props: {
    userInfo: {
      type: Object,
    },
  },
  computed: {
    tikTokHerf() {
      return `https://www.tiktok.com/@${this.unique_id}`;
    },
    avatar() {
      return this.userInfo?.avatar_thumb || "";
    },
    nikname() {
      return this.userInfo?.nickname || "暂无昵称";
    },
    unique_id() {
      return this.userInfo?.unique_id || "暂无ID";
    },
    signature() {
      return this.userInfo?.signature || "暂无简介";
    },
  },
  data() {
    return {};
  },

  mounted() {
    console.log(this.userInfo);
  },

  methods: {},
};
</script>

<style lang="stylus" scoped>
.usercard-iconlist {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 auto;
  width: 120px;
}

.usercard-avatar {
  width: 100px;
  margin: 10px auto;
}

.usercard-desc {
  margin: 0 auto;
  text-align: center;
}

.usercard-signature {
  display: flex;
  align-items: center;
  margin: 10px auto;
  width: 286px;
  height: 74px;
  background-color: #EFEFEF;
  text-align: center;
  border-radius: 10px;
}

.text-center {
  width: 250px;
  margin: 0 auto 6px;
}

.usercard-wrap {
  width: 382px;
  height: 422px;
  margin: 0 auto 16px;
  border-radius: 33px;
}

.btn-wrap {
  margin: 0 auto;
  width: 200px;
}

.update-btn {
  width: 200px;
  height: 30px;
  line-height: 5px;
}
</style>