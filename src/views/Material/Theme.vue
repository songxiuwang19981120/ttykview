<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div>
					<span>设备分组：</span>
					<el-select v-model="searchTableData.equipment" placeholder="设备分组选择" style="margin-right: 20px"
						@focus="getaccGroup" :loading="equipmentLoading" loading-text="数据加载中...">
						<el-option v-for="item in searchEquipmentList" :key="item.grouping_id"
							:label="item.grouping_name" :value="item.grouping_id">
						</el-option>
					</el-select>
				</div>
				<div>
					<span>账号分类：</span>
					<el-cascader :props="{ checkStrictly: true }" :options="searchTypecontrolList"
						v-model="searchTableData.typecontrol" placeholder="账号分类选择" style="margin-right: 20px"
						@focus="getTypecontrol"></el-cascader>
				</div>
				<div>
					<!-- 查询 -->
					<el-button type="primary" :loading="btnloading" @click="searchNickName"
						style="margin-right: 20px">{{
								btnloading ? '加载中...' : '搜索'
						}}</el-button>
				</div>
				<div>
					<el-button type="primary" @click="btnReset">重置</el-button>
				</div>
			</div>
			<div class="tt-accsituation--operation">
				<div>
					<el-button type="primary" @click="uploadNickName">上传</el-button>
				</div>
			</div>
		</div>
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>

		<el-dialog title="编辑" :visible="contentVisibleUpdate" @close="contentCancelUpdate" width="20%" style="margin-top:20px">
			<el-input style="width:50%" type="text" v-model="UpdateText" size="mini"></el-input>
			<el-button style="margin-left:20px" size="mini" @click="btnCancel">取消</el-button>
			<el-button  size="mini" type="primary"  @click="btnOK()">确认</el-button>
		</el-dialog>
		<!-- 表格 -->
		<el-dialog title="主题内容列表" :visible="contentVisible" @close="contentCancel" width="30%">
			<table-custom :loading="loadingList" :tableData="tableDataList" :columns="columnsList"></table-custom>
		</el-dialog>
		<!-- 上传弹层 -->
		<NickNameUploadDialog :showDialog.sync="showUploadDialog" :upParameter="parameterData"></NickNameUploadDialog>
	</div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import NickNameDetailDialog from './component/ThemeDetailDialog';
