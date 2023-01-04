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
			:default-checked-keys="defaultCheck"
			:check-strictly="true"
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
			setRoleData: {
				type: Object,
			},
			defaultCheck: {
				type: Array,
				default: []
			}
		},

		data() {
			return {
				treeData: [],
				defaultProps: {
					label: 'title',
				},
				rules: []
			};
		},

		methods: {
			// 获取树形
			async getRouteTree() {
				try {
					const res = await this.$api({
						type: 'getRouteTree'
					});
					console.log(res, '树形');
					if (res.status == 200) {
						this.treeData = res.data
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
				}
			},

			// 配置权限
			async setRole(data) {
				try {
					const res = await this.$api({
						type: 'setRole',
						data,
					});
					if (res.status == 200) {
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
				}
			},

			// 获取选中的权限id
			getCheckedKeys() {
				return this.$refs.tree.getCheckedKeys()
			},

			// 点击确定按钮
			async btnOK() {
				this.rules = this.$refs.tree.getCheckedKeys()
				await this.setRole({
					group_id: this.setRoleData.id,
					rules: this.rules
				})
				this.$parent.getApiusergroup({
						page: 1,
						limit: 10,
					});
				this.$emit('update:showdialog', false);
			},

			// 点击取消按钮
			btnCancel() {
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
