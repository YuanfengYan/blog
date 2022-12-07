<template>
  <div class="pageWarp">
    <div class="articleList">
      <ul v-if="article && article.data && article.data.length > 0" class="article">
        <li
          v-for="item in article.data"
          :key="item.id"
          class="articleItem"
          @click="jumpURL(item)"
        >
          <div class="article-image">
            <img :src="item.img_url" :alt="item.title" />
          </div>
          <div class="article-item-content">
            <h1 class="article-title">
              {{ item.title }}
            </h1>
            <div class="article-description">
              {{ item.description }}
            </div>
            <div class="article-category">
              {{ item.category_info ? item.category_info.name : "" }}
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="empty-data">
        暂无数据
        <a href="/">清空搜索条件</a>
      </div>
      <div v-if="isFetching" class="more">
        <div class="more-text">加载中<i class="el-icon-loading"></i></div>
      </div>
    </div>
    <div class="info-wrapper">
      <div class="personal-info-wrapper">
        <h2>Mr.Yan Blog</h2>
        <div class="num">
          <div>
            <h3>{{ article.meta.count }}</h3>
            <h6>cur articles</h6>
          </div>
          <div>
            <h3>{{ allArticles }}</h3>
            <h6>all articles</h6>
          </div>
        </div>
        <ul class="links">
          <li>
            <a href="https://github.com/YuanfengYan" target="blank">
              <img src="@/assets/images/github.png" />
            </a>
          </li>
        </ul>
        <!-- <hr ></hr> -->
        <el-divider content-position="left">分类</el-divider>
        <div class="categoryWarp">
          <template v-if="Array.isArray(categoryList) && categoryList.length">
            <div
              :class="['categoryItem', !categoryId ? 'active' : '']"
              @click="changeCategory()"
            >
              全部
            </div>
            <div
              v-for="(item, index) in categoryList"
              :class="['categoryItem', categoryId == item.id ? 'active' : '']"
              :key="item.id"
              @click="changeCategory(item.id)"
              :style="{
                backgroundColor: cateColors[index % cateColors.length],
              }"
            >
              {{ item.name }}
            </div>
          </template>
        </div>
        <el-divider content-position="left">友情链接</el-divider>
        <ul class="friend">
          <li class="friendlink">
            <a href="#">友情链接</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getArticleList, getArticleBaseInfo } from "@/request/api/article";
import { getCategory } from "@/request/api/category";

