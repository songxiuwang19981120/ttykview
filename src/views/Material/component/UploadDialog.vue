<template>
	<el-dialog :visible="showDialog" @close="btnCancel">
    <!-- 添加签名 -->
    <span>添加签名：</span>
		<el-input type="textarea" placeholder="请输入昵称(一行仅限一个)" rows="6" v-model="textareaNN" class="nicknameIpt">
		</el-input>
    <!-- 上传 -->

		<!-- 按钮 -->
		<el-row type="flex" justify="end" slot="footer">
			<el-button size="small" @click="btnCancel">取消</el-button>
			<el-button size="small" type="primary" @click="btnOK">确定</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
  import {BASE_URL} from '@/config/base.config'
	export default {
		props: {
			showDialog: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				textareaNN: '', // 文本域内容
        baseUrl: BASE_URL, // 基地址
			};
		},
		methods: {
			// 点击取消按钮
			btnCancel() {
				this.$emit('update:showDialog', false);
			},
			// 点击确定按钮
			btnOK() {
				console.log(this.textareaNN, '文本域数据');
				let nickNameArr = [];
        // 处理文本域数据
				this.textareaNN.split('\n').forEach((item) => {
          console.log(item.replace(/\s/gi, ''))
					if (item.replace(/\s/gi, '')) {
						nickNameArr.push(item.replace(/\s/gi, ''));
					}                                   
				});
        const nickNameStr = nickNameArr.join(',')
        console.log(nickNameStr)
			},
		},
	};
</script>

<style lang="stylus" scoped>
.nicknameIpt{
  width 60%
  vertical-align middle
}
</style>
<style scoped>
  ::v-deep .el-dialog__body{
    text-align: center !important;
  }
</style>
