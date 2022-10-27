<template>
  <div class="login-container">
    <!--登录面板内容部分-->
    <div class="login-inner">
      <!--面板头部-->
      <div class="login-header">
        <div class="login-logo">
          <img src="./images/lk_logo_sm.png" alt="" width="300">
        </div>
        <!--面板标题-->
        <div class="login-header-title">
          <a href="javascript:;" :class="{current:loginMode}" @click="dealLoginMode(true)">手机登录</a>
          <a href="javascript:;" :class="{current:!loginMode}" @click="dealLoginMode(false)">密码登录</a>
        </div>
      </div>
      <!--面板表单部分-->
      <div class="login-content">
        <form>
          <!--手机验证码登录部分-->
          <div :class="{current:loginMode}">
            <section class="login-message">
              <label>
                <input type="text" maxlength="11" placeholder="手机号" v-model="phone">
              </label>
              <button v-if="!countDown" class="get-verification" :class="{phone_right:phoneRight}"
                      @click.prevent="getVerifyCode()">获取验证码
              </button>
              <button v-else disabled="disabled" class="get-verification">
                已发送({{ countDown }}s)
              </button>
            </section>
            <section class="login-verification">
              <label>
                <input type="text" maxlength="8" placeholder="验证码" v-model="code"/>
              </label>
            </section>
            <section class="login-hint">
              温馨提示：未注册小撩买菜的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">服务协议与隐私政策</a>
            </section>
          </div>
          <!--账号登录部分-->
          <div :class="{current:!loginMode}">
            <section>
              <section class="login-message">
                <label>
                  <input type="text" maxlength="11" placeholder="用户名" v-model="userName" pattern="[0-9]{11}">
                </label>
              </section>
              <section class="login-verification">
                <label>
                  <input :type="passwordMode?'password':'text'" maxlength="20" placeholder="密码" autocomplete="off"
                         v-model="userPwd"/>
                </label>
                <div class="switch-show">
                  <img src="./images/hide_pwd.png" :class="{on:passwordMode}" alt="" width="20"
                       @click.prevent="dealPasswordMode(false)">
                  <img src="./images/show_pwd.png" :class="{on:!passwordMode}" alt="" width="20"
                       @click.prevent="dealPasswordMode(true)">
                </div>
              </section>
              <section class="login-message">
                <label>
                  <input type="text" maxlength="4" placeholder="验证码" v-model="captcha">
                </label>
                <img
                    class="get-verification"
                    src="http://demo.itlike.com/web/xlmc/api/captcha"
                    alt="captcha"
                    @click="getCaptcha"
                    ref="captcha"
                >
              </section>
            </section>
          </div>
          <button class="login-submit" @click.prevent="login">登录</button>
        </form>
        <button class="login-back" @click.prevent="back">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import {getPhoneCode, phoneCodeLogin, pwdLogin} from "../../service/api";
import {Toast} from 'vant'
import {mapActions} from 'vuex'

