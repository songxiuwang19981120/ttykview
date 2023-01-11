<template>
	<el-dialog title="编辑私信任务" :visible="showdialog" @close="btnCancel" width="40%">
		<el-form label-width="150px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="随机等待时间：" prop="start_time">
				<el-row type="flex">
					<el-input
						v-model="ruleForm.start_time"
						style="width: 60px; margin-right: 10px"
						size="mini"
					></el-input>
					<span style="margin-right: 10px">~</span>
					<el-form-item prop="end_time">
						<el-input
							v-model="ruleForm.end_time"
							style="width: 60px; margin-right: 10px"
							size="mini"
						></el-input>
						<span>秒</span>
					</el-form-item>
				</el-row>
			</el-form-item>
			<el-form-item label="单号消息推送次数：" prop="push_num">
				<el-input
					v-model="ruleForm.push_num"
					style="width: 70px; margin-right: 10px"
					size="mini"
				></el-input>
				<span>次</span>
			</el-form-item>
			<el-form-item label="账号分组：" prop="gruop_id">
				<el-select
					v-model="ruleForm.gruop_id"
					placeholder="请选择账号分组"
					:loading="groupLoading"
					loading-text="数据加载中..."
					size="mini"
				>
					<el-option
						v-for="(item, index) in groupData"
						:key="index"
						:label="item.name"
						:value="item.gruop_id"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="选择推送图片：" prop="push_img">
				<el-upload
					action="#"
					list-type="picture-card"
					:auto-upload="false"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="" />
				</el-dialog>
			</el-form-item>
			<el-form-item label="国家语种：" prop="language_id">
				<el-select
					v-model="ruleForm.language_id"
					placeholder="请选择国家语种"
					:loading="languageLoading"
					loading-text="数据加载中..."
					size="mini"
				>
					<el-option
						v-for="(item, index) in languageData"
						:key="index"
						:label="item.name"
						:value="item.language_id"
					>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="推送消息编辑：" prop="push_msg">
				<el-input
					style="width: 60%"
					v-model="ruleForm.push_msg"
					placeholder="请输入推送消息"
					size="mini"
					type="textarea"
					:rows="3"
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
						start_time: '',
						end_time: '',
						push_num: '',
						gruop_id: '',
						push_img: '',
						language_id: '',
						push_msg: '',
					};
				},
			},
		},

		data() {
			return {
				groupLoading: false,
				languageLoading: false,
				rules: {},
				btnloading: false,
				groupData: [
					{
						gruop_id: '0',
						name: '日本-1',
					},
					{
						gruop_id: '1',
						name: '日本-1',
					},
					{
						gruop_id: '2',
						name: '日本-2',
					},
				],
				languageData: [
					{
						language_id: '0',
						name: '日语',
					},
					{
						language_id: '1',
						name: '英语',
					},
					{
						language_id: '2',
						name: '法语',
					},
				],
				rules: {
					start_time: [{ required: true, message: '请输入等待时间', trigger: 'blur' }],
					end_time: [{ required: true, message: '请输入等待时间', trigger: 'blur' }],
					push_num: [{ required: true, message: '请输入推送次数', trigger: 'blur' }],
					gruop_id: [{ required: true, message: '请选择账号分类', trigger: 'blur' }],
					language_id: [{ required: true, message: '请输入国家语种', trigger: 'blur' }],
					push_msg: [{ required: true, message: '请输入推送消息', trigger: 'blur' }],
				},
				dialogImageUrl: '',
				dialogVisible: false,
			};
		},

		methods: {
			// 删除图片
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},

			// 预览图片
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},

			// 确定
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					const starttime = Number(this.ruleForm.start_time);
					const endtime = Number(this.ruleForm.end_time);
					if (starttime < 0 || endtime < 0 || starttime > endtime) {
						return this.$message.error('随机等待时间输入有误，请重新输入');
					}
					if (this.ruleForm.push_num <= 0) {
						return this.$message.error('单号消息推送次数有误');
					}
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
					start_time: '',
					end_time: '',
					push_num: '',
					gruop_id: '',
					push_img: '',
					language_id: '',
					push_msg: '',
				});
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style></style>
