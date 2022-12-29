<template>
    <div>
        <div class="infobar-wrap">
            <p>{{time}}-{{time}}转发最高值为{{data.max_num}} ，最低值为{{data.min_num}} , 平均值为{{data.average_num}}</p>
            <p>统计时间：{{data.update_time}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TtprojectInfoBar',
    props:{
        time:{
            type:String
        },
        data:{
            type:Object
        }
    },
    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="stylus" scoped>
.infobar-wrap
    padding: 0 30px
    display: flex
    justify-content: space-between
    align-items: center
    background-color: #CCC
    width: 100%
    height: 40px
    border-radius: 20px
</style>