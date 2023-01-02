<template>
  <div class="mar-bot-30">
    <div class="border-bot">
      <div class="data-desc mar-bot-30">
        <div>
          <i :class="[icon]" class="color-rad"></i>
          <span class="title fz-20">{{ title }}</span>
        </div>
        <el-date-picker
          class="date-picker"
          v-model="date"
          value-format="yyyy-MM-dd"
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

      <div class="dis-flex pad-20 mar-bot-50">
        <div class="data-item " v-for="item in data" :key="item.lable">
          <p class="fz-20">{{ item.data }}</p>
          <p class="fz-14 mar-bot-10">{{ item.lable }}</p>

          <p class="data-tag mar-bot-10">{{ item.tag_lable }}{{ item.tag_data }}</p>
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
    /* 
        function: handleChange
        params: val | 时间
        desc: 选择时间变化时的回调
    */
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


.fz-14 {
  font-size 14px
}

.fz-20 {
  font-size 20px
}

.date-picker {
  height: 40px
}

.pad-20 {
  padding: 0 70px;
}

.mar-bot-10 {
  margin-bottom: 10px
}

.mar-bot-30 {
  margin-bottom: 30px;
}

.mar-bot-50 {
  margin-bottom: 50px;
}

.color-rad {
  color: red;
  margin-right: 10px;
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

  p:nth-of-type(1) {
    font-weight: 700;
  }
}
</style>