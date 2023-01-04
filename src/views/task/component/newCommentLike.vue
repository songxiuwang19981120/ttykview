<template>
  <div>
    <el-dialog width="40%" :visible="showLikeCommentTask" :before-close="handlerClose" title="评论区点赞任务配置">
      <el-form :rules="rules" ref="likeCommentForm" label-position="left" label-width="210px" :model="likeCommentTaskForm">
        <el-form-item prop="group" label="账号分组 ：">
          <el-select style="width: 50%" ref="gropuSelect" clearable v-model="likeCommentTaskForm.group"
            placeholder="选择分组" size="medium" @change="getTypeControlList()">
            <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
              :key="item.grouping_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="typecontrol_id" label="账号分类 ：">
          <el-cascader style="width: 50%" clearable :props="{ checkStrictly: true, value: 'value' }" :options="typeList"
            v-model="likeCommentTaskForm.typecontrol_id" size="medium"></el-cascader>
        </el-form-item>
        <el-form-item label="">
          <p style="font-size:12px">当前已选中<span style="color:red">0</span>个账号</p>
        </el-form-item>
        <el-form-item prop="remarks" label="任务名称">
          <el-input type="text" size="medium" v-model="likeCommentTaskForm.remarks" placeholder="任务名称"
            style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="选择国家 ：" prop="account_region" v-model="likeCommentTaskForm.account_region">
          <el-select style="width: 50%" clearable multiple v-model="likeCommentTaskForm.account_region"
            placeholder="选择国家" size="medium">
            <el-option v-for="item in countryOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="tasklist_id_list" label="选择数据来源 ：" v-model="likeCommentTaskForm.tasklist_id_list">
          <el-select style="width: 50%" clearable multiple v-model="likeCommentTaskForm.tasklist_id_list"
            placeholder="选择数据来源" size="medium">
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
            <el-checkbox v-for="item in blackList" :key="item" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p  style="font-size:12px;text-align: center;">当前筛选条件可执行数据数量为<span style="color:red">0</span>条</p>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReset" size="medium">重 置</el-button>
        <el-button @click="handlerClose" size="medium">取 消</el-button>
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
    showLikeCommentTask: {
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
  computed: {
    typeSelectPlaceholder() {
      return this.group === "" ? "请先选择分组" : "选择分类";
    },
    isTypeSelectDis() {
      return this.group === "";
    },
  },
  data() {
    return {
      subLoading: false,
      rules: {
        group: [
          { required: true, message: "请选择账号分组", trigger: "blur" },
        ],
        typecontrol_id: [
          { required: true, message: "请选择账号分类", trigger: "blur" },
        ],
        account_region: [
          { required: true, message: "请选择国家", trigger: "blur" },
        ],
        tasklist_id_list: [
          { required: true, message: "请选择数据来源", trigger: "blur" },
        ],
        user_digg_upper_limit: [
          { required: true, message: "请填写点赞上限", trigger: "blur" },
          { pattern: /^\d+$/, message: '格式 必须为正整数', trigger: 'blur' }
        ],
        remarks: [
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
      blackList: ["无昵称", "无作品", "无头像", "历史已操作用户"],
      blackListMap: {
        无头像: "no_avatar",
        无作品: "no_aweme",
        历史已操作用户: "historical_users",
        无昵称: "no_nickname",
      },
      groupList: [],
      typeList: [],
      //TODO 需关注分组下拉框选择  需要跟后端对接
      groupData: [
        {
          value: "日本商城",
          label: "日本商城",
        },
        {
          value: "巴西商城",
          label: "巴西商城",
        },
        {
          value: "美国商城",
          label: "美国商城",
        },
      ],
      //TODO 数据来源  需要跟后端对接
      sourceData: [],
      //TODO 国家选择下拉框数据到时候要跟后端对接
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
      //新加坡，泰国，菲律宾，印度尼西亚，越南，马来西亚，巴西
      //TODO 字段名称要跟后端协商   视频发布任务 提交表单
      likeCommentTaskForm: {
        account_region: "", //选择国家
        tasklist_id_list: "", //数据来源
        user_digg_upper_limit: "1000", //单号点赞上限
        comment_digg_count_lower_limit: "5", //评论获赞小于
        can_fail_num: "3", //连续失败执行下一个号
        black_list: [], //黑名单
        port: [], //执行端协议
        typecontrol_id: "",
        uid_list: "",
        group: '',
        remarks: '' //备注任务名称
      },
    };
  },

  mounted() {
  },

  methods: {
    getList() {
      this.getTasklist();
      this.getGroupList()
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
      let data={
        grouping_id:this.likeCommentTaskForm.group
      }
      try {
        let result = await this.$api({ type: "getTypecontrol",data });
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


    async getTasklist() {
      let data = { task_type: "CollectionVideo" };
      let result = await this.$api({ type: "getTasklist", data });
      this.sourceData = result.data.list;
    },

    /* 
        function: handlerClose
        params: null
        desc: 关闭表单
    */
    handlerClose() {
      this.$emit("closeLikeCommentTask");
      this.resetForm();
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单
    */
    async handlerConfrim() {
      try {
        await this.$refs["likeCommentForm"].validate((valid) => {
          if (valid) {
            let userList = this.batchEditorList.map((item) => {
              return item.uid;
            });
            this.likeCommentTaskForm.uid_list = userList;
            this.likeCommentTaskForm.typecontrol_id = this.typecontrol_id;
            this.likeCommentTaskForm.black_list =
              this.likeCommentTaskForm.black_list.map((item) => {
                return this.blackListMap[item];
              });
            this.$api({
              type: "pushCommentTask",
              data: this.likeCommentTaskForm,
            }).then((res) => {
              this.$message.success(res.msg ?? "操作成功");
              this.resetForm();
              this.handlerClose();
              return
            }).catch(() => {
              this.$message.error(res.msg ?? "操作失败");
            })
          }
        });
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm() {
      this.getList()
      this.likeCommentTaskForm={
        account_region: "", //选择国家
        tasklist_id_list: "", //数据来源
        user_digg_upper_limit: "1000", //单号点赞上限
        comment_digg_count_lower_limit: "5", //评论获赞小于
        can_fail_num: "3", //连续失败执行下一个号
        black_list: [], //黑名单
        port: [], //执行端协议
        typecontrol_id: "",
        uid_list: "",
        group: '',
        remarks: '' //备注任务名称
      }
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