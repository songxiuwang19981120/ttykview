<template>
	<el-dialog :visible="showLogsDialog" @close="btnCancel">
		<el-row type="flex" justify="center">
			<el-button size="small" @click="btnCancel">取消</el-button>
			<el-button size="small" type="primary" @click="btnCancel">确定</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			showLogsDialog: {
				type: Boolean,
				default: false,
			},
		},
    methods: {
      btnCancel(){
        this.$emit('update:showLogsDialog',false)
      }
    }
	};
</script>

<style></style>
