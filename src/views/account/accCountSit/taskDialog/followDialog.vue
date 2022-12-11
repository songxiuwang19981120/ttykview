<template>
  <div>
    <el-dialog
      width="40%"
      :visible="showFollowDialog"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">关注任务配置</h1>
      </span>
      <el-form
        v-model="followTaskForm"
        label-position="left"
        label-width="130px"
      >
        <el-form-item label="选择国家 ：" v-model="followTaskForm.country">
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
          label="备注任务名称 ："
          v-model="followTaskForm.task_remark"
        >
          <el-input v-model="followTaskForm.task_remark"></el-input>
        </el-form-item>

        <el-form-item label="重置粉丝状态">
          <el-switch v-model="followTaskForm.rest_fans_status"></el-switch>
        </el-form-item>

        <div class="followtask-option">
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

          <el-checkbox-group v-model="followTaskForm.letter_type">
            <el-checkbox
              v-for="item in letterGroup"
              :key="item"
              :label="item"
            ></el-checkbox>
          </el-checkbox-group>
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
      letterOptions: ["1", "2", "3", "4", "5"],
      letterGroup: ["1", "2", "3", "4", "5"],
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
        letter_type: "", //私信类型
      },
    };
  },

  mounted() {},

  methods: {
    handlerClose() {
      this.$emit("closeFollowTask");
    },
    handlerConfrim() {
      console.log(this.followTaskForm);
    },
  },
};
</script>

<style lang="stylus">
.followtask-option {
  display: flex;
  justify-content: space-around;
}
</style>