<template>
  <div class="tt-accsituation" ref="accsituation">
    <div class="tt-accsituation--top">
      <div class="mr-15">
        <el-select
          ref="gropuSelect"
          clearable
          v-model="group"
          placeholder="设置分组"
        >
          <el-option
            v-for="item in groupList"
            :value="item.grouping_id"
            :label="item.grouping_name"
            :key="item.grouping_id"
          ></el-option>
        </el-select>
      </div>

      <div class="mr-15">
        <el-cascader
          clearable
          :props="{ checkStrictly: true, value: 'value' }"
          :options="typeList"
          v-model="classiFication"
          placeholder="设置分类"
        ></el-cascader>
      </div>

      <div class="mr-15">
        <el-select clearable v-model="fans" placeholder="粉丝量">
          <el-option
            v-for="item in fans_option"
            :value="item.value"
            :label="item.label"
            :key="item.label"
          ></el-option>
        </el-select>
      </div>

      <div class="mr-15">
        <el-select clearable v-model="ascription" placeholder="账号归属">
          <el-option
            v-for="item in ascription_option"
            :value="item.value"
            :label="item.label"
            :key="item.label"
          ></el-option>
        </el-select>
      </div>
      <el-button class="base-btn search-btn" @click="handlerSearch"
        >搜索</el-button
      >
      <el-button class="base-btn search-btn" @click="RestQuery">重置</el-button>
      <el-button class="base-btn">账号分配</el-button>
      <el-button @click="handleFollow" class="base-btn">{{
        followBtnText
      }}</el-button>
      <el-button
        class="base-btn"
        style="width: 150px"
        @click="showBatchEditorDialog"
        >编辑选中账号信息</el-button
      >
      <el-button class="base-btn">一键监控选中账号</el-button>
    </div>

    <table-custom
      class="tt-accsituation--tabel"
      :mutiSelect="true"
      @handleSelectionChange="handleSelectChange"
      :loading="loading"
      :tableData="memberList"
      :columns="columns"
    ></table-custom>

    <Pagination
      :total="total"
      :page="page"
      :size="limit"
      @pagination="handlePagination"
    />

    <EditorDialog
      @closeEditorDialog="closeEditorDialog"
      @updateMemberList="updateMemberList"
      :showEditorDialog="showEditorDialog"
      :typeList="typeList"
      :user_id="user_id"
      :groupList="groupList"
      :userIdList="userIdList"
    />

    <VideoTabel
      @closeVideoTabel="closeVideoTabel"
      :shwoVideoTabel="shwoVideoTabel"
      :videoList="videoList"
      :videoCount="videoCount"
      :member_id="member_id"
    />
    <ViewerTabel
      @updateVisitorList="updateVisitorList(arguments)"
      @toogleViewerTabel="toogleViewerTabel"
      :showViewerTabel="showViewerTabel"
      :vistList="vistList"
      :member_id="member_id"
      :visterTotal="visterTotal"
      :user_id="user_id"
    />
    <BatchEditor
      :member_ids="member_ids"
      :showBatchEditor="showBatchEditor"
      :editorTota="editorTota"
      :groupName="groupString"
      :typeName="classiFication"
    />
    <ReleaseVideoDialog
      :showReleaseVideoDialog="showReleaseVideoDialog"
      @closeReleaseVideoDialog="closeReleaseVideoDialog"
    />
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom";
import Pagination from "@/components/myComponent/table/pagination";
import EditorDialog from "./editoDialog/editorDialog";
import ReleaseVideoDialog from "./taskDialog/releaseVideoDialog";
import BatchEditorDialog from "./batchEditorDialog/batchEditorDialog";
import VideoTabel from "./videoTabel/videoTabel";
import ViewerTabel from "./ViewerLabel/viewerTabel";
import BatchEditor from "./taskDialog/batchEditor";

