<template>
  <div class="footer">
    <div class="site">
      <span>© Mr.Yan博客 - kananana.cn</span>
    </div>
    <div class="copyright">
      <a class="copyright-link" href="https://beian.miit.gov.cn" target="_blank">
        浙ICP备2022031961号-1
      </a>
    </div>
  </div>
</template>

<script></script>

<style scoped lang="scss">
.footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  @include font_color("text-color");
  .site {
    text-align: center;
    line-height: 20px;
    font-size: 14px;
  }
  .copyright {
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    a {
      @include font_color("text-color");
      text-decoration: none;
    }
  }
}
</style>
