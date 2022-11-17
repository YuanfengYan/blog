<template>
  <div>
    <div class="avatar" v-html="avatarSvg"></div>
  </div>
</template>
<script>
import createAvatar from "/lib/svgAvatar.js";

export default {
  name: "Avatar",
  props: {
    str: {
      type: String,
      default: "avatar",
    },
  },
  data() {
    return {
      // avatar_url
    };
  },
  computed: {
    avatarSvg() {
      return createAvatar(this.str);
    },
  },
  mounted() {},
};
</script>
