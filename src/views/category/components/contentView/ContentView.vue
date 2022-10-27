<template>
  <div class="wrapper emptyWrapper">
    <div
        v-for="(cate,index) in categoriesDetail"
        :key="cate.id">
      <div class="categoryTitle">{{ cate.name }}</div>
      <!--子列表-->
      <ProductItem :products="cate.products"/>
    </div>
  </div>
</template>

<script>
import ProductItem from "../productItem/ProductItem";

export default {
  name: "ContentView",
  components: {
    ProductItem
  },
  props: {
    categoriesDetail: Array
  }
}
</script>

<style scoped>
.wrapper {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}

.wrapper {
  position: absolute;
  left: 5.3125rem;
  right: 0;
  bottom: 0;
  top: 0;
  background: #FFF;
}

.categoryTitle {
  padding: 0 0.3125rem;
  height: 1.25rem;
  line-height: 1.25rem;
  font-size: 0.75rem;
  background: #F8F8F8;
  color: #666666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>