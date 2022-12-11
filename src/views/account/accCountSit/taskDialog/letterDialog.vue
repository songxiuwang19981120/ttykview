<template>
  <div>
    <el-dialog
      width="45%"
      :visible="showLetterTask"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">私信任务配置</h1>
      </span>

      <el-form
        class="lettertask-form"
        label-position="left"
        label-width="216px"
        v-model="letterTaskForm"
      >
        <el-form-item label="选择国家 ：" v-model="letterTaskForm.country">
          <el-select v-model="letterTaskForm.country" placeholder="选择国家">
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
          v-model="letterTaskForm.source_data"
        >
          <el-select
            v-model="letterTaskForm.source_data"
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
          label="单号私信上限 :"
          :prop="letterTaskForm.acc_letter_maxnum"
        >
          <el-input
            type="text"
            v-model="letterTaskForm.acc_letter_maxnum"
            placeholder="输入单号私信上限"
          ></el-input>
        </el-form-item>

        <el-form-item
          label-width="150px"
          label="总私信上限 :"
          :prop="letterTaskForm.letter_frequency"
        >
          <div class="between-input">
            <el-input
              class="lettertask-input--between"
              v-model="letterTaskForm.letter_frequency_minnum"
              autocomplete="off"
              placeholder="最小"
            ></el-input
            >&nbsp;&nbsp;
            <el-input
              class="lettertask-input--between"
              v-model="letterTaskForm.letter_frequency_maxnum"
              autocomplete="off"
              placeholder="最大"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item
          label="粉丝数量小于："
          :prop="letterTaskForm.fans_lessnum"
        >
          <el-input
            v-model="letterTaskForm.fans_lessnum"
            placeholder="输入指定粉丝量"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="@用户数量：" :prop="letterTaskForm.notify_accnum">
          <el-input
            v-model="letterTaskForm.notify_accnum"
            placeholder="输入@用户数量"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="连续失败执行下一个号（次） ："
          :prop="letterTaskForm.continuity_lose"
        >
          <el-input
            type="text"
            v-model="letterTaskForm.continuity_lose"
            placeholder="输入连续失败次数"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="关注数量小于："
          :prop="letterTaskForm.letter_lessnum"
        >
          <el-input
            type="text"
            v-model="letterTaskForm.letter_lessnum"
            placeholder="输入指定关注数量"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="获赞评论小于 ："
          :prop="letterTaskForm.like_lessnum"
        >
          <el-input
            type="text"
            v-model="letterTaskForm.like_lessnum"
            placeholder="输入指定评论数量"
          ></el-input>
        </el-form-item>

        <div class="lettertask-checkport">
          <span class="check">执行端选择：</span>
          <el-checkbox-group v-model="letterTaskForm.port">
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
    showLetterTask: {
      type: Boolean,
    },
  },
  data() {
    return {
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
      letterOptions: [
        {
          value: "法国素材",
          label: "法国素材",
        },
        {
          value: "美国素材",
          label: "美国素材",
        },
        {
          value: "英国素材",
          label: "英国素材",
        },
        {
          value: "俄国素材",
          label: "俄国素材",
        },
      ],
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
      ],
      //关注发布任务 提交表单
      letterTaskForm: {
        country: "",
        source_data: "",
        acc_letter_maxnum: "", //单号私信上限
        letter_total_maxnum: "", //总私信上限
        acc_letter_maxnum: "",
        letter_frequency: "",
        letter_frequency_maxnum: "",
        letter_frequency_minmum: "",
        fans_lessnum: "",
        theme_content: "",
        notify_accnum: "",
        continuity_lose: "",
        letter_lessnum: "", //关注数量小于
        like_lessnum: "", //获赞评论小于
        port: [], //执行端选择
      },
    };
  },

  mounted() {},

  methods: {
    handlerClose() {
      console.log("执行了");
      this.$emit("closeLetterTask");
    },
    handlerConfrim() {
      console.log(this.letterTaskForm);
    },
  },
};
</script>

<style lang="stylus">
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
</style>