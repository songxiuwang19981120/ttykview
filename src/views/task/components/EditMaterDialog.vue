<template>
	<el-dialog title="编辑素材任务" :visible="showdialog" @close="btnCancel" width="40%">
		<el-form label-width="150px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="任务名：" prop="task_name">
				<el-input
					v-model="ruleForm.task_name"
					style="width: 60%"
					placeholder="请输入任务名称"
					size="mini"
				></el-input>
			</el-form-item>
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button @click="btnCancel" size="mini">取消</el-button>
					<el-button type="primary" size="mini" :loading="btnloading" @click="btnOK">{{
						btnloading ? '执行中...' : '确定执行'
					}}</el-button>
				</el-form-item>
			</el-row>
		</el-form>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			showdialog: {
				type: Boolean,
				default: false,
			},
			ruleForm: {
				type: Object,
				default() {
					return {
						task_name: '',
					};
				},
			},
		},

		data() {
			return {
				btnloading: false,
				rules: {task_name: [{ required: true, message: '请输入任务名', trigger: 'blur' }],},
			};
		},

		methods: {
			// 确定
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					this.btnloading = true;
					setTimeout(() => {
						this.btnloading = false;
						this.$message.success('操作成功');
						this.btnCancel();
					}, 1000);
				} catch (error) {}
			},

			// 取消
			btnCancel() {
				this.$refs.ruleForm.resetFields();
				this.$emit('update:ruleForm', {
					task_name: '',
				});
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style></style>
