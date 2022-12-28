<template>
  <div>
    <el-dialog
      width="30%"
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
      
        <el-form-item
          label="选择国家 ："
          prop="account_region"
          v-model="followTaskForm.account_region"
        >
          <el-select
            style="width: 38%"
            v-model="followTaskForm.account_region"
            placeholder="选择国家"
          >
            <el-option
              v-for="item in countryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="单号私信上限 :"
          v-model="followTaskForm.user_chat_upper_limit"
          prop="user_chat_upper_limit"
        >
          <el-input
            style="width: 38%"
            type="text"
            v-model="followTaskForm.user_chat_upper_limit"
            placeholder="输入单号私信上限"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="总私信上限 :"
          v-model="followTaskForm.total_task_num"
          prop="total_task_num"
        >
          <el-input
            style="width: 38%"
            class="lettertask-input--between"
            v-model="followTaskForm.total_task_num"
            autocomplete="off"
            placeholder="输入总私信上限"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="task_name"
          label="备注任务名称 ："
          :model="followTaskForm.task_name"
        >
          <el-input
            placeholder="输入备注"
            style="width: 38%"
            v-model="followTaskForm.task_name"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-model="followTaskForm.reset_status"
          label="重置粉丝状态"
        >
          <el-switch v-model="followTaskForm.reset_status"></el-switch>
        </el-form-item>

        <el-form-item
          v-model="followTaskForm.privateletter_id"
          prop="privateletter_id"
          label="选择私信素材 ："
        >
          <el-select
            style="width: 35%"
            v-model="followTaskForm.privateletter_id"
            placeholder="私信素材"
          >
            <el-option
              v-for="item in letterOptions"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <div>
          <el-form-item label="选择素材类型 ：" prop="type_list">
            <el-checkbox-group v-model="followTaskForm.type_list">
              <el-checkbox
                :disabled="followTaskForm.type_list.length === 3"
                v-for="item in letterGroup"
                :key="item"
                :label="item"
              ></el-checkbox>
            </el-checkbox-group>
            <el-button type="primary" @click="restType" size="mini"
              >重置</el-button
            >
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
import formRule from "@/config/accountConfig/formRules.config";
const { follow } = formRule;
export default {
  name: "TtprojectVideoDialog",
  props: {
    showFollowDialog: {
      type: Boolean,
    },
    typecontrol_id: {
      type: Number,
    },
    userIdList: {
      type: Array,
    },
    batchEditorList: {
      type: Array,
    },
  },
  data() {
    return {
      rules: follow,
      letterOptions: [],
      letterGroup: ["文本话术", "短连接", "好友名片", "作品转发"],
      letterOptionsValue: {
        文本话术: "ChatText",
        短连接: "ChatLink",
        好友名片: "ChatProfile",
        作品转发: "ChatAweme",
      },
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
        {
          value: "新加坡",
          label: "新加坡",
        },
        {
          value: "泰国",
          label: "泰国",
        },
        {
          value: "菲律宾",
          label: "菲律宾",
        },
        {
          value: "印度尼西亚",
          label: "印度尼西亚",
        },
        {
          value: "越南",
          label: "越南",
        },
        {
          value: "马来西亚",
          label: "马来西亚",
        },
        {
          value: "巴西",
          label: "巴西",
        },
      ],
      //关注发布任务 提交表单
      followTaskForm: {
        typecontrol_id: "",
        user_chat_upper_limit: "", //单号私信上限
        total_task_num: "", // 总私信上限
        account_region: "", //国家
        task_name: "", //任务备注
        reset_status: false, //重置粉丝状态
        type_list: [], //私信类型
        privateletter_id: "", //私信素材
        uid_list: "",
      },
    };
  },

  mounted() {
    this.followTaskForm.typecontrol_id = this.typecontrol_id;
    this.getPrivateLetter();
  },

  methods: {
    async getPrivateLetter() {
      let result = await this.$api({ type: "getPrivateLetter" });
      this.letterOptions = result.data.list.map((item) => {
        return item.content;
      });
      console.log(this.letterOptions);
    },

    restType() {
      this.followTaskForm.type_list = [];
    },
    handlerClose() {
      this.$emit("closeFollowTask");
      this.resetForm();
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单
    */
    async handlerConfrim() {
      try {
        await this.$refs["followTaskForm"].validate((valid) => {
          if (valid) {
            let userList = this.batchEditorList.map((item) => {
              return item.uid;
            });
            this.followTaskForm.uid_list = userList;
            this.followTaskForm.reset_status =
              this.followTaskForm.reset_status === true ? "1" : "0";
            this.followTaskForm.type_list = this.followTaskForm.type_list.map(
              (item) => {
                return this.letterOptionsValue[item];
              }
            );

            this.pushLetter(this.followTaskForm);
          }
        });
      } catch (error) {
        console.error(error);
      }
    },

    async pushLetter(data) {
      let result = await this.$api({
        type: "pushLetter",
        data: data,
      });
      if (result.status === 200) {
        this.$message.success("提交成功");
        this.resetForm();
        return;
      }
      this.$message.error(result?.msg || "未知错误");
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm() {
      this.$refs["followTaskForm"].resetFields();
    },
  },
};
</script>

<style lang="stylus" scoped>
.followtask-option {
  display: flex;
  justify-content: space-around;
}

.tt-acccountsit--title {
  margin-bottom: 20px;
  font-size: 20px;
}

.flex {
  display: flex;

  button {
    margin-top: 5px;
    height: 30px;
  }
}
</style>