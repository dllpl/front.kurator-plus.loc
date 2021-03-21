<template>
  <span class="mr-3">
    <span class="mr-2 mb-0 font-weight-bolder text-muted small">{{name}}:</span>
    <span>{{text}}</span>
  </span>
</template>

<script>
    export default {
        name: "textWithLabel",
        props: ['name','text']
    }
</script>
