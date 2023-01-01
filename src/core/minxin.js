export default {
    data() {
        return {
        }
    },
    methods: {
        /*
            function: getTreeData
            params: data | 需要进行递归处理的数组
            desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
            return: 处理后的数据
        */
        getTreeData(data) {
            data.forEach((item) => {
                if (!item.children.length) {
                    item.children = undefined;
                } else {
                    this.getTreeData(item.children);
                }
            });
            return data;
        },
        /* 
            function: formatTypeId
            params: param | 需要格式化的数据
            desc: 格式化分类ID
            return: 格式化之后的分类ID，数组最后一位
        */
        formatTypeId(param) {
            if (!param) {
                return false
            }
            return param[param.length - 1] ?? ""
        },
    }
}