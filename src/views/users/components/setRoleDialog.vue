<template>
	<el-dialog :visible="showdialog" title="权限配置" @close="btnCancel">
		<el-row type="flex" justify="end">
			<el-button type="primary" size="medium" @click="btnOK">确定</el-button>
			<el-button @click="btnCancel" size="medium">取消</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			showdialog: {
				type: Boolean,
				default: false,
			},
		},

		methods: {
			// 点击确定按钮
			btnOK() {},

			// 点击取消按钮
			btnCancel() {
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
