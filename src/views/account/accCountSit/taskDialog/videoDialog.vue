<template>
  <div class="tt-acccountsit--vieotask">
    <el-dialog
      width="40%"
      :visible="showVideoTask"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">视频发布任务配置</h1>
      </span>

      <el-form
        :rules="rules"
        ref="videoForm"
        label-position="left"
        label-width="130px"
        :model="vieoTaskForm"
      >
        <el-form-item label="视频发布数量 :" prop="video_num">
          <el-input
            @blur="test"
            type="text"
            v-model="vieoTaskForm.video_num"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题标签内容 :" prop="tag_num">
          <el-input
            v-model="vieoTaskForm.tag_num"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="@用户数量 :" prop="user_num">
          <el-input v-model="vieoTaskForm.user_num"></el-input>
        </el-form-item>
        <el-form-item label="主题内容 :" prop="theme_content">
          <el-input
            class="input-textarea"
            type="textarea"
            v-model="vieoTaskForm.theme_content"
          ></el-input>
          <el-checkbox v-model="vieoTaskForm.random_content"
            >随机主题内容</el-checkbox
          >
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确认并执行</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectVideoDialog",
  props: {
    showVideoTask: {
      type: Boolean,
    },
  },
  data() {
    return {
      rules: {
        video_num: [
          {
            required: true,
            message: "请填写发布数量",
            trigger: "blur",
          },
        ],
      },

      //TODO  需要跟后端对接字段  视频发布任务 提交表单
      vieoTaskForm: {
        video_num: "", //视频发布数量
        tag_num: "", //主题标签内容
        user_num: "", // @用户数量
        theme_content: "", //主题内容
        random_content: false, //如果是随机内容的话为TRUE
      },
    };
  },

  mounted() {},

  methods: {
    test() {
      console.log(123);
    },
    /* 
        function: handlerClose
        params: null
        desc: 关闭后的回调
    */
    handlerClose() {
      this.$emit("closeVideoTask");
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交后的回调
    */
    handlerConfrim() {
      this.$refs["videoForm"].validate((valid) => {
        if (valid) {
          console.log("成功");
          this.handlerClose()
          console.log(this.vieoTaskForm);
          this.resetForm()
          console.log(this.vieoTaskForm);
          return 
        }
        this.$message.error('提交失败')
      });
    },
    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm(){
      this.$refs['videoForm'].resetFields()
      this.vieoTaskForm.random_content = false
    }
  },
};
</script>

<style lang="stylus">
.tt-acccountsit--title {
  margin-bottom: 20px;
  font-size: 20px;
}

.el-input {
  width: 220px;
}

.input-textarea textarea {
  height: 90px !important;
}
</style>