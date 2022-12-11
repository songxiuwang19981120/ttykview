<template>
  <div v-if="formType">
    <el-form
      label-width="200px"
      label-position="left"
      class="form"
      v-model="formData"
      ref="form"
    >
      <div v-if="selectList.length > 0">
        <el-select
          v-model="formData[item.prop]"
          v-for="item in selectList"
          :key="item.prop"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </div>

      <div v-if="formList.length > 0">
        <el-form-item
          class="form-item"
          v-for="item in formList"
          :prop="formData[item.prop]"
          :key="item.label"
          :label="item.label"
        >
        
          <el-input
            class="likecomment-input"
            :placeholder="item.placeholder"
            :class="item.class"
            v-model="formData[item.prop]"
          ></el-input>
          <el-checkbox class="tt-taskdialog--checkbox" v-if="formType === 'video' && item.label === '主题内容'">随机主题内容</el-checkbox>
        
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import form_template from "@/config/accountConfig/taskFormTemplate.config";
const { FORM_TEMPLATE } = form_template;
export default {
  name: "TtprojectBaseForm",
  props: {
    formType: {
      type: String,
    },
  },
  data() {
    return {
      template: FORM_TEMPLATE[this.formType],
      selectList: FORM_TEMPLATE[this.formType]["selectList"],
      formList: FORM_TEMPLATE[this.formType]["formList"],
      formData: {},
    };
  },

  watch: {
    formType(newVal) {
      this.formType = newVal;
      this.initTemplate();
    },
  },

  methods: {
    /* 
        function: initTemplate,
        params: null
        desc: 在formType改变时重置表单模板
    */
    initTemplate() {
      (this.template = FORM_TEMPLATE[this.formType]),
        (this.selectList = FORM_TEMPLATE[this.formType]["selectList"]),
        (this.formList = FORM_TEMPLATE[this.formType]["formList"]),
        (this.formData = {});
    },
  },
};
</script>

<style lang="stylus">
.form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
}
.taskdialog-baseinput
    width: 150px !important
    height: 40px !important
.taskdialog-themeinput input 
    width: 150% !important
    height: 90px !important

.tt-taskdialog--checkbox
    margin-left: 80px

.form-item
    width: 300px !important
</style> 