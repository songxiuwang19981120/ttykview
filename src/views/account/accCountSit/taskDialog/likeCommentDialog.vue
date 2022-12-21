<template>
  <div>
    <el-dialog
      width="40%"
      :visible="showLikeCommentTask"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">评论区点赞任务配置</h1>
      </span>
      <el-form
        :rules="rules"
        ref="likeCommentForm"
        label-position="left"
        label-width="216px"
        :model="likeCommentTaskForm"
      >
        <el-form-item
          label="选择国家 ："
          prop="account_region"
          v-model="likeCommentTaskForm.account_region"
        >
          <el-select
            style="width: 46%"
            clearable
            v-model="likeCommentTaskForm.account_region"
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
          prop="tasklist_id_list"
          label="选择数据来源 ："
          v-model="likeCommentTaskForm.tasklist_id_list"
        >
          <el-select
            style="width: 46%"
            clearable
            v-model="likeCommentTaskForm.tasklist_id_list"
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
        <el-form-item label="单号点赞上限（次）：" prop="user_digg_upper_limit">
          <el-input
            style="width: 46%"
            type="text"
            v-model="likeCommentTaskForm.user_digg_upper_limit"
            placeholder="输入单号点赞上限 "
          ></el-input>
        </el-form-item>
        <el-form-item
          label="评论获赞小于（次）："
          prop="comment_digg_count_lower_limit"
        >
          <el-input
            style="width: 46%"
            type="text"
            v-model="likeCommentTaskForm.comment_digg_count_lower_limit"
            placeholder="输入评论获赞小于"
          ></el-input>
        </el-form-item>
        <el-form-item label="连续失败执行下一个号（次）:" prop="can_fail_num">
          <el-input
            style="width: 46%"
            type="text"
            v-model="likeCommentTaskForm.can_fail_num"
            placeholder="输入连续失败次数"
          ></el-input>
        </el-form-item>

        <el-form-item label="黑名单 :" prop="black_list">
          <el-checkbox-group
            style="width: 101%"
            v-model="likeCommentTaskForm.black_list"
          >
            <el-checkbox
              v-for="item in blackList"
              :key="item"
              :label="item"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="port" label="执行端协议">
          <el-checkbox-group v-model="likeCommentTaskForm.port">
            <el-checkbox label="协议"></el-checkbox>
            <el-checkbox disabled label="真机"></el-checkbox>
            <!-- TODO  目前没有真机业务 -->
          </el-checkbox-group>
        </el-form-item>
        <!--        <div>
          <span>执行端选择：</span>
          
        </div> -->
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
const { likeComment } = formRule;
export default {
  name: "TtprojectVideoDialog",
  props: {
    showLikeCommentTask: {
      type: Boolean,
    },
    typecontrol_id: {
      type: Number,
    },
        userIdList:{
      type:Array
    },
        batchEditorList: {
      type: Array,
    },
  },
  data() {
    return {
      rules: likeComment,
      blackList: ["无昵称", "无作品", "无头像", "历史已操作用户"],
      blackListMap: {
        无头像: "no_avatar",
        无作品: "no_aweme",
        历史已操作用户: "historical_users",
        无昵称: "no_nickname",
      },
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
      ],
      //TODO 字段名称要跟后端协商   视频发布任务 提交表单
      likeCommentTaskForm: {
        account_region: "", //选择国家
        tasklist_id_list: "", //数据来源
        user_digg_upper_limit: "", //单号点赞上限
        comment_digg_count_lower_limit: "", //评论获赞小于
        can_fail_num: "", //连续失败执行下一个号
        black_list: [], //黑名单
        port: [], //执行端协议
        typecontrol_id: "",
        uid_list:'',
      },
    };
  },

  mounted() {
    this.getTasklist();
  },

  methods: {
    async getTasklist() {
      let data = { task_type: "CollectionVideo" };
      let result = await this.$api({ type: "getTasklist", data });
      this.sourceData = result.data.list;
      console.log(result);
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
            let result = this.$api({
              type: "pushCommentTask",
              data: this.likeCommentTaskForm,
            });
            if (result.status == 200) {
              this.$message.success(result.msg ?? '操作成功');
              return
            }
            this.resetForm();
            this.handlerClose();
          }
        });
      } catch (error) {
        console.error(error)
      }
    },

    /* 
        function: resetForm
        params: null
        desc: 重置表单字段
    */
    resetForm() {
      this.$refs["likeCommentForm"].resetFields();
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