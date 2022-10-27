<template>
  <div id="mine" v-if="userInfo.token">
    <!--导航栏-->
    <van-nav-bar
        title="个人中心"
        :fixed=true
        :border=false></van-nav-bar>
    <!--头像及其他信息-->
    <van-cell-group style="margin-top: 2.6rem">
      <van-cell
          style="background-color: #3bba63;color: #fff"
          is-link
          :center="true"
          @click="$router.push('/dashboard/mine/userCenter')"
      >
        <template #title>
          <div class="personMsg">
            <img class="iconImage" src="./images/user.jpeg" alt="">
            <div class="personInfo">
              <span v-text="userInfo.data.userName"></span>
              <span>手机号：{{ userInfo.data.phone }}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <!--我的订单、查看全部订单-->
    <van-cell-group>
      <van-cell
          title="我的订单"
          value="查看所有订单"
          is-link
          icon="label"
          @click="$router.push({path:'/dashboard/mine/mineOrder'})"
      />
    </van-cell-group>
    <!--待支付、待收货、待评价、售后/退款-->
    <router-link tag="div" to="/dashboard/mine/mineOrder">
      <van-grid>
        <van-grid-item
            v-for="(order,index) in orderData"
            :key="index"
            :icon="order.icon"
            :text="order.title"/>
      </van-grid>
    </router-link>
    <!--我的优惠券、我的收货地址-->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="我的优惠券" value="1张" is-link icon="gold-coin"/>
      <van-cell title="我的收货地址" is-link icon="todo-list"/>
    </van-cell-group>
    <!--联系客服、意见反馈-->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="联系客服" value="客服时间 07:00-22:00" is-link icon="phone"/>
      <van-cell title="意见反馈" is-link icon="smile-comment"/>
    </van-cell-group>
    <!--小撩买菜-->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="小撩买菜" value="下载APP体验更加" is-link icon="gift-card"/>
    </van-cell-group>
    <!--路由出口-->
    <transition name="router-slider" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
  <SelectLogin v-else/>
</template>

<script>
import SelectLogin from "../login/SelectLogin";
import {mapState} from 'vuex'

export default {
  name: "Mine",
  data() {
    return {
      orderData: [
        {title: '待支付', icon: 'cart-circle-o'},
        {title: '待收货', icon: 'gift-o'},
        {title: '待评价', icon: 'smile-comment-o'},
        {title: '售后/退款', icon: 'cash-back-record'}
      ]
    }
  },
  computed: {
    ...mapState(["userInfo"])
  },
  components: {
    SelectLogin
  },

}
</script>

<style lang="less" scoped>
#mine {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.van-nav-bar {
  background-color: #3bba63;
}

#mine /deep/ .van-nav-bar__title {
  color: white !important;
  font-size: 1rem;
}

.personMsg {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.personMsg > img {
  width: 4rem;
  height: 4rem;
  border-radius: 2rem;
  border: 0.12rem solid #FFF;
}

.personInfo {
  display: flex;
  flex-direction: column;
  margin-left: 0.8rem;
}

#mine /deep/ .van-cell__left-icon {
  color: orange;
  font-size: 1.2rem;
}

.router-slider-enter-active, .router-slider-leave-active {
  transition: all 0.3s;
}

.router-slider-enter, .router-slider-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>