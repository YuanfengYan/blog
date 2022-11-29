<template>
  <div>
    <div class="loadWarp" v-if="!loadFlag"></div>
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      loadFlag: false,
    };
  },
  mounted() {
    this.loadFlag = true;
  },
};
</script>
<style lang="scss" scoped>
.loadWarp {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-image: url("../assets/images/loadding.gif");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  z-index: 2000;
}
</style>
