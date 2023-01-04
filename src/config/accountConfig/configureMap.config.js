export default {
    fansMap: {
        '1000': "小于1K",
        "1000,5000": "1k-5k",
        "5000,10000": "5k-10k",
        "10000,50000": "10k-50k",
        "0,50000": "大于50k",
        "0,100000": "不限",
      },
      fansOption: [
        //粉丝量下拉框options  
        { value: [1000], label: "小于1K" },
        { value: [1000, 5000], label: "1k-5k" },
        { value: [5000, 10000], label: "5k-10k" },
        { value: [10000, 50000], label: "10k-50k" },
        { value: [0, 50000], label: "大于50k" },
      ],
      operationMap: {
        '编辑': "handleEdit",
        '删除': "handleDelete",
        '发布视频': "handleRelease",
        '分析': "handleAnalysis",
      },
      accStatusMap: {
        1: "正常",
        0: "封禁",
        2: "登出",
        2096: "私密账号",
        3002290: "个人资料，查看历史记录不可用",
      },
      operationOption: [
        {
          value: "编辑",
          label: "编辑",
        },
        {
          value: "删除",
          label: "删除",
        },
        {
          value: "分析",
          label: "分析",
        },
        {
          value: "发布视频",
          label: "发布视频",
        },
      ],
      sortQueryOption: [
        {
          value: "0",
          label: "粉丝",
        },
        {
          value: "1",
          label: "访问人数",
        },
        {
          value: "2",
          label: "关注",
        },
        {
          value: "3",
          label: "获赞",
        },
      ],
}