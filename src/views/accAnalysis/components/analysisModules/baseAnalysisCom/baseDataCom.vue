<template>
  <div>
    <div class="border-bot mar-bot-10">
      <div class="mar-bot-10">
        <i :class="[icon]" class="color-rad"></i>
        <span class="title">{{ title }}</span>
      </div>

      <div class="dis-flex pad-20 mar-bot-10">
        <div class="data-item" v-for="item in data" :key="item.lable">
          <p>{{ item.data }}</p>
          <p>{{ item.lable }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TtprojectBaseAnalysis",
  props: {
    icon: {
      type: String,
    },
    data: {
      type: Array,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus" scoped>
.dis-flex {
  display: flex;
  justify-content: space-between
}

.color-rad {
  color: red
  margin-right: 10px
}

.pad-20
  padding: 0 70px

.mar-bot-10
  margin-bottom: 20px

.border-bot
  border-bottom: 1px solid #ccc

.data-item
  width: 150px
  height: 50px
  text-align: center

  p
    font-weight 700
</style>