export default {
  name: "Login",
  data() {
    return {
      loginMode: true,  // 1. 登录模式
      passwordMode: true, // 2. 密码模式
      phone: null,  // 3. 手机号码
      countDown: 0,  // 4. 倒计时
      code: null,  // 5. 手机验证码
      userInfo: null,  // 6. 接收用户信息
      userName: null, // 7. 用户名
      userPwd: null, // 8. 密码
      captcha: null, // 9. 图形验证码
      //规则
      rules: {
        userName: {
          rule: /\s/,
          msg: '用户名|手机号不能为空'
        },
        userPwd: {
          rule: /^\w{4,11}$/,
          msg: '密码不能为空，并且要6-11位'
        },
        userTel: {
          rule: /1^[345689]\d{9}$/,
          msg: '填写11位手机号'
        }
      }
    }
  },
  methods: {
    ...mapActions(["syncUserInfo"]),
    back() {  // 1. 放回上一级路由
      this.$router.back();
    },
    dealLoginMode(flag) { // 2. 处理登录模式
      this.loginMode = flag;
    },
    dealPasswordMode(flag) {  // 3. 处理密码登录模式
      this.passwordMode = flag;
    },
    async getVerifyCode() { // 4. 获取短信验证码
      if (this.phoneRight) {// 4.1 过滤
        this.countDown = 60;
        // 4.2 倒计时
        this.intervalId = setInterval(() => {
          this.countDown--;
          if (this.countDown === 0) {
            clearInterval(this.intervalId);
          }
        }, 1000);
        // 4.3 获取短信验证码
        let result = await getPhoneCode(this.phone);
        console.log(result)
      }
    },
    async login() {  // 5. 登录
      let result;
      if (this.loginMode) { // 判断登录模式 手机验证码登录
        // 5.1 输入数据校验
        // 5.1.1 手机号码验证
        if (this.phone && !this.phone.trim()) {
          Toast({
            message: '请输入手机号码',
            duration: 500
          });
          return;
        } else if (!this.phoneRight) {
          Toast({
            message: '请输入正确手机号码',
            duration: 500
          });
          return;
        }
        // 5.1.2 验证码验证
        if (this.code && !this.code.trim()) {
          Toast({
            message: '请输入验证码',
            duration: 500
          });
          return;
        } else if (!(/^\d{6}$/gi.test(this.code))) {
          Toast({
            message: '请输入正确验证码',
            duration: 500
          });
          return;
        }
        // 5.1.3 手机验证码登录
        result = await phoneCodeLogin(this.phone, this.code);
        if (result.success_code === 200) {
          this.userInfo = result.data;
        } else {
          this.userInfo = {
            message: '登陆失败,手机号码或者验证码不正确！'
          }
        }
      } else {  // 用户名密码登录
        // 1. 判断有没有值
        if (!this.userName) {
          Toast({
            message: "请输入用户名",
            duration: 500
          })
          return;
        } else if (!this.userPwd) {
          Toast({
            message: "请输入密码",
            duration: 500
          })
          return;
        } /*else if (!this.captcha) {
          Toast({
            message: "请输入验证码",
            duration: 500
          })
          return;
        }*/
        // 2. 发起请求
        result = await pwdLogin(this.userName, this.userPwd);//result = await pwdLogin(this.userName, this.userPwd, this.captcha);
        Toast(result.data.message);
        console.log(result);
        if (result.success_code === 200) {
          this.userInfo = result.data;
        } else {
          this.userInfo = {
            message: result.data.message
          }
        }
    }
      //后续处理
      if (!this.userInfo.token) {
        Toast({
          message: this.userInfo.message,
          duration: 500
        })
      } else {
        // 用户信息保存到本地
        this.syncUserInfo(this.userInfo);
        // 返回主面板
        this.$router.back();
      }
    },
    getCaptcha() {
      // 1. 获取验证码标签
      let captcha = this.$refs.captcha;
      this.$set(captcha, 'src', "http://demo.itlike.com/web/xlmc/api/captcha?time=" + new Date())
    }
  },
  computed: {
    phoneRight() {// 验证手机号码是否正确
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone);
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: #fff;
}

.login-container .login-inner {
  padding-top: 60px;
  width: 80%;
  margin: 0 auto;
}

.login-container .login-inner .login-header .login-logo {
  font-size: 40px;
  font-weight: bold;
  color: #75a342;
  text-align: center
}

.login-container .login-inner .login-header .login-header-title {
  padding-top: 40px;
  padding-bottom: 10px;
  text-align: center;
}

.login-container .login-inner .login-header .login-header-title > a {
  color: #333;
  font-size: 14px;
  padding-bottom: 4px;
  text-decoration: none;
}

.login-container .login-inner .login-header .login-header-title > a:first-child {
  margin-right: 40px
}

.login-container .login-inner .login-header .login-header-title > a.current {
  color: #75a342;
  font-weight: 700;
  border-bottom: 2px solid #75a342
}

.login-container .login-inner .login-content > form > div {
  display: none;
}

.login-container .login-inner .login-content > form > div.current {
  display: block
}

.login-container .login-inner .login-content > form > div input {
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: 0;
  font: 400 14px Arial;
}

.login-container .login-inner .login-content > form > div input:focus {
  border: 1px solid #75a342
}

.login-container .login-inner .login-content > form > div .login-message {
  position: relative;
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}

.login-container .login-inner .login-content > form > div .login-message .get-verification {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: 0;
  color: #ccc;
  font-size: 14px;
  background: transparent;
}

.login-container .login-inner .login-content > form > div .login-message .get-verification.phone_right {
  color: #75a342
}

.login-container .login-inner .login-content > form > div .login-verification {
  position: relative;
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}

.login-container .login-inner .login-content > form > div .login-verification .switch-show {
  position: absolute;
  right: 10px;
  top: 12px;
}

.login-container .login-inner .login-content > form > div .login-verification .switch-show img {
  display: none
}

.login-container .login-inner .login-content > form > div .login-verification .switch-show img.on {
  display: block
}

.login-container .login-inner .login-content > form > div .login-hint {
  margin-top: 12px;
  color: #999;
  font-size: 12px;
  line-height: 20px;
}

.login-container .login-inner .login-content > form > div .login-hint > a {
  color: #75a342
}

.login-container .login-inner .login-content > form .login-submit {
  display: block;
  width: 100%;
  height: 42px;
  margin-top: 30px;
  border-radius: 4px;
  background: #75a342;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 42px;
  border: 0
}

.login-container .login-inner .login-content .login-back {
  display: block;
  width: 100%;
  height: 42px;
  margin-top: 15px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #75a342;
  color: #75a342;
  text-align: center;
  font-size: 16px;
  line-height: 42px
}
</style>