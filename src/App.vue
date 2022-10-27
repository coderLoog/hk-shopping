<template>
  <div id="app">
    <keep-alive exclude="Deatail">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
</style>
