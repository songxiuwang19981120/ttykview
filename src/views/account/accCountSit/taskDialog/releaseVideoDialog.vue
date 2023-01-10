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
        :rules="rules"
        ref="releaseVideoForm"
        label-position="left"
        label-width="150px"
        :model="releaseVideoForm"
      >
        <el-form-item label="输入作品文案：">
          <el-input
            type="textarea"
            v-model="releaseVideoForm.text"
            style="width: 70%"
            placeholder="请输入文案"
          ></el-input>
        </el-form-item>

        <el-form-item label="输入标签：">
          <el-input
            v-model="releaseVideoForm.label"
            style="width: 70%"
            type="textarea"
            placeholder="请输入标签(可输入多个)"
          ></el-input>
        </el-form-item>

        <el-form-item prop="task_name" label="输入任务名称：">
          <el-input
            v-model="releaseVideoForm.task_name"
            style="width: 70%"
            placeholder="请输入任务名称"
          ></el-input>
        </el-form-item>

        <el-form-item required prop="videoUrl" label="上传视频：">
          <el-upload
            class="upload-demo"
            drag
            :action="actionUrl"
            multiple
            :before-upload="videoBefore"
            accept=".mp4"
            :on-success="handleSucess"
            :on-remove="handleRemove"
            :on-change="handleChangePic"
            :on-error="handleError"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">仅支持上传单个视频</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handlerConfrim">{{
          loading ? "上传中..." : "确认并执行"
        }}</el-button>
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
    acc_id: {
      type: String,
    },
    showReleaseVideoDialog: {
      type: Boolean,
    },
  },
  data() {
    return {
      flag: new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
      ),
      loading: false,
      rules: {
        videoUrl: [
          { required: true, message: "请选择视频", trigger: "change" },
        ],
        task_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" },
        ],
      },
      BASE_URL: BASE_URL,
      releaseVideoForm: {
        text: "", //输入作品文案
        label: "", //标签
        task_name: "", //任务名称
        uid: "",
        video_url: "",
        //任务名称
      },
    };
  },
  computed: {
    actionUrl() {
      return `${BASE_URL}Base/upload`;
    },
  },
  mounted() {
    console.log(this.$parent.$data);
  },

  methods: {
handleError(error){
  console.log(error)
},
    //清楚空格
    trimAll(ele) {
      if (!typeof ele === "string") {
        return false;
      }
      return ele.split(" ").join("");
    },

    //如果有多个视频，设置视频为第一个
    handleChangePic(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      console.log(fileList);
    },

    // 视频删除
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    // 视频上传成功回调
    handleSucess(response, file, fileList) {
      //console.log(response);
      this.releaseVideoForm.video_url = response?.imageurl;
      console.log(this.releaseVideoForm.video_url);
    },
    // 校验视频大小
    videoBefore(file, fileList) {
      console.log(file.size);
      let { size } = file || {};
      if (size > 6 * 1024 * 1024) {
        this.$message.error("视频大小请不要超过6M");
        return false;
      }
    },
    handlerClose() {
      this.$emit("closeReleaseVideoDialog");
      this.resetForm();
    },

    async confrimVideo(data) {
      try {
        let result = await this.$api({ type: "confrimVideo", data });
        return result
      } catch (error) {
        console.error(error);
      }
    },

    async handlerConfrim() {
      try {
        if(this.releaseVideoForm.video_url === ""){
          this.$message.error('请选择需上传视频')
        }
        if (this.flag.test(this.releaseVideoForm.label)) {
          //snsArr=str.split(/[(\r\n)\r\n]+/);
          this.$message.error("标签中不允许包含特殊字符和空格");
          return false;
        }
        this.loading = true;
        //以换行符切成数组
        this.releaseVideoForm.uid = this.acc_id;
        this.releaseVideoForm.label = this.releaseVideoForm.label.split(/[(\r\n)\r\n]+/).map((item) => {
            return this.trimAll(item);
        }).join("\n");
        let result = await this.confrimVideo(this.releaseVideoForm);
        console.log(result);
        if (result?.status == 200) {
          this.$message.success("上传成功");
          this.resetForm();
          this.loading = false;
          return;
        }
        this.$message.error(result?.msg ?? "上传失败");

        this.loading = false;
        //this.resetForm()
        //this.handlerClose()

        console.log("提交", this.releaseVideoForm);
      } catch (error) {
        this.loading = false;
        this.$message.error;
        console.error(error);
      }
    },
    resetForm() {
      this.$refs["releaseVideoForm"].resetFields();
      this.releaseVideoForm.video_url = "",
      this.releaseVideoForm.text = "",
      this.releaseVideoForm.label = ""
    },
  },
};
</script>

<style lang="stylus" scoped>
::v-deep .el-upload-dragger {
  width: 300px;
}
</style>