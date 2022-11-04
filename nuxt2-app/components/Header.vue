<template>
  <header class="header">
    <el-button
      :class="['menu', showSlideFlag ? 'move' : '']"
      @click="tiggerSlidMenu"
      round
      >MENU</el-button
    >
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
          <el-dropdown>
            <span class="el-dropdown-link">
              分类<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in categoryList" :key="item.id">
                <a class="category-links" :href="'/?category_id=' + item.id">{{
                  item.name
                }}</a>
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
          popper-class="searchlistwarp"
          ><template slot-scope="{ item }">
            <div class="search-list">
              <div class="list-l">
                <img :src="item.img_url" alt="" />
              </div>
              <div class="list-r">
                <div class="list-r-top">
                  <p class="list-r-t">{{ item.title }}</p>
                  <p class="list-r-d">{{ item.description }}</p>
                </div>
                <div class="list-r-bottom">
                  <p>{{ item.mm }}</p>
                </div>
              </div>
            </div>
          </template>
        </el-autocomplete>
      </div>
    </nav>
    <nav :class="['nav-v', showSlideFlag ? 'show' : '']">
      <el-menu default-active="activeIndex" class="el-menu-demo" @select="handleSelect">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </nav>

    <div class="banner"></div>
  </header>
</template>

<script>
import { mapState } from "vuex";
import { getArticleSearch } from "@/request/api/article";
export default {
  name: "VHeader",
  props: {},
  data() {
    return {
      keyword: "",
      navIndex: 0,
      showSlideFlag: false,
      nav: [
        {
          title: "博客",
          router: "/blog",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
      categoryList: (state) => state.category.categoryList,
    }),
  },
  watch: {
    isLoginStatus: {
      handler() {
        this.handleNav();
      },
    },
  },
  mounted() {
    this.handleNav();
    this.getCategory();
  },
  methods: {
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
      console.log("开始查询");
      const [err, res] = await getArticleSearch({ keyword: queryString });
      console.log(err, res);
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
      const { category_id, keyword } = this.$route.query;
      if (category_id || keyword) {
        window.location.href = router;
      } else {
        this.$router.push(router);
      }
    },
  },
};
</script>
<style lang="scss">
.searchlistwarp {
  width: 300px !important;
}
.el-dropdown-menu .popper__arrow {
  @include border-bottom-color("dropdown-background-color");
}
.el-dropdown-menu .popper__arrow::after {
  @include border-bottom-color("dropdown-background-color");
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
</style>
<style scoped lang="scss">
.header {
  position: relative;
  z-index: 1000;
  .banner {
    width: 100%;
    height: 200px;
    background-color: rgb(66, 122, 118);
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
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    cursor: pointer;
    box-sizing: border-box;
    display: block;
    height: 56px;
    width: 150px;
    background: url("../assets/logo.png") center center no-repeat;
    background-size: contain;
  }
  .nav {
    box-sizing: border-box;
    flex: 1;
    height: 56px;
    display: flex;
    margin: 0 64px;
    align-items: center;

    .nav-item {
      box-sizing: border-box;
      height: 56px;
      line-height: 56px;
      padding: 0 10px;
      white-space: nowrap;
      cursor: pointer;
      display: block;
      text-align: center;
      font-size: 16px;
      @include font_color("nav-font-color");
      text-decoration: none;
      .el-dropdown {
        @include font_color("nav-font-color");
        font-size: 16px;
      }
    }
  }
}
.nav-v {
  @include background_color("header-background-color");
  height: 100vh;
  width: 200px;
  position: fixed;
  left: -202px;
  top: 0;
  transition: all 0.3s linear;
  &.show {
    left: 0;
  }
}

.search {
  cursor: pointer;
  margin-right: 50px;
  .search-list {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    background-color: #f9f9f9;
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
          color: #2d8cf0;
          line-height: 28px;
          font-size: 16px;
          padding-right: 10px;
        }
        .list-r-d {
          color: red;
          font-size: 14px;
          line-height: 28px;
        }
      }
      .list-r-bottom {
        color: #333;
        line-height: 30px;
        box-sizing: border-box;
        padding-bottom: 5px;
      }
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
