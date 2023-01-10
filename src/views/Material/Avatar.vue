<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div>
					<GroupSelect ref="groupselect" @handleChange="handleChange($event)" style="margin-right: 10px" />
				</div>
				<div>
					<TypeSelect @handleTypeChange="handleTypeChange($event)" :typeList="libraryList"
						style="margin-right: 10px" />
				</div>
				<div>
					<el-select v-model="searchTableData.status" placeholder="素材类型"
						style="width: 160px; margin-right: 20px">
						<el-option v-for="item in searchTypeList" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</div>
				<div>
					<el-select v-model="searchTableData.sort" placeholder="时间排序"
						style="width: 110px; margin-right: 20px">
						<el-option v-for="item in searchTimeSortList" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</div>
				<el-button type="primary" size="medium" class="seachbut" :loading="submitting" @click="searchTable">{{
					submitting?
									'搜索中 ...':
						'搜索'
				}}</el-button>
				<el-button type="primary" class="seachbut" size="medium" @click="resetTable">重置</el-button>
				<el-button type="primary" class="seachbut" size="medium" @click="imgUpLoad">上传图片</el-button>
				<el-button type="primary" class="seachbut" size="medium" @click="batchDelete" :loading="deleteing">{{
					deleteing? '删除中...': '批量删除'
				}}</el-button>
			</div>
		</div>
		<el-dialog title="图片上传" :visible.sync="imgUploadVisible" width="40%" :before-close="imgUploadClose">
			<el-form ref="imgForm" :rules="rulesUpload" :model="imgForm" label-width="140px">
				<el-form-item label="账号分组:" prop="group">
					<GroupSelect ref="addgroupselect" @handleChange="handleAddChange($event)" />
				</el-form-item>
				<el-form-item label="账号分类:" prop="library">
					<TypeSelect ref="addtypeselect" @handleTypeChange="handleAddTypeChange($event)"
						:typeList="libraryAddList" />
				</el-form-item>
				<el-form-item label="图片:" prop="img">
					<el-upload ref="imgUnload" class="upload-demo" drag action="" multiple accept=".png,.jpg,.jpeg"
						:on-remove="handleRemove" :auto-upload="false" :on-change="uploadImg" :file-list="fileList">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="imgUploadClose">取 消</el-button>
				<el-button type="primary" :loading="imgSubmitting" @click="submitForimg">{{
					imgSubmitting? '提交中...': '提 交'
				}}</el-button>
			</span>
		</el-dialog>
		<div>
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
				<span style="color: #ff411f; font-size: 12px; padding-left: 20px">
					已选中 {{ checkedCities.length }} 个图片</span></el-checkbox>
			<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class="img">
				<div v-for="(item, index) in tableData" :key="index" class="imgData">
					<el-image :src="item.image" class="imgsize"></el-image>
					<el-checkbox :label="item.headimage_id" :key="item.headimage_id" class="imgNum">头像编号:100{{
						item.headimage_id
					}}</el-checkbox>
					<div class="imgNum">上传时间:{{ item.usage_time }}</div>
				</div>
			</el-checkbox-group>
		</div>
		<!-- <table-custom :loading="loading" :tableData="tableData" :columns="columns" :mutiSelect="true"
            @handleSelectionChange="selectionChange"></table-custom> -->
		<pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
		</pagination>
	</div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
import GroupSelect from '@/components/base/baseSelect/GroupSelect.vue';
import TypeSelect from '@/components/base/baseSelect/TypeSelect.vue';
import base from '@/config/base.config';
const { BASE_URL } = base;

