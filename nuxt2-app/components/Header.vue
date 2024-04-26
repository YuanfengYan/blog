<template>
  <header class="header">
    <el-button
      :class="['menu', showSlideFlag ? 'move' : '']"
      @click="tiggerSlidMenu"
      round
      >MENU</el-button
    >
    <!-- pc端 -->
    <nav class="header-inner">
      <ul class="nav">
        <li
          v-for="(item, index) in nav"
          :key="index"
          :class="[
            'nav-item',
            {
              'nav-item-active': navIndex === index,
            },
          ]"
          @click="jumpURL(item.router)"
        >
          {{ item.title }}
        </li>
        <li class="nav-item" v-if="Array.isArray(categoryList) && categoryList.length">
          <el-dropdown trigger="click" placement="bottom-start" @command="jumpURL">
            <span class="el-dropdown-link">
              分类<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in categoryList"
                :command="'/?category_id=' + item.id"
                :key="item.id"
              >
                {{ item.name }}
                <!-- <a class="category-links" :href="'/?category_id=' + item.id">{{
                 
                }}</a> -->
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>

      <div class="search">
        <el-autocomplete
          :debounce="600"
          v-model="keyword"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          highlight-first-item
          popper-class="searchlistwarp"
        >
          <!-- <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="餐厅名" value="1"></el-option>
            <el-option label="订单号" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select> -->
          <template slot-scope="{ item }">
            <div class="search-list" @click="jumpURL('/article/' + item.id)">
              <div class="list-l">
                <img :src="item.img_url" alt="" />
              </div>
              <div class="list-r">
                <div class="list-r-top">
                  <p class="list-r-t">{{ item.title }}</p>
                  <p class="list-r-d">{{ item.description }}</p>
                </div>
                <div class="list-r-bottom">
                  {{ item.mm }}
                </div>
              </div>
            </div>
          </template>
        </el-autocomplete>
      </div>
      <el-switch
        :value="theme"
        active-icon-class="el-icon-moon"
        inactive-icon-class="el-icon-sunny"
        active-color="#232b26"
        inactive-color="#5fbdcb"
        active-value="dark"
        inactive-value="light"
        @change="changeTheme"
      >
      </el-switch>
    </nav>
    <!-- 移动端 -->
    <el-drawer
      direction="ltr"
      :visible.sync="showSlideFlag"
      :wrapperClosable="true"
      :show-close="true"
      :append-to-body="true"
      custom-class="navVWarp"
    >
      <el-menu default-active="activeIndex" class="el-menu-slide" @select="handleSelect">
        <template v-for="item in nav">
          <el-menu-item :index="item.id" @click="jumpURL(item.router)">{{
            item.title
          }}</el-menu-item>
        </template>
        <el-submenu index="cate2">
          <template slot="title">分类</template>
          <el-menu-item
            @click="jumpURL('/?category_id=' + cate.id)"
            index="2-1"
            v-for="cate in categoryList"
            :key="cate.id"
          >
            {{ cate.name }}
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-switch
        :value="theme"
        active-icon-class="el-icon-moon"
        inactive-icon-class="el-icon-sunny"
        active-color="#232b26"
        inactive-color="#5fbdcb"
        active-value="dark"
        inactive-value="light"
        @change="changeTheme"
      >
      </el-switch>
    </el-drawer>
    <div
      class="banner"
      :style="{
        backgroundImage: 'url(' + bannerUrl + ')',
      }"
    ></div>
  </header>
</template>

