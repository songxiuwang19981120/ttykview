<template>
	<el-dialog title="新建采集任务" :visible="showdialog" @close="btnCancel" width="40%">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="任务名：" prop="task_name">
				<el-input
					v-model="ruleForm.task_name"
					style="width: 60%"
					placeholder="请输入任务名"
					size="medium"
				></el-input>
			</el-form-item>
			<el-form-item label="目标国家：" prop="tar_country">
				<el-select
					style="width: 60%"
					v-model="ruleForm.tar_country"
					placeholder="请选择目标国家"
					:loading="countryLoading"
					loading-text="数据加载中..."
					size="medium"
				>
					<el-option
						v-for="(item, index) in countryData"
						:key="index"
						:label="item.name"
						:value="item.tar_country"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采集数量：" prop="col_num">
				<el-input
					v-model="ruleForm.col_num"
					style="width: 60%"
					placeholder="请输入采集数量"
					size="medium"
					type="number"
				></el-input>
			</el-form-item>
			<el-form-item label="采集类型：" prop="col_type">
				<el-select
					style="width: 60%"
					v-model="ruleForm.col_type"
					placeholder="请选择采集类型"
					:loading="typeLoading"
					loading-text="数据加载中..."
					size="medium"
				>
					<el-option
						v-for="(item, index) in typeData"
						:key="index"
						:label="item.name"
						:value="item.col_type"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="随机等待时间：" prop="start_time">
				<el-row type="flex">
					<el-input
						v-model="ruleForm.start_time"
						style="width: 60px; margin-right: 10px"
						size="medium"
					></el-input>
					<span style="margin-right: 10px">~</span>
					<el-form-item prop="end_time">
						<el-input
							v-model="ruleForm.end_time"
							style="width: 60px; margin-right: 10px"
							size="medium"
						></el-input>
						<span>秒</span>
					</el-form-item>
				</el-row>
			</el-form-item>
			<el-form-item label="采集目标：" prop="col_target">
				<el-input
					style="width: 60%"
					v-model="ruleForm.col_target"
					placeholder="请输入采集目标（一行一个）"
					size="medium"
					type="textarea"
					:rows="3"
				></el-input>
			</el-form-item>
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button @click="btnCancel" size="medium">取消</el-button>
					<el-button type="primary" size="medium" :loading="btnloading" @click="btnOK">{{
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
		},

		data() {
			return {
				countryLoading: false,
				typeLoading: false,
				countryData: [
					{ name: '美国', tar_country: '0' },
					{ name: '法国', tar_country: '1' },
					{ name: '日本', tar_country: '2' },
				],
				typeData: [
					{ name: '用户', col_type: '0' },
					{ name: '视频', col_type: '1' },
				],
				ruleForm: {
					task_name: '',
					tar_country: '',
					col_num: '',
					col_type: '',
					start_time: '',
					end_time: '',
					col_target: '',
				},
				rules: {
					task_name: [{ required: true, message: '请输入任务名', trigger: 'blur' }],
					tar_country: [{ required: true, message: '请选择目标国家', trigger: 'blur' }],
					col_num: [{ required: true, message: '请输入采集数量', trigger: 'blur' }],
					col_type: [{ required: true, message: '请选择采集类型', trigger: 'blur' }],
					start_time: [{ required: true, message: '请输入等待时间', trigger: 'blur' }],
					end_time: [{ required: true, message: '请输入等待时间', trigger: 'blur' }],
					col_target: [{ required: true, message: '请输入采集目标', trigger: 'blur' }],
				},
				btnloading: false,
			};
		},

		methods: {
			// 确定
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					const starttime = Number(this.ruleForm.start_time);
					const endtime = Number(this.ruleForm.end_time);
					if (starttime < 0 || endtime < 0 || starttime > endtime) {
						return this.$message.error('随机等待时间输入有误，请重新输入');
					}
					if (this.ruleForm.col_num <= 0) {
						return this.$message.error('采集数量输入有误');
					}
					this.btnloading = true;
					setTimeout(() => {
						this.btnloading = false;
						this.$message.success('操作成功');
						this.$emit('update:showdialog', false);
					}, 1000);
				} catch (error) {}
			},

			// 取消
			btnCancel() {
				this.$refs.ruleForm.resetFields();
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style></style>
