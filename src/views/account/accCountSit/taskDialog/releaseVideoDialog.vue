<template>
  <div>
    <el-dialog
      :visible="showReleaseVideoDialog"
      :before-close="handlerClose"
      width="40%"
    >
      <span slot="title">
        <h1>上传视频</h1>
      </span>
      <el-form
        ref="releaseVideoForm"
        label-position="left"
        label-width="150px"
        v-model="releaseVideoForm"
      >
        <el-form-item label="输入作品文案：">
          <el-input
            v-model="releaseVideoForm.work_text"
            style="width: 70%"
            placeholder="请输入文案"
          ></el-input>
        </el-form-item>

        <el-form-item label="输入标签：">
          <el-input
            v-model="releaseVideoForm.tag"
            style="width: 70%"
            type="textarea"
            placeholder="请输入标签(可输入多个)"
          ></el-input>
        </el-form-item>

        <el-form-item label="输入需要@的ID：">
          <el-input
            v-model="releaseVideoForm.id"
            style="width: 70%"
            type="textarea"
            placeholder="请输入需@ID(可输入多个)"
          ></el-input>
        </el-form-item>

        <el-form-item label="输入任务名称：">
          <el-input
            v-model="releaseVideoForm.task_name"
            style="width: 70%"
            placeholder="请输入任务名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="上传视频：">
          <el-upload
            class="upload-demo"
            drag
            :action="actionUrl"
            multiple
            :before-upload="videoBefore"
            accept=".mp4"
            :on-success="handleSucess"
            :on-error="handleError"
            :on-remove="handleRemove"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传视频文件</div>
          </el-upload>
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
import base from "@/config/base.config";
const { BASE_URL } = base;
export default {
  name: "TtprojectReleaseVideoDialog",
  props: {
    showReleaseVideoDialog: {
      type: Boolean,
    },
  },
  data() {
    return {
      BASE_URL: BASE_URL,
      releaseVideoForm: {
        work_text: "", //输入作品文案
        tag: "", //标签
        id: "", //需要@ID
        task_name: "", //任务名称
      },
    };
  },
  computed: {
    actionUrl() {
      return `${BASE_URL}Base/upload`;
    },
  },
  mounted() {},

  methods: {
    // 视频删除
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 视频上传失败回调
    handleError(err, file, fileList) {
      this.$message.error(err.msg);
    },
    // 视频上传成功回调
    handleSucess(response, file, fileList) {
      this.fileList = fileList;
    },
    // 校验视频大小
    videoBefore(file) {
      let { size } = file || {};
      if (size > 3 * 1024 * 1024) {
        this.$message.error("视频大小请不要超过2M");
        return false;
      }
    },
    handlerClose() {
      this.$emit("closeReleaseVideoDialog");
      this.resetForm();
    },
    handlerConfrim() {
      this.$message.success('上传成功')
      this.resetForm()
      this.handlerClose()
      console.log("提交", this.releaseVideoForm);
    },
    resetForm() {
      this.$refs["releaseVideoForm"].resetFields();
    },
  },
};
</script>

<style lang="stylus" scoped>
::v-deep .el-upload-dragger {
  width: 300px;
}
</style>