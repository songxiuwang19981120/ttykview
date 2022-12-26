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
            type="text"
            v-model="vieoTaskForm.video_num"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题标签内容 :" prop="label_num">
          <el-input
            v-model="vieoTaskForm.label_num"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="@用户数量 :" prop="user_num">
          <el-input v-model="vieoTaskForm.user_num"></el-input>
        </el-form-item>
        <el-form-item label="主题内容 :" prop="text">
          <el-input
            :disabled="isTextAreaDisabled"
            class="input-textarea"
            type="textarea"
            v-model="vieoTaskForm.text"
          ></el-input>
          <el-checkbox
            :disabled="isRandomTextDisabled"
            v-model="vieoTaskForm.text_round"
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
import formRule from "@/config/accountConfig/formRules.config";
const { video } = formRule;
export default {
  name: "TtprojectVideoDialog",
  props: {
    showVideoTask: {
      type: Boolean,
    },
    classiFication: {
      type: Array,
    },
    batchEditorList: {
      type: Array,
    },
  },
  computed: {
    isRandomTextDisabled() {
      return this.vieoTaskForm.text.length !== 0;
    },
    isTextAreaDisabled() {
      return this.vieoTaskForm.text_round === true;
    },
  },

  data() {
    return {
      rules: video,

      //TODO  需要跟后端对接字段  视频发布任务 提交表单
      vieoTaskForm: {
        typecontrol_id: "", //分类id
        uid_list: [], // uid数组
        video_num: "", //视频发布数量
        label_num: "", //主题标签内容
        user_num: "", // @用户数量
        text: "", //主题内容
        text_round: false, //如果是随机内容的话为1
      },
    };
  },

  mounted() {},

  methods: {
    /* 
        function: handlerClose
        params: null
        desc: 关闭后的回调
    */
    handlerClose() {
      this.$emit("closeVideoTask");
      this.resetForm();
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交后的回调
    */
    async handlerConfrim() {
      try {
        await this.$refs["videoForm"].validate((valid) => {
          if (valid) {
            let userList = this.batchEditorList.map((item) => {
              return item.uid;
            });
            this.vieoTaskForm.typecontrol_id =
              this.classiFication[this.classiFication.length - 1];
            this.vieoTaskForm.text_round =
              this.vieoTaskForm.text_round === true ? 1 : 0;
            this.vieoTaskForm.uid_list = userList;
            this.$api({ type: "uploadVideoTask", data: this.vieoTaskForm })
              .then((res) => {
                if (res.status == 200) {
                  this.$message.success(res.msg);
                  this.handlerClose();
                  this.resetForm();
                  this.$message.success(res.msg ?? '操作成功')
                  return;
                }
                this.$message.error(res.msg ?? "操作失败");
              })
              .cathch(() => {
                this.$message.error("未知错误");
              });
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm() {
      this.$refs["videoForm"].resetFields();
      this.vieoTaskForm.random_content = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
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