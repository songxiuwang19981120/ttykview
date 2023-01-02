<template>
  <div>
    <el-select v-model="operation" clearable @change="hanldChange(operation)">
      <el-option
        v-for="item in operationOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "TtprojectOperationSelect",

  data() {
    return {
      operation: "",

      operationOption: [
        {
          value: "编辑",
          label: "编辑",
        },
        {
          value: "删除",
          label: "删除",
        },
        {
          value: "分析",
          label: "分析",
        },
        {
          value: "发布视频",
          label: "发布视频",
        },
      ],
    };
  },

  mounted() {},

  methods: {
    hanldChange(operation) {
      this.$emit("setOperation", operation);
      console.log(this.operation);
    },
  },
};
</script>

<style lang="stylus" scoped></style>