<template>
    <div>
        <nav-bar>
            <div slot="left" class="back" @click="goback">
                <img src="../../../../images/tabbar/back.png" alt="">
            </div>
            <div slot="center" class="title">
                <div v-for="(title,index) in titles" class="tit-item" @click="titleClick(index)" :class="{active: index === currentIndex}">{{title}}</div>
            </div>
            <div slot="right"></div>
        </nav-bar>
    </div>
</template>

<script>
    import NavBar from "../../../../components/NavBar/NavBar";
    import index from "../../../../store";
    export default {
        name: "DetailNavBar",
        components:{
            NavBar,
            index
        },
        data(){
            return {
                titles:["商品","详情","评论","推荐"],
                currentIndex:0,
            }
        },
        methods: {
            titleClick(index) {
                this.currentIndex = index
            },
            goback(){
                this.$router.back();
            }
        }
    }
</script>

<style scoped>
 .title {
     display: flex;
 }
    .tit-item {
        flex: 1;
    }
    .active {
        color: #DD4A68;
    }
    .back img {
        height: 40px;
        width:40px;
    }
</style>