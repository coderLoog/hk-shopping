<template>
  <div id="category">
    <!--头部-->
    <Header/>
    <div class="listWrapper" v-if="!showLoading">
      <!--左边-->
      <div class="leftWrapper">
        <ul class="wrapper">
          <li
              class="categoryItem"
              v-for="(cate,index) in categories"
              :class="{selected:currentIndex===index}"
              @click="clickLeft(index)"
              :key="cate.id"
              ref="menuList"
          >
            <span class="textWrapper">{{ cate.name }}</span>
          </li>
        </ul>
      </div>
      <!--右边-->
      <ContentView :categoriesDetail="categoriesDetail"/>
    </div>
    <van-loading
        v-else
        type="spinner"
        color="#75a342"
        style="position: absolute;left: 50%;top:40%;transform: translateX(-50%)"
    >正在拼命加载中···！
    </van-loading>
  </div>
</template>

<script>
// 1. 引入组件
import Header from "./components/header/Header"
import ContentView from "./components/contentView/ContentView";
// 2. 引入滚动组件
import BScroll from 'better-scroll'

// 3. 引入接口
import {getCategories, getCategoriesDetail} from "./../../service/api/index"
// 4. 引入pubsub
import PubSub from 'pubsub-js'
// 5. 引入vuex
import {mapMutations, mapState} from 'vuex'
// 6. 引入toast
import {Toast} from 'vant'
import {addGoodsToCart} from "./../../service/api/index";

export default {
  name: "Category",
  created() {
    this.initData();
  },
  data() {
    return {
      // 是否显示正在加载
      showLoading: true,
      // 左侧列表数组
      categories: [],
      // 右侧列表数组
      categoriesDetail: [],
      // 左侧item选中与否
      currentIndex: 0
    }
  },
  components: {
    Header,
    ContentView
  },
  computed: {
    ...mapState(["shopCart", "userInfo"])
  },
  methods: {
    ...mapMutations(["ADD_GOODS"]),
    // 1. 初始化操作（数据和界面）
    async initData() {
      // 1. 获取左边数据
      let leftRes = await getCategories();
      if (leftRes.success) {
        this.categories = leftRes.data.cate;
      }
      // 2. 获取右边数据
      let rightRes = await getCategoriesDetail('/lk001');
      if (rightRes.success) {
        this.categoriesDetail = rightRes.data.cate;
      }
      // 3. 隐藏正在加载
      this.showLoading = false;
      // 4. 初始化滚动框架，一般在下一个周期执行
      this.$nextTick(() => {
        this.leftScroll = new BScroll('.leftWrapper', {
          probeType: 3,
          click: true,
          scrollY: true,
          tag: true,
          mouseWheel: true
        });
      })
    },
    // 2. 处理左侧点击
    async clickLeft(index) {
      // 2.1 改变索引
      this.currentIndex = index;
      // 2.2 获取点击的li标签
      let li = this.$refs.menuList[index];
      // 2.3 滚动到对应的元素上
      this.leftScroll.scrollToElement(li, 300);
      // 2.4 获取右边的数据
      let rightRes = await getCategoriesDetail(`/lk00${index + 1}`);
      if (rightRes.success) {
        this.categoriesDetail = rightRes.data.cate;
      }
    }
  },
  mounted() {
    // 订阅消息（添加到购物车）
    PubSub.subscribe('categoryAddToCart', async (msg, goods) => {
      if (msg === 'categoryAddToCart') {
        if (this.userInfo.token) {  // 已经登录
          let result = await addGoodsToCart(this.userInfo.token, goods.id, goods.name, goods.price, goods.small_image);
          // console.log(result);
          if (result.success_code === 200) {
            this.ADD_GOODS({
              goodsId: goods.id,
              goodsName: goods.name,
              smallImage: goods.small_image,
              goodsPrice: goods.price
            });
            // 提示用户
            Toast({
              message: "添加到购物车成功！",
              duration: 800
            })
          }
        } else {
          await this.$router.push('/login');
        }

      }
    })
  },
  beforeDestroy() {
    PubSub.unsubscribe('categoryAddToCart');
  }
}
</script>

<style lang="less" scoped>

#category {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
}

.listWrapper {
  display: flex;
  position: absolute;
  top: 2.75rem;
  bottom: 3rem;
  width: 100%;
  overflow: hidden;
}

.leftWrapper {
  background-color: #F4F4F4;
  width: 5.3125rem;
  flex: 0 0 5.3125rem;
}

.categoryItem {
  padding: 0.75rem 0;
  border-bottom: solid 1px #E8E9E8;
  position: relative;
}

.categoryItem .textWrapper {
  line-height: 1.25rem;
  border-left: solid 0.1875rem transparent;
  padding: 0.3125rem 0.6875rem;
  font-size: 0.8125rem;
  color: #666666;
}

.categoryItem.selected {
  background: #FFF;
}

.categoryItem.selected .textWrapper {
  border-left-color: #3cb963;
  font-weight: bold;
  font-size: 0.875rem;
  color: #333333;
}

@media (min-width: 960px) {
  .wrapper {
    border-right: 1px solid #E8E9E8;
  }

  .wrapper .categoryItem {
    background: #fff;
  }
}
</style>