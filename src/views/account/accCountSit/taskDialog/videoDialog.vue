<template>
  <div class="tt-acccountsit--vieotask">
    <el-dialog
      width="40%"
      :visible="showVideoDialog"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">视频发布任务配置</h1>
        <p>当前已选中0个账号</p>
      </span>

      <el-form
        :rules="rules"
        ref="videoForm"
        label-position="left"
        label-width="130px"
        :model="vieoTaskForm"
      >
        <el-form-item label="选择分组 ：">
          <el-select
            style="width: 45%"
            ref="gropuSelect"
            clearable
            v-model="vieoTaskForm.group"
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

        <el-form-item label="选择分类 ：">
          <el-cascader
            style="width: 45%"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="vieoTaskForm.typecontrol_id"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="视频发布数量 ：" prop="video_num">
          <el-input
            style="width: 45%"
            type="number"
            placeholder="输入发布视频数量"
            v-model="vieoTaskForm.video_num"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题标签内容 ：" prop="label_num">
          <el-input
            style="width: 45%"
            v-model="vieoTaskForm.label_num"
            placeholder="输入发布标签数量"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="@粉丝数量 ：" prop="user_num">
          <el-input
            style="width: 45%"
            type="number"
            placeholder="输入@用户数量"
            v-model="vieoTaskForm.user_num"
          ></el-input>

          <el-checkbox label="@官方"></el-checkbox>
          <el-checkbox label="@同类博主"></el-checkbox>
        </el-form-item>

        <el-form-item label="备注任务名称 :">
          <el-input placeholder="备注任务名称" style="width: 45%" v-model="vieoTaskForm.task_name"></el-input>
        </el-form-item>

        <el-form-item label="发布时间 :">
          <el-date-picker
            v-model="vieoTaskForm.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="主题内容 :" prop="text">
          <el-input
            :disabled="isTextAreaDisabled"
            class="input-textarea"
            type="textarea"
            v-model="vieoTaskForm.text"
          ></el-input>
          <el-checkbox
            :disabled="isRandomTextDisabled"
            v-model="vieoTaskForm.text_round"
            >随机主题内容</el-checkbox
          >
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
export default {
  name: "TtprojectVideoDialog",
  props: {
    showVideoDialog: {
      type: Boolean,
    },
    classiFication: {
      type: Array,
    },
    batchEditorList: {
      type: Array,
    },
  },
  computed: {
    isRandomTextDisabled() {
      return this.vieoTaskForm.text.length !== 0;
    },
    isTextAreaDisabled() {
      return this.vieoTaskForm.text_round === true;
    },
    typeSelectPlaceholder() {
      return this.group === "" ? "请先选择分组" : "选择分类";
    },
    isTypeSelectDis() {
      return this.group === "";
    },
  },

  data() {
    return {
      rules: {
        video_num: [
          { required: true, message: "请输入视频发布数量", trigger: "blur" },
          {
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
        user_num: [
          { required: true, message: "请输入@用户数量", trigger: "blur" },
          {
            pattern: /^[0-9]*[1-9][0-9]*$/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
      },
      typeList: [],
      groupList: [],
      //TODO  需要跟后端对接字段  视频发布任务 提交表单
      vieoTaskForm: {
        typecontrol_id: "", //分类id
        uid_list: [], // uid数组
        video_num: "", //视频发布数量
        label_num: "", //主题标签内容
        user_num: "", // @用户数量
        text: "", //主题内容
        text_round: false, //如果是随机内容的话为1
        task_name: "", //备注任务名称
        date: "",
      },

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },

  mounted() {
    this.getGroupList();
  },

  methods: {

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
        function: handleReset
        params: null
        desc: 手动重置表单
    */
    handleReset(){
      this.resetForm()
    },

    /* 
        function: handlerClose
        params: null
        desc: 关闭后的回调
    */
    handlerClose() {
      this.$emit("closeVideoTask");
      this.resetForm();
    },

    /* 
        function: handlerConfrim
        params: null
        desc: 提交后的回调
    */
    async handlerConfrim() {
      try {
        await this.$refs["videoForm"].validate((valid) => {
          if (valid) {
            let userList = this.batchEditorList.map((item) => {
              return item.uid;
            });
            this.vieoTaskForm.typecontrol_id =
              this.classiFication[this.classiFication.length - 1];
            this.vieoTaskForm.text_round =
              this.vieoTaskForm.text_round === true ? 1 : 0;
            this.vieoTaskForm.uid_list = userList;
            this.$api({ type: "uploadVideoTask", data: this.vieoTaskForm })
              .then((res) => {
                if (res.status == 200) {
                  this.$message.success(res.msg);
                  this.handlerClose();
                  this.resetForm();
                  this.$message.success(res.msg ?? "操作成功");
                  return;
                }
                this.$message.error(res.msg ?? "操作失败");
              })
              .cathch(() => {
                this.$message.error("未知错误");
              });
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
      this.$refs["videoForm"].resetFields();
      this.vieoTaskForm.random_content = false;
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
  },
};
</script>

<style lang="stylus" scoped>
.tt-acccountsit--title {
  margin-bottom: 20px;
  font-size: 20px;
}

.el-input {
  width: 220px;
}

.input-textarea textarea {
  height: 90px !important;
}
</style>