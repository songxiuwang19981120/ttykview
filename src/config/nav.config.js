export default {
    ASIDE_LIST: [
        {
            title: '首页',
            to: '/index',
            icon: 'el-icon-s-tools',
        },
        {
            title: '设备管理',
            to: '',
            icon: 'el-icon-s-tools',
            children: [
                {
                    title: '设备情况',
                    to: '/equsituation',
                    icon: '',
                },
                {
                    title: '设备分组',
                    to: '/equgroup',
                    icon: '',
                },
            ]
        },
        {
            title: '账号管理',
            to: '',
            icon: 'el-icon-s-tools',
            children: [
                {
                    title: '账号情况',
                    to: '/accsituation',
                    icon: '',
                },
                {
                    title: '账号分类',
                    to: '/accclass',
                    icon: '',
                },
            ]
        },
        {
            title: '任务配置',
            to: '',
            icon: 'el-icon-s-tools',
            children: [
                {
                    title: '视频发布',
                    to: '/videorelease',
                    icon: '',
                },
                {
                    title: '评论区点赞',
                    to: '/commentlike',
                    icon: '',
                },
                {
                    title: '关注',
                    to: '/follow',
                    icon: '',
                },
                {
                    title: '私信',
                    to: '/private',
                    icon: '',
                },
            ]
        },
        {
            title: '素材管理',
            to: '',
            icon: 'el-icon-s-tools',
            children: [
                {
                    title: '视频',
                    to: '/video',
                    icon: '',
                },
                {
                    title: '头像',
                    to: '/avartar',
                    icon: '',
                },
                {
                    title: '昵称',
                    to: '/nikname',
                    icon: '',
                },
                {
                    title: '签名',
                    to: '/autograph',
                    icon: '',
                },
                {
                    title: '标签',
                    to: '/label',
                    icon: '',
                },
                {
                    title: '需关注ID',
                    to: '/fllow',
                    icon: '',
                },
                {
                    title: '私信素材',
                    to: '/letter',
                    icon: '',
                },
                {
                    title: '主题内容',
                    to: '/theme',
                    icon: '',
                },
            ]
        },

        {
            title: '视频采集',
            to: '/videocapture',
            icon: 'el-icon-s-platform'
        },
        {
            title: '用户采集',
            to: '/usercapture',
            icon: 'el-icon-s-platform'
        }

    ]

}