<template>
  <div id="order">
    <!--导航栏-->
    <van-nav-bar
        title="填写订单"
        left-text="返回"
        left-arrow
        :fixed=true
        :border=true
        @click-left="onClickLeft"
    />
    <!--收货地址、商品展示-->
    <van-contact-card
        :type="address_type"
        add-text="选择收货地址"
        :name="address_name"
        :tel="address_tel"
        @click="chooseAddress"
        style="margin-top: 3rem"
    />
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="送达时间" :value="arriveDate" @click="showDatePopup" is-link/>
      <router-link :to="{path:'/confirmOrder/orderDetail'}">
        <van-cell :value="`共${goodsCount}件`" is-link center>
          <template #title>
            <img v-for="(goods,index) in threeShopCart" :src="goods.small_image" alt="" style="width: 3rem">
          </template>
        </van-cell>
      </router-link>
    </van-cell-group>
    <!--支付方式-->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="支付方式" value="微信"/>
    </van-cell-group>
    <!--备注-->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="备注" value="微信">
        <label>
          <input type="text" placeholder="选填，备注您的需求" v-model="notice">
        </label>
      </van-cell>
    </van-cell-group>
    <!--商品金额、配送费-->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="商品金额" :value="`￥${this.totalPrice}`"/>
      <van-cell title="配送费" :value="`￥${this.disPrice}`"/>
    </van-cell-group>
    <!--提交订单-->
    <van-submit-bar
        :price="totalPrice*100+this.disPrice*100"
        label="实付"
        button-text="提交订单"
        @submit="onSubmit"
    />
    <!--弹出日期组件-->
    <van-popup v-model="dateShow" round position="bottom" :style="{height:'30%'}">
      <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="onDateCancel"
          @confirm="onDateConfirm"
      ></van-datetime-picker>
    </van-popup>
    <!--支付二维码-->
    <van-popup v-model="isPay" round position="center">
      <qriously :value="qrcode" :size="200"/>
    </van-popup>
    <transition name="router-slider" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import Moment from 'moment'
import {mapState} from 'vuex'
import {Toast} from 'vant'
import {
  postOrder,
  orderPaySuccess,
  getWXCode,
  queryPayStatus,
  getAllSelectedGoods,
  delAllSelectedGoods
} from "../../service/api/index"
import ajax from "../../service/api/ajax";

