<template>
  <div class="tt-accsituation" ref="accsituation">
    <div class="tt-accsituation--top">
      <div class="flex-jus-spacebet">
        <div class="mr-30">
          <el-select
            style="width: 150px"
            size="medium"
            ref="gropuSelect"
            clearable
            v-model="group"
            placeholder="设置分组"
            @change="setLocalGroup"
          >
            <el-option
              v-for="item in groupList"
              :value="item.grouping_id"
              :label="item.grouping_name"
              :key="item.grouping_id"
            ></el-option>
          </el-select>
        </div>

        <div class="mr-30">
          <el-cascader
            style="width: 150px"
            size="medium"
            @change="setLocalType"
            clearable
            :props="{ checkStrictly: true, value: 'value' }"
            :options="typeList"
            v-model="classiFication"
            placeholder="设置分类"
          ></el-cascader>
        </div>

        <div class="mr-30">
          <el-select
            style="width: 100px"
            size="medium"
            @change="setLocalFans"
            clearable
            v-model="fans"
            placeholder="粉丝量"
          >
            <el-option
              v-for="item in fans_option"
              :value="item.value"
              :label="item.label"
              :key="item.label"
            ></el-option>
          </el-select>
        </div>

        <el-input
          style="width: 150px"
          size="medium"
          clearable
          class="search-uid search-uid--input mr-30"
          v-model="accUid"
          placeholder="请输入账号UID"
        ></el-input>

        <el-button
          type="primary"
          size="medium"
          class="base-btn search-btn"
          @click="handlerSearch"
          >搜 索</el-button
        >
        <el-button
          type="primary"
          size="medium"
          class="base-btn search-btn"
          @click="RestQuery"
          >重 置</el-button
        >
      </div>

      <div class="flex-jus-spacebet">
        <div class="ml-15">
          <span class="fz-14" style="color: rgba(16, 16, 16, 1)"
            >开启回关：</span
          >
          <el-switch
            @click="toogleFollow"
            style="width: 30px; height: 30px"
            v-model="openFollow"
            active-color="#ff4949"
          >
          </el-switch>
        </div>

        <el-button
          type="primary"
          size="medium"
          class="base-btn ml-15"
          style="width: 150px"
          @click="showBatchEditorDialog"
          >编辑选中账号信息</el-button
        >
      </div>
    </div>

    <div
      class="tt-accsituation-main"
      style="border: 1px solid #bbbbbb; border-radius: 8px"
    >
      <div
        style="height: 35px; margin-bottom: 10px"
        class="flex-jus-spacebet pad-0-20"
      >
        <div class="flex-jus-spacebet">
          <div class="flex-jus-spacebet">
            <p class="mr-30 fz-14">共{{ total }}个账号</p>
            <p class="mr-30 fz-14" style="color: #ff411f">
              已选择{{ accTotal }}个账号
            </p>
          </div>

          <div class="height-20 ml-20">
            <p class="fz-14">
              总关注次数 ：{{ total_follow }}次&nbsp;&nbsp; 总粉丝量 ：{{
                total_fans
              }}个
            </p>
          </div>

          <div v-if="(startRefresh === true) && (busThread !==0) && (subThread !== 0)" class="pad-0-20 flex ml-20">
            <transition name="el-fade-in-linear">
              <p class="fz-14">
                总刷新进度 ：
                <span style="color:#98AFFD">{{ busThread }} / {{ subThread }}</span>
              </p>
            </transition>
            <transition name="el-fade-in-linear">
              <img
                v-show="endRefresh === true"
                class="sucess-icon ml-15"
                src="../../../assets/sucess.png"
                alt="成功"
              />
            </transition>
          </div>

        </div>

        <div class="flex-jus-spacebet">
          <el-select
            size="medium"
            style="width: 110px"
            v-model="sortQuery"
            clearable
            placeholder="粉丝"
          >
            <el-option
              v-for="item in sortQueryOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            class="ml-15"
            size="medium"
            clearable
            style="width: 100px"
            placeholder="升序"
            v-model="sortWay"
          >
            <el-option
              v-for="item in sortOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            size="medium"
            type="primary"
            class="ml-15"
            @click="handleSort"
            >查 看</el-button
          >
          <el-button
            :disabled="isRefreshBtnDis"
            @click="handleRefresh"
            size="medium"
            type="primary"
            >{{ refreshText }}</el-button
          >
        </div>
      </div>

      <keep-alive>
        <table-custom
          ref="multipleTable"
          class="tt-accsituation--tabel"
          :mutiSelect="true"
          @handleSelectionChange="handleSelectChange"
          :loading="loading"
          :tableData="memberList"
          :columns="columns"
          :height="tabelHeight"
        ></table-custom>
      </keep-alive>

    <keep-alive>
      <Pagination
        style="padding: 4px"
        :total="total"
        :page="page"
        :limit="limit"
        @pagination="handlePagination"
        @handleCurrentChange="handleCurrentChange"
      />
    </keep-alive>
    </div>

    <ConfrimDelDialog
      :showConfrimDel="showConfrimDel"
      @handleClose="closeConfrimDel"
      @handleConfrim="confrimDel"
    />

    <EditorDialog
      ref="editor"
      @closeEditorDialog="closeEditorDialog"
      @updateMemberList="updateMemberList"
      :showEditorDialog="showEditorDialog"
      :typeList="typeList"
      :user_id="user_id"
      :groupList="groupList"
      :userIdList="userIdList"
      :accInfo="accInfo"
      :page="page"
      :limit="limit"
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
      @closeViewerTabel="closeViewerTabel"
      :showViewerTabel="showViewerTabel"
      :vistList="vistList"
      :member_id="member_id"
      :visterTotal="visterTotal"
      :user_id="user_id"
    />

    <BatchEditor
      :typecontrol_id="classiFication"
      :grouping_id="group"
      :uidList="userIdList"
      :member_ids="member_ids"
      :showBatchEditor="showBatchEditor"
      :editorTota="editorTota"
      :groupName="groupString"
      :nicknameCanUseNum="nicknameCanUseNum"
      :autographCanUseNum="autographCanUseNum"
      :headimageCanUseNum="headimageCanUseNum"
    />

    <ReleaseVideoDialog
      :showReleaseVideoDialog="showReleaseVideoDialog"
      @closeReleaseVideoDialog="closeReleaseVideoDialog"
      :acc_id="acc_id"
    />
  </div>
