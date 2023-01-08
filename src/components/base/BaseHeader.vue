<template>
  <div class="tt-header">
    <div>
      <i :class="curIcon"></i>
      <span class="fz-20">{{ curTitle }}</span>
    </div>
    <div class="tt-header--login">
      <i class="el-icon-bell fz-20"></i>
      <el-image class="ml-12 tt-avatar-img" :src="src" fit="cover"></el-image>
      <p class="fz-14 tt-header-name">{{userName}}</p>
      <svg
        @click="logout"
        t="1672657190113"
        class="tt-header--logout"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4805"
        width="20"
        height="20"
      >
        <path
          d="M523.264 491.7248c-18.8416 0.4096-32.5632-14.7456-32.9728-33.5872V95.8464c0-18.6368 13.7216-33.792 32.9728-33.792 19.456 0 33.1776 15.1552 33.1776 33.792v361.8816c-0.2048 9.216-3.8912 17.8176-10.4448 24.1664-6.5536 6.5536-13.5168 9.8304-22.7328 9.8304z m-10.4448 468.3776c-117.9648 0.4096-231.424-44.8512-316.416-126.3616-40.5504-39.1168-73.3184-85.6064-95.8464-137.216-52.0192-118.5792-46.08-254.7712 16.1792-368.4352 37.888-68.608 74.9568-108.3392 136.192-150.528 15.7696-10.8544 36.0448-9.216 46.2848 4.3008 5.3248 7.168 8.192 15.9744 6.7584 24.7808-1.6384 8.8064-6.7584 16.7936-14.1312 21.7088-47.7184 32.9728-90.9312 76.3904-118.784 127.1808-28.4672 51.6096-45.2608 113.8688-45.2608 172.8512 0 97.28 37.2736 192.7168 108.7488 261.5296 71.68 69.0176 177.3568 113.2544 276.8896 112.64 99.5328 0.6144 199.2704-37.6832 270.9504-106.7008 70.656-67.1744 114.4832-170.1888 114.4832-267.6736 0.2048-58.9824-10.6496-119.1936-39.1168-170.8032-28.0576-50.7904-75.3664-100.1472-123.0848-133.12-7.3728-4.9152-12.4928-12.6976-14.1312-21.2992-1.6384-8.8064 1.8432-18.2272 6.144-23.7568 11.0592-13.312 28.8768-12.6976 44.6464-1.8432 56.5248 38.912 103.0144 90.5216 136.192 150.528C971.776 441.5488 977.7152 577.536 925.696 696.32c-22.7328 51.6096-55.296 98.304-95.8464 137.216-41.1648 39.5264-89.2928 71.0656-142.336 92.5696-55.7056 22.7328-114.8928 34.2016-174.6944 33.9968z m0 0"
          p-id="4806"
          fill="#515151"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "TtprojectBaseHeader",

  data() {
    return {
      src: require("../../assets/logo.jpg"),
      curTitle: '',
      curIcon: ''
    };
  },

  mounted() {},
  computed:{
    ...mapGetters(['userInfo']),
    userName(){
      return this.userInfo.username
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    },
  },

  watch: {
			$route: {
				handler(val) {
          this.curTitle = val.meta.title,
          this.curIcon = val.meta.icon
				},
				deep: true,
        immediate:true
			},
		},
};
</script>

<style lang="stylus" scoped>
.fz-14
  font-size 14px

.fz-20
  font-size 20px

.ml-12 
  margin-left 12px

.el-icon-bell {
  cursor pointer
  color black !important
}

.tt-header {
  z-index:2
  height: 100%;
  width: 100%
  display: flex;
  justify-content: space-between;
  align-items: center;
}

[class*=" el-icon-"], [class^=el-icon-]{
  color: red;
  margin-right: 6px;
  font-size : 22px;
}

.tt-header-name
  margin: 0 12px

.tt-avatar-img {
  overflow: hidden;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.tt-header--logout {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: 0.2s;
  transform: scale(1);

  &:hover {
    transform: scale(1.5);
  }
}

.tt-header--admin {
  cursor: pointer;
}

.tt-header--login {
  display: flex;
  align-items: center;
  height: 30px;
}
</style>