export default {
  name: "Order",
  data() {
    return {
      // 1. 地址
      address_type: 'add', //地址卡片类型
      address_name: null, // 收货地址
      address_tel: null,  // 收货人电话
      address_id: null,  // 收货人地址id
      // 2. 日期
      dateShow: false,
      minDate: new Date(),
      maxDate: new Date(2021, 4, 5),
      currentDate: new Date(),
      // 3. 送达时间
      arriveDate: "请选择送达时间",
      // 4. 备注
      notice: null,
      // 5. 二维码
      isPay: false,
      qrcode: null
    }
  },
  computed: {
    ...mapState(["shopCart", "userInfo"]),
    // 商品总件数
    goodsCount() {
      return Object.values(this.shopCart).filter(value => value.checked).length;
    },
    // 商品总价
    totalPrice() {
      let totalPrice = 0;
      Object.values(this.shopCart).forEach((goods, index) => {
        if (goods.checked) {
          totalPrice += goods.num * Number(goods.price);
        }
      })
      return totalPrice;
    },
    // 取购物车前三件选中商品
    threeShopCart() {
      let shopCart = [];
      Object.values(this.shopCart).forEach((goods, index) => {
        if (goods.checked) {
          shopCart.push(goods);
        }
      })
      return shopCart.slice(0, 3);
    },
    // 配送费
    disPrice() {
      // 商品总价大于40免配送费  小于40 6元配送费
      return this.totalPrice > 40 && this.totalPrice !== 0 ? 0 : 6;
    }
  },
  mounted() {
    // 接收收货地址
    PubSub.subscribe("userAddress", (msg, address) => {
      if (msg === 'userAddress') {
        // console.log(address);
        // 修改卡片类型、姓名、电话
        this.address_type = 'edit';
        this.address_name = address.name;
        this.address_tel = address.tel;
        this.address_id = address.address_id;
      }
    })
  },
  methods: {
    onClickLeft() { // 点击左边
      this.$router.back();  // 返回上一个路由
    },
    chooseAddress() {
      this.$router.push('/confirmOrder/myAddress');
    },
    async onSubmit() {  // 提交订单
      // 数据验证
      if (!this.address_id) {
        Toast({
          message: "请选择收货地址",
          duration: 500
        })
        return;
      } else if (this.arriveDate === "请选择送达时间") {
        Toast({
          message: "请选择送达时间",
          duration: 500
        })
        return;
      } else if (!this.notice) {
        Toast({
          message: "请备注信息",
          duration: 500
        })
        return;
      }
      // 处理订单相关
      if (this.userInfo.token) {
        // 1. 查询所有已被选中商品
        let goodsResult = await getAllSelectedGoods(this.userInfo.token);
        // 2. 创建订单
        if (goodsResult.success_code === 200) {
          let orderResult = await postOrder(this.userInfo.token, this.address_id, this.arrive_time, goodsResult.data, this.notice, this.totalPrice, this.disPrice);
          // 3. 删除购物车中已经生成订单的商品
          if (orderResult.success_code === 200) {
            let delResult = await delAllSelectedGoods(this.userInfo.token);
            // 4. 发起微信支付
            if (delResult.success_code === 200) {
              // todo：暂时默认支付一分钱
              let urlResult = await getWXCode(orderResult.data.order_id, 1);
              if (urlResult.code_url === 200) {
                this.isPay = true;
                this.qrcode = urlResult.code_url;
                // 5. 验证用户是否扫码支付成功
                let payResult = await queryPayStatus(orderResult.data.order_id);
                if (payResult.success) {
                  Toast({
                    message: "支付成功！", //payResult.message
                    duration: 1000
                  })
                  this.isPay = false;
                  // 6. 通知自己服务器订单支付成功
                  let statusResult = orderPaySuccess(this.userInfo.token, orderResult.data.order_id);
                  if (statusResult.success_code === 200) {
                    // 7. 跳转到我的界面
                    this.$router.replace('/dashboard/mine');
                    window.sessionStorage.setItem("tabBarActiveIndex", 3);
                  } else {
                    Toast({
                      message: "出了点小问题",
                      duration: 500
                    })
                  }
                } else {
                  Toast({
                    message: payResult.message,
                    duration: 1000
                  })
                }
              } else {
                Toast({
                  message: "获取支付二维码失败",
                  duration: 500
                })
              }
            }
          } else {
            Toast({
              message: "订单生成失败",
              duration: 500
            })
          }
        } else {
          Toast({
            message: "购物车同步出现问题",
            duration: 500
          })
        }
      } else {
        Toast({
          message: "获取订单商品失败",
          duration: 500
        })
      }
    },
    // 展示日期组件
    showDatePopup() {
      this.dateShow = true;
    },
    // 取消日期组件
    onDateCancel() {
      this.dateShow = false;
    },
    // 确认日期组件
    onDateConfirm(value) {
      this.dateShow = false;
      this.arriveDate = Moment(value).format('YYYY-MM-DD hh:mm');
    },
  },
  beforeDestroy() {
    PubSub.unsubscribe("userAddress");
  }

}
</script>

<style scoped>
#order {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.router-slider-enter-active, .router-slider-leave-active {
  transition: all 0.3s;
}

.router-slider-enter, .router-slider-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}

input {
  text-align: right;
}

::-webkit-input-placeholder { /* WebKit browsers */
  direction: rtl;
}

:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  direction: rtl;
}

::-moz-placeholder { /* Mozilla Firefox 19+ but I'm not sure about working */
  direction: rtl;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  direction: rtl;
}
</style>