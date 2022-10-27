<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav"></detail-nav-bar>
        <scroll class="content" ref="scroll">
            <showings :top-images="topImages"></showings>
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detail-info ="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
            <detail-param-info :param-info="paramInfo" ref="param" />
            <detail-comment-info :comment-info="commentInfo" ref="comment" />
            <goods-list :goods="recommends" ref="recommend" />
        </scroll>
    </div>
</template>

<script>
    //子组件
   import DetailNavBar from "./childComps/nav/DetailNavBar";
   import Showings from "./childComps/showing/Showings";
   import DetailBaseInfo from "./childComps/shopinfo/DetailBaseInfo";
   import DetailShopInfo from "./childComps/storeshop/DetailShopInfo";
   import DetailGoodsInfo from "./childComps/GoodsInfo/DetailGoodsInfo"
   import DetailParamInfo from "./childComps/param/DetailParamInfo";
   import DetailCommentInfo from "./childComps/comment/DetailCommentInfo";

   //组件
   import GoodsList from "../../components/goods/GoodsList";
   import Scroll from "../../components/scroll/Scroll";


   import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "../../service/api/index";


   export default {
        name: "Deatail",
        data(){
            return {
                iid:null,
                topImages:[],
                goods:{},
                shop:{},
                detailInfo:{},
                goodsParam:{},
                paramInfo:{},
                commentInfo:{},
                recommends:[]


            }
        },
        created(){
            //保存传入的iid
            this.iid = this.$route.params.iid;

            //根据传入的iid请求数据
            getDetail(this.iid).then(res => {

                const data = res.result;
                //1.获取顶部的轮播数据
                this.topImages = data.itemInfo.topImages;

                //2.获取商品信息
                this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
                //console.log(this.goods);
                //3.获取店铺信息
                this.shop = new Shop(data.shopInfo)

                // 4.保存商品的详情数据
                this.detailInfo = data.detailInfo;

                // 5.获取参数的信息
                this.paramInfo = new GoodsParam(
                    data.itemParams.info,
                    data.itemParams.rule
                );
                if (data.rate.cRate !=0) {
                    this.commentInfo = data.rate.list[0];
                }

                getRecommend().then((res) => {
                    //console.log(res);
                    this.recommends = res.data.list;
                });

            });



        },
       methods:{
           imageLoad () {
               this.$refs.scroll.refresh()
           }
       },
        components: {
            DetailNavBar,
            Showings,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            GoodsList,
            Scroll
        },



    }
</script>

<style scoped>
    #detail {
        position: relative;
        z-index: 9;
        background-color: #fff;
        height: 100vh;
    }

    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }

    /* 给一个固定的高度 */
    .content {
        height: calc(100% - 44px);
    }
</style>