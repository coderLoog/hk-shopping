<template>
  <div id="editAddress">
    <!--导航栏-->
    <van-nav-bar
        title="编辑地址"
        left-text="返回"
        left-arrow
        :fixed=true
        :border=true
        @click-left="onClickLeft"
    />
    <van-address-edit
        :area-list="areaList"
        show-postal
        show-delete
        show-set-default
        :address-info="addressInfo"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
        style="margin-top: 3rem"
    />
  </div>
</template>

<script>
import {Toast} from 'vant'
import {mapState} from 'vuex'
import {changeUserAddress, getCurrentUserAddress, delUserAddress} from "../../../../service/api/index"
import areaList from './../../../../config/area'
import PubSub from 'pubsub-js'

export default {
  name: "EditAddress",
  data() {
    return {
      areaList: areaList,
      addressInfo: {}
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    if (this.$route.query["address_id"]) {
      if (this.userInfo.token) {
        this.getCurrentAddress(this.userInfo.token, this.$route.query["address_id"]);
      }
    }
  },
  methods: {
    onClickLeft() { // 点击左边
      this.$router.back();  // 返回上一个路由
    },
    // 修改收货地址
    async onSave(content) {
      if (this.userInfo.token) {
        // 发起修改请求
        let result = await changeUserAddress(this.addressInfo.id, this.userInfo.token, content.name, content.tel, content.province + content.city + content.county, content.addressDetail, content.postalCode, content.isDefault, content.province, content.city, content.county, content.areaCode);
        // 判断是否修改成功
        if (result.success_code === 200) {
          Toast({
            message: "修改地址成功",
            duration: 500
          })
        }
        // 返回上一界面
        this.$router.back();
        // 发布修改成功消息
        PubSub.publish('backToMyAddress');
      } else {
        Toast({
          message: "出了点小问题",
          duration: 500
        })
      }
    },
    // 删除收货地址
    async onDelete() {
      let result = await delUserAddress(this.addressInfo.id);
      // console.log(result);
      if (result.success_code === 200) {
        Toast({
          message: '删除地址成功！',
          duration: 400
        });
        // 2.1 返回到上一级界面
        this.$router.back();
        // 2.2 发布删除成功
        PubSub.publish('backToMyAddress');
      } else {
        Toast({
          message: '删除地址失败！',
          duration: 400
        });
      }
    },
    async getCurrentAddress(user_id, address_id) {
      let result = await getCurrentUserAddress(user_id, address_id);
      // console.log(result);
      if (result.success_code === 200) {
        this.addressInfo = {
          id: result.data._id,
          name: result.data.address_name,
          tel: result.data.address_phone,
          province: result.data.province,
          city: result.data.city,
          county: result.data.county,
          addressDetail: result.data.address_area_detail,
          areaCode: result.data.areaCode,
          postalCode: result.data.address_post_code,
          isDefault: result.data.address_tag
        }
      }
    }
  },
}
</script>

<style scoped>
#editAddress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 9999;
}
</style>

