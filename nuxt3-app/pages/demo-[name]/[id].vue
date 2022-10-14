<template>
  <div class="">id :{{id}}</div>
  <!-- <p>{{route}}</p> -->
</template>

<script setup>
import {ref} from 'vue'
const route = useRoute()
const id = ref(route.params.id)
</script>

<style scoped></style>
