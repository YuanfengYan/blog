<template>
  <div class="">
    <p class="p1">404</p>
    <p class="p2">article not found</p>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  layout: "activity",
  head() {
    return {
      title: "前端杂货铺",
      meta: [
        {
          name: "keywords",
          content: "Mr.Yan,blog,JavaScript,前端,yanyuanfeng",
        },
        {
          name: "description",
          content: "Mr.Yan的技术博客",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.p1 {
  @include font_color("text-color");
  font-size: 45px;
  margin: 20px auto;
  text-align: center;
}
.p2 {
  @include font_color("text-color2");
  font-size: 20px;
  margin: 20px auto 100px;
  text-align: center;
}
</style>
