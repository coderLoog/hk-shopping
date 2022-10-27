import {
    ADD_GOODS,
    INIT_SHOP_CART,
    REDUCE_CART,
    SELECTED_SINGLE_GOODS,
    SELECTED_ALL_GOODS,
    CLEAR_CART,
    USER_INFO,
    INIT_USER_INFO,
    RESET_USER_INFO
} from "./mutations-type";

import {getStore, setStore, removeStore} from '../config/global'
import Vue from 'vue'

export default {
    // 1. 往购物车中添加数据
    [ADD_GOODS](state, {goodsId, goodsName, smallImage, goodsPrice}) {
        let shopCart = state.shopCart;
        // 1.1 判断商品是否已经存在
        if (shopCart[goodsId]) {    // 存在
            shopCart[goodsId]["num"]++;
        } else {
            shopCart[goodsId] = {
                "num": 1,
                "id": goodsId,
                "name": goodsName,
                "small_image": smallImage,
                "price": goodsPrice,
                "checked": true
            }
        }
        // 1.2 产生新对象
        state.shopCart = {...shopCart};
        // 1.3 存入本地
        setStore('shopCart', state.shopCart);
    },

    // 2. 页面初始化获取购物车的数据（本地）
    [INIT_SHOP_CART](state) {
        let initCart = getStore('shopCart');
        if (initCart) {
            state.shopCart = JSON.parse(initCart);
        }
    },

    // 3. 把商品移出购物车
    [REDUCE_CART](state, {goodsId}) {
        let shopCart = state.shopCart;
        let goods = shopCart[goodsId];
        if (goods) {  // 找到该商品
            if (goods['num'] > 0) {
                goods['num']--;
                // 3.1 判断是否成为0个
                if (goods['num'] === 0) {
                    delete shopCart[goodsId];
                }
            } else {
                goods = null;
            }
            // 3.2 同步数据
            // 3.2.1 同步到shopCart中
            state.shopCart = {...shopCart};
            // 3.2.2 同步到本地
            setStore('shopCart', state.shopCart);
        }
    },

    // 4. 单个商品选中和取消选中
    [SELECTED_SINGLE_GOODS](state, {goodsId}) {
        let shopCart = state.shopCart;
        let goods = shopCart[goodsId];
        if (goods) {
            if (goods.checked) {  // 存在该属性
                goods.checked = !goods.checked;
            } else {
                Vue.set(goods, 'checked', true);
            }
            // 4.1 同步数据并进行本地化
            state.shopCart = {...shopCart};
            setStore("shopCart", state.shopCart);
        }
    },

    // 5. 商品的全选和取消全选
    [SELECTED_ALL_GOODS](state, {isSelected}) {
        let shopCart = state.shopCart;
        Object.values(shopCart).forEach((goods, index) => {
            if (goods.checked) {  // 存在该属性
                goods.checked = !isSelected;
            } else {
                Vue.set(goods, 'checked', !isSelected);
            }
        })
        state.shopCart = {...shopCart};
        setStore("shopCart", state.shopCart);
    },

    // 6. 清空购物车
    [CLEAR_CART](state) {
        // 6.1 vuex数据置空
        state.shopCart = null;
        state.shopCart = {...state.shopCart};
        // 6.2 本地数据清除
        // setStore("shopCart", state.shopCart);
        removeStore("shopCart");
    },

    // 7. 保存用户信息到本地
    [USER_INFO](state, {userInfo}) {
        state.userInfo = userInfo;
        setStore("userInfo", userInfo);
    },

    // 8. 获取用户信息
    [INIT_USER_INFO](state) {
        // 8.1 获取用户信息
        let userInfo = getStore("userInfo");
        // 8.2 判断
        if (userInfo) {
            state.userInfo = JSON.parse(userInfo);
        }
    },

    // 9. 重置用户信息
    [RESET_USER_INFO](state) {
        state.userInfo = {};
        removeStore("userInfo");
    }
}