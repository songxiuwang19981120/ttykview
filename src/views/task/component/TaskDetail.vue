<template>
  <div>
    <el-dialog
    width="60%"
    :visible="showTaskDetail"
    :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">{{ title || "默认标题" }}</h1>
      </span>
      <table-custom
        :loading="loading"
        :tableData="tableData"
        :columns="columns"
      >
      </table-custom>
    </el-dialog>
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
export default {
  name: "TtprojectTaskDetail",
  props: {
    title: {
      type: String,
    },
    tableData: {
      type: Array,
    },
    taskDesc: {
      type: String,
    },
    showTaskDetail:{
        type: Boolean
        
    }
  },
  components: {
    tableCustom,
  },
  data() {
    return {
      loading: false,
				columns: [
          {
						label: '头像',
						prop: 'task_type',
						align: 'center',
            fixed: true,
            width:'200',
						render() {
							return (<div style="display:flex">
                <el-image></el-image>
                <div>
                  <p>赵铁柱</p>
                  <p>ID:233333333</p>
                </div>
              </div>);
						},
					},
          {
						label: '账号分类',
						prop: 'task_type',
						align: 'center',
						render() {
							return (<div>
                巴西/盲盒
              </div>);
						},
					},
          {
						label: '任务批次',
						prop: 'task_type',
						align: 'center',
						render() {
							return (<div>
                22
              </div>);
						},
					},
          {
						label: '目标数量',
						prop: 'task_type',
						align: 'center',
						render() {
							return (<div>
                2
              </div>);
						},
					},
          {
						label: '已执行数量',
						prop: 'task_type',
						align: 'center',
						render() {
							return (<div>
                2
              </div>);
						},
					},

					{
						label: '失败次数',
						prop: 'task_type',
						align: 'center',
						render() {
							return <div>1</div>;
						},
					},
					{
						label: '更新时间',
						prop: 'create_time',
						align: 'center',
					},
					{
						label: '状态',
						prop: 'status',
						align: 'center',
						render(h, { row }) {
							const { status } = row;
							let state;
							if (status == 0) {
								state = '成功';
							} else if (status == 1) {
								state = '未开始';
							} else if (status == 2) {
								state = '失败';
							}
							return <div>{state}</div>;
						},
					},
					{
						label: '操作',
						prop: 'status',
						align: 'center',
            width:'200',
						render(h, { row }) {
              return (
                <div>
                  <el-button size="mini">日志</el-button>
                  <el-button size="mini">删除</el-button>
                </div>
              )
						},
					},
				],
    };
  },

  mounted() {},

  methods: {
    showLogDialog(){

    },
    handleDel(){
      console.log('删除')
    },
    handlerClose(){
        this.$emit('closeTaskDetail')
    }
  },
};
</script>

<style lang="stylus" scoped></style>