<template>
  <div>
    <el-dialog width="20%" :visible="showBatchEiDialog" :before-close="handlerClose">
      <span slot="title">
        <h1 class="tt-acccountsit--title">批量编辑</h1>
      </span>


<el-form :model="batchEiatorForm">
  <el-form-item label="设置分组">
           
    
        <el-select clearable v-model="batchEiatorForm.group" placeholder="选择分组">
          <el-option
            v-for="item in groupList"
            :value="item.grouping_id"
            :label="item.grouping_name"
            :key="item.grouping_id"
          ></el-option>
        </el-select>
      
  </el-form-item>

<el-form-item label="设置分类">
      
        <el-cascader
          clearable
          :props="{ checkStrictly: true, value: 'value' }"
          :options="typeList"
          v-model="batchEiatorForm.classiFication"
          placeholder="选择分类"
        ></el-cascader>
      
</el-form-item>

</el-form>
      <p>
        目前可用素材: 1285套
      </p>

      <p>
        此次共编辑: {{this.total}}个账号
      </p>


      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectBatchEditorDialog",
    props:{
      showBatchEiDialog:{
        type:Boolean
      },
      check_all:{
        type:Boolean
      },
       groupList:{
      type:Array
    },
        typeList: {
      type: Array,
    },
    batchEditorLength:{
      type:Number
    },
    accTotal:{
      type:Number
    }
        
    },
    computed:{
      total(){
        return this?.total || this?.batchEditorLength
      }
    },
  data() {
    return {
      batchEiatorForm:{
        group:'',
        classiFication:[]
      }
    };
  },

  mounted() {},

  methods: {
    handlerClose(){
        this.$emit('closeBatchEidialog')
    },
    handlerConfrim(){
        console.log(this.batchEiatorForm)
    }
  },
};
</script>

<style lang="stylus" scoped></style>