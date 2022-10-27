<template>
  <swiper id="swiper" ref="mySwiper" :options="swiperOptions">
    <swiper-slide v-for="(sowing,index) in sowing_list" :key=sowing.public_id>
      <a :href="sowing.link">
        <img :src="sowing.image" :alt="sowing.name">
      </a>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import Swiper2, {Navigation, Pagination, Autoplay} from 'swiper';

Swiper2.use([Navigation, Pagination, Autoplay]);

export default {
  name: "Sowing",
  props: {
    sowing_list: Array
  },
  data() {
    return {
      swiperOptions: {
        notNextTick: true,
        pagination: { // 分页
          el: '.swiper-pagination',
          clickable: true,
          bulletActiveClass: 'my-swiper-select'
        },
        loop: true, // 循环
        autoplay: {
          delay: 1000,  // 自动播放,切换时长
        },
        speed: 600, // 速度
        direction: 'horizontal',  // 滚动方向
        on: { // 滑动后监听,回调函数
          slideChangeTransitionEnd() {
            //console.log(this.activeIndex);
          }
        }
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
  },
  mounted() {
    //  进来就在一秒内滚动到第3页
    // this.swiper.slideTo(3, 1000);
  },
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  }
}
</script>

<style scoped>
#swiper {
  height: 14rem;
  width: 100%;
  background-color: transparent;
}

#swiper img {
  width: 100%;
  height: 100%;
}

#swiper /deep/ .my-swiper-select {
  background-color: #75a342 ;
  opacity: 1;
}
</style>