<template>
  <div>
    <el-dialog
      width="45%"
      :visible="showEditorDialog"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">账号编辑</h1>
      </span>
      <el-form ref="editorForm" :rules="rules" :model="accUpdateForm">
        <el-form-item label="选择分组 :" prop="grouping_id">
          <el-select
            style="width: 60%"
            clearable
            v-model="accUpdateForm.grouping_id"
            :placeholder="groupTitle"
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
          <el-cascader
            class="typeid-cascader"
            style="width: 60%"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="accUpdateForm.typecontrol_id"
            :placeholder="typeTitle"
            @change="updateType"
          ></el-cascader>
        </el-form-item>

        <el-form-item class="ml-8" label="编辑昵称 :" prop="nickname">
          <el-input
            style="width: 60%"
            type="text"
            v-model="accUpdateForm.nickname"
          ></el-input>
          <el-button
            class="ml-8"
            @click="
              getRandom({
                loading: 'nickNameLoading',
                type: '1',
                accParams: 'nickname',
                desParams: 'nickname_id',
                resAccParams: 'nickname',
                resDesParams: 'nickname_id',
              })
            "
            :loading="nickNameLoading"
            type="primary"
            >{{ this.nickNameLoading ? "获取中..." : "随机获取" }}</el-button
          >
        </el-form-item>

        <el-form-item class="ml-8" label="编辑签名 :" prop="signature">
          <el-input
            style="width: 60%"
            type="textarea"
            v-model="accUpdateForm.signature"
          ></el-input>
          <el-button
            class="ml-8"
            :loading="signatureLoading"
            @click="
              getRandom({
                loading: 'signatureLoading',
                type: '2',
                accParams: 'signature',
                desParams: 'autograph_id',
                resAccParams: 'autograph',
                resDesParams: 'autograph_id',
              })
            "
            type="primary"
            >{{ this.signatureLoading ? "获取中..." : "随机获取" }}</el-button
          >
        </el-form-item>

        <el-form-item class="upload-wrap ml-8" label="上传头像 :">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="`${BASE_URL}Base/upload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
          >
            <img
              v-if="accUpdateForm.avatar_uri"
              :src="accUpdateForm.avatar_uri"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div>
            <el-button           
              class="avatar-random--btn ml-52"
              type="primary"
              @click="
                getRandom({
                  loading: 'avatarLoading',
                  type: '3',
                  accParams: 'avatar_uri',
                  desParams: 'headimage_id',
                  resAccParams: 'image',
                  resDesParams: 'headimage_id',
                })
              "
              :loading="avatarLoading"
              >{{ this.avatarLoading ? "获取中..." : "随机获取" }}</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button
          type="primary"
          @click="handlerConfrim"
          :loading="submitting"
          >{{ submitting ? "提交中 ..." : "确 定" }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom";
import Pagination from "@/components/myComponent/table/pagination";
import base from "@/config/base.config";
import formRule from "@/config/accountConfig/formRules.config";
const { editorDialog } = formRule;
const { BASE_URL } = base;
export default {
  name: "TtprojectEditorDialog",
  props: {
    showEditorDialog: {
      type: Boolean,
    },
    accInfo:{
      type:Object
    },
    user_id: {
      type: String,
    },
    page:{
      type:Number
    },
    limit:{
      type:Number
    }
  },

  watch: {
    "accUpdateForm.grouping_id": {
      async handler(newVal) {
        if (this.accUpdateForm.grouping_id === "") {
          this.typeList = [];
          this.accUpdateForm.typecontrol_id = "";
          return false;
        }

        let searchTypeData = {
          grouping_id: this.accUpdateForm.grouping_id,
        };
        let result = await this.$api({
          type: "getTypecontrol",
          data: searchTypeData,
        });
        this.typeList = this.getTreeData(result.data);
      },
    },
  },

  computed: {
    actionUrl() {
      return `${BASE_URL}Base/upload`;
    },
  },
  components: { tableCustom, Pagination },

  data() {
    return {
      BASE_URL: BASE_URL, //图片BASE地址
      rules: editorDialog, //表单校验规则  详见formRules文件
      submitting: false,
      avatarLoading: false,
      nickNameLoading: false,
      signatureLoading: false,
      groupList: [],
      typeList: [],
      grouping_id: "", //分组ID
      typecontrol_id: "", //分类ID
      accUpdateForm: {
        //更新数据的表单
        nickname: "",
        signature: "",
        avatar_uri: "",
        typecontrol_id: this.$parent.$data.accInfo.typecontrol_id,
        grouping_id: this.$parent.$data.accInfo.grouping_id,
      },
      destroyInfo: {
        //编辑时随机获取的信息
        nickname_id: "",
        autograph_id: "",
        headimage_id: "",
      },
      userTypeMap: {
        nickname: "1",
        signature: "2",
        avatar_uri: "3",
      },
    };
  },

  mounted() {
    this.getGroupList();
  },
  computed:{
    groupTitle(){
      return this.$parent.$data?.accInfo?.grouping_name || '暂无分组'
    },
    typeTitle(){
      return this.$parent.$data?.accInfo?.type_title || '暂无分类'
    }
  },
  methods: {

    updateType(){
      this.$forceUpdate()
    },

    /*
            function: getTreeData
            params: data | 需要进行递归处理的数组
            desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
            return: 处理后的数据
        */
    getTreeData(data) {
      if (!data) {
        return false;
      }
      data.forEach((item) => {
        if (!item.children.length) {
          item.children = undefined;
        } else {
          this.getTreeData(item.children);
        }
      });
      return data;
    },

    async initTypeList(){
      try {
        let searchTypeData = {
          grouping_id: this.accInfo.grouping_id,
        };
        let result = await this.$api({
          type: "getTypecontrol",
          data: searchTypeData,
        });
        this.typeList = this.getTreeData(result.data);
      } catch (error) {
        console.error(error);
      }

    },

    async getGroupList() {
      try {
        let result = await this.$api({ type: "getGrouping" });
        this.groupList = result.data.list;
        this.initTypeList()
      } catch (error) {
        console.error(error);
      }

    },

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
        params: file | 默认参数
        desc: upload之前回调，判断文件是否符合规则
    */
    beforeAvatarUpload(file) {
      console.log(file);
      let { size, type } = file;
      let isPass = true;
      isPass = /(jpeg | png | jpg |image)/g.test(type);
      isPass = size < 500 * 1024;
      if (!isPass) {
        let errMsg = /(jpeg | png | jpg | image)/g.test(type)
          ? "文件不得大于5kb"
          : "请选择图片文件";
        this.$message.error(errMsg);
        this.$refs.upload[0]?.abort(file);
        return false;
      }
    },

    /* 
        function: handleAvatarSuccess
        params: res | 默认参数，返回值
        desc: upload成功回调
    */
    handleAvatarSuccess(res) {
      if (res.status !== "200") {
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
      this.grouping_id = "";
      this.accUpdateForm.avatar_uri = ""
    },

    /* 
        function: updateInfo
        params: data | 表单数据
        desc: 更新用户数据 
    */
    async updateInfo(data = {}) {
      try {
        await Promise.all(
          Object.entries(data).map((item) => {
            let type = this.userTypeMap[item[0]];
            let key = item[0];
            let info = item[1];
            let user_id = this.user_id;
            let data = Object.fromEntries([
              ["type", type],
              [key, info],
              ["user_id", user_id],
            ]);
            this.reqInfo(data);
          })
        );
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: resetDestroyInfo
        params: nu;;
        desc: 重置需要摧毁素材数据
    */
    resetDestroyInfo() {
      this.destroyInfo = {
        nickname_id: "",
        autograph_id: "",
        headimage_id: "",
      };
    },

    /* 
        function: reqInfo
        params: data | 请求API时的参数，默认为{}
        desc: 更新用户信息的静态方法 
    */
    async reqInfo(data = {}) {
      try {
        await this.$api({ type: "updateUserInfo", data: data });
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: delInfo
        params: data | 请求API时的参数，默认为destroyInfo
        desc: 销毁素材库对应素材的静态方法 
    */
    async delInfo(data = this.destroyInfo) {
      try {
        await this.$api({ type: "destroyedUserInfo", data: data });
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单回调 
    */
    async handlerConfrim() {
      try {
        let typecontrol_id =
          this.accUpdateForm.typecontrol_id[
            this.accUpdateForm.typecontrol_id.length - 1
          ];
        let destroyInfo = Object.entries(this.destroyInfo).filter((item) => {
          return item[1] !== "";
        });
        let accUpdateForm = Object.entries(this.accUpdateForm).filter((item) => {
          return (
            item[1] !== "" && item[0] !== "typecontrol_id" && item[0] !== "grouping_id"
          );
        });
        let memberInfo = {
          user_id: this.user_id,
          grouping_id: this.accUpdateForm.grouping_id,
          typecontrol_id: typecontrol_id
        };
        await this.updateInfo(Object.fromEntries(accUpdateForm)),
        await this.delInfo(Object.fromEntries(destroyInfo)),
        await this.$api({ type: "setMemberId", data: memberInfo });
        this.$message.success("操作成功");
        this.handlerClose();
        this.resetDestroyInfo();
        this.accUpdateForm.avatar_uri = ""; 
        this.$parent.updateMemberList({a:1});
      } catch (error) {
        this.$message.error("提交失败");
      }
    },

    /* 
        function: getRandom
        params: {loading,type,accParams,desParams,resAccParams,resDesParams}
                *loading | 相应button的loading                        默认为空
                *type | random类型，1为昵称，2为签名，3为头像           默认为空
                *accparams | accUpdateForm键名                        默认为空
                *desParams | destroyInfo键名                          默认为空
                *resAccParams | 返回值，对应accUpdateForm键名          默认为空
                *resDesParams | 返回值，对应accUpdateForm键名          默认为空
        desc: 随机获取素材 
    */
    async getRandom({
      loading = "",
      type = "",
      accParams = "",
      desParams = "",
      resAccParams = "",
      resDesParams = "",
    }) {
      try {
        this[loading] = true;
        let typeId = this.accUpdateForm.typecontrol_id || this.$parent.accInfo.typecontrol_id;
        console.log(typeId);
        if (typeId.length === 0) {
          this.$message.error("请先选择分类");
          this[loading] = false;
          return false;
        }
        let data = {
          typecontrol_id: typeId,
          type: type,
        };
        let result = await this.$api({ type: "getUserRandomInfo", data });
        if (result.data?.[0]?.[resAccParams]) {
          this.accUpdateForm[accParams] = result.data[0]?.[resAccParams];
          this.destroyInfo[desParams] = result.data[0]?.[resDesParams];
          this.$message.success("获取成功");
          this[loading] = false;
          return;
        }
        this.$message.error(result.msg ?? "获取失败");
        this[loading] = false;
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单
    */
    resetForm() {
      this.$refs["editorForm"].resetFields();
      this.accUpdateForm.grouping_id = "";
    },
  },
};
</script>

<style lang="stylus" scoped>
.tt-acccountsit--title {
  margin-bottom: 20px;
  font-size: 20px;
}

.upload-wrap {
  position: relative;
  display: flex;
  align-items: center;

  .el-form-item__content {
    display: flex !important;
  }
}

.avatar-uploader {
  border-radius: 50%;
  border: 1px dashed #d9d9d9;

  img {
    border-radius: 50%;
  }
}

.avatar-uploader .el-upload {
  width: 200px;
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-random--btn {
  position: absolute;
  left: 182px;
  bottom: 70px;
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

.ml-8 {
  margin-left: 10px !important;
}

.ml-52 {
  margin-left: 52px;
}

/* ::v-deep .el-cascader .el-input__inner::placeholder{
  color: #606266
} */
</style>