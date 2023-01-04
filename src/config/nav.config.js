export default {
    ASIDE_LIST: [
        {
            title: '首页',
            to: '/index',
            icon: 'el-icon-s-home',
        },
        {
            title: '设备管理',
            to: '',
            icon: 'el-icon-mobile-phone',
            children: [
                {
                    title: '设备情况',
                    to: '/equsituation',
                    icon: '',
                },
                // {
                //     title: '账号分组',
                //     to: '/equgroup',
                //     icon: '',
                // },
            ]
        },
        {
            title: '账号管理',
            to: '',
            icon: 'el-icon-receiving',
            children: [
                {
                    title: '账号情况',
                    to: '/accsituation',
                    icon: '',
                },
                {
                    title: '账号分组',
                    to: '/equgroup',
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
            title: '任务管理',
            to: '',
            icon: 'el-icon-tickets',
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
                {
                    title: '账号创建',
                    to: '/accountcreation',
                    icon: '',
                },
                {
                    title: '养号任务',
                    to: '/cultivatetask',
                    icon: '',
                },
                {
                    title: '视频采集',
                    to: '/videocapture',
                    icon: ''
                },
                {
                    title: '用户采集',
                    to: '/usercapture',
                    icon: ''
                }
            ]
        },
        {
            title: '素材管理',
            to: '',
            icon: 'el-icon-magic-stick',
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
            title: '账户管理',
            to: '',
            icon: 'el-icon-user',
            children: [
                {
                    title: '用户管理',
                    to: '/users',
                    icon: '',
                },
                {
                    title: '角色管理',
                    to: '/roles',
                    icon: '',
                },
            ]
        },

    ]

}