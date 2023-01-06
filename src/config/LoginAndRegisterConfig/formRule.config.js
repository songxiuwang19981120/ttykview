

export default {

    username: [
        { required: true, message: '账号必填', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '密码必填', trigger: 'blur' },
        { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, message: '密码格式 6-21位数字字母组合', trigger: 'blur' }
    ],
    isSamePwd: [
        { required: true, message: '请确认密码', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '邮箱必填', trigger: 'blur' },
        {  pattern:/^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/,message: '请输入正确的邮箱格式', trigger: 'blur' }],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
}