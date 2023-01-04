<template>
  <div>
    <el-dialog width="40%" :visible="showLetterTask" :before-close="handlerClose" title="关注任务配置">
      <el-form ref="followTaskForm" :rules="rules" class="lettertask-form" label-position="left" label-width="220px"
        :model="followTaskForm">
        <el-form-item prop="group" label="账号分组 ：">
          <el-select style="width: 50%" ref="gropuSelect" clearable v-model="followTaskForm.group" placeholder="选择分组"
            size="medium" @change="getTypeControlList()">
            <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
              :key="item.grouping_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="typecontrol_id" label="账号分类 ：">
          <el-cascader style="width: 50%" clearable :props="{ checkStrictly: true, value: 'value' }" :options="typeList"
            v-model="followTaskForm.typecontrol_id" size="medium"></el-cascader>
        </el-form-item>

        <el-form-item label="">
          <p style="font-size:12px">当前已选中<span style="color:red">0</span>个账号</p>
        </el-form-item>

        <el-form-item label="备注任务名称 ：" prop="remarks">
          <el-input style="width: 50%" type="text" v-model="followTaskForm.remarks" placeholder="请备注任务名称"></el-input>
        </el-form-item>
        <el-form-item label="选择国家 ：" prop="account_region">
          <el-select style="width: 50%" clearable multiple v-model="followTaskForm.account_region" placeholder="选择国家">
            <el-option v-for="item in countryOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据来源 ：" prop="tasklist_id_list">
          <el-select style="width: 50%" clearable multiple v-model="followTaskForm.tasklist_id_list"
            placeholder="选择数据来源" v-loadMore="sourceLoadMore">
            <el-option v-for="item in sourceData" :key="item.tasklist_id" :label="item.task_name"
              :value="item.tasklist_id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="单号每日关注上限 ：" prop="user_follow_upper_limit">
          <el-input style="width: 50%" type="number" v-model="followTaskForm.user_follow_upper_limit"
            placeholder="输入单号关注上限"></el-input>
        </el-form-item>

        <div class="between-input">
          <el-form-item label="关注频率 ：" prop="rate_min">
            <el-input class="lettertask-input--between" type="number" v-model="followTaskForm.rate_min"
              placeholder="最小"></el-input>
          </el-form-item>

          <el-form-item prop="rate_max" class="rate_max">
            <el-input class="lettertask-input--between" type="number" v-model="followTaskForm.rate_max"
              placeholder="最大"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="连续失败执行下一个号（次）：" prop="can_fail_num">
          <el-input style="width: 50%" type="number" v-model="followTaskForm.can_fail_num"
            placeholder="输入连续失败次数"></el-input>
        </el-form-item>

        <el-form-item label="目标粉丝量小于：" prop="follower_status">
          <el-input style="width: 50%" type="number" v-model="followTaskForm.follower_status"
            placeholder="输入粉丝小于数"></el-input>
        </el-form-item>

        <el-form-item label="目标关注量小于：" prop="following_count">
          <el-input style="width: 50%" type="number" v-model="followTaskForm.following_count"
            placeholder="输入关注少于数"></el-input>
        </el-form-item>

        <el-form-item label="黑名单" prop="black_list">
          <el-checkbox-group v-model="followTaskForm.black_list">
            <el-checkbox v-for="item in blackList" :key="item" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <p  style="font-size:12px;text-align: center;">当前筛选条件可关注用户数量为<span style="color:red">0</span>条</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReset">重 置</el-button>
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim" size="medium" :loading="subLoading">{{ subLoading ? "提交中..." :
    "确定"
}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectVideoDialog",
  props: {
    showLetterTask: {
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
      subLoading: false,
      rules: {
        remarks: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        rate_min: [
          { required: true, message: "请选择关注频率最小值", trigger: "blur" },
        ],
        rate_max: [
          { required: true, message: "请选择关注频率最大值", trigger: "blur" },
        ],
        group: [
          { required: true, message: "请选择账号分组", trigger: "blur" },
        ],
        typecontrol_id: [
          { required: true, message: "请选择账号分类", trigger: "blur" },
        ],
        account_region: [
          { required: true, message: "请选择国家", trigger: "change" },
        ],
        tasklist_id_list: [
          { required: true, message: "请选择数据来源", trigger: "change" },
        ],
        user_follow_upper_limit: [
          { required: true, message: "请设置每日需关注上限", trigger: "blur" },
        ],
        can_fail_num: [
          { required: true, message: "请设置连续失败次数", trigger: "blur" },
        ],
      },
      blackList: ["无昵称", "无作品", "无头像", "历史已操作用户"],
      blackListMap: {
        无头像: "no_avatar",
        无作品: "no_aweme",
        历史已操作用户: "historical_users",
        无昵称: "no_nickname",
      },
      typeList: [],
      groupList: [],
      sourceData: [],
      page: 1,
      limit: 20,
      // TODO 国家options
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
        account_region: [], //国家
        user_follow_upper_limit: "150", //单号关注上限
        rate_min: "", //关注频率最小值
        rate_max: "", //关注频率最大值
        sourceCount: "",
        follower_status: "100", //粉丝量小于
        tasklist_id_list: [], //数据来源
        following_count: "200", //关注数量小于
        typecontrol_id: "",
        can_fail_num: "3", //连续失败次数
        black_list: ["历史已操作用户"],
        uid_list: "",
        remarks: '',//备注任务名称
        group: ''
      },
    };
  },

  mounted() {
    this.getTasklist();
    this.followTaskForm.typecontrol_id = this.typecontrol_id;
    this.getGroupList()
  },

  methods: {
    async sourceLoadMore() {
      this.page = ++this.page;
      let data = {
        task_type: "CollectionUser",
        page: this.page,
        limit: this.limit,
      };
      let result = await this.$api({ type: "getTasklist", data });
      console.log("数据来源", result);
      result.data.list.forEach((item) => {
        this.sourceData.push(item);
      });
      if (this.sourceData.length == this.sourceCount) {
        this.$message.warning("刷到底了");
      }
    },

    handleReset() {
      this.resetForm()
    },
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
      let data = {
        grouping_id: this.followTaskForm.group
      }
      try {
        let result = await this.$api({ type: "getTypecontrol", data });
        this.typeList = this.getTreeData(result.data);
      } catch (error) {
        console.error(error);
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

    handlerClose() {
      this.page = 1;
      this.limit = 10;
      this.$emit("closeLetterTask");
      this.resetForm();
    },
    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单
    */
    handlerConfrim() {
      this.$refs["followTaskForm"].validate((valid) => {
        if (valid) {
          if(this.followTaskForm.rate_min>this.followTaskForm.rate_max){
            this.$message.warning("请输入正确的关注频率");

          }else{
            this.$message.success("操作成功,任务正在发布中");
            this.handlerClose()
          }
        }
      });
      return
       this.$refs["followTaskForm"].validate((valid) => {
        if (valid) {
          let userList = this.batchEditorList.map((item) => {
            return item.uid;
          });
          this.followTaskForm.uid_list = userList;
          this.followTaskForm.typecontrol_id = this.typecontrol_id;
          this.followTaskForm.black_list = this.followTaskForm.black_list.map(
            (item) => {
              return this.blackListMap[item];
            }
          );

          let data = this.followTaskForm;

          this.confrimTask(data);
        }
      });
    },
    async confrimTask(data) {
      let result = await this.$api({ type: "pushFollowTask", data: data });
      console.log(result.status)
      if (result.status == 200) {
        this.$message.success("操作成功,任务正在发布中");
        this.resetForm();
        this.followTaskForm.black_list = []
        this.handlerClose();
      } else {
        this.$message.warning(result.msg);
        this.followTaskForm.black_list = []
      }
    },

    async getTasklist() {
      let data = { task_type: "CollectionUser" };
      let result = await this.$api({ type: "getTasklist", data });
      console.log("数据来源", result);
      this.sourceData = result.data.list;
      this.sourceCount = result.data.count;
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
.lettertask-form {
  box-sizing: border-box;
  padding-left: 30px;
}

.lettertask-input--between:nth-of-type(1) {
  width: 120px;
  // margin-left: 65px;
}

.lettertask-input--between input {
  width: 60px !important;
}

.lettertask-checkport {
  display: flex;

  .check {
    margin-right: 130px;
  }
}

.tt-acccountsit--title {
  margin-bottom: 20px;
  font-size: 20px;
}

.between-input{
  display: flex;
  align-items: center;
}
.rate_max{
  margin-left: -180px

}
</style>