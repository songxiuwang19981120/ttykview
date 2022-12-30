<template>
    <div>
        <el-dialog>
            <table-custom
            :loading="loading"
            :tableData="tableData"
            :columns="columns"
            ></table-custom>
        </el-dialog>
    </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
export default {
    name: 'TtprojectLogDialog',
    components:{tableCustom},
    props:{

    },
    data() {
        return {
            loading:false
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="stylus" scoped>

</style>