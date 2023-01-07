<template>
  <div>
    <el-menu
      class="tt-aside"
      :default-active="activeIndex"
      :unique-opened="true"
      router
      background-color="#2d2f33"
      text-color="#fff"
      ref="baseAside"
    >

        <div class="tt-aside--logo">LOGO</div>
      <div v-for="item in NAV_LIST" :key="item.title">
        <el-menu-item v-if="!item.children" :index="item.to">
          <i :class="item.icon"></i>
          {{ item.title }}
        </el-menu-item>

        <el-submenu v-if="item.children" :index="item.title">
          <template slot="title">
            <i :class="item.icon"></i>
            {{ item.title }}
          </template>
          <div v-if="item.children">
            <el-menu-item-group
              :key="child.title"
              v-for="child in item.children"
            >
              <el-menu-item :index="child.to">{{ child.title }}</el-menu-item>
            </el-menu-item-group>
          </div>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
import navList from "@/config/nav.config";
const { ASIDE_LIST } = navList;
export default {
  name: "TtprojectBaseAide",

  data() {
    return {
      activeIndex: this.$route.path.split("/")[1],
      NAV_LIST: ASIDE_LIST,
    };
  },
  computed: {
    hasAside() {
      return this.NAV_LIST.length > 0;
    },
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="stylus">
.tt-aside {
  height: 100vh;
  width: 100% !important
}
.tt-aside--logo
    height: 80px
    background-color #555555
    text-align: center
    line-height 80px
    font-size 30px
    font-weight 600
</style>