export default {
  name: "AccountSituation",
  components: {
    tableCustom,
    Pagination,
    EditorDialog,
    BatchEditorDialog,
    VideoTabel,
    ViewerTabel,
    BatchEditor,
    ReleaseVideoDialog,
  },
  computed: {
    followBtnText() {
      return this.isFollow === true ? "一键回关已开启" : "开启一键回关";
    },
    batchEditorLength() {
      return this.batchEditorList.length;
    },
    accTotal() {
      return this.check_all === "true" ? 100 : 0;
    },
    isTaskConfigDisabled() {
      return (
        this.classiFication.length === 0 || this.batchEditorList.length === 0
      );
    },
    typeSelectPlaceholder() {
      return this.group === "" ? "请先选择分组" : "选择分类";
    },
    isTypeSelectDis() {
      return this.group === "";
    },
  },
  watch: {
    classiFication() {
      let data = {
        typecontrol_id: this.formatTypeId(),
        limit: this.limit,
        page: this.page,
        grouping_id: this.group ?? "",
      };
      let arr = Object.entries(this.typeList)/* .find((item) => {
        return item?.[1]?.grouping_id === newVal;
      }); */
      console.log(arr)
      this.getMemberList(data);
    },

    async group(newVal) {
      let arr = Object.entries(this.groupList).find((item) => {
        return item?.[1]?.grouping_id === newVal;
      });
      this.groupString = arr?.[1]?.grouping_name;
      let data = {
        typecontrol_id: this.formatTypeId(),
        grouping_id: this.group ?? "",
        limit: this.limit ?? 10,
        page: this.page ?? 1,
      };
      let searchTypeData = {
        grouping_id: this.group,
      };
      this.getMemberList(data);
      let result = await this.$api({
        type: "getTypecontrol",
        data: searchTypeData,
      });
      this.typeList = this.getTreeData(result.data);
    },
  },
  data() {
    return {
      showReleaseVideoDialog: false, //控制发布视频dialog展示
      showBatchEditor: false,
      showEditorDialog: false, //是否展示编辑按钮界面
      showBatchEiDialog: false, //是否展示批量编辑按钮界面
      shwoVideoTabel: false, //是否展示视频播放弹窗
      showViewerTabel: false, //是否展示访问列表表格
      isFollow: false, //是否开启一键回关
      searchForm: {
        grouping_id: "",
        typecontrol_id: "",
        uid: "",
        fans: "",
        acc_id: "",
      },
      accStatusMap: {
        1: "正常",
        0: "封禁",
        2: "登出",
        2096: "私密账号",
        3002290: "个人资料，查看历史记录不可用",
      }, //账号状态
      classiFication: [], //设置分类
      typeList: [], //设置分类options   从接口拿的，动态渲染
      loading: false, //表格懒加载选项
      groupList: [], //分组options
      columns: [
        //表格组件options（包含模板）      用来渲染表格
        {
          prop: "avatar_thumb",
          label: "基础信息",
          align: "left",
          width: "300",
          render: (h, { row }) => {
            return (
              <div style="display: flex;min-width: 300px">
                <a
                  target="three"
                  href={"https://www.tiktok.com/@" + row.unique_id}
                >
                  <el-image
                    class="table-avatar mr-15"
                    src={row.avatar_thumb}
                    style="width: 60px; height: 60px; border-radius: 50%;margin-right: 16px"
                  ></el-image>
                </a>
                <div>
                  <p>{row.nickname}</p>
                  <p>ID ：{row.unique_id}</p>
                  <el-tooltip content="Top center" placement="right-start">
                    <div slot="content">
                      账号归属：
                      <br />
                      设备分类：
                      <br />
                      设备编号：
                      <br />
                      备份名称：
                      <br />
                    </div>
                    <span style="display: inline-block; background-color: #FFDDA5">
                      设备信息
                    </span>
                  </el-tooltip>
                </div>
              </div>
            );
          },
        },
        {
          prop: "status",
          label: "状态",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return <div>{this.accStatusMap[row.status]}</div>;
          },
        },
        {
          prop: "signature",
          label: "个人简介",
          align: "center",
          render: (h, { row }) => {
            return (
              <el-tooltip content={row.signature} placement="top">
                <p>{row.signature.substring(0, 10) + "..."}</p>
              </el-tooltip>
            );
          },
        },
        {
          prop: "aweme_count",
          label: "视频数量",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <span
                style="cursor: pointer"
                onClick={this.showVideoTabel.bind(this, row)}
              >
                {row.aweme_count}
              </span>
            );
          },
        },
        {
          prop: "unread_viewer_count",
          label: "主页访问人数",
          align: "center",
          render: (h, { row }) => {
            return (
              <span
                style="cursor: pointer"
                onClick={this.toogleViewerTabel.bind(this, row)}
              >
                {row.unread_viewer_count}
              </span>
            );
          },
        },
        {
          prop: "follower_status",
          label: "播放/收藏/转发",

          align: "center",
          render: (h, { row }) => {
            return <span>{row.play_num} / 0 / 0</span>;
          },
        },
        {
          prop: "following_status,following_count,play_num",
          label: "关注/粉丝/获赞",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                {row.following_count} / {row.follower_status} /{" "}
                {row.total_favorited}
              </div>
            );
          },
        },
        {
          prop: "operation",
          label: "操作",
          width: "400",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  onClick={this.handleEdit.bind(this, row)}
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  onClick={this.handleDelete.bind(this, row)}
                >
                  删除
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  onClick={this.handleMonitor.bind(this, row)}
                >
                  监控
                </el-button>

                <el-button
                  size="mini"
                  type="primary"
                  onClick={this.handleAnalysis.bind(this, row)}
                >
                  分析
                </el-button>

                <el-button
                  size="mini"
                  type="primary"
                  onClick={this.handleRelease.bind(this, row)}
                >
                  发布视频
                </el-button>
              </div>
            );
          },
        },
      ],
      acc_id: "", //查询框的账号ID
      ascription: "",
      ascription_option: [
        { value: "1", label: "张三" },
        { value: "2", label: "李四" },
        { value: "3", label: "王五" },
      ],
      fans_option: [
        //粉丝量下拉框options  TODO 数据可能要问后端拿，目前写死了
        { value: [1000, 2000], label: "1k-2k" },
        { value: [1000, 2000], label: "2k-9k" },
        { value: [1000, 2000], label: "9k-10k" },
      ],
      fans: "", //粉丝量查询框对应 model
      page: 1, //页码
      taskConfig: "", //对应设置任务下拉框 model
      memberList: [], //渲染表格的数据    和后端对接的  对应获取函数为getMemberList
      accConfigCloumn: [
        //任务下拉框的options
        "视频发布",
        "评论区点赞",
        "关注",
        "私信",
      ],
      check_all: "", //是否选择所有账号
      total: 0, //返回的账号总条数
      fans_total: 0, //粉丝总量
      groupString: "",
      group: "", //设置分组
      limit: 10, //每页请求数据条数
      user_video_num: 0, //视频数量
      videoList: [], //用户视频列表数据
      vistList: [], //访问列表数据
      member_id: "", //用户ID，获取数据用的
      visterTotal: 0, //访问总人数
      user_id: "", //被选中的用户的UID
      batchEditorList: [], //批量编辑的账号列表
      materialTotal: 0, //素材数量  给批量编辑窗口用的
      videoCount: 0,
      userIdList: [], //选中用户的UID  组件通信之间会用到
      member_ids: "",
      editorTota: 0,
      userInfo: "",
    };
  },

  mounted() {
    const scrollView = document.getElementsByClassName('tt-main')
    this.getMemberList();
    /*     this.getTypeControlList(); */
    this.getGroupList();
    console.log(scrollView)
    scrollView[0].addEventListener('scroll',this.scrollHandle,true)

  },
    beforeDestroy () {
    // 获取指定元素
    const scrollview = document.getElementsByClassName('tt-main')
    // 移除监听
    scrollview[0].removeEventListener('scroll', this.scrollHandle, true)
  },
  methods: {

    
             
                scrollHandle(e){
         
      console.log(e,1111);
        },
   

    /* 
        function: formatTypeId
        params: null
        desc: 格式化分类ID
        return: 格式化之后的分类ID，数组最后一位
    */
    formatTypeId() {
      return this.classiFication[this.classiFication.length - 1] ?? "";
    },
    /* 
        function: handleFollow
        params: null
        desc: 一键回关回调
    */
    handleFollow() {
      this.isFollow = !this.isFollow;
      console.log("一键回关");
    },

    /* 
        function: handleAnalysis
        params: row | 默认值，获取表格行内数据
        desc: 跳转到账号分析界面
    */
    handleAnalysis(row) {
      let unique_id = row.unique_id;
      let userInfo = row;
      this.$router.push({
        name: "analysis",
        query: { id: unique_id, userInfo: JSON.stringify(userInfo) },
      });
    },
    /* 
        function: closeReleaseVideoDialog
        params: null
        desc: 关闭发布视频弹窗
    */
    closeReleaseVideoDialog() {
      this.showReleaseVideoDialog = false;
    },
    /* 
        function: handleRelease
        params: null
        desc: 发布视频回调
    */
    handleRelease() {
      this.showReleaseVideoDialog = true;
      console.log("发布视频");
    },
    /* 
        function: handleMonitor
        params: null
        desc: 单账号监控回调
    */
    handleMonitor() {
      console.log("监控");
    },

    /* 
        function: showBatchEditorDialog
        params: null
        desc: 打开批量编辑弹窗
    */
    showBatchEditorDialog() {
      if (
        this.group === "" ||
        this.classiFication.length === 0 ||
        this.batchEditorList.length === 0
      ) {
        this.$message.error("请先选择分组、分类、账号");
        return false;
      }
      this.showBatchEditor = true;
    },

    /* 
        function: closeBatchEditor
        params: null
        desc: 关闭批量编辑弹窗
    */
    closeBatchEditor() {
      this.showBatchEditor = false;
      this.member_ids = "";
    },
    /* 
        function: updateMemberList
        params: null
        desc: 刷新界面，用于更新操作之后
    */
    updateMemberList() {
      this.getMemberList();
    },

    /* 
        function: RestQuery
        params: null
        desc: 重置搜索字段
    */
    RestQuery() {
      this.classiFication = [];
      this.acc_id = "";
      this.fans = "";
      this.searchForm.grouping_id = "";
      this.group = "";
      this.getMemberList();
      this.$message.success("重置成功");
    },

    /* 
        function: updateVisitorList
        params: params | 子组件传的参数，arguments
        desc: 用来更新访问人数dialog的数据更新
    */
    async updateVisitorList(params) {
      let result = await this.getVisitorList({
        member_id: params[0],
        page: params[1],
      });
      this.vistList = result.list;
    },

    /* 
        function: toogleViewerTabel
        params: null
        desc: 切换访问列表表格显示状态
    */
    toogleViewerTabel(val) {
      this.showViewerTabel = !this.showViewerTabel;
      this.member_id = val?.member_id;
      this.user_id = val?.uid;
      this.getVisitorList({ member_id: this.member_id }).then((res) => {
        this.vistList = res.list;
        this.visterTotal = res.count;
      });
      this.member_id = "";
    },

    /* 
        function: getVisitorList
        params: member_id | 用户ID
        desc: 获取访问列表
        return: 访问列表
    */
    async getVisitorList({
      member_id = "",
      page = this.page,
      limit = 10, //TODO  后期可能需要变更字段
    }) {
      let data = {
        member_id: member_id ?? "",
        limit: limit,
        page: page,
      };
      let result = await this.$api({ type: "getVistorList", data: data });
      return result.data;
    },

    /* 
        function: closeVideoTabel
        params: null
        desc: 关闭视频列表
    */
    closeVideoTabel() {
      this.shwoVideoTabel = false;
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
        function: closeBatchEidialog
        params: null
        desc: 批量编辑弹框展示
    */
    closeBatchEidialog() {
      this.materialTotal = 0;
      this.showBatchEiDialog = false;
    },

    /* 
        function: handlerSearch
        params: null
        desc: 搜索按钮回调
    */
    async handlerSearch() {
      let data = {
        typecontrol_id: this.formatTypeId(),
        uid: this.acc_id ?? "",
        min: this.fans[0] ?? "",
        max: this.fans[1] ?? "",
        limit: this.limit ?? 10,
        page: this.page ?? 1,
        grouping_id: this.group ?? "",
      };
      let result = await this.$api({
        type: "getMember",
        data: data,
      });
      console.log(result);
      this.memberList = result?.data?.list ?? [];
      this.total = result?.data?.count ?? 0;
    },

    /* 
        function: handlePagination
        params: null
        desc: 打开访问人数表格
    */
    handlePagination(val) {
      this.limit = val.limit;
      this.page = val.page;
      let data = {
        typecontrol_id: this.formatTypeId(),
        grouping_id: this.group ?? "",
        limit: this.limit ?? 10,
        page: this.page ?? 1,
      };
      this.getMemberList(data);
    },

    /* 
        function: batchEditor
        params: null
        desc: 批量编辑回调
    */
    async batchEditor() {
      try {
        if (this.group.toString().length === 0) {
          this.$message.error("请选择分组");
          return false;
        }
        if (this.classiFication.length === 0) {
          this.$message.error("请选择分类");
          return false;
        }
        if (this.batchEditorList.length === 0) {
          this.$message.error("请选择账号");
          return false;
        }
        let data = {
          typecontrol_id: this.formatTypeId(),
        };
        let result = await this.$api({ type: "getProjectNum", data: data });
        this.materialTotal = result.data.num ?? 0;
        this.showBatchEiDialog = true;
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: closeEditorDialog
        params: null
        desc: 关闭编辑弹窗
    */
    closeEditorDialog() {
      this.showEditorDialog = false;
    },

    /* 
        function: getVideoList
        params: null
        desc: 获取用户视频列表
    */
    async getVideoList(data = { member_id: "", page: this.page, limit: 10 }) {
      let result = await this.$api({ type: "getMemberList", data: data });
      this.videoList = result.data.list ?? [];
      this.videoCount = result.data.count ?? 0;
    },

    /* 
        function: updateProjectNum
        params: params | arguments
        desc: 更新可用素材，由子组件触发的自定义事件
    */
    async updateProjectNum(params) {
      let data = { typecontrol_id: params[0] };
      let result = await this.$api({ type: "getProjectNum", data: data });
      this.materialTotal = result.data.num ?? 0;
    },

    /* 
        function: shwoVideoTabel
        params: val | 默认参数，获取相应用户的member_id
        desc: 打开视频表格,并进行后续操作
    */
    async showVideoTabel(val) {
      this.member_id = val.member_id;
      this.shwoVideoTabel = true;
      let data = { member_id: val.member_id, page: this.page, limit: 10 };
      await this.getVideoList(data);
    },

    /* 
        function: closeFollowTask
        params: null
        desc: 关闭关注任务配置
    */
    closeFollowTask() {
      this.showFollowDialog = false;
      this.taskConfig = "";
    },

    /* 
        function: closeLetterTask
        params: null
        desc: 关闭私信任务配置
    */
    closeLetterTask() {
      this.showLetterTask = false;
      this.taskConfig = "";
    },

    /* 
        function: closeLikeCommentTask
        params: null
        desc: 关闭点赞任务任务配置
    */
    closeLikeCommentTask() {
      this.showLikeCommentTask = false;
      this.taskConfig = "";
    },

    /* 
        function: closeVideoTask
        params: null
        desc: 关闭视频任务配置
    */
    closeVideoTask() {
      this.showVideoTask = false;
      this.taskConfig = "";
    },

    /* 
        function: handleSelectChange
        params: val | 默认值为对象，里面是选中账号信息
        desc: 表格多选框改变时的回调
    */
    handleSelectChange(val) {
      this.member_ids = "";
      this.batchEditorList = val;
      val.length === 100 ? (this.check_all = true) : (this.check_all = false);
      this.userIdList = this.batchEditorList.map((item) => {
        return item.uid;
      });
      let member_id = this.batchEditorList.map((item) => {
        return item.member_id;
      });
      member_id.forEach((item) => {
        this.member_ids += `${item},`;
      });
      this.editorTota = this.batchEditorList.length;
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
        function: getMemberList
        params: null
        desc: 异步获取memberList，页面渲染时调用
    */
    async getMemberList(data = { limit: this.limit, page: this.page }) {
      try {
        this.loading = true;
        let result = await this.$api({
          type: "getMember",
          data: data,
        });
        this.memberList = result.data.list;
        this.total = result.data.count;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: handleEdit
        params: row | 该行的相应数据
        desc: 编辑操作时的回调
    */
    handleEdit(row) {
      this.user_id = row.uid;
      this.showEditorDialog = true;
    },

    /*
        function: handleDelete
        params: index,row | default
        desc: 删除操作时的回调
    */
    async handleDelete(row) {
      try {
        this.$message.success("删除成功");
        let result = await this.$api({
          type: "deleteMember",
          data: { member_ids: row.member_id },
        });
        if (result.status == 200) {
          this.$message.success(result.msg ?? "操作成功");
          return;
        }
        this.$message.error(result.msg ?? "操作失败");
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: handlerCurrentChange
        params: val | default
        desc: 分页的回调，设置page为val，当val改变时发起请求，获取数据重新渲染页面
    */
    /*     async handlerCurrentChange(val) {
      try {
        this.page = val;
        let result = await this.$api({
          type: "getMember",
          data: { page: this.page },
        });
        this.memberList = result.data.list;
      } catch (error) {
        console.error(error);
      }
    }, */
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/base/base.scss";
.base-btn {
  background-color: $button-back-color;
  border-color: $button-bord-color;
  color: #fff;
}

.tt-accsituation-searchForm {
  display: flex;
}

.tt-accsituation--top {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  width: 100%;
  height: 60px;
}

.tt-accsituation-searchbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-radius: 8px;

  .el-input--suffix {
    width: 200px;
  }
}

.search-btn {
  width: 70px;
}

.tt-accsituation--settask {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 10px;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-radius: 8px;
}

.tt-accsituation--tabel {
  width: 100% !important;
  border-radius: 8px;
}

.batchedit-btn {
  width: 150px;
}

.ml-15 {
  margin-left: 15px;
}

.mr-15 {
  margin-right: 15px;
}

.mr-30 {
  margin-right: 10px;
}

.ml-50 {
  margin-left: 50px;
}

.searchbtn-group {
  display: flex;
  justify-content: flex-end;
  margin-left: 80px;
}

.tt-accsituation-setid {
  height: 40px !important;
}

.tt-accsituation-topsearch {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-radius: 8px;
}

.topsearch-right {
  margin-left: 10px;
}

.editor-btn {
  display: flex;
  justify-content: flex-end;
}

.table-phonenumber {
  width: 80px;
  height: 80px;
  background-color: #ffdda5;
}
.table-avatar {
}
</style>