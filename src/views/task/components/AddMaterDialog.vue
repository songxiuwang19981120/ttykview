<template>
	<el-dialog title="上传素材任务" :visible="showdialog" @close="btnCancel" width="40%">
		<el-form label-width="150px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="上传图片：" prop="push_img">
				<el-upload
					action="https://jsonplaceholder.typicode.com/posts/"
					list-type="picture-card"
					accept=".png,.jpg,.jpeg"
					:auto-upload="false"
					:on-preview="hdPicPrev"
					:on-remove="hdPicRem"
					:on-success="hdPicSuc"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="picVisible">
					<img width="100%" :src="picUrl" alt="" />
				</el-dialog>
			</el-form-item>
			<el-form-item label="上传视频：" prop="push_video">
				<el-upload
					action="#"
					list-type="picture-card"
					accept=".mp4,.mov,.wmv,.flv,.avi,.mkv"
					:auto-upload="false"
					:on-preview="hdVideoPrev"
					:on-remove="hdVideoRem"
					:on-success="hdVideoSuc"
				>
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="videoVisible">
					<img width="100%" :src="videoUrl" alt="" />
				</el-dialog>
			</el-form-item>
			<el-form-item label="上传昵称：" prop="push_nick">
				<el-input
					style="width: 60%"
					v-model="ruleForm.push_nick"
					placeholder="请输入昵称（一行一个）"
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
		},

		data() {
			return {
				picVisible: false,
				picUrl: '',
				videoVisible: false,
				videoUrl: '',
				ruleForm: {
					push_img: '',
					push_video: '',
					push_nick: '',
				},
				rules: {},
				btnloading: false,
			};
		},

		methods: {
			// 删除图片
			hdPicRem(file, fileList) {
				console.log(file, fileList);
			},

			// 预览图片
			hdPicPrev(file) {
				this.picUrl = file.url;
				this.picVisible = true;
			},

			// 图片上传成功返回
			hdPicSuc(response, file, fileList) {
				// if (response.status != '200') {
				// 	this.$message.warning(response.msg);
				// 	this.fileList.splice(this.fileList.indexOf(file), 1)
				// }
			},

			// 删除视频
			hdVideoRem(file, fileList) {
				console.log(file, fileList);
			},

			// 预览视频
			hdVideoPrev(file) {
				this.videoUrl = file.url;
				this.videoVisible = true;
			},

			// 视频上传成功返回
			hdVideoSuc(response, file, fileList) {
				// if (response.status != '200') {
				// 	this.$message.warning(response.msg);
				// 	this.fileList.splice(this.fileList.indexOf(file), 1)
				// }
			},

			// 确定
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					// 处理文本域数据
					let nickNameArr = [];
					this.ruleForm.push_nick.split('\n').forEach((item) => {
						console.log(item);
						if (item != '') {
							nickNameArr.push(item);
						}
					});
					if (nickNameArr.length && nickNameArr[0]) {
						this.ruleForm.push_nick = nickNameArr.join('\n');
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
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style></style>
