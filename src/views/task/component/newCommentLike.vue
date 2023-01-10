<template>
  <div>
    <el-dialog width="40%" :visible="showLikeCommentTask" :before-close="handlerClose" title="评论区点赞任务配置">
      <el-form :rules="rules" ref="likeCommentForm" label-position="left" label-width="210px"
        :model="likeCommentTaskForm">
        <el-form-item prop="grouping_id" label="账号分组 ：">
          <el-select style="width: 50%" ref="gropuSelect" clearable v-model="likeCommentTaskForm.grouping_id"
            placeholder="选择分组" size="medium" @change="getTypeControlList()">
            <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
              :key="item.grouping_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="typecronl_id" label="账号分类 ：">
          <el-cascader style="width: 50%" clearable :props="{ checkStrictly: true, value: 'value' }" :options="typeList"
            v-model="likeCommentTaskForm.typecronl_id" size="medium" @change="getMemberList"></el-cascader>
        </el-form-item>
        <el-form-item label="">
          <p style="font-size:12px">当前已选中<span style="color:red">{{ accCount }}</span>个账号</p>
        </el-form-item>
        <el-form-item prop="task_name" label="任务名称">
          <el-input type="text" size="medium" v-model="likeCommentTaskForm.task_name" placeholder="任务名称"
            style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="选择国家 ：" prop="country_list" v-model="likeCommentTaskForm.country_list">
          <el-select style="width: 50%" clearable multiple filterable v-model="likeCommentTaskForm.country_list"
            placeholder="选择国家" size="medium">
            <el-option v-for="(item, index) in countryOptions" :key="index" :label="item" :value="item">{{
              item
            }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tasklist_id_list" label="选择数据来源 ：" v-model="likeCommentTaskForm.tasklist_id_list">
          <el-select style="width: 50%" clearable multiple v-model="likeCommentTaskForm.tasklist_id_list"
            placeholder="选择数据来源" size="medium" v-loadMore="sourceLoadMore">
            <el-option v-for="item in sourceData" :key="item.tasklist_id" :label="item.task_name"
              :value="item.tasklist_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单号点赞上限（次）：" prop="user_digg_upper_limit">
          <el-input style="width: 50%" type="number" v-model="likeCommentTaskForm.user_digg_upper_limit"
            placeholder="输入单号点赞上限 " size="medium"></el-input>
        </el-form-item>
        <el-form-item label="连续失败执行下一个号（次）:" prop="can_fail_num">
          <el-input style="width: 50%" type="number" v-model="likeCommentTaskForm.can_fail_num" placeholder="输入连续失败次数"
            size="medium"></el-input>
        </el-form-item>
        <el-form-item label="评论获赞小于（次）：" prop="comment_digg_count_lower_limit">
          <el-input style="width: 50%" type="number" v-model="likeCommentTaskForm.comment_digg_count_lower_limit"
            placeholder="输入评论获赞小于" size="medium"></el-input>
        </el-form-item>

        <el-form-item label="黑名单 :" prop="black_list">
          <el-checkbox-group style="width: 101%" v-model="likeCommentTaskForm.black_list" size="medium">
            <el-checkbox v-for="item in blackList" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p style="font-size:12px;text-align: center;">当前筛选条件可执行数据数量为<span style="color:red">{{ screenNumber }}</span>条
        </p>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm" size="medium">重 置</el-button>
        <el-button @click="handlerClose" size="medium">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim" size="medium" :loading="subLoading">{{
          subLoading? "提交中..."
            : "确定"
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectVideoDialog",
  props: {
    showLikeCommentTask: {
      type: Boolean,
    },
  },
  computed: {
  },
  data() {
    return {
      screenNumber: 0,
      accCount: 0,
      subLoading: false,
      rules: {
        grouping_id: [
          { required: true, message: "请选择账号分组", trigger: "blur" },
        ],
        typecronl_id: [
          { required: true, message: "请选择账号分类", trigger: "blur" },
        ],
        country_list: [
          { required: true, message: "请选择国家", trigger: "blur" },
        ],
        tasklist_id_list: [
          { required: true, message: "请选择数据来源", trigger: "blur" },
        ],
        user_digg_upper_limit: [
          { required: true, message: "请填写点赞上限", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        task_name: [
          { required: true, message: "请输入任务名称", trigger: "change" },
        ],
        acc_likenum_max: [
          { required: true, message: "请填写点赞上限", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        can_fail_num: [
          { required: true, message: "请填写失败次数", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        source_data: [
          { required: true, message: "请选择数据来源", trigger: "change" }
        ]
      },
      blackList: [
        {
          label: '无头像',
          value: 'no_avatar',
        },
        {
          label: '无作品',
          value: 'no_aweme',
        },
        {
          label: '无昵称',
          value: 'no_nickname',
        },
        {
          label: '历史已操作用户',
          value: 'historical_users',
        },
      ],
      groupList: [],
      typeList: [],
      //TODO 数据来源  需要跟后端对接
      sourceData: [],
      //TODO 国家选择下拉框数据到时候要跟后端对接
      countryOptions: [],
      //新加坡，泰国，菲律宾，印度尼西亚，越南，马来西亚，巴西
      //TODO 字段名称要跟后端协商   视频发布任务 提交表单
      likeCommentTaskForm: {
        country_list: [], //选择国家
        tasklist_id_list: [], //数据来源
        user_digg_upper_limit: "1000", //单号点赞上限
        comment_digg_count_lower_limit: "5", //评论获赞小于
        can_fail_num: "3", //连续失败执行下一个号
        black_list: ['historical_users'], //黑名单
        typecronl_id: "",
        grouping_id: '',
        task_name: '' //备注任务名称
      },
      page: 1,
      limit: 20,
    };
  },
  watch: {
    "likeCommentTaskForm.country_list": {
      async handler(val) {
        if (val != '') {
          this.commentlistscreenCommentDigg()
        }
      },
    },
    "likeCommentTaskForm.tasklist_id_list": {
      async handler(val) {
        if (val != '') {
          this.commentlistscreenCommentDigg()
        }
      },
    },
    "likeCommentTaskForm.comment_digg_count_lower_limit": {
      async handler(val) {
        if (val != '') {
          this.commentlistscreenCommentDigg()
        }
      },
    },
    "likeCommentTaskForm.black_list": {
      async handler(val) {
        if (val != '') {
          this.commentlistscreenCommentDigg()
        }
      },
    },
  },
  mounted() {
  },

  methods: {
    getList() {
      this.getTasklist();
      this.getGroupList();
      this.getCountry();
    },

    // 获取评论任务筛选后的评论数量
    async commentlistscreenCommentDigg() {
      // let country_list = this.likeCommentTaskForm.country_list.map((item) => { return item;}).join(',');
      // let tasklist_id_list = this.likeCommentTaskForm.tasklist_id_list.map((item) => { return item;}).join(',');
      let data = {
        grouping_id: this.likeCommentTaskForm.grouping_id,
        typecronl_id: this.formatTypeId(this.likeCommentTaskForm.typecronl_id),
        country_list: this.likeCommentTaskForm.country_list,
        tasklist_id_list: this.likeCommentTaskForm.tasklist_id_list,
        comment_digg_count_lower_limit: this.likeCommentTaskForm.comment_digg_count_lower_limit,
        black_list: this.likeCommentTaskForm.black_list,
      }
      console.log('data',data);
      try {
        let result = await this.$api({ type: "commentlistscreenCommentDigg", data });
        this.screenNumber = result.data
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    },
    /*
        desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
    */
    getTreeData(data) {
      if (data.length == 0) {
        return []
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
    /*
        function: getTypeControlList
        params: null
        desc: 异步获取TypeControlList，页面渲染时调用
    */
    async getTypeControlList() {
      this.likeCommentTaskForm.typecronl_id = '';
      if (this.likeCommentTaskForm.grouping_id == '') {
        return this.typeList = [];
      }
      let data = {
        grouping_id: this.likeCommentTaskForm.grouping_id
      }
      try {
        let result = await this.$api({ type: "getTypecontrol", data });
        this.typeList = this.getTreeData(result.data);
      } catch (error) {
        console.error(error);
      }
    },
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


    async getTasklist() {
      let data = { task_type: "CollectionUser" };
      let result = await this.$api({ type: "getTasklist", data });
      this.sourceData = result.data.list;
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
        function: handlerClose
        params: null
        desc: 关闭表单
    */
    handlerClose() {
      this.accCount = 0
      this.groupList = []
      this.typeList = []
      this.sourceData= []
      this.countryOptions= []
      this.$refs["likeCommentForm"].resetFields();
      this.$emit("closeLikeCommentTask");
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单
    */
    handlerConfrim() {
      try {
        this.$refs["likeCommentForm"].validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.likeCommentTaskForm))
            data.typecronl_id = this.formatTypeId(this.likeCommentTaskForm.typecronl_id)
            this.pushCommentTask(data)
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    async pushCommentTask(data) {
      try {
        this.subLoading = true;
        const res = await this.$api({
          type: "pushCommentTask",
          data,
        });
        if (res.status == 200) {
          this.$message.success(res.msg ?? "操作成功");
          this.$parent.getVideoTasks()
          this.handlerClose();
        } else {
          this.$message.error(res.msg ?? "操作失败");
        }
      } catch (error) {
      } finally {
        this.subLoading = false;
      }
    },
    formatTypeId(param) {
      return param[param.length - 1] ?? "";
    },
    // 获取账号
    async getMemberList() {
      if (this.likeCommentTaskForm.typecronl_id != '') {
        try {
          const res = await this.$api({
            type: 'getMember',
            data: {
              grouping_id: this.likeCommentTaskForm.grouping_id,
              typecontrol_id: this.formatTypeId(this.likeCommentTaskForm.typecronl_id),
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

    resetForm() {
      this.accCount = 0
      this.typeList = []
      this.$refs["likeCommentForm"].resetFields();
      this.getList()
    },
  },
};
</script>

<style lang="stylus" scoped>
.tt-acccountsit-liketask--blacklist {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  .blacklist-label {
    margin-right: 14px;
  }
}

.tt-acccountsit--title {
  margin-bottom: 20px;
  font-size: 20px;
}
</style>