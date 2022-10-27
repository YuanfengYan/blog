<template>
  <div class="header">
    <div class="header-inner">
      <a class="logo" href="/"></a>
      <div class="nav">
        <div
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
        </div>
      </div>
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
    </div>
  </div>
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
    // this.getCategory();
  },
  methods: {
    // getCategory() {
    //   this.$store.dispatch("category/getCategoryData");
    // },
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
<style>
.searchlistwarp {
  width: 300px !important;
}
</style>
<style scoped lang="scss">
.header {
  border-bottom: 1px solid #f0f0f0;
}

.header-inner {
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
      padding: 0 32px;
      white-space: nowrap;
      cursor: pointer;
      display: block;
      text-align: center;
      font-size: 16px;
      color: #222222;
      text-decoration: none;

      &-active {
        color: #2d8cf0;
      }

      &:hover {
        color: #2d8cf0;
        text-decoration: underline;
      }
    }
  }
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

@media screen and (max-width: 540px) {
  .nav {
    display: none;
  }

  .search {
    flex: 1;
    margin-left: 24px;
  }
}
</style>
