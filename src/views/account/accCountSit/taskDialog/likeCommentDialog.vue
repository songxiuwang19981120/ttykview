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
        label-position="left"
        label-width="216px"
        v-model="likeCommentTaskForm"
      >
        <el-form-item label="选择国家 ：" v-model="likeCommentTaskForm.country">
          <el-select
            v-model="likeCommentTaskForm.country"
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
          v-model="likeCommentTaskForm.source_data"
        >
          <el-select
            v-model="likeCommentTaskForm.source_data"
            placeholder="选择数据来源"
          >
            <el-option
              v-for="item in sourceData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="选择需关注分组 ："
          v-model="likeCommentTaskForm.need_follow_group"
        >
          <el-select
            v-model="likeCommentTaskForm.need_follow_group"
            placeholder="需关注分组"
          >
            <el-option
              v-for="item in groupData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="单号作品点赞上限（次）："
          :prop="likeCommentTaskForm.work_likenum_max"
        >
          <el-input
            type="text"
            v-model="likeCommentTaskForm.work_likenum_max"
            placeholder="输入作品点赞上限"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="单号点赞上限（次）："
          :prop="likeCommentTaskForm.acc_likenum_max"
        >
          <el-input
            type="text"
            v-model="likeCommentTaskForm.acc_likenum_max"
            placeholder="输入单号点赞上限 "
          ></el-input>
        </el-form-item>
        <el-form-item
          label="评论获赞小于（次）："
          :prop="likeCommentTaskForm.comment_likenum_less"
        >
          <el-input
            type="text"
            v-model="likeCommentTaskForm.comment_likenum_less"
            placeholder="输入评论获赞小于"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="连续失败执行下一个号（次） ："
          :prop="likeCommentTaskForm.continuity_lose"
        >
          <el-input
            type="text"
            v-model="likeCommentTaskForm.continuity_lose"
            placeholder="输入连续失败次数"
          ></el-input>
        </el-form-item>

        <div class="tt-acccountsit-liketask--blacklist">
          <span class="blacklist-label">黑名单：</span>
          <el-checkbox-group v-model="likeCommentTaskForm.black_list">
            <el-checkbox
              v-for="item in blackList"
              :key="item"
              :label="item"
            ></el-checkbox>
          </el-checkbox-group>
        </div>

        <div>
          <span>执行端选择：</span>
          <el-checkbox-group v-model="likeCommentTaskForm.port">
            <el-checkbox label="协议"></el-checkbox>
            <el-checkbox label="真机"></el-checkbox>
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
    showLikeCommentTask: {
      type: Boolean,
    },
  },
  data() {
    return {
      //TODO 黑名单选择  需要跟后端对接
      blackList: ["无昵称", "无作品", "无头像", "历史已操作用户"],
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
      sourceData: [
        {
          value: "巴西宠物",
          label: "巴西宠物",
        },
        {
          value: "美国宠物",
          label: "美国宠物",
        },
        {
          value: "英国宠物",
          label: "英国宠物",
        },
        {
          value: "法国宠物",
          label: "法国宠物",
        },
      ],
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
        country: "", //选择国家
        source_data: "", //数据来源
        need_follow_group: "", //需关注分组
        work_likenum_max: "", //单号作品点赞上限
        acc_likenum_max: "", //单号点赞上限
        comment_likenum_less: "", //评论获赞小于
        continuity_lose: "", //连续失败执行下一个号
        black_list: [], //黑名单
        port: [], //执行端协议
      },
    };
  },

  mounted() {},

  methods: {
    handlerClose() {
      this.$emit("closeLikeCommentTask");
    },
    handlerConfrim() {
      console.log(this.likeCommentTaskForm);
    },
  },
};
</script>

<style lang="stylus">
.tt-acccountsit-liketask--blacklist {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  .blacklist-label {
    margin-right: 14px;
  }
}
</style>