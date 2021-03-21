<template>
  <router-link class="btn btn btn-link text-dark" :to="to" :title="title">
    <i class="fas fa-pencil-alt"/>
  </router-link>
</template>

<script>
  export default {
    name: "g-button-link-edit",
    inheritAttrs: false,
    props: {
      to: {
        type: [Object, String],
      },
      title: {
        type: String,
        default: 'Редактировать'
      }
    }
  }
</script>