export default {
  name: "BlogIndex",
  head() {
    return {
      title: "Mr.Yan的博客",
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
  data() {
    return {
      cateColors: [
        "#5289b9",
        "rgb(132, 155, 135)",
        "rgb(103, 204, 134)",
        "rgb(248, 178, 106)",
        "#009688",
      ],
      isFetching: false, //接口防抖
      allArticles: "",
    };
  },
  async asyncData({ query }) {
    const { keyword, category_id, page = 1 } = query;
    const [err, res] = await getArticleList({
      // id,
      category_id,
      keyword,
      page,
      // is_admin: 1,
    });
    // console.log("article---", [err, res]);
    if (!err) {
      const isLoad = res.data.data.meta.total_pages > page;
      return {
        isClear: !!keyword || !!category_id,
        page,
        isLoad,
        categoryId: category_id,
        article: res.data.data,
      };
    } else {
      return {};
    }
  },
  computed: {
    ...mapState({
      categoryList: (state) => state.category.categoryList,
    }),
  },
  watch: {
    // 监听路由是否变化
    $route(to, from) {
      console.log("query");
      if (to.query.category_id != from.query.category_id) {
        this.changeCategory(to.query.category_id); // 重新调用加载数据方法
      }
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.getCategory();
      getArticleBaseInfo().then(([err, res]) => {
        // console.log("getArticleBaseInfo", res);
        if (!err) {
          this.allArticles = res.data.data.count;
        }
      });
      document.addEventListener("scroll", this.handleScroll, true);
    },
    // 获取分类
    getCategory() {
      this.$store.dispatch("category/getCategoryData");
    },
    // 改变分类
    async changeCategory(id) {
      if (id == this.categoryId) {
        return;
      }
      this.categoryId = id;
      const [err, res] = await getArticleList({
        category_id: this.categoryId,
        page: 1,
      });

      if (!err) {
        this.article = res.data.data;
        this.isLoad = res.data.data.meta.total_pages > this.page;
      }
    },

    // 加载更多分页
    async loadData() {
      this.isFetching = true;
      const [err, res] = await getArticleList({
        category_id: this.categoryId,
        page: this.page + 1,
      });
      this.isFetching = false;
      if (!err) {
        this.page++;
        this.article.data.push(...res.data.data.data);
        this.isLoad = res.data.data.meta.total_pages > this.page;
      }
    },
    jumpURL(item) {
      this.$router.push("/article/" + item.id);
    },
    // 页面滑到底部需要调用的方法
    handleScroll() {
      // 下面这部分兼容手机端和PC端
      const scrollTop = document.documentElement.scrollTop; // 滚动条的位置
      const windowHeitht = document.documentElement.clientHeight; // 在页面上返回内容的可视高度
      const scrollHeight = document.documentElement.scrollHeight; // 返回整个元素的高度（包括带滚动条的隐蔽的地方）
      // eslint-disable-next-line no-var
      // 是否滚动到底部的判断
      if (
        Math.round(scrollTop) + windowHeitht >= scrollHeight - 20 &&
        !this.isFetching &&
        this.isLoad
      ) {
        //此处加载数据
        this.loadData();
      }
    },
  },
};
</script>
<style>
span.el-radio__input {
  display: none;
}
.el-radio {
  margin: 0;
}
</style>
<style lang="scss" scoped>
.pageWarp {
  // width: 1150px;
  display: flex;
  align-items: flex-start;
  margin: 20px auto 0;
  padding: 0 20px;
  max-width: 1100px;
}

.info-wrapper {
  flex-basis: 400px;
  margin-left: 15px;
  transition: all 0.3s;
  overflow: hidden;
  top: 70px;
  overflow: hidden;
  height: auto;
  border-radius: 0.25rem;
  box-sizing: border-box;
  padding: 15px;
  @include background-color("content-background-color");
  @include box-shadow("content-box-shadow");
  .personal-info-wrapper {
    & > h2 {
      color: #000;
      text-align: center;
      margin: 10px auto 20px;
      @include font_color("text-color");
    }
  }
  .num {
    display: flex;
    margin: 0 auto 10px;
    width: 80%;
    @include font_color("text-color");
    & > div:first-child {
      border-right: 1px solid #333;
    }
    & > div {
      flex-basis: 50%;
      text-align: center;
      h3 {
        @include font_color("text-color");
        font-size: 16px;
        line-height: 25px;
      }
      h6 {
        line-height: 20px;
        font-size: 12px;
        @include font_color("text-color");
      }
    }
  }
  .links {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    img {
      width: 22px;
    }
    hr {
      border-top: 1px solid #eaecef;
    }
  }

  .categoryWarp {
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .categoryItem {
      display: inline-block;
      margin: 4px;
      background: #ff0000;
      vertical-align: middle;
      margin: 4px 8px 10px;
      padding: 4px 8px;
      display: inline-block;
      cursor: pointer;
      border-radius: 0.25rem;
      color: #fff;
      line-height: 13px;
      font-size: 13px;
      opcity: 0.7;
      &.active {
        background: red;
        transform: scale(1.3);
        /* font-size: 16px ; */
        opacity: 1;
      }
      // @for $i from 1 through 30 {
      //   &:nth-child(#{$i}) {
      //     background: nth($cateColor, random(length($cateColor)));
      //   }
      // }
    }
  }
  .friend {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    .friendlink {
      margin-right: 20px;
      a {
        line-height: 30px;
        display: block;
        color: #6dd189;
        font-size: 16px;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.articleList {
  width: 100%;
  margin: 0 auto;
  .article {
    .articleItem {
      cursor: pointer;
      box-sizing: border-box;
      display: block;
      margin: 0 auto 20px;
      padding: 16px 20px;
      text-decoration: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      transition: all 0.2s linear;
      border-radius: 6px;
      @include background-color("content-background-color");
      @include box-shadow("content-box-shadow");
      &:hover {
        @include box-shadow("content-hover-box-shadow");
      }
      .article-image {
        width: 100px;
        & img {
          width: 100%;
          border-radius: 4px;
        }
      }

      .article-item-content {
        padding-left: 24px;
        flex: 1;
      }

      .article-title {
        font-weight: bold;
        font-size: 18px;
        @include font_color("text-color");
        padding: 0;
        margin: 0;
      }

      .article-description {
        font-size: 14px;
        @include font_color("text-color2");
        margin: 12px 0 24px;
      }

      .article-category {
        font-size: 14px;
        color: #808080;
      }
    }
  }
  .empty-data {
    padding: 80px 0;
    text-align: center;
    font-size: 14px;
    a {
      @include font_color("text-link-color");
    }
  }
  .more {
    cursor: pointer;
    padding: 32px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    @include font_color("text-color");
    .more-text {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
    }
  }
}

@media screen and (max-width: 768px) {
  .pageWarp {
    display: block;
  }
  .info-wrapper {
    display: none;
  }
}

pre {
  /*控制代码不换行*/
  white-space: pre;
  word-wrap: normal;
}

.cnblogs-markdown .hljs {
  display: block;
  overflow: auto;
  padding: 1.3em 2em !important;
  font-size: 16px !important;
  background: #272822 !important;
  color: #fff;
  max-height: 700px;
}
</style>
