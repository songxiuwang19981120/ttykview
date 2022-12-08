<template>
  <div class="tt-accsituation">
    <div class="tt-accsituation--operation">
      <el-cascader
        clearable
        :props="{ checkStrictly: true }"
        :options="typeList"
        v-model="group"
        placeholder="设置分组选择"
      ></el-cascader>

      <el-select v-model="fans" placeholder="粉丝量">
        <el-option
          v-for="item in options"
          :value="item.value"
          :label="item.label"
          :key="item.label"
        ></el-option>
      </el-select>

      <el-select v-model="taskConfig" placeholder="已选账号任务配置">
      </el-select>
    </div>

    <div class="tt-accsituation--content">
      <div class="tt-accsituation-content--top">

        <el-input @keydown.native.enter="searchAccId" class="tt-accsituation--search" placeholder="输入账号ID" v-model="accId" clearable>
        </el-input>

        <el-button>批量编辑</el-button>
      </div>

      <el-table
        class="tt-accsituation--table"
        stripe
        border
        :data="memberList"
        style="width: 100%"
      >
        <el-table-column type="selection"> </el-table-column>

        <el-table-column label="头像">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.avatar_thumb"
              fit="fit"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <div
              class="statusLight"
              :class="scope.row.status === 1 ? 'bgcred' : 'bgcgreen'"
            ></div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in tableCloumn"
          :prop="TABLE_MAP[item]"
          :key="item"
          :label="item"
        ></el-table-column>

        <el-table-column label="关注/获赞/播放量"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handlerCurrentChange"
      class="base-pagination"
      background
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import tableMap from "@/config/tableMap.config";
const { TABLE_MAP } = tableMap;
export default {
  name: "AccountSituation",
  components: {},
  data() {
    return {
      accId:'',
      option: "",
      TABLE_MAP: TABLE_MAP,
      group: "",
      fans: "",
      userID: "",
      page: "",
      typeList: [],
      fansOption: [],
      taskConfig: "",
      tableData: [],
      memberList: [],
      tableCloumn: [
        "设备分组",
        "设备编号",
        "备份名称",
        "UID",
        "昵称",
        "国家",
        "项目分类",
        "账号分类",
        "签名",
        "视频数量",
        "主页访问人数",
        "粉丝量",
        "更新时间",
      ],
      checkAll: "",
      total: 0,
      fansTotal: 0,
      options: [
        { value: "1k-2k", label: "1k-2k" },
        { value: "2k-9k", label: "2k-9k" },
        { value: "9k-10k", label: "9k-10k" },
      ],
    };
  },

  mounted() {
    this.getMemberList();
    this.getTypeControlList();
  },

  methods: {
    /*
        function: getTreeData
        params: data | 需要进行递归处理的数组
        desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
    */
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children < 1) {
          data[i].children = undefined;
        }
        this.getTreeData(data[i].children);
      }
      return data;
    },

    async getFansList() {
      try {
        let result = await this.$api({ type: "getFansList" });
        this.fansTotal = result;
      } catch (error) {
        console.error(error);
      }
    },

    /*
        methods: getTypeControlList
        params: null
        desc: 异步获取TypeControlList，页面渲染时调用
    */
    async getTypeControlList() {
      try {
        let result = await this.$api({ type: "getTypecontrol" });
        this.typeList = result;
        this.typeList = this.getTreeData(this.typeList);
        console.log(this.typeList);
      } catch (error) {
        console.error(error);
      }
    },

    /*
        methods: getMemberList
        params: null
        desc: 异步获取memberList，页面渲染时调用
    */
    async getMemberList() {
      try {
        let result = await this.$api({ type: "getMember" });
        this.memberList = result.list;
        this.total = result.count;
        console.log(this.memberList);
      } catch (error) {
        console.error(error);
      }
    },

    /*
        function: handleEdit
        params: index,row | default
        desc: 编辑操作时的回调
    */
    handleEdit(index, row) {
      console.log(index, row);
    },

    /*
        function: handleDelete
        params: index,row | default
        desc: 删除操作时的回调
    */
    handleDelete(index, row) {
      console.log(index, row);
    },

    /*
        function: handlerCurrentChange
        params: val | default
        desc: 分页的回调，设置page为val，当val改变时发起请求，获取数据重新渲染页面
    */
    async handlerCurrentChange(val) {
      try {
        console.log(val);
        this.page = val;
        let result = await this.$api({
          type: "getMember",
          data: { page: this.page },
        });
        this.memberList = result.list;
      } catch (error) {
        console.error(error);
      }
    },


    /*
      function: searchAccId
      params: null
      desc: 搜索账号ID
    */
    searchAccId(){
      console.log(1111)
    }
  },
};
</script>

<style lang="stylus">
.tt-accsituation--operation {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  height: 70px;
}

.tt-accsituation--content {
  box-sizing: border-box;
  padding: 20px 10px;
  margin-top: 20px;
  background-color: #fff;
}

.tt-accsituation-content--top {
  margin-bottom: 30px;
}

.tt-accsituation--table {
  margin: 0 auto;
  border: 1px solid #ccc !important;
  border-radius: 8px;
}

.statusLight {
  margin: 0 auto;
  height: 10px;
  width: 10px;
  border-radius: 50%;
}

.base-pagination {
  width: 500px;
  margin: 20px auto;
}

.tt-accsituation--search
  width: 180px

.bgcred {
  background-color: red;
}

.bgcgreen {
  background-color: green;
}
</style>