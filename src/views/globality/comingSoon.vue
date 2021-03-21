<template>
    <div class="row h-100 justify-content-center align-items-center text-monospace">
      <strong>Страница "{{getTitle}}" в разработке ...</strong>
    </div>
</template>

<script>
    export default {
        name: "comingSoon",
        computed:{
            getTitle(){
                return this.$route.meta.label
            }
        }
    }
</script>
