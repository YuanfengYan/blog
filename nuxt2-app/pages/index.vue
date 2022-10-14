<template>
  <div class="warp">
    <div>12:</div>
    <div class="content">
      <div>12:</div>
    </div>
  </div>
  <!-- <Tutorial/> -->
</template>

<script lang="ts">
import Vue from "vue";
import { getArticleList } from "../request/api/article";
export default Vue.extend({
  name: "IndexPage",
  async asyncData(context) {
    // console.log(context);
    // const ip = await context.$axios.$get("/api/v1/aricle");
    return;
  },
  data() {
    return {
      ip: 2,
    };
  },
  mounted() {
    getArticleList();
    // this.$axios.$get("/api/v1/article");
    setTimeout(() => {}, 2000);
  },
});
</script>
<style lang="scss">
$primary-color: white;
.warp {
  background: red;
  .content {
    font-size: 40px;
    color: $primary-color;
  }
}
</style>