import NickNameUploadDialog from './component/ThemeUploadDialog';
export default {
	name: 'TtTheme',
	components: {
		tableCustom,
		NickNameDetailDialog,
		NickNameUploadDialog,
	},
	data() {
		return {
			liadbutton:false,
			contentVisibleUpdate:false,
			UpdateText:"",
			subjectcontent_id:"",
			columnsList: [
				{
					prop: 'content',
					label: '主题内容',
					align: 'center',
				},
				{
					label: '操作',
					align: 'center',
					render: (h, { row }) => {
						return (
							<div>
								<el-button
									style="margin-right: 5px;"
									type="primary"
									size="mini"
									onClick={this.editBtnB.bind(this, row)}
								>
									修改
								</el-button>
				
								<el-button
									style="margin-right: 5px;"
									type="danger"
									size="mini"
									onClick={this.delete.bind(this, row)}
								>
									删除
								</el-button>
				
							</div>
						);
					},
				},
			],
			btnUpdateloading:false,
			classifytypecontrol_id:"",//获取的数据
			classifygrouping_id:"",
			loadingList: false,
			tableDataList: [],
			contentVisible: false,
			searchEquipmentList: [], // 分组数据
			searchTypecontrolList: [], // 账号分类数据
			btnloading: false,
			searchTableData: {
				equipment: '',
				typecontrol: '', // 表格搜索
			},
			loading: false, // 表格-分页组件相关
			tableData: [],
			columns: [
				{
					prop: 'type_title',
					label: '分类',
					align: 'center',
				},
				{
					label: '操作',
					align: 'center',
					render: (h, { row }) => {
						return (
							<div>
								<el-button
									style="margin-right: 5px;"
									type="primary"
									size="mini"
									onClick={this.editBtn.bind(this, row)}
								>
									查看主题内容
								</el-button>
							</div>
						);
					},
				},
			],
			total: 0,
			showDetailDialog: false,
			showUploadDialog: false,
			equipmentLoading: false,
			typecontrolLoading: false,
			nickData: {}, // 传递给详情弹层的数据
			parameterData: {}
		};
	},

	mounted() {
		this.subjectcontentListtable()
	},

	methods: {
		//取消按钮
		btnCancel() {
				this.contentVisibleUpdate=false
				
			},
			//确认
			btnOK(){
				this.btnUpdateloading=true
				this.subjectcontentUpdate();//修改提交数据
				setTimeout(() => {
				this.getNickNameClassify();//获取当前index
				this.contentVisibleUpdate=false;
				}, 50);
				
			},

		contentCancel() {
			this.tableDataList = []
			this.contentVisible = false
		},
		contentCancelUpdate(){
			this.contentVisibleUpdate=false;
			this.UpdateText="";
		},
		editBtn(row) {
			this.contentVisible = true;
			this.classifytypecontrol_id=row.typecontrol_id;
			this.classifygrouping_id=row.classifygrouping_id;
			this.getNickNameClassify()
		},
		//修改按钮
		editBtnB(row){
			
			this.contentVisibleUpdate=true;
			this.UpdateText=row.content;
			this.subjectcontent_id=row.subjectcontent_id;
			this.classifytypecontrol_id=row.typecontrol_id;
			this.classifygrouping_id=row.grouping_id;
			this.getNickNameClassify()
			// this.subjectcontentUpdate(row)
		},
		//修改接口
		async subjectcontentUpdate() {
			try {
				const res = await this.$api({
					type: 'subjectcontentUpdate',
					data:{
						content:this.UpdateText,
						subjectcontent_id:this.subjectcontent_id,
					}
				});
				if (res.status == 200) {
				
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} 
		},
		//删除按钮
		delete(row){
			this.subjectcontent_id=row.subjectcontent_id;
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
			let subjectcontentDelete=this.subjectcontentDelete();
			let getNickNameClassify =setTimeout(() => {
				this.getNickNameClassify();
			}, 50);
          this.$message({
			subjectcontentDelete,
			getNickNameClassify,
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
			
		
		},
		async subjectcontentDelete() {
			try {
				const res = await this.$api({
					type: 'subjectcontentDelete',
					data:{
						subjectcontent_ids:this.subjectcontent_id
					}
				});
				if (res.status == 200) {
					
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} 
		},
		// 获取设备分组数据
		async getaccGroup() {
			try {
				this.equipmentLoading = true;
				const res = await this.$api({
					type: 'getGrouping',
				});
				if (res.status == 200) {
					this.searchEquipmentList = res.data.list;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.equipmentLoading = false;
			}
		},
		
		// 获取素材分类数据
		async getTypecontrol() {
			try {
				this.typecontrolLoading = true
				const res = await this.$api({
					type: 'getTypecontrol',
				});
				if (res.status == 200) {
					this.getTreeData(res.data);
					this.searchTypecontrolList = res.data;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.typecontrolLoading = false
			}
		},
		// 获取素材分类数据
		async subjectcontentListtable(data) {
			try {
				this.loading = true
				const res = await this.$api({
					type: 'subjectcontentListtable',
					data
				});
				this.loading = false
				if (res.status == 200) {
					this.tableData = res.data;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false
			}
		
		},

		// 获取index分类数据
		async getNickNameClassify() {
			this.loadingList=true
			let data = {
				typecontrol_id:this.classifytypecontrol_id, //点击设备分组的grouping_id
				grouping: this.classifygrouping_id,//点击分类的typecontrol_id
			}
			try {
				const res = await this.$api({
					type: 'subjectcontentIndex',
					data: data
				});
				if (res.status == 200) {
					this.tableDataList = res.data.list;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loadingList = false;
			}
			
		},
		// 点击查询按钮
		searchNickName() {
			this.btnloading = true;
			let data = this.searchTableData;
			this.subjectcontentListtable2(data);
			this.btnloading = false;
		},
		// 获取素材分类数据
		async subjectcontentListtable2(data) {
			try {
				this.loading = true
				const res = await this.$api({
					type: 'subjectcontentListtable',
					data:{
						typecontrol_id:data.typecontrol[data.typecontrol.length - 1] ?? "",
						grouping_id:data.equipment
					}
				});
				
				this.loading = false
				if (res.status == 200) {
					this.tableData = res.data;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false
			}
			
			
		},
		
		// 点击重置按钮
		btnReset() {
			this.searchTableData = {
				equipment: '',
				typecontrol: ''
			}
			this.subjectcontentListtable();
		},
		// 点击上传按钮
		uploadNickName() {
			this.showUploadDialog = true;
		},
		// 点击详情按钮
		toNickNameDetail(obj) {
			this.showDetailDialog = true;
			this.nickData = {
				typecontrol_id: obj.typecontrol_id,
				grouping_id: this.searchTableData.equipment,
			};
			this.$refs.detailDialog.getNickName({
				page: 1,
				limit: 20,
				typecontrol_id: obj.typecontrol_id,
				grouping_id: this.searchTableData.equipment,
			});
		},
		// 处理树型children问题
		getTreeData(arr) {
			arr.forEach((item) => {
				if (!item.children.length) {
					item.children = undefined;
				} else {
					this.getTreeData(item.children);
				}
			});
		},
	},
};
</script>

<style lang="stylus" scoped>
	.tt-accsituation{
		background-color #fff
		margin-bottom  20px
		border-radius 4px
		padding 0 12px
		.tt-accsituation--operation{
			display flex
			height 70px
			line-height 70px
		}
	}
</style>
