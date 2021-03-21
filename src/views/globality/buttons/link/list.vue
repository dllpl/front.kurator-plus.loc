<template>
  <router-link class="btn btn btn-link text-dark" :to="to" :title="title">
    <i class="fas fa-list-alt"/>
  </router-link>
</template>

<script>
  export default {
    name: "g-button-link-list",
    inheritAttrs: false,
    props: {
      to: {
        type: [Object, String],
      },
      title: {
        type: String,
        default: 'Список'
      }
    }
  }
</script>

<style scoped>

</style>
