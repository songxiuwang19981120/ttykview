<template>
  <div>
    <el-dialog
      width="20%"
      :visible="showBatchEiDialog"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">批量编辑</h1>
      </span>
        <h2>当前分组为：{{this.groupString}}</h2>
      <el-form :model="batchEiatorForm">
<!--         <el-form-item label="设备分组">
          <el-select
            clearable
            v-model="batchEiatorForm.group"
            placeholder="选择分组"
          >
            <el-option
              v-for="item in groupList"
              :value="item.grouping_id"
              :label="item.grouping_name"
              :key="item.grouping_id"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="账号分类">
          <el-cascader
            clearable
            @change="setProjectNum"
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="batchEiatorForm.typecontrol_id"
            placeholder="选择分类"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <p>目前可用素材: {{ this.materialTotal }}套</p>
      <p>此次共编辑: {{ this.editorTotal }}个账号</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectBatchEditorDialog",
  props: {
    showBatchEiDialog: {
      type: Boolean,
    },
    check_all: {
      type: Boolean,
    },
    groupList: {
      type: Array,
    },
    typeList: {
      type: Array,
    },
    batchEditorLength: {
      type: Number,
    },
    accTotal: {
      type: Number,
    },
    batchEditorList: {
      type: Array,
    },
    materialTotal: {
      type: Number,
    },
    group:{
      type:String
    },
    groupString:{
      type:String
    },
    typecontrol_id:{
      type:Number
    }
  },
  watch:{
    batchEiatorForm(newVal){
      console.log(newVal)
    }
  },
  computed: {
    editorTotal() {
      return this?.accTotal || this?.batchEditorLength;
    },
    memberIdList(){
      return this.batchEditorList.map(item=>{
        return item.member_id
      })
    }
  },
  data() {
    return {
      batchEiatorForm: {
        group: "",
        typecontrol_id: [],
        eidtorList: "",
        member_id:this.memberIdList
      },
    };
  },

  mounted() {},

  methods: {
    handlerClose() {
      this.$emit("closeBatchEidialog");
    },
    async setProjectNum(){
      let data = {
        typecontrol_id: this.batchEiatorForm.typecontrol_id[this.batchEiatorForm.typecontrol_id.length - 1] ?? ''
      }
      let result = await this.$api({type:'getProjectNum',data:data})
      this.$emit('updateProjectNum',this.batchEiatorForm.typecontrol_id[this.batchEiatorForm.typecontrol_id.length - 1])
      console.log(result)
    },
    async handlerConfrim() {
      if (this.editorTotal > this.materialTotal) {
        this.$message.error("素材不够用啦");
        return false;
      }
      let userList = this.batchEditorList.map((item) => {
        return item.uid;
      });
      let updateData = {
        member_id: this.memberIdList.toString(),
        typecontrol_id: this.batchEiatorForm.typecontrol_id[this.batchEiatorForm.typecontrol_id.length - 1] ?? this.typecontrol_id,
        
      }
      console.log(updateData)
      this.batchEiatorForm.eidtorList = userList;
      let result = await this.$api({type:'updateUserDate',data:updateData})
      console.log(result);
    },
  },
};
</script>

<style lang="stylus" scoped>
</style>