<script>
import { mapState } from "vuex";
import { getArticleSearch } from "@/request/api/article";
import img1 from "./images/bing1.jpg"
import img2 from "./images/bing2.jpg"
import img3 from "./images/bing3.jpg"
import img4 from "./images/bing4.jpg"
import img5 from "./images/bing5.jpg"
import img6 from "./images/bing6.jpg"
import img7 from "./images/bing7.jpg"
import img8 from "./images/bing8.jpg"
import img9 from "./images/bing9.jpg"
import img10 from "./images/bing10.jpg"
export default {
  name: "VHeader",
  props: {},
  data() {
    // var theme1 = this.$state.state.theme.theme,
    return {
      select: "",
      // themeIsDark: "light",
      keyword: "",
      navIndex: 0,
      showSlideFlag: false,
      bannerUrl: img1,
      notfoundUrl: "https://img.yanyuanfeng.top/other/404-3.png",
      bannerList: [
        img1,
        img2,
        img3,
        img4,
        img5,
        img6,
        img7,
        img8,
        img9,
        img10,
      ],
      nav: [
        {
          title: "博客",
          router: "/",
        },
      ],
    };
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
      categoryList: (state) => state.category.categoryList,
      theme: (state) => state.theme.theme,
    }),
  },
  watch: {
    isLoginStatus: {
      handler() {
        this.handleNav();
      },
    },
    theme: {
      handler(newval) {
        if (process.browser) {
          document.body.setAttribute("data-theme", newval);
        }
      },
      immediate: true,
    },
    // 监听路由是否变化
    $route(to, from) {
      this.initBanner(to);
      // console.log(to.path, to);
      // this.bannerUrl = this.bannerList[Math.floor(Math.random() * 5)];
    },
  },
  mounted() {
    this.handleNav();
    this.getCategory();
    this.initBanner(this.$route);
  },
  methods: {
    initBanner(to) {
      console.log(to, "tooooo");
      if (to.path == "/") {
        this.bannerUrl = this.bannerList[0];
      } else if (to.path === "/noarticle") {
        this.bannerUrl = this.notfoundUrl;
      } else if (to.params.id) {
        this.bannerUrl = this.bannerList[to.params.id % this.bannerList.length];
      }
    },
    changeTheme(newval) {
      this.$store.commit("theme/SET_THEME", newval);
    },
    // 展示侧边栏
    tiggerSlidMenu() {
      this.showSlideFlag = !this.showSlideFlag;
    },
    getCategory() {
      this.$store.dispatch("category/getCategoryData");
    },
    handleSelect() {},
    async querySearchAsync(queryString, cb) {
      if (queryString == "") return;
      // console.log("开始查询");
      const [err, res] = await getArticleSearch({ keyword: queryString });
      // console.log(err, res);
      if (err) {
        cb([]);
      } else {
        res.data.data ? cb(res.data.data) : cb([]);
      }
    },
    onSearch() {
      if (!this.keyword) return false;
      window.location.href = `/?keyword=${this.keyword}`;
    },
    handleNav() {
      if (this.isLoginStatus) {
        this.nav.splice(1, 0, {
          title: "个人中心",
          router: "/usercenter",
        });
      } else {
        const index = this.nav.findIndex((item) => item.router === "/usercenter");
        if (index !== -1) {
          this.nav.splice(index, 1);
        }
      }
    },
    // // 返回首页
    // goHome() {
    //   window.location.href = "/";
    // },
    // // 跳转URL
    jumpURL(router) {
      // const { category_id } = this.$route.query;
      // if (router.indexOf("?") > 0 || !category_id) {
      //   window.location.href = router;
      // } else {
      //   this.$router.push(router);
      // }

      // if (category_id) {
      //   window.location.href = router;
      // } else {
      //   this.$router.push(router);
      // }
      if (this.showSlideFlag) this.showSlideFlag = false;
      this.$router.push(router);
    },
  },
};
</script>
<style lang="scss">
.search {
  .el-input {
    input {
      border-color: rgb(31 123 15) !important;
      @include background_color("background-color");
    }
  }
}

