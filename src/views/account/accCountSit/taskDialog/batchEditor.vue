<template>
  <div>
    <el-dialog
      width="40%"
      :visible="showBatchEditor"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">批量编辑账号</h1>
        <p>此次共编辑{{ accTotal }}个账号</p>
      </span>

      <el-form
        label-position="left"
        label-width="170px"
        ref="editorForm"
        :model="eidtorForm"
      >
        <el-form-item label="选择账号 ：">
          <el-select
            clearable
            size="medium"
            v-model="checkAcc"
            :placeholder="checkAccText"
          >
            <el-option
              v-for="item in checkAccList"
              :value="item.value"
              :label="item.label"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="修改分组 ：" prop="groupId">
          <el-select
            class="mr-15"
            :disabled="isGroupDis"
            size="medium"
            ref="gropuSelect"
            clearable
            v-model="groupId"
            placeholder="设置分组"
            @change="groupChange"
          >
            <el-option
              v-for="item in groupList"
              :value="item.grouping_id"
              :label="item.grouping_name"
              :key="item.grouping_id"
            ></el-option>
          </el-select>
          <el-checkbox v-model="modifyGroup" @change="handleChangeGroup"></el-checkbox>
        </el-form-item>

        <el-form-item label="修改分类 ：" prop="typeId">
          <el-cascader
            class="mr-15"
            size="medium"
            :disabled="isGroupDis"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="typeId"
            placeholder="设置分类"
          ></el-cascader>

         <!--  <el-checkbox :disabled="ischeckTypeDis" v-model="modifyType"></el-checkbox> -->
        </el-form-item>

        <el-form-item label="修改昵称 ：">
          <p style="width: 42%">当前可用{{nicknameCanUseNum ?? 0}}个</p>
          <el-checkbox v-model="nickname"></el-checkbox>
        </el-form-item>
        <el-form-item label="修改个人简介 ：">
          <p style="width: 42%">当前可用{{autographCanUseNum ?? 0}}个</p>
          <el-checkbox v-model="signature"></el-checkbox>
        </el-form-item>
        <el-form-item label="修改头像 ：">
          <p style="width: 42%">当前可用{{headimageCanUseNum ?? 0}}个</p>
          <el-checkbox v-model="avatar_thumb"></el-checkbox>
        </el-form-item>
<!--         <el-form-item label="选择当前分类所有账号 ：">
          <el-checkbox v-model="eidtorForm.check_all"></el-checkbox>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确认并执行</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MINXIN from "@/core/minxin";
import formRule from "@/config/accountConfig/formRules.config";

import GroupSelect from "@/components/base/baseSelect/GroupSelect";
import TypeSelect from "@/components/base/baseSelect/TypeSelect";

