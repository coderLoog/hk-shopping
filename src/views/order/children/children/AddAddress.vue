<template>
  <div id="addAddress">
    <!--导航栏-->
    <van-nav-bar
        title="新增地址"
        left-text="返回"
        left-arrow
        :fixed=true
        :border=true
        @click-left="onClickLeft"
    />
    <van-address-edit
        :area-list="areaList"
        show-postal
        show-set-default
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @change-detail="onChangeDetail"
        style="margin-top: 3rem"
    />
  </div>
</template>

<script>
import {Toast} from "vant";
import areaList from './../../../../config/area'
import {addUserAddress} from "../../../../service/api/index"
import {mapState} from 'vuex'
import PubSub from 'pubsub-js'

export default {
  name: "AddAddress",
  data() {
    return {
      areaList: areaList,
      searchResult: [],
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    onClickLeft() { // 点击左边
      this.$router.back();  // 返回上一个路由
    },
    // 保存用户信息
    async onSave(content) {
      if (this.userInfo.token) {
        let result = await addUserAddress(
            this.userInfo.token,
            content.name,
            content.tel,
            content.province + content.city + content.county,
            content.addressDetail,
            content.postalCode,
            content.isDefault,
            content.province,
            content.city,
            content.county,
            content.areaCode
        );
        console.log(result);
        if (result.success_code === 200) {
          Toast({message: '添加地址成功', duration: 400});
          // 回去
          this.$router.back();
          // 发起通知
          PubSub.publish("backToMyAddress");
        } else {
          Toast({message: '添加地址失败', duration: 400});
        }
      }
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: '黄龙万科中心',
            address: '杭州市西湖区',
          },
        ];
      } else {
        this.searchResult = [];
      }
    },
  },
}
</script>

<style scoped>
#addAddress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 9999;
}
</style>