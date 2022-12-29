<template>
  <div class="mar-bot-10">
    <div class="border-bot">
      <div class="data-desc mar-bot-10">
        <div>
          <i :class="[icon]" class="color-rad"></i>
          <span class="title">{{ title }}</span>
        </div>
        <el-date-picker
          class="date-picker"
          v-model="date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="handleChange"
        >
        </el-date-picker>
      </div>

      <div class="dis-flex pad-20 mar-bot-10">
        <div class="data-item" v-for="item in data" :key="item.lable">
          <p>{{ item.data }}</p>
          <p>{{ item.lable }}</p>
          <p class="data-tag">{{ item.tag_lable }}{{ item.tag_data }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TtprojectTabData",
  props: {
    data: {
      type: Array,
    },
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      date: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    handleChange(val) {
      console.log(val);
      this.$emit("updateData");
    },
  },
};
</script>

<style lang="stylus" scoped>
.dis-flex {
  display: flex;
  justify-content: space-between;
}

.date-picker {
  height: 40px
}

.pad-20 {
  padding: 0 70px;
}

.mar-bot-10 {
  margin-bottom: 30px;
}

.color-rad {
  color: red
}

.border-bot
  border-bottom: 1px solid #ccc

.data-desc
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  height: 50px

.data-tag
  height: 30px
  background-color: #ccc
  line-height 30px
  border-radius: 20px

.data-item {
  width: 150px;
  height: 50px;
  text-align: center;

  p {
    font-weight: 700;
  }
}
</style>