export default {
	name: 'TtAvatar',
	components: {
		tableCustom,
		pagination,
		GroupSelect,
		TypeSelect,
	},
	data() {
		return {
			deleteing: false, //删除ing
			checkAll: false, //全选
			checkedCities: [], //已选数据
			isIndeterminate: true, //复选框全选属性
			baseUrl: BASE_URL,
			imgUrl: '', //播放图片路径
			loading: false, //表格加载loading
			tableData: [], //表格数据
			columns: [
				{
					prop: 'image',
					label: '头像',
					minWidth: 100,
					fixed: true,
					align: 'center',
					render: (h, { row }) => {
						let imgList = [];
						imgList[0] = row.image;
						return (
							<div>
								<el-image
									style="width: 50px; height: 50px"
									src={row.image}
									preview-src-list={imgList}
								></el-image>
							</div>
						);
					},
				},
				{
					prop: 'operation',
					label: '操作',
					width: 160,
					align: 'center',
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div>
								<el-popconfirm
									confirm-button-text="删除"
									cancel-button-text="取消"
									title="确认删除此图片？"
									onConfirm={this.removeHandler.bind(this, row, '1')}
								>
									<el-button slot="reference" type="danger" size="mini">
										删除
									</el-button>
								</el-popconfirm>
							</div>
						);
					},
				},
			], //表格
			total: 0, //数据总量
			current_page: 1, //当前页
			current_limit: 50, //每页条数
			submitting: false, //提交确定
			groupList: [], //账号分组
			libraryList: [], //账号分类
			searchTableData: {
				equipment: '',
				library: '',
				status: '',
				sort: '',
			}, //搜索条件
			searchTimeSortList: [
				{
					value: 'desc',
					label: '正序',
				},
				{
					value: 'asc',
					label: '倒序',
				},
			], //时间排序
			searchTypeList: [
				{
					value: '',
					label: '全部素材',
				},
				{
					value: '0',
					label: '已用素材',
				},
				{
					value: '1',
					label: '可用素材',
				},
			], //素材类型
			imgUploadVisible: false, //图片上传弹框
			imgSubmitting: false, //图片上传加载状态
			imgForm: {
				group: '', //分组
				library: '', //库
			}, //图片数据
			rulesUpload: {
				group: [{ required: true, message: '请选择账号分组', trigger: 'blur' }],
				library: [{ required: true, message: '请选择账号分类', trigger: 'blur' }],
			}, //图片上传弹框校验
			fileList: [], //已选择需要上传的图片
			libraryAddList: [],
		};
	},

	mounted() {
		this.getGroupList();
		this.getHeadimageList();
	},

	methods: {
		// 图片拉取
		uploadImg(file, fileList) {
			let { size } = file || {};
			if (fileList.findIndex(f => f.name === file.name) != fileList.findLastIndex(f => f.name === file.name)) {
				this.$message.error('图片已存在');
				fileList.pop()
			} else if (size > 200 * 1024) {
				this.$message.error('图片大小请不要超过200kb');
				// fileList.splice(fileList.indexOf(file), 1)
				fileList.pop()
			} else {
				this.fileList = fileList
			}
		},
		// 分组选择
		async handleChange(e) {
			this.searchTableData.equipment = e;
			let searchTypeData = {
				grouping_id: e,
			};
			try {
				let result = await this.$api({ type: 'getTypecontrol', data: searchTypeData });
				if (result.status == '200') {
					this.getTreeData(result.data);
					this.libraryList = result.data;
				} else {
					this.$message.error({ message: result.msg });
				}
			} catch (error) { }
		},
		// 分类选择
		handleTypeChange(e) {
			this.searchTableData.library = e;
		},
		// 分组选择 - 新增
		async handleAddChange(e) {
			this.imgForm.group = e;
			let searchTypeData = {
				grouping_id: e,
			};
			try {
				let result = await this.$api({ type: 'getTypecontrol', data: searchTypeData });
				if (result.status == '200') {
					this.getTreeData(result.data);
					this.libraryAddList = result.data;
				} else {
					this.$message.error({ message: result.msg });
				}
			} catch (error) { }
		},
		// 分类选择 - 新增
		handleAddTypeChange(e) {
			this.imgForm.library = e;
		},
		// 批量删除
		batchDelete() {
			if (this.checkedCities.length == 0) {
				this.$message.warning('请选择需要删除的头像');
			} else {
				this.removeHandler(this.checkedCities, '2');
			}
		},
		// 监听全选
		handleCheckAllChange(val) {
			if (val) {
				this.tableData.forEach((item) => {
					if (this.checkedCities.indexOf(item.headimage_id) === -1) {
						this.checkedCities.push(item.headimage_id);
					}
				});
			} else {
				this.checkedCities = [];
			}
			this.isIndeterminate = false;
		},
		// 单个选择
		handleCheckedCitiesChange(value) {
			let checkedCount = value.length;
			this.checkAll = checkedCount === this.tableData.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
		},
		// 检验上传的图片大小
		imgBefore(file) {
			let { size } = file || {};
			if (size > 200 * 1024) {
				this.$message.error('图片大小请不要超过200kb');
				return false;
			}
		},
		// 图片删除
		handleRemove(file, fileList) {
			this.fileList = fileList;
		},
		/*
		function: getTreeData
		params: data | 需要进行递归处理的数组
		desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
		return: 处理后的数据
	*/
		getTreeData(arr) {
			arr.forEach((item) => {
				if (!item.children.length) {
					item.children = undefined;
				} else {
					this.getTreeData(item.children);
				}
			});
		},
		/* 
		获取分组
	*/
		async getGroupList() {
			let result = await this.$api({ type: 'getGrouping' });
			if (result.status == '200') {
				this.groupList = result.data.list;
			} else {
				this.$message.error({ message: result.msg });
			}
		},
		// 图片上传提交
		submitForimg() {
			if (this.fileList.length == 0) {
				return this.$message.warning({ message: '请选择需要上传的图片' });
			}
			this.$refs['imgForm'].validate((valid) => {
				if (!valid) return false;
				this.imgSubmitting = true;
				this.imgSub()
			});
		},
		async imgSub() {
			let msg = []
			this.fileList.forEach((item) => {
				let data = new FormData();
				let typecontrolId = this.imgForm.library[this.imgForm.library.length - 1] ?? '';
				data.append('file', item.raw);
				data.append('typecontrol_id', typecontrolId);
				data.append('grouping_id', this.imgForm.group);
				msg.push(this.headimageUpload(data))
			})
			await Promise.all(msg)
			this.$message.success({ message: '新增成功' });
			this.imgSubmitting = false;
			this.imgUploadClose()
			this.getHeadimageList();
		},
		// 头像上传提交
		async headimageUpload(data) {
			try {
				let result = await this.$api({ type: 'headimageUpload', data: data });
				return result.msg
			} catch (error) {
				console.error(error);
			}
		},
		// 取消图片上传弹框
		imgUploadClose() {
			this.fileList = [];
			this.imgForm = {
				group: '', //分组
				library: '', //库
			};
			this.$refs.imgUnload.clearFiles();
			this.$refs.addgroupselect.group = '';
			this.$refs.addtypeselect.classiFication = '';
			this.imgUploadVisible = false;
		},
		/*
	   图片上传弹框
	*/
		imgUpLoad() {
			this.fileList = [];
			this.imgForm = {
				group: '', //分组
				library: '', //库
			};
			this.imgUploadVisible = true;
		},
		/*
	   删除图片
	*/
		async removeHandler(val, type) {
			let data = {
				headimage_ids: '',
			};
			if (type == 2) {
				//批量删除
				this.deleteing = true;
				data.headimage_ids = val.join(',');
			} else {
				data.headimage_ids = val.headimage_id;
			}

			try {
				let result = await this.$api({ type: 'deleteHeadimage', data: data });
				this.deleteing = false;
				if (result.status == '200') {
					if (type == 2) {
						this.checkedCities = [];
					}
					this.$message.success({ message: '图片删除成功' });
					this.getHeadimageList();
				} else {
					this.$message.error({ message: result.msg });
				}
			} catch (error) {
				console.error(error);
			}
		},
		/*
	   翻页回调
	*/
		handlePagination(val) {
			this.current_page = val.page; //页数
			this.current_limit = val.limit; //请求数据量
			this.getHeadimageList();
		},
		/*
	  获取表格已选择的数据
   */
		selectionChange(val) { },
		// 搜索数据
		searchTable() {
			this.submitting = true;
			this.getHeadimageList();
		},
		/*
		获取图片
	*/
		async getHeadimageList() {
			let order = '';
			if (this.searchTableData.sort != '') {
				order = 'usage_time';
			}
			let typecontrolId =
				this.searchTableData.library[this.searchTableData.library.length - 1] ?? '';
			let data = {
				limit: this.current_limit,
				page: this.current_page,
				img_num: '',
				add_time_start: '',
				add_time_end: '',
				typecontrol_id: typecontrolId,
				order: order,
				sort: this.searchTableData.sort,
				grouping_id: this.searchTableData.equipment,
				status: this.searchTableData.status,
			};
			try {
				this.loading = true;
				let result = await this.$api({ type: 'getHeadimageList', data: data });
				if (result.status == '200') {
					this.tableData = result.data.list;
					this.total = result.data.count;
				} else {
					this.$message.error({ message: result.msg });
				}
				this.loading = false;
				this.submitting = false;
			} catch (error) {
				this.loading = false;
				this.submitting = false;
				console.error(error);
			}
		},
		/*
		搜索重置
	*/
		resetTable() {
			this.searchTableData = {
				equipment: '',
				library: '',
				status: '',
				sort: '',
			};
			this.libraryList = [];
			this.$refs.groupselect.group = '';
			this.getHeadimageList();
		},
	},
};
</script>

<style scoped>
::v-deep .el-image-viewer__canvas {
	width: 40%;
}

.search-title {
	font-size: 13px;
	padding-right: 10px;
}

.imgsize {
	width: 125px;
	height: 125px;
	border-radius: 100px;
}

.img {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	max-height: 700px;
	overflow-y: scroll;
}

.imgData {
	width: 170px;
	margin: 10px 15px;
}

.imgNum {
	color: rgba(16, 16, 16, 1);
	font-size: 12px;
	text-align: left;
	padding-top: 5px;
}

.imgCheckbox {
	display: flex;
	justify-content: space-between;
	margin-top: 5px;
}
</style>
