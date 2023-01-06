<template>
  <div>
    <el-dialog
      width="40%"
      :visible="showBatchEditor"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">批量编辑账号</h1>
        <p>此次共编辑{{ editorTota }}个账号</p>
      </span>

      <el-form
        :rules="rules"
        label-position="left"
        label-width="170px"
        ref="editorForm"
        :model="eidtorForm"
      >
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
          <el-checkbox v-model="modifyGroup"></el-checkbox>
        </el-form-item>

        <el-form-item label="修改分类 ：" prop="typeId">
          <el-cascader
            class="mr-15"
            size="medium"
            :disabled="isTypeDis"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="typeId"
            placeholder="设置分类"
          ></el-cascader>

          <el-checkbox v-model="modifyType"></el-checkbox>
        </el-form-item>
        <el-form-item label="修改昵称 ：">
          <p style="width: 42%">当前可用12222个</p>
          <el-checkbox v-model="eidtorForm.modify_nickname"></el-checkbox>
        </el-form-item>
        <el-form-item label="修改个人简介 ：">
          <p style="width: 42%">当前可用12222个</p>
          <el-checkbox v-model="eidtorForm.modify_userdesc"></el-checkbox>
        </el-form-item>
        <el-form-item label="修改头像 ：">
          <p style="width: 42%">当前可用1222个</p>
          <el-checkbox v-model="eidtorForm.modify_avatar"></el-checkbox>
        </el-form-item>
        <el-form-item label="选择当前分类所有账号 ：">
          <el-checkbox v-model="eidtorForm.check_all"></el-checkbox>
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
      type: Boolean,
    },
    member_ids: {
      type: String,
    },
    editorTota: {
      type: Number,
    },
  },
  computed: {
    isGroupDis() {
      return !(this.modifyGroup === true);
    },
    isTypeDis() {
      return !(this.modifyType === true);
    },
  },
  watch: {},

  data() {
    return {
      rules: BatchEditor,
      modifyType: "",
      modifyGroup: "",
      typeList: [],
      groupList: [],
      groupId: "",
      typeId: "",
      eidtorForm: {
        grouping_id: "",
        typecontrol_id: "",
        member_ids: "",
        modify_nickname: "",
        modify_userdesc: "",
        modify_avatar: "",
        check_all: "",
      },
    };
  },
  watch: {},
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
      this.$parent.closeBatchEditor();
    },
    async handlerConfrim() {
      this.eidtorForm.member_ids = this.member_ids
      this.eidtorForm.grouping_id = this.groupId
      this.eidtorForm.typecontrol_id = this.typeId[this.typeId.length - 1]
      console.log(this.eidtorForm);
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