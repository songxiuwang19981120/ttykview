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
        <el-form-item class="ml-8" label="选择分组 :" prop="class">
          <el-select
            style="width: 42%"
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
          <el-cascader
            style="width: 42%"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="accUpdateForm.typecontrol_id"
            placeholder="选择分类"
          ></el-cascader>
        </el-form-item>

        <el-form-item class="ml-8" label="编辑昵称 :" prop="nickname">
          <el-input
            style="width: 42%"
            type="text"
            v-model="accUpdateForm.nickname"
          ></el-input>
          <el-button class="ml-8" @click="getRendomNickname" type="primary"
            >随机获取</el-button
          >
        </el-form-item>

        <el-form-item class="ml-8" label="编辑签名 :" prop="signature">
          <el-input
            style="width: 42%"
            type="text"
            v-model="accUpdateForm.signature"
          ></el-input>
          <el-button class="ml-8" @click="getRendomAutograph" type="primary"
            >随机获取</el-button
          >
 
        </el-form-item>

        <el-form-item class="upload-wrap ml-8" label="上传头像 :">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="actionUrl"
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
              @click="getRendomAvatar"
              >随机获取</el-button
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
      return `${BASE_URL}Base/upload`;
    },
  },
  components: { tableCustom, Pagination },
  watch:{
/*     'accUpdateForm.nickname':{
      handler(newval){
        console.log('nickname=======',newval)
        this.destroyInfo.nickname_id = ''
      }
    },
    'accUpdateForm.signature':{
      handler(newval){
        console.log('signature=======',newval)
        this.destroyInfo.autograph_id = ''
      }
    },
    'accUpdateForm.avatar_uri':{
      handler(newval){
        console.log('avatar_uri=======',newval)
        this.destroyInfo.headimage_id = ''
      }
    }, */
  },
  data() {
    return {
      BASE_URL: BASE_URL, //图片BASE地址
      rules: editorDialog, //表单校验规则  详见formRules文件
      submitting: false,
      grouping_id:'', //分组ID
      typecontrol_id:'', //分类ID
      type_id: "",
      accUpdateForm: {
        //更新数据的表单
        nickname:'',
        signature: "",
        avatar_uri: "",
        typecontrol_id:'',
      },
      destroyInfo: {
        //编辑时随机获取的信息
        nickname_id: "",
        autograph_id: "",
        headimage_id: "",
      },

      userTypeMap:{
        'nickname' : '1',
        'signature':'2',
        'avatar_uri':'3'
      },
    };
  },

  mounted() {
    //this.accUpdateForm.user_id = this.user_id
  },

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
        params: file | 默认参数
        desc: upload之前回调，判断文件是否符合规则
    */
    beforeAvatarUpload(file) {
      let { size, type } = file;
      let isPass = true;
      isPass = /(jpeg | png | jpg |image)/g.test(type);
      isPass = size < 500 * 1024;
      if (!isPass) {
        let errMsg = /(jpeg | png | jpg | image)/g.test(type)
          ? "文件不得大于5kb"
          : "请选择图片文件";
        this.$message.error(errMsg);
        this.$refs.upload[0].abort(file);
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
    },

    /* 
        function: destroyUserInfo
        params: null
        desc: 依次销毁用户信息，用于提交表单之后 
    */


    async updateInfo(data = {}){
        try {
        console.log(data)
        let arrData = Object.entries(data)
        console.log(arrData)
        Promise.all(arrData.forEach(item=> {
          let type = this.userTypeMap[item[0]]
          let key = item[0]
          let info = item[1]
          let user_id = this.user_id
          let data = Object.fromEntries([['type',type],[key,info],['user_id',user_id]])
          console.log(data)
          this.reqInfo(data)
        }))

        } catch (error) {
          console.error(error)          
        }

    },

    async reqInfo(data = {}){
      await this.$api({type:'updateUserInfo',data:data})
    },

    async delInfo(data=this.destroyInfo){
      await this.$api({type:'destroyedUserInfo',data:data})
    },
    

    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单回调 
    */
    handlerConfrim() {
     
      let typecontrol_id = this.accUpdateForm.typecontrol_id[this.accUpdateForm.typecontrol_id.length - 1]
      let destroyInfo = Object.entries(this.destroyInfo).filter(item=>{
        return item[1] !== '' 
      })
      let accUpdateForm =Object.entries(this.accUpdateForm).filter(item=>{
        return item[1] !== '' && item[0] !== 'typecontrol_id'
      })
      let memberInfo = {grouping_id:this.grouping_id,typecontrol_id:typecontrol_id}
      console.log(typecontrol_id,destroyInfo,accUpdateForm,memberInfo)
      Promise.all(
        this.updateInfo(Object.fromEntries(accUpdateForm)),
        this.delInfo(Object.fromEntries(destroyInfo)),
        this.$api({type:'setMemberId',data:memberInfo})
      ).then(()=>{
        this.$message.success('编辑成功')
      }).catch(()=>{
        this.$message.error('编辑失败')
      })

    },

    /* 
        function: getRendomInfo
        params: type | 1是随机获取昵称，2是签名，3是头像
        desc: 根据传入type随机获取所需字段
        return: 返回拿到的字段
    */
    async getRendomInfo(type) {
      try {
        let typeId = this.accUpdateForm.typecontrol_id
        if (typeId.length === 0) {
          this.$message.error("请先选择分类");
          return false;
        }
        let data = {
          typecontrol_id: typeId[typeId.length - 1],
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
      if (result?.data?.[0]?.nickname) {
        this.accUpdateForm.nickname = result.data?.[0]?.nickname;
        this.$message.success("获取成功");
        this.destroyInfo.nickname_id = result.data?.[0]?.nickname_id;
        console.log(result.data?.[0]?.nickname_id)
        return;
      }
      this.$message.error("素材库为空");
    },

    /* 
        function: getRendomAutograph
        params: null
        desc: 随机获取签名
    */
    async getRendomAutograph() {
      let result = await this.getRendomInfo(2);
      if (result?.data?.[0]?.autograph) {
        this.accUpdateForm.signature = result.data?.[0]?.autograph;
        this.$message.success("获取成功");
        this.destroyInfo.autograph_id = result.data?.[0]?.autograph_id;
        return;
      }
      this.$message.error(result.msg ?? "素材库为空");
    },

    /* 
        function: getRendomAvatar
        params: null
        desc: 随机获取头像
    */
    async getRendomAvatar() {
      let result = await this.getRendomInfo(3);
      if (result?.data?.[0]?.image) {
        this.disAvatarBtn = false
        this.accUpdateForm.avatar_uri = result.data?.[0]?.image;
        this.$message.success("获取成功");
        this.destroyInfo.headimage_id = result.data?.[0]?.headimage_id;
        return;
      }
      this.$message.error(result.msg ?? "素材库为空");
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
  border: 1px dashed #d9d9d9;
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
</style>