<template>
  <div>
    <el-dialog width="50%" :visible="showPrivateDialog" :before-close="handlerClose" title="私信任务配置">
      <el-form ref="letterForm" :rules="rules" class="lettertask-form" label-position="left" label-width="220px"
        :model="letterTaskForm">

        <el-form-item prop="grouping_id" label="账号分组 ：">
          <el-select style="width: 50%" ref="gropuSelect" clearable v-model="letterTaskForm.grouping_id" placeholder="账号分组"
            @change="getTypeControlList()">
            <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
              :key="item.grouping_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="typecronl_id" label="账号分类 ：">
          <el-cascader style="width: 50%" clearable :props="{ checkStrictly: true, value: 'value' }" :options="typeList"
            v-model="letterTaskForm.typecronl_id" @change="getMemberList"></el-cascader>
        </el-form-item>
        <el-form-item label="">
          <p style="font-size:12px">当前已选中<span style="color:red">{{ accCount }}</span>个账号</p>
        </el-form-item>
        <el-form-item label="任务名称 ：" prop="task_name">
          <el-input style="width: 50%" type="text" v-model="letterTaskForm.task_name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="国家 ：" v-model="letterTaskForm.country_list" prop="country_list">
          <el-select style="width: 50%" clearable multiple filterable v-model="letterTaskForm.country_list" placeholder="选择国家">
            <el-option v-for="(item, index) in countryOptions" :key="index" :label="item" :value="item">{{
              item
            }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源 ：" v-model="letterTaskForm.tasklist_id_list" prop="tasklist_id_list">
          <el-select multiple clearable filterable style="width: 50%" v-model="letterTaskForm.tasklist_id_list"
            placeholder="选择数据来源" v-loadMore="sourceLoadMore">
            <el-option v-for="item in sourceData" :key="item.tasklist_id" :label="item.task_name"
              :value="item.tasklist_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单号私信上限 ：" prop="user_chat_upper_limit" v-model="letterTaskForm.user_chat_upper_limit">
          <el-input style="width: 50%" type="number" v-model="letterTaskForm.user_chat_upper_limit"
            placeholder="单号私信上限"></el-input>
        </el-form-item>
        <el-form-item label="总私信上限 ：" v-model="letterTaskForm.total_task_num">
          <el-input style="width: 50%" type="number" v-model="letterTaskForm.total_task_num"
            placeholder="单号私信上限"></el-input>
        </el-form-item>
        <el-form-item v-model="letterTaskForm.privateletter_id" prop="privateletter_id" label="私信素材 ：">
          <el-select style="width: 50%" clearable filterable v-model="letterTaskForm.privateletter_id" placeholder="私信素材选择">
            <el-option v-for="item in letterOptions" :key="item.privateletter_id" :label="item.content"
              :value="item.privateletter_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材类型 ：" prop="type_list">
          <el-checkbox-group v-model="letterTaskForm.type_list">
            <el-checkbox :disabled="letterTaskForm.type_list.length === 3" v-for="item in letterGroup" :key="item.value"
              :label="item.value">{{ item.label }}</el-checkbox>
            <el-button style="margin-left:10px" type="primary" @click="restType" size="mini">重置</el-button>

          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-model="letterTaskForm.reset_status" label="重置粉丝状态">
          <el-switch v-model="letterTaskForm.reset_status"></el-switch>
        </el-form-item>
      </el-form>
      <p style="font-size:12px;text-align: center;">当前筛选条件可私信用户数量为<span style="color:red">{{ screenNumber }}</span>个</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReset">重 置</el-button>
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectVideoDialog",
  props: {
    showPrivateDialog: {
      type: Boolean,
    },
  },
  data() {
    return {
      screenNumber:0,
      accCount: 0,
      letterGroup: [
        {
          label: '文本话术',
          value: 'ChatText',
        },
        {
          label: '短连接',
          value: 'ChatLink',
        },
        {
          label: '好友名片',
          value: 'ChatProfile',
        },
        {
          label: '作品转发',
          value: 'ChatAweme',
        },
      ],
      letterOptions: [],
      rules: {
        type_list: [
          { required: true, message: "请选择素材类型", trigger: "blur" },
        ],
        privateletter_id: [
          { required: true, message: "请输入私信素材", trigger: "blur" },
        ],
        task_name: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        rate_min: [
          { required: true, message: "请选择关注频率最小值", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        rate_max: [
          { required: true, message: "请选择关注频率最大值", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        grouping_id: [
          { required: true, message: "请选择账号分组", trigger: "blur" },
        ],
        typecronl_id: [
          { required: true, message: "请选择账号分类", trigger: "blur" },
        ],
        country_list: [
          { required: true, message: "请选择国家", trigger: "change" },
        ],
        tasklist_id_list: [
          { required: true, message: "请选择数据来源", trigger: "change" },
        ],
        user_follow_upper_limit: [
          { required: true, message: "请设置单号私信上限", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        can_fail_num: [
          { required: true, message: "请设置连续失败次数", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
      },
      typeList: [],
      groupList: [],
      sourceData: [],
      page: 1,
      limit: 20,
      // TODO 国家options
      countryOptions: [],
      //关注发布任务 提交表单
      letterTaskForm: {
        grouping_id: '',  //账号分组
        typecronl_id: "",  //账号分类
        task_name: "", //任务备注
        country_list: [], //国家
        tasklist_id_list: [],  //数据来源
        user_chat_upper_limit: "100", //单号私信上限
        total_task_num: "", // 总私信上限
        privateletter_id: "", //私信素材
        type_list: [], //私信类型
        reset_status: false, //重置粉丝状态
      },
    };
  },
  watch: {
    "letterTaskForm.country_list": {
      async handler(val) {
        if (val != '') {
          this.pushScreenChat()
        }
      },
    },
    "letterTaskForm.tasklist_id_list": {
      async handler(val) {
        if (val != '') {
          this.pushScreenChat()
        }
      },
    },
    "letterTaskForm.reset_status": {
      async handler(val) {
        if (val != '') {
          this.pushScreenChat()
        }
      },
    },
  },

  mounted() {
  },

  methods: {
    async pushScreenChat(){
      let data = {
        grouping_id: this.letterTaskForm.grouping_id,
        typecronl_id: this.formatTypeId(this.letterTaskForm.typecronl_id),
        country_list: this.letterTaskForm.country_list,
        tasklist_id_list: this.letterTaskForm.tasklist_id_list,
        reset_status: this.letterTaskForm.reset_status,
      }
      try {
        let result = await this.$api({ type: "pushScreenChat", data });
        this.screenNumber = result.data
      } catch (error) {
      }
    },
    getList() {
      this.getTasklist();
      this.getGroupList();
      this.getCountry();
      this.getPrivateLetter()
    },
    // 获取私信素材
    async getPrivateLetter() {
      try {
        let result = await this.$api({ type: 'getPrivateLetter' });
        if (result.status == '200') {
          this.letterOptions = result.data.list;
        } else {
          this.$message.error({ message: result.msg });
        }
      } catch (error) {
        this.$message.error({ message: error.msg });
      }
    },
    // 获取国家
    async getCountry() {
      try {
        let result = await this.$api({ type: 'getCountry' });
        if (result.status == '200') {
          this.countryOptions = result.data;
        } else {
          this.$message.error({ message: result.msg });
        }
      } catch (error) {
        this.$message.error({ message: error.msg });
      }
    },
    // 获取数据来源
    async getTasklist() {
      let data = { task_type: "CollectionUser" };
      let result = await this.$api({ type: "getTasklist", data });
      this.sourceData = result.data.list;
      this.sourceCount = result.data.count;
    },
    // 获取数据来源（拉到底部加载新的数据）
    async sourceLoadMore() {
      this.page = ++this.page;
      let data = {
        task_type: "CollectionUser",
        page: this.page,
        limit: this.limit,
      };
      let result = await this.$api({ type: "getTasklist", data });
      result.data.list.forEach((item) => {
        this.sourceData.push(item);
      });
      if (this.sourceData.length == this.sourceCount) {
        this.$message.warning("刷到底了");
      }
    },
    /*
      function: getTypeControlList
      params: null
      desc: 异步获取TypeControlList，页面渲染时调用
  */
    async getTypeControlList() {
      let data = {
        grouping_id: this.letterTaskForm.grouping_id
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
    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单
    */
    async handlerConfrim() {
      await this.$refs["letterForm"].validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.letterTaskForm))
          data.typecronl_id = this.formatTypeId(this.letterTaskForm.typecronl_id)
          data.user_chat_upper_limit = Number(this.letterTaskForm.user_chat_upper_limit)
          data.total_task_num = Number(this.letterTaskForm.total_task_num)
          this.pushLetter(data)
        }
      });
    },
    // 提交表单
    async pushLetter(data) {
      try {
        let result = await this.$api({ type: 'pushChat',data });
        if (result.status == '200') {
          this.$message.success({ message: result.msg });
          this.$parent.getVideoTasks()
          this.handlerClose();
        } else {
          this.$message.error({ message: result.msg });
        }
      } catch (error) {
        this.$message.error({ message: error.msg });
      }
    },
    // 获取账号
    async getMemberList() {
      if (this.letterTaskForm.typecronl_id != '') {
        try {
          const res = await this.$api({
            type: 'getMember',
            data: {
              grouping_id: this.letterTaskForm.grouping_id,
              typecontrol_id: this.formatTypeId(this.letterTaskForm.typecronl_id),
            },
          });
          if (res.status == 200) {
            this.accCount = res.data.count;
          } else {
            this.$message.error(res.msg);
          }
        } catch (error) {
        }
      } else {
        this.accCount = 0
      }
    },
    restType(){
      this.letterTaskForm.type_list=[]
    },

    // 重置
    handleReset() {
      this.getList()
      this.accCount = 0
      this.typeList = []
      this.$refs["letterForm"].resetFields();
    },
    // 关闭
    handlerClose() {
      this.accCount = 0
      this.screenNumber = 0
      this.typeList = []
      this.groupList = []
      this.$emit("closePrivateTask");
      this.$refs["letterForm"].resetFields();
    },
    formatTypeId(param) {
      return param[param.length - 1] ?? "";
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
  },
};
</script>

<style lang="stylus" scoped>
.lettertask-form {
  box-sizing: border-box;
  padding-left: 30px;
}

.lettertask-input--between:nth-of-type(1) {
  width: 70px;
  margin-left: 65px;
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

.between-input
  display: flex
  justify-content: space-between

.rate-max
  margin-right: 267px
  position: absolute
  right: 10px
  .el-form-item__error
    left: 70px !important

.rate-min .el-form-item__error
  left: 70px !important
</style>