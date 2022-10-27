import ajax from './ajax'
import {request} from "../../../../yyysupermall-master/src/network/request";

// 1. 定义基础路径
const BASE_URL = 'http://localhost:3000'

// 2. 首页数据请求
export const getHomeData = () => ajax(BASE_URL + '/home/multidata');
export const getHData = (type,page) => ajax(BASE_URL + '/home/data',{type,page});
// 3. 分类左侧推荐栏数据接口
export const getCategories = () => ajax(BASE_URL + '/api/homeApi/categories');
// 4. 点击左侧推荐后右侧具体数据接口
export const getCategoriesDetail = (preParams) => ajax(BASE_URL + '/api/homeApi/categoriesdetail' + preParams);

//商品详情数据接口
export const getDetail = (iid) => ajax(BASE_URL+'/detail',{iid});

//商品推荐数据
export  const getRecommend = () => ajax(BASE_URL+'/recommend');


// 5. 用户中心接口

 const LOCAL_BASE_URL = "http://localhost:3000"
//const LOCAL_BASE_URL = "/api"

// 5.1 获取短信验证码(GET)
export const getPhoneCode = (phone) => ajax(LOCAL_BASE_URL + '/api/send_code', {phone});

// 5.2 手机验证码登录(POST)
export const phoneCodeLogin = (phone, code) => ajax(LOCAL_BASE_URL + '/api/login_code', {phone, code}, 'POST');

// 5.3 用户名密码登录(POST)
/* export const pwdLogin = (user_name, user_pwd, captcha) => ajax(LOCAL_BASE_URL + '/api/login_pwd', {
    user_name,
    user_pwd,
    captcha
}, 'POST') */ //原来的写法

export const pwdLogin = (userName, userPwd) => ajax(LOCAL_BASE_URL + '/mine/api/login_pwd', {
    userName,
    userPwd
}, 'POST');


// 5.4 自动登录（GET）
export const getUserInfo = () => ajax(LOCAL_BASE_URL + '/api/userinfo');

// 5.5 退出登录（GET）
export const getLogOut = () => ajax(LOCAL_BASE_URL + '/login/api/logout');

// 6. 购物车接口
// 6.1 添加商品到购物车
export const addGoodsToCart = (user_id, goods_id, goods_name, goods_price,goods_imgUrl) => ajax(LOCAL_BASE_URL + '/api/cart/add', {
    user_id,
    goods_id,
    goods_name,
    goods_price,
    goods_imgUrl
}, 'POST');


// 6.2 获取当前用户购物车中的商品
export const getGoodsCart = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/search/' + user_id);

// 6.3 修改购物车商品数量
export const changeCartNum = (user_id, goods_id, type) => ajax(LOCAL_BASE_URL + '/api/cart/num', {
    user_id,
    goods_id,
    type
}, 'POST');

// 6.4 删除当前用户购物车中所有的商品
export const clearAllCart = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/clear/' + user_id);

// 6.5 单个商品的选中和取消选中
export const singerGoodsSelect = (user_id, goods_id) => ajax(LOCAL_BASE_URL + '/api/cart/singer_select', {
    user_id,
    goods_id
}, 'POST');

// 6.6 所有商品的选中和取消选中
export const allGoodsSelect = (user_id, flag) => ajax(LOCAL_BASE_URL + '/api/cart/all_select', {user_id, flag}, 'POST');

// 6.7 查询所有已经被选中的商品
export const getAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/selected/' + user_id);

// 6.8 删除已经生成订单的商品
export const delAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL + '/api/cart/del_checked/' + user_id);


// 7. 地址接口

// 7.1 获取当前用户的地址
export const getUserAddress = (user_id) => ajax(LOCAL_BASE_URL + '/api/address/search/' + user_id);

// 7.2 添加新的地址
export const addUserAddress = (user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode) => ajax(LOCAL_BASE_URL + '/api/address/add', {
    user_id,
    address_name,
    address_phone,
    address_area,
    address_area_detail,
    address_post_code,
    address_tag,
    province,
    city,
    county,
    areaCode
}, 'POST');

// 7.3 编辑用户的地址
export const changeUserAddress = (address_id, user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode) => ajax(LOCAL_BASE_URL + '/api/address/edit', {
    address_id,
    user_id,
    address_name,
    address_phone,
    address_area,
    address_area_detail,
    address_post_code,
    address_tag,
    province,
    city,
    county,
    areaCode
}, 'POST');

// 7.4 删除用户的地址
export const delUserAddress = (address_id) => ajax(LOCAL_BASE_URL + '/api/address/del/' + address_id);

// 7.5 获取单条地址
export const getCurrentUserAddress = (user_id, address_id) => ajax(LOCAL_BASE_URL + '/api/address/one', {
    user_id,
    address_id
}, 'POST');

// 8. 订单接口
// 8.1 提交订单
export const postOrder = (user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price) => ajax(LOCAL_BASE_URL + '/api/order/post', {
    user_id,
    address_id,
    arrive_time,
    cart_shop,
    notice,
    shop_price,
    dis_price
}, 'POST');

// 8.2 订单支付成功
export const orderPaySuccess = (user_id, order_id) => ajax(LOCAL_BASE_URL + '/api/order/change_status', {
    user_id,
    order_id
}, 'POST');

// 8.3 查询订单
export const getOrder = (user_id, status) => ajax(LOCAL_BASE_URL + '/api/order/get', {user_id, status}, 'POST'); // pay will


// 9. 微信支付接口部署
/*支付接口白名单：demo.itlike.com */
const PAY_URL = 'http://47.98.157.152/WXPayProject/pay';
// const PAY_URL = '/pay';
// 6.1 获取支付的URL
export const getWXCode = (outTradeNo, totalFee) => ajax(PAY_URL + '/createNative.do', {outTradeNo, totalFee});
// 6.2 查询是否支付成功
export const queryPayStatus = (out_trade_no) => ajax(PAY_URL + '/queryPayStatus.do', {out_trade_no});

// http://localhost:8080/pay/createNative.do?outTradeNo=5fc0a5663a85621ca80755f5&totalFee=1



//抽取商品详情的数据
export class Goods{
    constructor(itemInfo,columns,services) {
        this.title = itemInfo.title
        this.desc = itemInfo.desc
        this.newPrice = itemInfo.price
        this.oldPrice = itemInfo.oldPrice
        this.discount = itemInfo.discountDesc
        this.columns = columns
        this.services = services
        this.realPrice = itemInfo.lowNowPrice


    }
}

export class Shop {
    constructor(shopInfo) {
        this.logo = shopInfo.shopLogo;
        this.name = shopInfo.name;
        this.fans = shopInfo.cFans;
        this.sells = shopInfo.cSells;
        this.score = shopInfo.score;
        this.goodsCount = shopInfo.cGoods
    }
}

// 商品参数
export class GoodsParam {
    constructor(info, rule) {
        // 注: images可能没有值(某些商品有值, 某些没有值)
        this.image = info.images ? info.images[0] : '';
        this.infos = info.set;
        this.sizes = rule.tables;
    }
}