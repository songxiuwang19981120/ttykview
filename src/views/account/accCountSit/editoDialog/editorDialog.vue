<template>
  <div>
    <el-dialog
      width="30%"
      :visible="showEditorDialog"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">账号编辑</h1>
      </span>
      <el-form ref="editorForm" :rules="rules" :model="accUpdateForm">

        <el-form-item label="选择分组 :" prop="class">
           <el-select clearable v-model="accUpdateForm.classification" placeholder="选择分组">
          <el-option
            v-for="item in groupList"
            :value="item.grouping_id"
            :label="item.grouping_name"
            :key="item.grouping_id"
          ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择分类 :" prop="group">
          <div>
            <el-cascader
              clearable
              :props="{ checkStrictly: true, value: 'value' }"
              :options="typeList"
              v-model="accUpdateForm.group"
              placeholder="选择分类"
            ></el-cascader>
          </div>
        </el-form-item>

        <el-form-item label="编辑昵称 :" prop="nick_name">
          <div>
            <el-input type="text" v-model="accUpdateForm.nick_name"></el-input>
            <el-button class="ml-36" @click="getRendomNickname" type="primary"
              >随机获取</el-button
            >
          </div>
        </el-form-item>

        <el-form-item label="编辑签名 :" prop="autograph">
          <div>
            <el-input type="text" v-model="accUpdateForm.autograph"></el-input>
            <el-button class="ml-36" @click="getRendomAutograph" type="primary"
              >随机获取</el-button
            >
          </div>
        </el-form-item>

        <el-form-item class="upload-wrap" label="上传图像 ：">
          <el-upload
            ref="upload"
            drag
            class="avatar-uploader"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
          >
            <el-image
              v-if="imageUrl"
              :src="imageUrl"
              style="width: 100px; height: 100px"
              class="avatar"
              fit="fit"
            >
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button type="primary" @click="getRendomAvatar"
            >随机获取</el-button
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
import tableCustom from "@/components/myComponent/table/tableCustom";
import Pagination from "@/components/myComponent/table/pagination";

export default {
  name: "TtprojectEditorDialog",
  props: {
    showEditorDialog: {
      type: Boolean,
    },
    typeList: {
      type: Array,
    },
    user_id: {
      type: String,
    },
    groupList:{
      type:Array
    }
  },
  computed: {
    actionUrl() {
      return "http://192.168.4.30/api/Base/upload";
    },
  },
  components: { tableCustom, Pagination },
  data() {
    return {
      rules: {
        group: [{ required: true, message: "请选择分类", trigger: "change" }],
      },
      
      imageUrl: "",
      accUpdateForm: {
        group: "",
        autograph: "",
        nick_name: "",
        avatar: "",
        classification:''
      },

    };
  },

  mounted() {},

  methods: {
    /* 
        function: handleAvatarError
        params: null
        desc: upload失败回调
    */
    handleAvatarError() {
      this.$message.error("上传失败");
    },

    /* 
        function: beforeAvatarUpload
        params: null
        desc: upload之前回调
    */
    beforeAvatarUpload(file) {
      let { size, type } = file;
      let isPass = true;
      isPass = /(jpeg | png | jpg |image)/g.test(type);
      isPass = size < 500 * 1024;
      console.log(isPass);
      if (!isPass) {
        let errMsg = /(jpeg | png | jpg | image)/g.test(type)
          ? "文件不得大于5kb"
          : "请选择图片文件";
        this.$message.error(errMsg);
        this.$refs.upload[0].abort(file);
        return false;
      }
      this.imageUrl = file.name;
    },

    /* 
        function: handleAvatarSuccess
        params: res | 默认参数，返回值
        desc: upload成功回调
    */
    handleAvatarSuccess(res) {
      console.log(res);
      this.imageUrl = JSON.parse(JSON.stringify(res.data));
      this.accUpdateForm.avatar = JSON.parse(JSON.stringify(res.data));
      res.msg === "200"
        ? this.$message.success("上传成功")
        : this.$message.error(res?.msg || "未知错误");
      console.log(this.imageUrl);
    },

    /* 
        function: handlerClose
        params: null
        desc: 关闭账号编辑dialog
    */
    handlerClose() {
      this.$emit("closeEditorDialog");
      this.resetForm();
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单回调
    */
    handlerConfrim() {
      console.log("提交");
      console.log(this.accUpdateForm);
    },

    /* 
        function: getRendomInfo
        params: type | 1是随机获取昵称，2是签名，3是头像
        desc: 根据传入type随机获取所需字段
        return: 返回拿到的字段
    */
    async getRendomInfo(type) {
      try {
        let group = this.accUpdateForm.group;
        if (group.length === 0) {
          this.$message.error("请先选择分类");
          return false;
        }
        let data = {
          typecontrol_id: group[group.length - 1],
          type: type,
        };
        let result = await this.$api({ type: "getUserRandomInfo", data: data });
        
        return result;
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: getRendomNickname
        params: null
        desc: 随机获取昵称
    */
    async getRendomNickname() {
      let result = await this.getRendomInfo(1);
      if(result.data[0].nickname){
          this.accUpdateForm.nick_name = result.data[0].nickname
          this.$message.success('获取成功')
           return true
      }
          this.$message.error('素材库为空')
    },

    /* 
        function: getRendomAutograph
        params: null
        desc: 随机获取签名
    */
    async getRendomAutograph() {
      let result = await this.getRendomInfo(1);
      if(result.data[0].autograph){
        this.accUpdateForm.autograph = result.data[0].autograph
        this.$message.success('获取成功')
         return true
      }
      this.$message.error('素材库为空')
    },

    /* 
        function: getRendomAvatar
        params: null
        desc: 随机获取头像
    */
    async getRendomAvatar() {
      let result = await this.getRendomInfo(2);
      if(result.data[0].image){
        
        this.accUpdateForm.autograph = result.data[0].image
        this.$message.success('获取成功')
        return true
      }

      this.$message.error('素材库为空')
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单
    */
    resetForm() {
      this.$refs["editorForm"].resetFields();
    },
  },
};
</script>

<style lang="stylus" scoped>
.avatar-uploader .el-upload-dragger {
  width: 200px !important;
}

.avatar-uploader .el-upload {
  width: 200px !important;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>