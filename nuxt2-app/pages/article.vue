<template>
  <div>
    <div class="article-wrap">
      <div class="article">
        <h1 class="title">
          {{ article.title }}
        </h1>
        <div class="info">
          <span v-if="nickname" class="author"> By {{ nickname }} </span>
          <span class="created-at">{{ article.created_at }}</span>
          <span v-if="article.category_info" class="category">
            文章分类：{{ article.category_info.name }}
          </span>
        </div>
        <v-md-preview class="article-content" :text="article.content"></v-md-preview>
      </div>
      <div class="fixed-sidebar">
        <div class="fixed-scroll-top">
          <i class="el-icon-top" @click="scrollTop"></i>
        </div>
      </div>
    </div>

    <vue-lazy-component @after-leave="onLoadEnd">
      <ArticleComment class="response-wrap" />
    </vue-lazy-component>
  </div>
</template>
<script>
import { getArticleDetail } from "@/request/api/article";
import ArticleComment from "@/components/article/ArticleComment";
import { mapState } from "vuex";
import { component as VueLazyComponent } from "@xunlei/vue-lazy-component"; //懒加载组件
import Clipboard from "clipboard";

export default {
  name: "ArticleDetail",
  components: {
    ArticleComment,
    VueLazyComponent,
  },
  async asyncData(context) {
    const { id } = context.query;
    const params = {
      id,
      is_markdown: false,
    };
    const [err, res] = await getArticleDetail(params);
    console.log([res]);
    if (!err) {
      return {
        article: res.data.data,
      };
    }
  },
  data() {
    return {
      isLogin: false,
    };
  },
  async fetch({ store }) {
    await store.dispatch("category/getCategoryData");
  },
  head() {
    const article = this.article || {};
    return {
      title: article.title,
      meta: [
        { name: "keywords", content: article.seo_keyword },
        { name: "description", content: article.description },
      ],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      isLoginStatus: (state) => state.user.isLoginStatus,
    }),
    nickname() {
      if (this.article && this.article.admin_info) {
        return this.article.admin_info.nickname;
      }
      return "";
    },
  },
  beforeDestroy() {
    if (this.progress) {
      this.progress.removeProgress();
      this.progress = null;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      // this.$nextTick(() => {
      //   const ProgressIndicator = require("@/lib/progress-indicator");
      //   // eslint-disable-next-line no-new
      //   this.progress = new ProgressIndicator();
      // });
      this.creatCopyBtn();
      this.copy();
    },
    // 回到顶部
    scrollTop() {
      this.$scrollTo(0);
    },
    // 点击展开评论
    onLoadEnd() {
      console.log("wwww");
      // this.$nextTick(() => {
      //   this.progress.calculateWidthPrecent();
      // });
    },
    creatCopyBtn() {
      const codeDoms = document.querySelectorAll("pre");
      let i = document.createElement("i");
      i.setAttribute("class", "el-icon-copy-document hljs-copy");
      i.setAttribute("data-clipboard-action", "copy");
      Array.from(codeDoms).forEach((item, index) => {
        let dom = i.cloneNode(false);
        let i_text = document.createTextNode("复制");
        dom.appendChild(i_text);
        dom.setAttribute("data-clipboard-target", "#copy" + index);
        item.appendChild(dom);
        let child = item.children[0];
        child.setAttribute("id", "copy" + index);
      });
    },
    copy() {
      this.$nextTick(() => {
        this.clipboard = new Clipboard(".hljs-copy");
        this.clipboard.on("success", (e) => {
          // console.log(e)
          this.$message.success("复制成功");
          e.clearSelection(); // 清除文本的选中状态
        });
        this.clipboard.on("error", (e) => {
          this.$message.error("复制失败");
          e.clearSelection(); // 清除文本的选中状态
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.article {
  box-sizing: border-box;
  width: 768px;
  margin: 80px auto 0;
  padding-bottom: 80px;
  border-bottom: 1px solid #e8e8e8;
  .article-content {
    margin: 0 auto;
  }
}

.title {
  font-size: 36px;
  font-weight: 600;
  @include font_color("text-color");
  line-height: 42px;
  text-align: center;
}

.info {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22px auto 48px;
}

.info span {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  // color: #999999;
  @include font_color("text-color2");
  line-height: 20px;
  text-align: center;

  &:last-child {
    margin-right: 0;
  }
}
.fixed-sidebar {
  cursor: pointer;
  position: fixed;
  bottom: 32px;
  right: 32px;
}

@media screen and (max-width: 540px) {
  .article {
    margin: 32px auto 0;
    box-sizing: border-box;
    width: 100vw;
    .article-content {
      width: 100%;
      box-sizing: border-box;
    }
  }
  .title {
    font-size: 32px;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;

    & span {
      margin-right: 0;
    }
  }
}
</style>
