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
        <v-md-preview ref="markdownwarp" class="article-content" :text="article.content">
        </v-md-preview>
      </div>
      <div class="fixedSidebar">
        <div class="slide-icon">
          <i
            :class="['el-icon-tickets', showArticleNav ? 'active' : '']"
            @click.stop="showNav"
          ></i>
        </div>
        <div class="slide-icon">
          <i class="el-icon-top" @click="scrollTop"></i>
        </div>
        <ul :class="['articleNav', showArticleNav ? 'active' : '']" @click.stop="">
          <li
            v-for="item in titles"
            :class="['navItem', item.type]"
            @click="gonav(item.id)"
          >
            {{ item.content }}
          </li>
        </ul>
      </div>
    </div>

    <vue-lazy-component v-if="reWrite" @after-leave="onLoadEnd">
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
    // console.log(context, "context");
    const { id } = context.params;
    const params = {
      id,
      is_markdown: false,
    };
    const [err, res] = await getArticleDetail(params);
    if (!err) {
      return {
        article: res.data.data,
      };
    } else {
      context.redirect("/noarticle"); //没找到文章
    }
  },
  data() {
    return {
      isLogin: false,
      reWrite: true,
      titles: [],
      showArticleNav: false, //是否显示文章目录导航栏
    };
  },
  watch: {
    // 监听路由是否变化
    $route(to, from) {
      if (to.params.id != from.params.id) {
        // console.log("params", to.params.id);
        this.getArticleDetail2(to.params.id);
        this.reWrite = false;
        this.$nextTick(() => {
          this.reWrite = true;
        });
      }
    },
  },
  async fetch({ store }) {
    await store.dispatch("category/getCategoryData");
  },
  head() {
    const article = this.article || {};
    return {
      title: article.title,
      meta: [
        { name: "keywords", content: article.seo_keyword + ",Mr.Yan,yanyuanfeng" },
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
      this.creatCopyBtn();
      this.copy();
      this.showTitles();
      this.bodyclick();
    },
    showNav() {
      this.showArticleNav = !this.showArticleNav;
    },
    goErrorPage() {
      this.$router.push("/notfound");
    },
    bodyclick() {
      document.body.addEventListener("click", () => {
        this.showArticleNav = false;
      });
    },
    /**
     * 目录跳转
     */
    gonav(id) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    getcontent(h) {
      var text = [].slice
        .call(h.childNodes)
        .map(function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue;
          } else if (["CODE", "SPAN"].indexOf(node.tagName) !== -1) {
            return node.textContent;
          } else {
            return "";
          }
        })
        .join("")
        .replace(/\(.*\)$/, "");
      return text;
    },
    /**
     * 显示目录
     */
    showTitles() {
      this.titles = [];
      let self = this;
      let content = this.$refs.markdownwarp.$el;
      // 提取h2标签
      let h3dom = content.querySelectorAll("h3");
      let h2dom = content.querySelectorAll("h2");
      let domlist = [].concat(...h2dom, ...h3dom);
      domlist.sort((a, b) => {
        return (
          a.attributes["data-v-md-line"].value - b.attributes["data-v-md-line"].value
        );
      });

      let each = [].forEach;
      each.call(domlist, (h) => {
        let id = h.getAttribute("data-v-md-line");
        h.setAttribute("id", id);
        this.titles.push({
          id,
          type: h.nodeName, //H2,H3
          content: this.getcontent(h),
        });
      });
    },
    async getArticleDetail2(id) {
      const [err, res] = await getArticleDetail({
        id,
        is_markdown: false,
      });
      if (!err) {
        this.article = res.data.data;
        this.$nextTick(() => {
          this.showTitles();
        });
      }
    },
    // 回到顶部
    scrollTop() {
      this.$scrollTo(0);
    },
    // 点击展开评论
    onLoadEnd() {
      // console.log("wwww");
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
  font-size: 24px;
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
.fixedSidebar {
  cursor: pointer;
  position: fixed;
  z-index: 1001;
  bottom: 32px;
  right: 32px;
  .articleNav {
    border-radius: 6px;
    box-sizing: border-box;
    cursor: auto;
    padding: 20px 0px 10px 20px;
    position: absolute;
    bottom: 80px;
    right: 0px;
    transition: all 0.2s linear;
    height: 70vh;
    width: 30vh;
    overflow-y: auto;
    transform: scale(0);
    transform-origin: 100% 100%;
    z-index: 10;
    @include background_color("header-background-color");
    &.active {
      transform: scale(1);
    }
    .navItem {
      @include font_color("text-color");
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 10px 0 10px 10px;
      font-size: 16px;
      position: relative;
      &:hover {
        cursor: pointer;
        color: #3eaf7c !important;
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        width: 3px;
        height: 18px;
        left: 0;
        background: #3eaf7c;
        top: 10px;
      }
      &.H3 {
        margin-left: 20px;
      }
    }
  }
  .slide-icon {
    margin-top: 20px;
    i {
      font-size: 22px;
      @include font_color("text-color");
      &.active {
        color: #3eaf7c !important;
      }
    }
  }
}

@media screen and (max-width: 768px) {
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
