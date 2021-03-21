<template>
  <div>
    <div v-if="fillFactor === null" />
    <div v-else-if="fillFactor < 100">
      <small class="text-black-50">Профиль заполнен на {{fillFactor}}%</small>
      <b-progress class="mb-3" :value="fillFactor" :max="100" />
    </div>
    <div v-else class="text-success">
      <i class="fas fa-check-circle" /> Профиль заполнен полностью
    </div>
  </div>
</template>

<script>
  export default {
    name: "fillFactorProgress",
    computed: {
      fillFactor() {
        return this.$store.state.user.me.fillFactor
      }
    }
  }
</script>