</template>

<script>
import store from "store";
import configureMap from "@/config/accountConfig/configureMap.config";
import tableCustom from "@/components/myComponent/table/tableCustom";
import Pagination from "@/components/myComponent/table/pagination";
import EditorDialog from "./editoDialog/editorDialog";
import ReleaseVideoDialog from "./taskDialog/releaseVideoDialog";
import BatchEditorDialog from "./batchEditorDialog/batchEditorDialog";
import VideoTabel from "./videoTabel/videoTabel";
import ViewerTabel from "./ViewerLabel/viewerTabel";
import BatchEditor from "./taskDialog/batchEditor";
import TableOperation from "./tableOperation/operationSelect";
import ConfrimDelDialog from "./confrimDelDialog/confrimDelDialog";
const {
  fansMap,
  fansOption,
  operationMap,
  accStatusMap,
  operationOption,
  sortQueryOption,
} = configureMap;
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
    TableOperation,
    ConfrimDelDialog,
  },


  computed: {
    showRefreshProgess(){
      return this.startRefresh === true || this.endRefresh === true
    },
    batchEditorLength() {
      return this.batchEditorList.length;
    },
    accTotal() {
      return this.check_all === true ? this.total : this.editorTota;
    },
    refreshText() {
      return this.startRefresh !== true ? "刷新账号数据" : "数据刷新中...";
    },
    isRefreshBtnDis(){
      return this.startRefresh === true
    }
  },
  created(){
    this.page = Number(store.get('page'))
    this.handleCurrentChange(this.page)
  },
  watch: {
    startRefresh(newVal) {
      if (newVal === true) {
        this.updateProgress();
      }
    },

    page(newVal) {
      store.set("page", newVal);
    },

    limit(newVal) {
      store.set("limit", newVal);
    },

    async classiFication(newVal) {
      console.log(newVal);
      if (newVal.length === 0) {
        this.checkType = false;
        return false;
      }
      if (this.group === "") {
        return false;
      }
      this.checkType = true;
      let data = {
        grouping_id: this.group,
        typecontrol_id: this.classiFication[this.classiFication.length - 1],
      };
      let result = await this.getProjectNum(data);
      console.log(result);
    },

    async group(newVal) {
      if (this.group === "") {
        this.checkGroup = false;
        this.typeList = [];
        this.classiFication = [];
        store.set("typecontrol_id", "");
        return false;
      }
      this.checkGroup = true;
      let arr = Object.entries(this.groupList).find((item) => {
        return item?.[1]?.grouping_id === newVal;
      });
      this.groupString = arr?.[1]?.grouping_name;
      let searchTypeData = {
        grouping_id: this.group,
      };
      let result = await this.$api({
        type: "getTypecontrol",
        data: searchTypeData,
      });
      this.typeList = this.getTreeData(result.data);
    },
  },
  data() {
    return {
      tabelHeight: (window.innerHeight - 224).toString(),
      openFollow: false,
      total_fans: 0, //总关注次数
      total_follow: 0, //总粉丝量
      accInfo: {},
      accUid: "", //账号UID
      showConfrimDel: false,
      showReleaseVideoDialog: false, //控制发布视频dialog展示
      showBatchEditor: false,
      showEditorDialog: false, //是否展示编辑按钮界面
      showBatchEiDialog: false, //是否展示批量编辑按钮界面
      shwoVideoTabel: false, //是否展示视频播放弹窗
      showViewerTabel: false, //是否展示访问列表表格
      sortQuery: "", //排序字段
      sortWay: "", //排序方式
      searchForm: {
        grouping_id: "",
        typecontrol_id: "",
        uid: "",
        fans: "",
        acc_id: "",
      },
      sortOption: [
        {
          value: "asc",
          label: "升序",
        },
        {
          value: "desc",
          label: "降序",
        },
      ],
      sortQueryOption: sortQueryOption, //排序字段
      operationOption: operationOption,
      accStatusMap: accStatusMap, //账号状态
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
          width: "240",
          render: (h, { row }) => {
            return (
              <div style="display: flex;align-items:center;min-width: 270px">
                <a
                  style="display: flex;align-items:center;"
                  target="three"
                  href={"https://www.tiktok.com/@" + row.unique_id}
                >
                  <el-image
                    lazy
                    scroll-container=".el-table__body-wrapper"
                    class="table-avatar mr-15"
                    src={row.avatar_thumb}
                    style="width: 50px; height: 50px; border-radius: 50%;margin-right: 16px"
                  ></el-image>
                </a>
                <div>
                  <p style="font-size: 14px;">{row.nickname}</p>
                  <p style="font-size: 12px">UID ：{row.uid}</p>
                  <el-tooltip content="Top center" placement="right-start">
                    <div slot="content">
                      账号分组：{row?.grouping_name || "账号暂无分组"}
                      <br />
                      账号分类：{row?.type_title || "账号暂无分类"}
                      <br />
                      设备分类：{row?.phone_number || "暂无设备分类"}
                      <br />
                      设备编号：{row?.backups_name || "暂无设备编号"}
                      <br />
                    </div>
                    <span style="cursor: pointer;display: inline-block; background-color: #FFDDA5; font-size:12px; border-radius: 4px">
                      账号信息
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

          align: "center",
          render: (h, { row }) => {
            return (
              <div style="font-size: 12px">{this.accStatusMap[row.status]}</div>
            );
          },
        },
        {
          prop: "signature",
          label: "个人简介",
          align: "center",
          render: (h, { row }) => {
            let showText;
            let tipText;
            row.signature.length > 0
              ? (showText = row.signature.substring(0, 10) + "...")
              : (showText = "暂无简介");
            row.signature.length > 0
              ? (tipText = row.signature)
              : (tipText = "暂无简介");
            return (
              <el-tooltip content={tipText} placement="top">
                <p style="font-size: 12px">{showText}</p>
              </el-tooltip>
            );
          },
        },
        {
          prop: "aweme_count",
          label: "视频数量",
          align: "center",

          render: (h, { row }) => {
            return (
              <span
                style="cursor: pointer;font-size: 12px"
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
            let colorRed = "";
            if (this.sortQuery == "unread_viewer_count") {
              colorRed = ";color:red";
            } else {
              colorRed = "";
            }
            return (
              <p
                style={"cursor: pointer;font-size: 12px" + colorRed}
                onClick={this.showviewerTabel.bind(this, row)}
              >
                {row.unread_viewer_count}
              </p>
            );
          },
        },
        {
          prop: "following_status",
          label: "关注",
          align: "center",

          render: (h, { row }) => {
            let colorRed = "";
            if (this.sortQuery == "following_count") {
              colorRed = ";color:red";
            } else {
              colorRed = "";
            }
            return (
              <span style={"font-size: 12px" + colorRed}>
                {row.following_count}
              </span>
            );
          },
        },
        {
          prop: "follower_status",
          label: "粉丝",

          align: "center",
          render: (h, { row }) => {
            let colorRed = "";
            if (this.sortQuery === "follower_status") {
              colorRed = ";color:red";
            } else {
              colorRed = "";
            }
            return (
              <span style={"font-size: 12px" + colorRed}>
                {row.follower_status}
              </span>
            );
          },
        },
        {
          prop: "total_favorited",
          label: "获赞",

          align: "center",
          render: (h, { row }) => {
            let colorRed = "";
            if (this.sortQuery == "total_favorited") {
              colorRed = ";color:red";
            } else {
              colorRed = "";
            }
            return (
              <span style={"font-size: 12px" + colorRed}>
                {row.total_favorited}
              </span>
            );
          },
        },
        {
          prop: "follower_status",
          label: "播放/收藏/转发",
          width: "130",
          align: "center",
          render: (h, { row }) => {
            return (
              <span style="font-size: 12px">
                {row?.play_count || 0} / {row?.collect_count || 0} /{" "}
                {row?.share_count || 0}
              </span>
            );
          },
        },
        {
          prop: "updata_time",
          label: "更新时间",
          width: "134",
          align: "center",
        },
        {
          prop: "operation",
          label: "操作",
          width: "127",
          align: "center",
          fixed: "right",
          render: (h, { row }) => {
            return (
              <div style="display:flex">
                <TableOperation
                  ref="operation"
                  style="margin-right:10px"
                  onsetOperation={this.setOperation.bind(this, row)}
                />
              </div>
            );
          },
          /*                            <el-image
                  style="width: 40px;height: 30px"
                  src={require("../../../assets/video.png")}
                  onClick={this.handleMonitor.bind(this, row)}
                ></el-image>  */
        },
      ],
      acc_id: "", //查询框的账号ID
      fansMap: fansMap,
      fans_option: fansOption,
      fans: "", //粉丝量查询框对应 model
      page: 1, //页码
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
      limit: 20, //每页请求数据条数
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
      userInfo: "", //账号信息
      delId: "", //需要删除账号的ID
      operationMap: operationMap, //表格下拉框相应
      min: "",
      max: "",
      typeText: "",
      subThread: 0, //当前刷新了多少
      busThread: 0, //总共需要刷新多少
      startRefresh: false, //刷新账号任务开始
      endRefresh: false, //刷新账号任务结束
      checkGroup: false, //是否选择了分组
      checkType: false, //是否选择了分类
      isSearch: false, //选择分组分类之后是否搜索
      countDown: "",
      maxTime: "",
      nicknameCanUseNum: 0,
      autographCanUseNum: 0,
      headimageCanUseNum: 0,
    };
  },

  mounted() {
    this.getGroupList();
    this.initInterface();
  },

  methods: {
    resetUidList() {
      this.userIdList = [];
    },


    handleCurrentChange(currentPage){
      this.page = currentPage
    },

    /*
        function: autoFollow
        params: data | 需要传递给后端的数据
        desc: 开启自动回关
        return: 后端返回的结果
    */
    async autoFollow(data) {
      try {
        let result = await this.$api({ type: "", data });
        return result;
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: toogleFollow
        params: null
        desc: 切换自动回关的回调
    */
    async toogleFollow() {
      try {
        if (this.openFollow === true) {
          //let result = this.autoFollow()
          this.$message.success("已开启自动回关");
          return;
        }
        this.$message.error("已关闭自动回关");
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: refreshAcc
        params: null
        desc: 发起刷新账号请求
    */
    async refreshAcc(data) {
      try {
        let result = await this.$api({ type: "refreshAcc", data });
        return result;
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: handleRefresh
        params: null
        desc: 点击刷新账号后的回调
    */
    async handleRefresh() {
      try {
        if (this.classiFication.length === 0 || this.group === "") {
          this.$message.error("请选择需要刷新的分组与分类");
          return false;
        }
        if (this.startRefresh === true) {
          this.$message.error(
            "刷新账号过于频繁，请在已创建任务执行完毕后再进行操作"
          );
          return false;
        }
        let data = {
          grouping_id: this.group,
          typecontrol_id: this.classiFication[this.classiFication.length - 1],
        };
        let result = await this.refreshAcc(data);
        if (result?.status == 200) {
          this.startRefresh = true;
          store.set("startRefresh", "0");
          this.$message.success("操作成功，努力刷新中");
          return;
        }
        this.$message.error(result?.msg ?? "刷新账号失败");
      } catch (error) {
        this.$message.error("操作失败");
        console.error(error);
      }
    },

    /*
        function: getRefreshDetail
        params: null
        desc: 获取刷新账号任务所需参数
    */
    async getRefreshDetail() {
      try {
        let result = await this.$api({ type: "getRefreshDetail" });
        return result;
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: updateProgress
        params: null
        desc: 创建刷新账号任务后执行，实时更新刷新进度
    */
    updateProgress() {
      let update = setInterval(() => {
        this.getRefreshDetail().then((res) => {
          this.subThread = res.data.complete_num + res.data.fail_num;
          this.busThread = res.data.task_num;
          if (
            this.subThread === this.busThread ||
            this.subThread > this.busThread
          ) {
            this.$message.success("刷新账号任务已完成");

            clearInterval(update);
            this.startRefresh = false;
            this.endRefresh = true;
            store.remove("startRefresh");

            return;
          }
        });
      }, 5000);
    },

    /*
        function: getTreeData
        params: data | 需要进行递归处理的数组
        desc: 递归函数，对数组进行处理，设置长度为0的children为undefined
        return: 处理后的数据
    */
    getTreeData(data) {
      if (!data) {
        return false;
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

    formatTypeId(param) {
      return param[param.length - 1] ?? "";
    },

    /* 
        function: initInterface
        params: null
        desc: 读取本地存储字段并赋值，初始化页面账号信息为刷新页面之前状态
    */
    async initInterface() {
      this.page = store.get("page") ?? 1;
      this.limit = store.get("limit") ?? 20;
      let isRefreshEnd = store.get("startRefresh");
      let group = store.get("group") ?? "";
      let typecontrol_id = store.get("typecontrol_id") ?? "";
      let fans = store.get("fans") ?? "";
      isRefreshEnd === "0"
        ? (this.startRefresh = true)
        : (this.startRefresh = false);
      if (this.startRefresh === true) {
        this.updateProgress();
      }
      if (group !== "" && typecontrol_id !== "") {
        this.isSearch = true;
        this.total_fans = store.get("total_fans") ?? 0;
        this.total_follow = store.get("total_follow") ?? 0;
      }
      if (fans !== "") {
        this.fans = fans;
        fans = Object.entries(this.fansMap).find((item) => {
            return item[1] == fans;
        })[0].split(",");
        this.min = fans[0] ?? "";
        this.max = fans[1] ?? "";
      }
      this.group = group;
      this.classiFication.push(typecontrol_id);
      let data = {
        min: this.min ?? "",
        max: this.max ?? "",
        typecontrol_id:
          this.classiFication[this.classiFication.length - 1] ?? "",
        grouping_id: this.group ?? "",
        limit: this.limit ?? 10,
        page: this.page ?? 1,
      };
      let getProjectData = {
        grouping_id: this.group,
        typecontrol_id:
          this.classiFication[this.classiFication.length - 1] ?? "",
      };
      await this.getMemberList(data);
      await this.getProjectNum(getProjectData);
    },

    /* 
        function: setGroupText
        params: grouping_id
        desc: 存储分组input text
    */
    setGroupText(grouping_id) {
      let arr = Object.entries(this.groupList).find((item) => {
        return item?.[1]?.grouping_id === grouping_id;
      });
      this.groupString = arr?.[1]?.grouping_name;
    },

    /* 
        function: setTypeText
        params: typecontrol_id
        desc: 存储分类input text
    */
    setTypeText(typecontrol_id) {
      let arr = Object.entries(this.typeList).find((item) => {
        return item?.[1]?.typecontrol_id === typecontrol_id;
      });
      this.typeText = arr?.[1]?.label;
    },

    /* 
        function: setLocalGroup
        params: null
        desc: 本地存储 group 字段（分组）
    */
    setLocalGroup() {
      this.isSearch = false;
      this.setGroupText(this.group);
      store.set("group", this.group);
      store.set("groupText", this.groupString);
    },

    /* 
        function: setLocalFans
        params: null
        desc: 本地存储 fans 字段（粉丝）
    */
    setLocalFans() {
      let fans = this.fansMap[this.fans.toString()];
      store.set("fans", fans);
    },

    /* 
        function: setLocalType
        params: null
        desc: 本地存储 typecontrol_id 字段（分类）同时获取分类input文本
    */
    setLocalType() {
      this.isSearch = false;
      let typecontrol_id = this.formatTypeId(this.classiFication);
      this.setTypeText(typecontrol_id);
      store.set("typecontrol_id", typecontrol_id);
      store.set("typeText", this.typeText);
    },

    /* 
        function: handleSort
        params: null
        desc: 排序回调
    */
    async handleSort() {
      try {
        if (this.sortQuery === "") {
          this.$message.error("请选择排序字段");
          return false;
        }
        let typecontrol_id = this.formatTypeId(this.classiFication);
        let data = {
          uid: this.acc_id,
          typecontrol_id: typecontrol_id ?? "",
          grouping_id: this.group ?? "",
          order: this.sortQuery || 'follower_status',
          sort: this.sortWay || "dasc",
        };
        let result = await this.getMemberList(data);
        if (result.status == 200) {
          this.$message.success("查询成功");
          return;
        }
        this.$message.error(result.msg ?? "查询失败");
      } catch (error) {
        this.$message.error();
      }
    },

    /* 
        function: delAcc
        params: null
        desc: 删除账号
    */
    async delAcc() {
      try {
        let result = await this.$api({
          type: "deleteMember",
          data: { member_ids: this.delId },
        });
        if (result?.status == 200) {
          this.$message.success("删除成功");
          return;
        }
        this.$message.error(result?.msg ?? "删除失败");
      } catch (error) {
        this.$message.error("删除失败");
        console.error(error);
      }
    },

    /* 
        function: confrimDel
        params: null
        desc: 确认删除账号
    */
    async confrimDel() {
      try {
        await this.delAcc();
        this.closeConfrimDel();
        this.updateMemberList();
      } catch (error) {
        this.$message.error("操作失败");
        console.error(error);
      }
    },

    /* 
        function: closeConfrimDel
        params: null
        desc: 关闭确认删除弹窗
    */
    closeConfrimDel() {
      this.showConfrimDel = false;
      let tabel = this.$refs["multipleTable"];
      console.log(tabel.$refs["operation"]["operation"]);
    },

    /* 
        function: setOperation
        params: row | 表格对应行的数据
                e   | operationMap对应键值
        desc: 打开相应操作界面
    */
    setOperation(row, e) {
      this.accInfo = row;
      console.log(e);
      if (e === "") {
        return false;
      }
      this.acc_id = row.uid;
      this[this.operationMap[e]](row) && this[this.operationMap[e]](row);
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
      this.acc_id = "";
    },

    /* 
        function: handleRelease
        params: null
        desc: 发布视频回调
    */
    handleRelease() {
      this.showReleaseVideoDialog = true;
    },

    /* 
        function: handleMonitor
        params: e   |   event
                row |   表格对应行数据
        desc: 单账号监控回调
    */
    handleMonitor(e, row) {
      row.path[0].src = require("../../../assets/video-red.png");
    },

    /* 
        function: showBatchEditorDialog
        params: null
        desc: 打开批量编辑弹窗
    */
    async showBatchEditorDialog() {
      if (
        this.group === "" ||
        this.classiFication.length === 0 ||
        this.batchEditorList.length === 0
      ) {
        this.$message.error("请先选择分组，分类和账号");
        return false;
      }
      if (
        (this.checkGroup === true &&
          this.checkType === true &&
          this.isSearch === false) ||
        (this.group !== "" &&
          this.classiFication.length !== 0 &&
          this.isSearch === false)
      ) {
        this.$message.error("请对所选分类下的账号进行操作");
        return false;
      }
      this.showBatchEditor = true;
      let data = {
        grouping_id: this.group,
        typecontrol_id: this.classiFication[this.classiFication.length - 1],
      };
      let result = await this.getProjectNum(data);
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
      let data = {
        min: this.min ?? "",
        max: this.max ?? "",
        typecontrol_id:
          this.classiFication[this.classiFication.length - 1] ?? "",
        grouping_id: this.group ?? "",
        limit: this.limit ?? 20,
        page: this.page ?? 1,
        uid: this.accUid ?? "",
      };
      this.getMemberList(data);
    },

    /* 
        function: removeLocal
        params: null
        desc: 清空缓存字段
    */
    removeLocal() {
      store.remove("page");
      store.remove("limit");
      store.remove("group");
      store.remove("typecontrol_id");
      store.remove("fans");
      store.remove("groupText");
      store.remove("typeText");
      store.remove("total_follow");
      store.remove("total_fans");
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
      this.sortQuery = "";
      this.sortWay = "";
      this.limit = 20;
      this.page = 1;
      this.total_fans = 0;
      this.total_follow = 0;
      this.removeLocal();
      this.getMemberList();
      this.$message.success("重置成功");
    },

    /* 
        function: updateVisitorList
        params: params | 子组件传的参数，arguments
        desc: 用来更新访问人数dialog的数据更新
    */
    async updateVisitorList(params) {
      let data = {
        member_id: params[0],
        page: params[1],
        limit: 10,
      };
      let result = await this.getVisitorList(data);
      this.vistList = result.data.list;
    },

    async showviewerTabel(row) {
      try {
        this.showViewerTabel = true;
        let data = {
          member_id: row.member_id,
          page: 1,
          limit: 10,
        };
        let result = await this.getVisitorList(data);
        console.log(result);
        if (result?.status == 200) {
          this.vistList = result.data.list;
          this.visterTotal = result.data.count;
          return;
        }
        this.$message.error(result?.msg ?? "获取访问人数失败");
      } catch (error) {
        console.error(error);
      }
    },

    closeViewerTabel() {
      this.showViewerTabel = false;
      this.vistList = [];
      this.visterTotal = 0;
    },

    /* 
        function: getVisitorList
        params: member_id | 用户ID
        desc: 获取访问列表
        return: 访问列表
    */
    async getVisitorList(data) {
      try {
        let result = await this.$api({ type: "getVistorList", data });
        return result;
      } catch (error) {
        console.error(error);
      }
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
      try {
        this.isSearch = true;
        this.page = 1;
        this.loading = true;
        let data = {
          typecontrol_id: this.formatTypeId(this.classiFication) ?? "",
          uid: this.accUid ?? "",
          min: this.fans[0] ?? "",
          max: this.fans[1] ?? "",
          limit: this.limit ?? "",
          page: this.page ?? "",
          grouping_id: this.group ?? "",
        };
        let result = await this.$api({
          type: "getMember",
          data,
        });
        console.log(result);
        if (result.status == 200) {
          this.memberList = result?.data?.list || [];
          this.total = result?.data?.count || 0;
          this.total_fans = result?.data?.total_fans || 0;
          this.total_follow = result?.data?.total_follow || 0;
          store.set("total_fans", this.total_fans);
          store.set("total_follow", this.total_follow);
          this.loading = false;
          this.$message.success("搜索成功");
          return;
        }
        this.loading = false;
        this.$message.error("搜索失败");
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },

    /* 
        function: handlePagination
        params: null
        desc: 打开访问人数表格
    */
    handlePagination(val) {
      this.limit = val.limit;
      this.page = val.page;
      let typecontrol_id = this.formatTypeId(this.classiFication);
      let data = {
        order: this.sortQuery ?? "",
        sort: this.sortWay ?? "",
        typecontrol_id: typecontrol_id ?? "",
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
          grouping_id: this.group ?? "",
          typecontrol_id: this.formatTypeId(this.classiFication) ?? "",
        };
        let result = await this.$api({ type: "getProjectNum", data: data });
        this.materialTotal = result.data.num ?? 0;
        this.showBatchEiDialog = true;
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: getProjectNum
        params: data | 请求接口携带的数据
        desc: 关闭编辑弹窗
    */
    async getProjectNum(data) {
      try {
        let result = await this.$api({ type: "getProjectNum", data });
        this.nicknameCanUseNum = result?.data?.nickname ?? 0;
        this.autographCanUseNum = result?.data?.autograph ?? 0;
        this.headimageCanUseNum = result?.data?.headimage ?? 0;
        return result;
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
      this.accInfo = {};
    },

    /* 
        function: getVideoList
        params: null
        desc: 获取用户视频列表
    */
    async getVideoList(data = { member_id: "", page: 1, limit: 10 }) {
      try {
        let result = await this.$api({ type: "getMemberList", data: data });
        this.videoList = result.data.list ?? [];
        this.videoCount = result.data.count ?? 0;
      } catch (error) {
        console.error(error);
      }
    },

    /* 
        function: updateProjectNum
        params: params | arguments
        desc: 更新可用素材，由子组件触发的自定义事件
    */
    async updateProjectNum(params) {
      let data = { typecontrol_id: params[0], grouping_id: params[1] };
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
      let data = { member_id: val.member_id, page: 1, limit: 10 };
      await this.getVideoList(data);
    },

    /* 
        function: handleSelectChange
        params: val | 默认值为对象，里面是选中账号信息
        desc: 表格多选框改变时的回调
    */
    handleSelectChange(val) {
      this.member_ids = "";
      this.batchEditorList = val;
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

    async getMemberList(
      data = {
        limit: this.limit || 20,
        page: this.page || 1,
        order: this.sortQuery || "",
        sort: this.sortWay || "",
        typecontrol_id: this.formatTypeId(this.classiFication) || "",
        grouping_id: this.group || "",
        min: this.fans[0] || "",
        max: this.fans[1] || "",
      }
    ) {
      try {
        this.loading = true;
        let result = await this.$api({
          type: "getMember",
          data: data,
        });
        this.memberList = result.data.list;
        this.total = result?.data?.count || 0;
        this.loading = false;
        return result;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },

    /*
        function: handleEdit
        params: row | 该行的相应数据
        desc: 编辑操作时的回调
    */
    async handleEdit(row) {
      this.user_id = row.uid;
      console.log();
      this.$refs["editor"].$data.accUpdateForm.grouping_id =
        this.accInfo.grouping_id;
      this.$refs["editor"].$data.accUpdateForm.typecontrol_id = parseInt(
        this.accInfo.typecontrol_id
      );

      let searchTypeData = {
        grouping_id: this.accInfo.grouping_id,
      };
      let result = await this.$api({
        type: "getTypecontrol",
        data: searchTypeData,
      });
      this.typeList = this.getTreeData(result.data);
      this.$refs["editor"].$data.typeList = this.typeList;
      this.showEditorDialog = true;
    },

    /*
        function: handleDelete
        params: index,row | default
        desc: 删除操作时的回调
    */
    handleDelete(row) {
      this.showConfrimDel = true;
      this.delId = row.member_id;
      //this.$message.success("删除成功");
      /*         let result = await this.$api({
          type: "deleteMember",
          data: { member_ids: row.member_id },
        });
        if (result.status == 200) {
          this.$message.success(result.msg ?? "操作成功");
          return;
        } */
      //this.$message.error(result.msg ?? "操作失败");
    },

    /* begin() {
      this.countDown = '20分00秒';
      this.maxTime = 20 * 60;
      this.handleCountDown();
    },
handleCountDown() {
      this.interval = setInterval(() => {
        this.maxTime--;
        let minutes = Math.floor(this.maxTime / 60);
        let seconds = Math.floor(this.maxTime % 60);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        this.countDown = minutes + "分" + seconds + "秒";
        if (this.maxTime === 0) {
          clearInterval(this.interval)
        }
      }, 1000)
    }, */

    /* 
      刷新账号逻辑：
        开始：startRefresh
              发起刷新账号请求
              如果任务创建成功的话 设置字段为true
        结束：endRefresh
    
    
    */
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

.color-red {
  color: red;
}

.tt-accsituation-searchForm {
  display: flex;
}

.tt-accsituation--top {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.batchedit-btn {
  width: 150px;
}

.flex-jus-spacebet {
  display: flex;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  align-items: center;
}

.height-20 {
  height: 20px;
}

.pad-0-20 {
  padding: 0 20px;
}

.flex {
  display: flex;
}

.ml-15 {
  margin-left: 15px;
}

.ml-20 {
  margin-left: 20px;
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

.mb-10 {
  margin-bottom: 10px;
}

.fz-12 {
  font-size: 12px;
}

.fz-14 {
  font-size: 14px;
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

.tt-accsituation-main {
  padding-top: 10px;
  background-color: #fff;
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

.search-uid--input {
  padding-left: 10px;
  border-radius: 10px;
}

.el-icon-search {
  z-index: 1;
  left: 10px;
  top: 10px;
}

.sucess-icon {
  height: 24px;
  width: 24px;
}

::v-deep .el-table__cell {
  padding: 6px 0;
}

::v-deep .search-uid {
  padding-left: 0;
}
</style>

 

 