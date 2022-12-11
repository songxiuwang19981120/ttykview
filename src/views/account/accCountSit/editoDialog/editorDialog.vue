<template>
    <div>
        <el-dialog :visible="showEditorDialog" :before-close="handlerClose">
            <table-custom></table-custom>
        </el-dialog>
    </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom";
import Pagination from "@/components/myComponent/table/pagination";

export default {
    name: 'TtprojectEditorDialog',
    props:{
        showEditorDialog:{
            type:Boolean
        }
    },
    components:{tableCustom,Pagination},
    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        handlerClose(){
            this.$emit('closeEditorDialog')
        }
    },
};
</script>

<style lang="stylus" scoped>

</style>