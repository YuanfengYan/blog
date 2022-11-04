<template>
  <div class="pageWarp">
    <el-row :gutter="10">
      <el-col :xs="0" :sm="6">
        <div class="category">
          <el-divider><div class="categorytitle">分类</div></el-divider>
          <el-radio-group
            size="mini"
            class="categoryWarp"
            v-on:change="changeCategory"
            v-model="categoryId"
          >
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
      </el-col>
      <el-col :xs="24" :sm="18">
        <ul
          v-if="article && article.data && article.data.length > 0"
          class="response-wrap article"
        >
          <li v-for="item in article.data" :key="item.id" class="article-list">
            <a :href="'/article?id=' + item.id" class="article-item">
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
            </a>
          </li>
        </ul>
        <div v-else class="empty-data">
          暂无数据
          <a v-if="isClear" href="/">清空搜索条件</a>
        </div>

        <div v-if="isLoad" class="response-wrap more" @click="loadMore">
          <div class="more-text">点击加载更多</div>
          <div class="more-arrow">
            <img src="https://cdn.boblog.com/arrow.png" alt="" />
          </div>
        </div>
      </el-col>
    </el-row>
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
  width: 1150px;
  margin: 0 auto;
}
.category {
  margin-top: 40px;
  width: 100%;
  overflow: hidden;
  background-color: #eee;
  .categorytitle {
    font-size: 14px;
    color: rgb(119, 5, 5);
  }
  .categoryWarp {
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 15px 15px 20px;
    .categoryItem {
      display: inline-block;
      margin: 4px;
    }
  }
}
.article-list {
  box-sizing: border-box;
  display: block;
  clear: both;
  padding: 32px 0;
  border-bottom: 1px solid #f0f0f0;
}

.article-list:hover .article-title {
  color: #0164da;
  text-decoration: underline;
}

.article-item {
  display: flex;
  height: 100%;
  width: 100%;
  text-decoration: none;
  -webkit-transition: background-color 0.35s, color 0.35s, margin 0.45s,
    -webkit-transform 0.5s;
  transition: background-color 0.35s, color 0.35s, margin 0.45s, transform 0.5s;
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

@media screen and (max-width: 768px) {
}
</style>