.el-dropdown-menu .popper__arrow,
.searchlistwarp .popper__arrow {
  @include border_bottom_color("dropdown-background-color");
}
.el-dropdown-menu .popper__arrow::after,
.searchlistwarp .popper__arrow::after {
  @include border_bottom_color("dropdown-background-color");
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  @include background_color("dropdown-hover-background-color");
}
.el-dropdown-menu {
  &.el-popper {
    border: none !important;
  }
}
.searchlistwarp {
  // 搜索列表容器
  width: 300px !important;
  @include border_color("background-color");
  @include background_color("background-color");
  ul {
    li {
      @include background_color("background-color");
      &:hover {
        @include background_color("background-color3");
      }
    }
  }
}

// 抽屉
.navVWarp {
  @include background_color("background-color");
  width: 200px !important;
  .el-switch {
    position: fixed;
    bottom: 0px;
    margin: auto;
    width: 200px;
    text-align: center;
    display: inline-block;
    padding: 20px 0;
    box-sizing: content-box;
    z-index: 2;
  }
  .el-menu-item,
  .el-submenu {
    text-align: center;
    @include background_color("background-color");
    @include font_color("text-color");
  }
  .el-submenu__title {
    // color: #fff;
    @include font_color("text-color");
    &:hover {
      // background: #333333;
      @include background_color("background-color3");
    }
  }
  .el-menu-slide {
    border: none;
    padding-bottom: 70px;
    @include background_color("background-color");
  }
}
</style>
<style scoped lang="scss">
.header {
  position: relative;
  z-index: 1000;
  .banner {
    width: 100%;
    height: 400px;
    // background-color: rgb(66, 122, 118);
    background-size: cover;
    background-position: center;
  }
}
//
.menu {
  display: none;
  position: fixed;
  top: 20px;
  left: 30px;
  z-index: 10;
  transition: all 0.3s linear;
  &.move {
    left: 230px;
  }
}

.header-inner {
  position: fixed;
  top: 0;
  left: -10px;
  right: -10px;
  @include background_color("header-background-color");
  box-sizing: border-box;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    cursor: pointer;
    box-sizing: border-box;
    display: block;
    height: 70px;
    width: 150px;
    background: url("../assets/logo.png") center center no-repeat;
    background-size: contain;
  }
  .nav {
    box-sizing: border-box;
    flex: 1;
    height: 70px;
    display: flex;
    margin: 0 64px;
    align-items: center;

    .nav-item {
      box-sizing: border-box;
      line-height: 100%;
      padding: 0 20px;
      white-space: nowrap;
      cursor: pointer;
      display: block;
      text-align: center;
      font-size: 18px;
      @include font_color("nav-font-color");
      text-decoration: none;
      .el-dropdown {
        @include font_color("nav-font-color");
        font-size: 18px;
      }
    }
  }
}
.category-links {
  display: block;
  width: 100%;
  height: 100%;
}

.el-switch {
  margin-right: 20px;
}
.search {
  cursor: pointer;
  margin-right: 50px;
}

.search-list {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  // @include background_color_lighten("background-color");
  .list-l {
    width: 20%;
    line-height: 100%;
    img {
      width: 90%;
    }
  }
  .list-r {
    width: 80%;
    box-sizing: border-box;
    padding-left: 4px;
    .list-r-top {
      padding-top: 5px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .list-r-t {
        @include font_color("text-color");
        line-height: 28px;
        font-size: 16px;
        padding-right: 10px;
      }
      .list-r-d {
        @include font_color("text-color2");
        font-size: 14px;
        line-height: 28px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .list-r-bottom {
      color: #915050;
      line-height: 30px;
      box-sizing: border-box;
      padding-bottom: 5px;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
    }
  }
}
// elementui样式覆盖
.el-dropdown-menu {
  width: 200px;
  @include background_color("dropdown-background-color");
  .el-dropdown-menu__item > a {
    font-size: 16px;
    @include font_color("nav-font-color");
    text-decoration: none;
  }
}

@media screen and (max-width: 768px) {
  .nav {
    display: none;
  }

  .menu {
    display: block;
  }
  .header-inner {
    display: none;
  }
}
@media screen and (min-width: 768px) {
  .nav-v {
    display: none;
  }
}
</style>
