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
        <a href="/blog">清空搜索条件</a>
      </div>
      <div v-if="isLoad" class="more" @click="loadMore">
        <div class="more-text">点击加载更多</div>
        <div class="more-arrow">
          <img src="https://cdn.boblog.com/arrow.png" alt="" />
        </div>
      </div>
    </div>
    <div class="info-wrapper">
      <div class="personal-info-wrapper">
        <h2>Yan's Blog</h2>
        <div class="num">
          <div>
            <h3>5</h3>
            <h6>Articles</h6>
          </div>
          <div>
            <h3>10</h3>
            <h6>Tags</h6>
          </div>
        </div>
        <ul class="links">
          <li>
            <img src="@/assets/images/github.png" />
          </li>
        </ul>
        <!-- <hr ></hr> -->
        <el-divider content-position="left">分类</el-divider>
        <el-radio-group
          size="mini"
          class="categoryWarp"
          v-on:change="changeCategory"
          v-model="categoryId"
        >
          <el-radio class="categoryItem" :key="all" border>全部</el-radio>
          <template v-if="Array.isArray(categoryList) && categoryList.length">
            <el-radio
              class="categoryItem"
              v-for="item in categoryList"
              :key="item.id"
              :label="item.id"
              border
              >{{ item.name }}</el-radio
            >
          </template>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getArticleList } from "@/request/api/article";
import { getCategory } from "@/request/api/category";

export default {
  name: "BlogIndex",
  data() {
    return {};
  },
  async asyncData({ query }) {
    const { id, keyword, category_id, page = 1 } = query;
    const [err, res] = await getArticleList({
      // id,
      category_id,
      keyword,
      page,
      is_category: 1,
      is_admin: 1,
    });
    if (!err) {
      const isLoad = res.data.data.meta.total_pages > page;
      console.log("xxxxx", res);
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
  watch: {},
  mounted() {
    this.getCategory();
  },
  methods: {
    getCategory() {
      this.$store.dispatch("category/getCategoryData");
    },
    async changeCategory() {
      const [err, res] = await getArticleList({
        category_id: this.categoryId,
      });

      if (!err) {
        this.article = res.data.data;
      }
    },
    // 获取新数据
    async fetchData(id) {
      const [err, res] = await getArticleList({
        category_id: id,
        is_category: 1,
        is_admin: 1,
        page: this.page,
      });
      if (!err) {
        this.categoryId = id;
        this.article.data.push(...res.data.data.data);
        this.isLoad = res.data.data.meta.total_pages > this.page;
      }
    },
    // 加载更多分页
    loadMore() {
      this.page++;
      this.fetchData();
    },
    jumpURL(item) {
      this.$router.push("/article?id=" + item.id);
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
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  box-sizing: border-box;
  padding: 15px;
  background: #fff;
  .personal-info-wrapper {
    & > h2 {
      color: #000;
      text-align: center;
      margin: 10px auto 20px;
    }
  }
  .num {
    display: flex;
    margin: 0 auto 10px;
    width: 80%;
    & > div:first-child {
      border-right: 1px solid #333;
    }
    & > div {
      flex-basis: 50%;
      text-align: center;
      h3 {
        font-size: 16px;
        line-height: 25px;
      }
      h6 {
        line-height: 20px;
        font-size: 12px;
        color: #242424;
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
    }
  }
}
.articleList {
  width: 100%;
  margin: 0 auto;
  .article {
    .articleItem {
      box-sizing: border-box;
      display: block;
      margin: 0 auto 20px;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      text-decoration: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      transition: all 0.2s linear;
      box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
      &:hover {
        color: #0164da;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.3);
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
        color: #404040;
        padding: 0;
        margin: 0;
      }

      .article-description {
        font-size: 14px;
        color: #404040;
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
  }
  .more {
    cursor: pointer;
    padding: 32px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .more-text {
      font-size: 16px;
      font-weight: 400;
      color: #222222;
      line-height: 22px;
    }
    .more-arrow {
      width: 16px;
      margin-top: 24px;
    }
    .more-arrow img {
      width: 100%;
    }
  }
}

@media screen and (max-width: 768px) {
  .pageWarp {
    display: block;
  }
}
</style>
