<template>
  <div>
    <el-cascader
      :disabled="disabled"
      @change="handleChange(classiFication)"
      clearable
      :props="{ checkStrictly: true, value: 'value' }"
      :options="typeList"
      v-model="classiFication"
      placeholder="设置分类"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  name: "TtprojectTypeSelect",
  props:{
    typeList:{
        type:Array
    },
    disabled:{
        type:Boolean
    }
  },
  data() {
    return {
        classiFication:[]
    };
  },

  mounted() {},

  methods: {
    handleChange(classiFication){
        this.$emit('handleTypeChange',classiFication)
    }
  },
};
</script>

<style lang="stylus" scoped></style>