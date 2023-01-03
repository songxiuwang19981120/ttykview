<template>
	<el-dialog :visible="showdialog" title="权限配置" @close="btnCancel">
		<el-tree
			:data="treeData"
			show-checkbox
			default-expand-all
			node-key="id"
			ref="tree"
			highlight-current
			check-strictly
			:props="defaultProps"
		>
		</el-tree>
		<el-row type="flex" justify="end" style="margin-top: 20px;">
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

		data() {
			return {
				treeData: [
					{
						id: 1,
						label: '一级 1',
						children: [
							{
								id: 4,
								label: '二级 1-1',
								children: [
									{
										id: 9,
										label: '三级 1-1-1',
									},
									{
										id: 10,
										label: '三级 1-1-2',
									},
								],
							},
						],
					},
					{
						id: 2,
						label: '一级 2',
						children: [
							{
								id: 5,
								label: '二级 2-1',
							},
							{
								id: 6,
								label: '二级 2-2',
							},
						],
					},
					{
						id: 3,
						label: '一级 3',
						children: [
							{
								id: 7,
								label: '二级 3-1',
							},
							{
								id: 8,
								label: '二级 3-2',
							},
						],
					},
				],
				defaultProps: {
					children: 'children',
					label: 'label',
				},
			};
		},

		methods: {
			// 点击确定按钮
			btnOK() {
				console.log(this.$refs.tree.getCheckedKeys());
			},

			// 点击取消按钮
			btnCancel() {
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
