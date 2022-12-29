<template>
  <div>
    <el-dialog
      width="40%"
      :visible="showLetterTask"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">关注任务配置</h1>
        <p>当前已选中0个账号</p>
      </span>
      <el-form
        ref="letterForm"
        :rules="rules"
        class="lettertask-form"
        label-position="left"
        label-width="220px"
        :model="letterTaskForm"
      >

              <el-form-item prop="group" label="选择分组 ：">
          <el-select
            style="width: 45%"
            ref="gropuSelect"
            clearable
            v-model="letterTaskForm.group"
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

        <el-form-item prop="typecontrol_id" label="选择分类 ：">
          <el-cascader
            style="width: 45%"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="letterTaskForm.typecontrol_id"
          ></el-cascader>
        </el-form-item>

        <el-form-item
          label="选择国家 ："
          v-model="letterTaskForm.account_region"
          prop="account_region"
        >
          <el-select
            style="width: 38%"
            v-model="letterTaskForm.account_region"
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
          label="选择数据来源 ："
          v-model="letterTaskForm.tasklist_id_list"
          prop="tasklist_id_list"
        >
          <el-select
            multiple
            style="width: 38%"
            v-model="letterTaskForm.tasklist_id_list"
            placeholder="选择数据来源"
          >
            <el-option
              v-for="item in sourceData"
              :key="item.tasklist_id"
              :label="item.task_name"
              :value="item.tasklist_id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="单号每日关注上限 ："
          prop="user_follow_upper_limit"
          v-model="letterTaskForm.user_follow_upper_limit"
        >
          <el-input
            style="width: 38%"
            type="text"
            v-model="letterTaskForm.user_follow_upper_limit"
            placeholder="输入单号关注上限"
          ></el-input>
        </el-form-item>

        <el-form-item 
        label-width="150px" 
        label="关注频率 ：" 
        required>
          <div class="between-input">
            <el-form-item class="rate-min" prop="rate_min">
            <el-input
              
              class="lettertask-input--between"
              v-model="letterTaskForm.rate_min"
              autocomplete="off"
              placeholder="最小"
            ></el-input
            
            >
            </el-form-item>
           
            <el-form-item class="rate-max" prop="rate_max">
            <el-input
              
              class="lettertask-input--between"
              v-model="letterTaskForm.rate_max"
              autocomplete="off"
              placeholder="最大"
            ></el-input>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="粉丝数量小于：" prop="follower_status">
          <el-input
            style="width: 38%"
            v-model="letterTaskForm.follower_status"
            placeholder="输入指定粉丝量"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="连续失败执行下一个号（次）：" prop="can_fail_num">
          <el-input
            style="width: 39%"
            type="text"
            v-model="letterTaskForm.can_fail_num"
            placeholder="输入连续失败次数"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="关注数量小于："
          prop="following_count"
          v-model="letterTaskForm.following_count"
        >
          <el-input
            style="width: 38%"
            type="text"
            v-model="letterTaskForm.following_count"
            placeholder="输入关注少于次数"
          ></el-input>
        </el-form-item>

        <el-form-item label="评论评论小于 ：" prop="total_favorited">
          <el-input
            style="width: 38%"
            type="text"
            v-model="letterTaskForm.total_favorited"
            placeholder="输入获赞小于次数"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注任务名称 ：" prop="remarks">
          <el-input
            style="width: 38%"
            type="text"
            v-model="letterTaskForm.remarks"
            placeholder="请备注任务名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="黑名单" prop="black_list">
          <el-checkbox-group v-model="letterTaskForm.black_list">
            <el-checkbox
              v-for="item in blackList"
              :key="item"
              :label="item"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReset">重 置</el-button>
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确认并执行</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formRule from "@/config/accountConfig/formRules.config";
const { letter } = formRule;
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
      rules: letter,
      blackList: ["无昵称", "无作品", "无头像", "历史已操作用户"],
      blackListMap: {
        '无头像': "no_avatar",
        '无作品': "no_aweme",
        '历史已操作用户': "historical_users",
        '无昵称': "no_nickname",
      },
      typeList:[],
      groupList:[],
      sourceData: [],
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
      letterTaskForm: {
        account_region: "", //国家
        user_follow_upper_limit: "", //单号关注上限
        rate_min: "", //关注频率最小值
        rate_max: "", //关注频率最大值
        typecontrol_id:'',
        follower_status: "", //粉丝量小于
        tasklist_id_list: [], //数据来源
        following_count: "", //关注数量小于
        total_favorited: "", //评论数量小于
        typecontrol_id: "",
        can_fail_num: "", //连续失败次数
        following_count: "", //关注数量小于
        black_list: [],
        uid_list: "",
        remarks:'',//备注任务名称
        group:''
      },
    };
  },

  mounted() {
    this.getTasklist();
    this.letterTaskForm.typecontrol_id = this.typecontrol_id;
    this.getGroupList()
  },

  methods: {
    async getTasklist() {
      let result = await this.$api();
    },

handleReset(){
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
      try {
        let result = await this.$api({ type: "getTypecontrol" });
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
      console.log("执行了");
      this.$emit("closeLetterTask");
      this.resetForm();
    },
    /* 
        function: handlerConfrim
        params: null
        desc: 提交表单
    */
    async handlerConfrim() {
      /*       let maxNum = this.letterTaskForm.rate_man
      let minNum = this.letterTaskForm.rate_min
      let isPass = (maxNum === 0 || minNum === 0) || ( minNum > maxNum)
      if(!isPass){
        this.$message.error('关注频率参数错误')
        return false
      } */
      await this.$refs["letterForm"].validate((valid) => {
        if (valid) {
          let userList = this.batchEditorList.map((item) => {
            return item.uid;
          });
          this.letterTaskForm.uid_list = userList;
          this.letterTaskForm.typecontrol_id = this.typecontrol_id;
          this.letterTaskForm.black_list = this.letterTaskForm.black_list.map(
            (item) => {
              return this.blackListMap[item];
            }
          );
         
          let data = this.letterTaskForm;
          
          this.aaa(data)
          
        }
      });
    },
    async aaa(data){
      let result = await this.$api({ type: "pushFollowTask", data: data });
          if (result.status == 200) {
            this.$message.success(res.msg);
            this.resetForm();
            this.handlerClose();
          }else{
            console.log('11111111111111111',result);
          this.$message.warning(result.msg);
          this.resetForm();
          }

    },

    async getTasklist() {
      let data = { task_type: "CollectionUser" };
      let result = await this.$api({ type: "getTasklist", data });
      this.sourceData = result.data.list;
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm() {
      this.$refs["letterForm"].resetFields();
      this.letterTaskForm.rate_min = '',
      this.letterTaskForm.rate_max = '',
      this.letterTaskForm.black_list = []
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