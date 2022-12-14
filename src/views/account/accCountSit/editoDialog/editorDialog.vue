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
          <el-select
            clearable
            v-model="accUpdateForm.grouping_id"
            placeholder="选择分组"
          >
            <el-option
              v-for="item in groupList"
              :value="item.grouping_id"
              :label="item.grouping_name"
              :key="item.grouping_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择分类 :" prop="typecontrol_id">
          <div>
            <el-cascader
              clearable
              :props="{ checkStrictly: true, value: 'value' }"
              :options="typeList"
              v-model="accUpdateForm.typecontrol_id"
              placeholder="选择分类"
            ></el-cascader>
          </div>
        </el-form-item>

        <el-form-item label="编辑昵称 :" prop="nickname">
          <div>
            <el-input type="text" v-model="accUpdateForm.nickname"></el-input>
            <el-button class="ml-36" @click="getRendomNickname" type="primary"
              >随机获取</el-button
            >
          </div>
        </el-form-item>

        <el-form-item label="编辑签名 :" prop="signature">
          <div>
            <el-input type="text" v-model="accUpdateForm.signature"></el-input>
            <el-button class="ml-36" @click="getRendomAutograph" type="primary"
              >随机获取</el-button
            >
          </div>
        </el-form-item>

        <el-form-item class="upload-wrap" label="上传头像 ：">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
          >
            <img v-if="accUpdateForm.avatar_uri" :src="accUpdateForm.avatar_uri" class="avatar" />
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
import base from "@/config/base.config";

const { BASE_URL } = base;
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
    groupList: {
      type: Array,
    },
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
        typecontrol_id: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
      },
      showImageUrl: "",
      type_id: "",
      accUpdateForm: {
        user_id: this.user_id,
        type: "",
        nickname: "",
        signature: "",
        grouping_id: "",
        typecontrol_id: "",
        avatar_uri: "",
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
      console.log(file);
    },

    /* 
        function: handleAvatarSuccess
        params: res | 默认参数，返回值
        desc: upload成功回调
    */
    handleAvatarSuccess(res) {
      console.log(res);
      if (res.status !== '200') {
        this.$message.error(res?.msg || "未知错误");
        return false;
      }
      this.$message.success("上传成功");
      this.accUpdateForm.avatar_uri = JSON.parse(JSON.stringify(res.imageurl));
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
      console.log(this.accUpdateForm);
      let typeMap = {
        nickname: 1,
        signature: 2,
        avatar_uri: 3,
      };
      let length = this.accUpdateForm.typecontrol_id.length;
      if (length === 0) {
        this.$message.error("请选择分类");
        return false;
      }
      Object.entries(this.accUpdateForm)
        .filter((item) => {
          return (
            item[0] === "nickname" ||
            item[0] === "signature" ||
            item[0] === "avatar_uri"
          );
        })
        .forEach((item) => {
          if (item[1].length !== 0) {
            let typeData = typeMap[item[0]];
            let typeId =
              this.accUpdateForm.typecontrol_id[
                this.accUpdateForm.typecontrol_id.length - 1
              ];
            let key = item[0];
            let keyData = this.accUpdateForm[key];
            let data = Object.fromEntries([
              ["user_id", this.user_id],
              ["typecontrol_id", typeId],
              ["type", typeData],
              [key, keyData],
            ]);
            console.log(data);
            this.$api({ type: "updateUserInfo", data: data })
              .then((res) => {
                console.log(res);
                this.handlerClose();
                this.$parent.updateMemberList();
                this.$message.success("操作成功");
              })
              .catch((err) => {
                this.$message.error(err);
                return false;
              });
          }
        });
    },

    /* 
        function: getRendomInfo
        params: type | 1是随机获取昵称，2是签名，3是头像
        desc: 根据传入type随机获取所需字段
        return: 返回拿到的字段
    */
    async getRendomInfo(type) {
      try {
        let group = this.accUpdateForm.typecontrol_id;
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
      console.log(result);
      if (result?.data?.[0]?.nick_name) {
        this.accUpdateForm.nickname = result.data[0].nick_name;
        this.$message.success("获取成功");
        return true;
      }
      this.$message.error("素材库为空");
    },

    /* 
        function: getRendomAutograph
        params: null
        desc: 随机获取签名
    */
    async getRendomAutograph() {
      if (result?.data?.[0]?.signature) {
        this.accUpdateForm.signature = result.data[0].signature;
        this.$message.success("获取成功");
        let result = await this.getRendomInfo(2);
        return true;
      }
      this.$message.error("素材库为空");
    },

    /* 
        function: getRendomAvatar
        params: null
        desc: 随机获取头像
    */
    async getRendomAvatar() {
      if (result?.data?.[0]?.image) {
        this.accUpdateForm.avatar_uri = result.data[0].image;
        this.$message.success("获取成功");
        let result = await this.getRendomInfo(3);
        return true;
      }
      this.$message.error("素材库为空");
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
  width: 200px;
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