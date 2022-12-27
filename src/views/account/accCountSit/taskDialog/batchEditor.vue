<template>
    <div>
        <el-dialog
        width="40%"
        :visible="showBatchEditor"
        :before-close="handlerClose"
        >
        <span>此次共编辑{{editorTota}}个账号</span>
            <el-form ref="editorForm" :model="eidtorForm">
                <el-form-item label="选择分组">
            <el-select
            style="width: 45%"
            ref="gropuSelect"
            clearable
            v-model="eidtorForm.grouping_id"
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

                <el-form-item label="选择分类">
                              <el-cascader
            style="width: 45%"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="eidtorForm.typecontrol_id"

          ></el-cascader>
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
export default {
    name: 'TtprojectBatchEditor',
    props:{
        showBatchEditor:{
            type:Boolean
        },
        member_ids:{
            type:String
        },
        editorTota:{
            type:Number
        }
    },
    data() {
        return {
            
            typeList:[],
            groupList:[],
            eidtorForm:{
                grouping_id:'',
                typecontrol_id:'',
                member_id:'',
            }
        };
    },

    mounted() {
        this.getGroupList()
        this.getTypeControlList()
    },

    methods: {
            /*
        function: getTreeData
        params: data | 需要进行递归处理的数组
        desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
        return: 处理后的数据
    */
    getTreeData(data) {
      data.forEach((item) => {
        if (!item.children.length) {
          item.children = undefined;
        } else {
          this.getTreeData(item.children);
        }
      });
      return data;
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
        handlerClose(){
            this.$parent.closeBatchEditor()
        },
        async handlerConfrim(){
            try {
            this.eidtorForm.typecontrol_id = this.eidtorForm.typecontrol_id[this.eidtorForm.typecontrol_id.length - 1]
            this.eidtorForm.member_id = this.member_ids
            console.log(this.eidtorForm)
            let result = await this.$api({type:'updateUserType',data:this.eidtorForm})
            if(result.status == 200) {
                this.$message.success('操作成功')
                this.handlerClose()
                this.resetForm()
                this.$parent.updateMemberList()
                return
            }
            this.$message.error(result.msg ?? '操作失败')
            console.log(result)               
            } catch (error) {
                console.error(error)
            }


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
                grouping_id:'',
                typecontrol_id:'',
                member_id:'',
            }
    },
    },
};
</script>

<style lang="stylus" scoped>

</style>