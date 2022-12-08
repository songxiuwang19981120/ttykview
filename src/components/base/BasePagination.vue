<template>
    <div>
    <el-pagination
    @current-change="handlerCurrentChange"
    class="base-pagination"
  background
  layout="prev, pager, next"
  :total="total">
</el-pagination>
    </div>
</template>

<script>
export default {
    name: 'TtprojectBasePagination',
    props:{
        total:{
            type:String
        }
    },
    data() {
        return {
            page:''
        };
    },

    mounted() {
        
    },

    methods: {
        handlerCurrentChange(val){
            console.log(val)
            this.$EventBus.$off('addMemberList')
            this.$EventBus.$emit('addMemberList')
        }
    },
};
</script>

<style lang="stylus">

</style>