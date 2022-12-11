export default {
  'FORM_TEMPLATE': {
    'video':{
      'selectList':[],
      'formList':[
        {
          label: "视频发布数量",
          prop: "videoNum",
          placeholder: "请输入发布数量",
          class:'taskdialog-baseinput'
        },
        {
          label: "主题标签数量",
          prop: "tagNum",
          placeholder: "请输入标签数量",
          class:'taskdialog-baseinput'
        },
        {
          label: "@用户数量",
          prop: "userNum",
          placeholder: "请输入@用户数量",
          class:'taskdialog-baseinput'
        },
        {
          label: "主题内容",
          prop: "themeContent",
          placeholder: "请输入主题内容",
          class:'taskdialog-themeinput'
        },
      ]
    },

    'likeComment': {
      'selectList': [
        {
          prop: "country",
          placeholder: "国家选择",
          options: [
            {
              value: "法国",
              label: "法国",
            },
            {
              value: "英国",
              label: "英国",
            },
            {
              value: "德国",
              label: "德国",
            },
          ],
        },
        {
          prop: "needFollow",
          placeholder: "需关注分组",
          options: [
            {
              value: "法国商城",
              label: "法国商城",
            },
            {
              value: "美国商城",
              label: "美国商城",
            },
            {
              value: "俄国商城",
              label: "俄国商城",
            },
          ],
        },
        {
          prop: "blackList",
          placeholder: "黑名单选择",
          options: [
            {
              value: "无昵称",
              label: "无昵称",
            },
            {
              value: "无作品",
              label: "无作品",
            },
            {
              value: "无头像",
              label: "无头像",
            },
          ],
        },
        {
          prop: "accCource",
          placeholder: "数据来源",
          options: [
            {
              value: "法国",
              label: "法国",
            },
            {
              value: "英国",
              label: "英国",
            },
            {
              value: "德国",
              label: "德国",
            },
          ],
        },
      ],
      'formList': [
        {
          label: '单作品点赞上限',
          prop: 'workMaxNum',
          placeholder: '请输入点赞上限'
        },
        {
          label: '单号点赞上限',
          prop: 'accLikeNum',
          placeholder: '请输入点赞上限'
        },
        {
          label: '评论获赞小于',
          prop: 'commentLess',
          placeholder: '请输入获赞小于数量'
        },
        {
          label: '连续失败执行下一个号',
          prop: 'continLose',
          placeholder: '请输入连续失败次数'
        },
      ]
    },

    'follow': {
      'selectList': [
        {
          prop: "country",
          placeholder: "国家选择",
          options: [
            {
              value: "法国",
              label: "法国",
            },
            {
              value: "英国",
              label: "英国",
            },
            {
              value: "德国",
              label: "德国",
            },
          ],
        },
        {
          prop: "needFollow",
          placeholder: "需关注分组",
          options: [
            {
              value: "法国商城",
              label: "法国商城",
            },
            {
              value: "美国商城",
              label: "美国商城",
            },
            {
              value: "俄国商城",
              label: "俄国商城",
            },
          ],
        },
        {
          prop: "blackList",
          placeholder: "黑名单选择",
          options: [
            {
              value: "无昵称",
              label: "无昵称",
            },
            {
              value: "无作品",
              label: "无作品",
            },
            {
              value: "无头像",
              label: "无头像",
            },
          ],
        },
        {
          prop: "accCource",
          placeholder: "数据来源",
          options: [
            {
              value: "法国",
              label: "法国",
            },
            {
              value: "英国",
              label: "英国",
            },
            {
              value: "德国",
              label: "德国",
            },
          ],
        },
      ],
      'formList': [
        {
          label: '单号每日关注上限',
          prop: 'accLetterMaxNum',
          placeholder: '请输入关注上限'
        },
        {
          label: '关注频率',
          prop: 'letterFrequency',
          placeholder: '请输入点赞上限',
          separate:2
        },
        {
          label: '粉丝数量小于',
          prop: 'fansLess',
          placeholder: '请输入获赞小于数量'
        },
        {
          label: '连续失败执行下一个号',
          prop: 'continLose',
          placeholder: '请输入连续失败次数'
        },
        {
          label: '评论获赞小于',
          prop: 'likeCommentNumLess',
          placeholder: '请输入获赞小于数量'
        },
      ]
    },


    'letter': {
      'selectList': [
        {
          prop: "country",
          placeholder: "目标国家",
          options: [
            {
              value: "法国",
              label: "法国",
            },
            {
              value: "英国",
              label: "英国",
            },
            {
              value: "德国",
              label: "德国",
            },
          ],
        },
        {
          prop: "blackList",
          placeholder: "黑名单选择",
          options: [
            {
              value: "无昵称",
              label: "无昵称",
            },
            {
              value: "无作品",
              label: "无作品",
            },
            {
              value: "无头像",
              label: "无头像",
            },
          ],
        },
        {
          prop: "accCource",
          placeholder: "数据来源",
          options: [
            {
              value: "法国",
              label: "法国",
            },
            {
              value: "英国",
              label: "英国",
            },
            {
              value: "德国",
              label: "德国",
            },
          ],
        },
      ],
      'formList': [
        {
          label: '单号私信上限',
          prop: 'letterMaxNum',
          placeholder: '请输入私信上限'
        },
        {
          label: '总私信上限',
          prop: 'allLetterNum',
          placeholder: '请输入总私信上限'
        },
        {
          label: '备注任务名称',
          prop: 'remarkTask',
          placeholder: '请输入备注名称'
        },
      ]
    }
  }
}
