import Vue from 'vue'

// 注册人民币过滤器
Vue.filter('moneyFormat', (value) => {
    return '￥' + Number(value).toFixed(2);
})