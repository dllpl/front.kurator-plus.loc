<template>
  <div>
    <h1>Шаблоны</h1>
    <div class="d-flex">
      <b-button :to="{name: $route.meta.role+'-report-vacation-plan-index'}" variant="outline-primary">
        <span class="pr-2 border-right"><i class="far fa-sun"/></span> Планы на летние каникулы
      </b-button>
      <b-button class="ml-3" :to="{name: $route.meta.role+'-report-vacancies-index'}" variant="outline-primary">
        <span class="pr-2 border-right"><i class="far fa-sun"/></span> Данные по кадрам
      </b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "templates",
  }
</script>

<style scoped>

</style>
