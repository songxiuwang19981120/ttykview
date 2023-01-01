<template>
    <div>
    <el-select
        :disabled="disabled"
        @change="handleChange(group)"
        ref="gropuSelect"
        clearable
        v-model="group"
        placeholder="设置分组"
      >
        <el-option
          v-for="item in groupList"
          :value="item.grouping_id"
          :label="item.grouping_name"
          :key="item.grouping_id"
        ></el-option>
      </el-select>
    </div>
</template>

<script>
export default {
    name: 'TtprojectGroupSelect',
    props:{
        disabled:{
            type:Boolean
        }
    },
    data() {
        return {
            group:'',
            groupList:[],
        };
    },

    mounted() {
        this.getGroupList()
    },

    methods: {
    /* 
        function: getGroupList
        params: null
        desc: 获取分组  异步
    */
    async getGroupList() {
      let result = await this.$api({ type: "getGrouping" });
      console.log(result);
      this.groupList = result.data.list;
    },
        handleChange(group){
            this.$emit('handleChange',group)
        }
    },
};
</script>

<style lang="stylus" scoped>

</style>