<template>
  <button class="btn btn-success" @click="$emit('click')">{{title}}</button>
</template>

<script>
    export default {
        name: "g-btn-save",
        props: {
            title: {
                default: 'Сохранить',
                type: String
            }
        }
    }
</script>
