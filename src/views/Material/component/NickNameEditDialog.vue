<template>
	<el-dialog :visible="showDialog" @close="btnCancel">
		<div class="nickname">
      <!-- <input class="everyname" v-for="(item,index) in nickNameList" :key="index">
        {{item.nickname}}
      </input> -->
      <input type="text" v-for="(item,index) in nickNameList" :key="index" v-model="item.nickname" class="nameipt" />
		</div>
		<el-row type="flex" justify="center">
			<el-button size="small" @click="btnCancel">取消</el-button>
			<el-button size="small" type="primary" @click="btnOK">确定</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			showDialog: {
				type: Boolean,
				default: false,
			},
		},
    data() {
      return {
        nickNameList: [
          {
            nickname: 'zdsdfas'
          },
          {
            nickname: 'zdsdfas'
          },
          {
            nickname: 'zdsdfas'
          }
        ],
        // page: {
				// 	page: 1,
				// 	limit: 20,
				// 	nickname: '',
				// 	typecontrol_id: '',
				// 	status: null,
				// 	grouping_id: null,
				// },
      }
    },
    methods: {
      // // 获取昵称素材库数据
			// async getNickName(data) {
			// 	this.loading = true;
			// 	try {
			// 		const res = await this.$api({
			// 			type: 'getNickName',
			// 			data,
			// 		});
			// 		console.log(res, '昵称数据列表');
			// 		this.tableData = res.list;
			// 		this.total = res.count;
			// 	} catch (error) {
			// 		console.error(error);
			// 	} finally {
			// 		this.loading = false;
			// 	}
			// },
      // 点击取消按钮
      btnCancel() {
        this.$emit('update:showDialog',false)
      },
      // 点击确定按钮
      btnOK() {
        this.$emit('update:showDialog',false)
      }
    },
    // created() {
		// 	// 获取昵称素材库数据
		// 	this.getNickName(this.page);
		// },
	};
</script>

<style lang="stylus" scoped>
	.nickname{
    border 3px solid #000
    margin-bottom 16px
    .everyname{
      font-size 18px
      font-weight 700
      margin-bottom 2px    }
    .nameipt{
      display block
      font-size 18px
      font-weight 700
      margin-bottom 2px   
      border none 
    }
  }
</style>