const {BatchEditor} = formRule
export default {
  name: "TtprojectBatchEditor",
  mixins: [MINXIN],
  components: { GroupSelect, TypeSelect },
  props: {
    showBatchEditor: {
      type: Boolean
    },
    member_ids: {
      type: String
    },
    editorTota: {
      type: Number
    },
    typecontrol_id:{
      type: Array
    },
    grouping_id:{
      type: String
    },
    nicknameCanUseNum:{
      type:Number
    },
    autographCanUseNum:{
      type:Number
    },
    headimageCanUseNum:{
      type:Number
    },
    uidList:{
      type:Array
    }
  },
  computed: {
    accTotal(){
      return this.checkAcc === 'all' ? this.checkAccTotal : this.editorTota
    },
    checkAccText(){
      return `当前已选中${this.editorTota}个账号`
    },
    ischeckTypeDis(){
      return !(this.modifyGroup === true)
    },
    isGroupDis() {
      return !(this.modifyGroup === true);
    },
    isTypeDis() {
      return !(this.modifyType === true && this.modifyGroup === true);
    },
  },
  watch: {
    async checkAcc(newVal){
      if(newVal === 'all'){
        let data = {
          typecontrol_id: this.typecontrol_id[this.typecontrol_id.length - 1],
          grouping_id: this.grouping_id
        }
        let result = await this.$api({
          type: "getMember",
          data,
        })
        this.checkAccTotal = result?.data?.count || 0
      }
    },
    async typeId(newVal){
      try {
        if(newVal.length === 0){
          return false
        }
        this.type_list.push('typecontrol_id')
        let data = {
          grouping_id :this.groupId,
          typecontrol_id: this.typeId[this.typeId.length - 1]
        }
        await this.$parent.getProjectNum(data)
      } catch (error) {
        console.error(error);
      }
    },

    groupId(newVal){
      if(newVal !== ''){
        this.type_list.push('grouping_id')
      }
    },

    nickname(newVal){
      if(newVal === true){
        this.type_list.push('nickname')
      }
    },
        avatar_thumb(newVal){
      if(newVal === true){
        this.type_list.push('avatar_thumb')
      }
    },
        signature(newVal){
      if(newVal === true){
        this.type_list.push('signature')
      }
    }
  },

  data() {
    return {
      checkAccTotal:'',
      checkAcc:'',
      rules: BatchEditor,
      modifyType: "",
      modifyGroup: "",
      typeList: [],
      groupList: [],
      checkAccList:[
        {
          value:'all',
          label:'当前分组、分类所有账号'
        }
      ],
      groupId: "",
      typeId: [],
      nickname:false,
      avatar_thumb:false,
      signature:false,
      eidtorForm: {
        grouping_id: "",
        typecontrol_id: "",
        member_ids: "",
        modify_nickname: "",
        modify_userdesc: "",
        modify_avatar: "",
        check_all: "",
      },
      type_list:[],
    };
  },
  mounted() {
    this.getGroupList();
    /*  this.getGroupList(); */
    /* this.getTypeControlList(); */
  },
  destroyed() {
    this.groupId = "";
    this.typeId = "";
    this.typeList = [];
    this.groupList = [];
  },
  
  methods: {

    resetForm() {
      this.$refs["editorForm"].resetFields();

    },

    resetAccTotal(){
      this.$emit('resetAccTotal')
    },

    handleChangeGroup(){
      console.log(11111,this.modifyGroup);
      if(this.modifyGroup === false){
        this.modifyType = false
        console.log(this.modifyType);
      }
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

    async groupChange() {
      if (this.groupId === "") {
        this.typeList = [];
        this.groupId = "";
        return false;
      }
      let searchTypeData = {
        grouping_id: this.groupId,
      };
      let result = await this.$api({
        type: "getTypecontrol",
        data: searchTypeData,
      });
      this.typeList = this.getTreeData(result.data);
    },

    /* 
        function: getGroupList
        params: null
        desc: 获取分组  异步
    */
    async getGroupList() {
      let result = await this.$api({ type: "getGrouping" });
      console.log(result);
      this.groupList = result.data.list;
    },

    async handleChange(e) {
      this.eidtorForm.grouping_id = e;
      let searchTypeData = {
        grouping_id: this.eidtorForm.grouping_id,
      };
      let result = await this.$api({
        type: "getTypecontrol",
        data: searchTypeData,
      });
      this.typeList = this.getTreeData(result.data);
    },

    handleTypeChange(e) {
      console.log(e);
      this.eidtorForm.typecontrol_id = e;
      console.log(this.eidtorForm.typecontrol_id);
    },

    /*
        function: getTypeControlList
        params: null
        desc: 异步获取TypeControlList，页面渲染时调用
    */
    async getTypeControlList() {
      try {
        let result = await this.$api({ type: "getTypecontrol" });
        this.typeList = this.getTreeData(result.data);
      } catch (error) {
        console.error(error);
      }
    },
    handlerClose() {
      this.resetForm()
      this.groupId = ''
      this.typeId = []
      this.nickname = false
      this.avatar_thumb = false
      this.signature = false
      this.modifyGroup = false
      this.checkAcc = ""
      this.type_list = []
      this.$parent.closeBatchEditor();
    },

    /*
        function: getTypeControlList
        params: null
        desc: 表单提交回调
    */
    async handlerConfrim() {
      try {
      let old_typecontrol_id = this.checkAcc === 'all' ? this.typecontrol_id[this.typecontrol_id.length - 1] : ''
      let old_grouping_id =  this.checkAcc === 'all' ? this.grouping_id : ''
      let typecontrol_id =  (this.typeId[this.typeId.length - 1] ?? '') 
      let grouping_id =  this.groupId 
      let uid_list = this.checkAcc === 'all' ? [] : this.uidList
      let data = {
        uid_list: uid_list,
        old_typecontrol_id: old_typecontrol_id ?? '',
        old_grouping_id: old_grouping_id ?? '',
        typecontrol_id: typecontrol_id,
        grouping_id: grouping_id,
        //nickname: this.nickname === false ? '' : 1,
        //avatar_thumb: this.avatar_thumb === false ? '' : 1,
        //signature: this.signature === false ? '' : 1,
        type_list: this.type_list
      }
      console.log(data,1111111111111111111111111111111111);
      if(this.nickname === true && this.nicknameCanUseNum < this.accTotal){
        this.$message.warning('昵称素材不足，请前往素材库添加')
        return false
      }
      if(this.signature === true && this.autographCanUseNum < this.accTotal){
        this.$message.warning('个人简介素材不足，请前往素材库添加')
        return false
      }
      if(this.avatar_thumb === true && this.headimageCanUseNum < this.accTotal){
        this.$message.warning('头像素材不足，请前往素材库添加')
        return false
      }
       let result = await this.$api({type:'batchEditorAcc',data})
      if(result?.status == 200){
        this.$message.success('操作成功')
        this.handlerClose();
        this.$parent.getMemberList()
        this.resetForm();
        return
      }
      this.$message.error(result.msg ?? "操作失败"); 
      this.handlerClose();
      this.resetForm();
      } catch (error) {
        this.$message.error('操作失败')
        console.error(error);
      }

      
/*       try {
        let typeId = this.eidtorForm.typecontrol_id;
        this.eidtorForm.typecontrol_id = this.formatTypeId(typeId);
        this.eidtorForm.member_id = this.member_ids;
        let result = await this.$api({
          type: "updateUserType",
          data: this.eidtorForm,
        });
        if (result.status == 200) {
          this.$message.success("操作成功");
          this.handlerClose();
          this.resetForm();
          this.$parent.updateMemberList();
          return;
        }
        this.$message.error(result.msg ?? "操作失败");
        console.log(result);
      } catch (error) {
        console.error(error);
      } */
    },
    /* 
        function: getGroupList
        params: null
        desc: 获取分组  异步
    */
    async getGroupList() {
      let result = await this.$api({ type: "getGrouping" });
      console.log(result);
      this.groupList = result.data.list;
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm() {
      this.eidtorForm = {
        grouping_id: "",
        typecontrol_id: "",
        member_id: "",
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
.mr-15 {
  margin-right: 15px;
}

.tt-acccountsit--title {
  margin-bottom: 20px;
  font-size: 20px;
}

/* hark */
::v-deep .el-form-item__content {
  display: flex;
}
</style>