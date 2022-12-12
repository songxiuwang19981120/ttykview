<template>
  <div>
    <el-dialog
      width="40%"
      :visible="showFollowDialog"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">私信任务配置</h1>
      </span>
      <el-form
      :rules="rules"
      ref="followTaskForm"
        :model="followTaskForm"
        label-position="left"
        label-width="130px"
      >
        <el-form-item label="选择国家 ："  prop="country" v-model="followTaskForm.country">
          <el-select v-model="followTaskForm.country" placeholder="选择国家">
            <el-option
              v-for="item in countryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          prop="task_remark"
          label="备注任务名称 ："
          v-model="followTaskForm.task_remark"
        >
          <el-input v-model="followTaskForm.task_remark"></el-input>
        </el-form-item>

        <el-form-item label="重置粉丝状态">
          <el-switch v-model="followTaskForm.rest_fans_status"></el-switch>
        </el-form-item>

      
        <div class="followtask-option">
          <el-form-item prop="letter_data" label="选择私信素材 ：">
          <el-select
            v-model="followTaskForm.letter_data"
            placeholder="私信素材"
          >
            <el-option
              v-for="item in letterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          </el-form-item>

          <el-form-item label="选择类型 ：" prop="letter_type">
          <el-checkbox-group v-model="followTaskForm.letter_type">
            <el-checkbox
              :disabled="followTaskForm.letter_type.length === 3"
              v-for="item in letterGroup"
              :key="item"
              :label="item"
            ></el-checkbox>
          </el-checkbox-group>
          <el-button @click="restType" size="mini">重置</el-button>
          </el-form-item>
        </div>
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
  name: "TtprojectVideoDialog",
  props: {
    showFollowDialog: {
      type: Boolean,
    },
  },
  data() {
    return {
      rules:{
        country:[
        {required: true,message:"请选择国家",trigger: "change"},
        
        ],
        task_remark:[
          {required: true,message:"请备注任务名称",trigger: "blur"},
        ],
        letter_data:[
          {required: true,message:"请选择私信素材",trigger: "change"},
        ],
        letter_type:[
          {required: true,message:"请选择类型",trigger: "change"},
        ],
      },
      letterOptions: ["1", "2", "3", "4", "5"],
      letterGroup: ["文本话术", "短连接", "好友名片", "作品转发"],
      countryOptions: [
        {
          value: "法国",
          label: "法国",
        },
        {
          value: "美国",
          label: "美国",
        },
        {
          value: "英国",
          label: "英国",
        },
        {
          value: "俄国",
          label: "俄国",
        },
      ],
      //关注发布任务 提交表单
      followTaskForm: {
        country: "",      //国家
        task_remark: "", //任务备注
        rest_fans_status: "", //重置粉丝状态
        letter_data: "", //私信素材
        letter_type: [], //私信类型
      },
    };
  },

  mounted() {},

  methods: {

    restType(){
      this.followTaskForm.letter_type = []
    },
    handlerClose() {
      this.$emit("closeFollowTask");
      this.resetForm()
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单
    */
    handlerConfrim() {
       this.$refs["followTaskForm"].validate((valid) => {
        if (valid) {
          this.handlerClose()
          console.log(this.followTaskForm);
          this.resetForm()
          console.log(this.followTaskForm);
          this.$message.success('提交成功')
          return 
        }
        this.$message.error('提交失败')
      });
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm(){
      this.$refs['followTaskForm'].resetFields()
    }
  },
};
</script>

<style lang="stylus">
.followtask-option {
  display: flex;
  justify-content: space-around;
}
</style>