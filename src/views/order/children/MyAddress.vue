<template>
  <div id="myAddress">
    <!--导航栏-->
    <van-nav-bar
        title="我的地址"
        left-text="返回"
        left-arrow
        :fixed=true
        :border=true
        @click-left="onClickLeft"
    />
    <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onBackAddress"
        style="margin-top: 3rem"
    />
    <transition name="router-slider" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {Toast} from 'vant'
import {getUserAddress} from "../../../service/api/index";
import {mapState} from "vuex"
import PubSub from 'pubsub-js'

export default {
  name: "MyAddress",
  data() {
    return {
      chosenAddressId: '1',
      list: [],
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    onAdd() {
      this.$router.push({
        path: '/confirmOrder/myAddress/addAddress',
      })
    },
    onEdit(item, index) {
      this.$router.push({
        path: '/confirmOrder/myAddress/editAddress?address_id=' + item.address_id,

      })
    },
    onClickLeft() {
      this.$router.back();
    },
    // 获取当前用户地址
    async initUserAddress() {
      if (this.userInfo.token) {
        let result = await getUserAddress(this.userInfo.token);
        // console.log(result)
        if (result.success_code === 200) {
          let addressArr = result.data;
          this.list = [];
          addressArr.forEach((address, index) => {
            let addressObj = {
              id: String(index + 1),
              name: address.address_name,
              tel: address.address_phone,
              address: address.address_area + address.address_area_detail,
              address_id: address._id,
              user_id: address.user_id
            }
            this.list.push(addressObj);
          })
        } else {
          Toast({
            message: "获取地址失败！",
            duration: 400
          })
        }
      } else {
        Toast({
          message: "登录已过期，请退出登录",
          duration: 400
        })
      }
    },
    onBackAddress(item, index) {
      // console.log(item,index);
      if (item) {
        // 发布地址数据
        PubSub.publish("userAddress", item);
        // 返回上级界面
        this.$router.back();
      }
    }
  },
  mounted() {
    this.initUserAddress();
    PubSub.subscribe("backToMyAddress", (msg) => {
      if (msg === "backToMyAddress") {
        this.initUserAddress();
      }
    })
  },
  beforeDestroy() {
    PubSub.unsubscribe("backToMyAddress");
  }
}
</script>

<style scoped>
#myAddress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 200;
}

.router-slider-enter-active, .router-slider-leave-active {
  transition: all 0.3s;
}

.router-slider-enter, .router-slider-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>