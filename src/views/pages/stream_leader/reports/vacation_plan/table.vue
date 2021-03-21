<template>
  <table class="table table-sm mt-1">
    <thead>
    <tr>
      <th width="70"></th>
      <th width="180">
        <b-input v-if="!readonly" placeholder="чч:мм-чч:мм" style="width: 90px;" v-mask="['##:##-##:##']"
                 size="sm" :value="outData[0][1]"/>
          <span v-else>
            {{outData[0][1]}}
          </span>
      </th>
      <th width="180">
        <b-input v-if="!readonly" placeholder="чч:мм-чч:мм" style="width: 90px;" v-mask="['##:##-##:##']"
                 size="sm" :value="outData[0][2]"/>
          <span v-else>
            {{outData[0][2]}}
          </span>
      </th>
      <th width="180">
        <b-input v-if="!readonly" placeholder="чч:мм-чч:мм" style="width: 90px;" v-mask="['##:##-##:##']"
                 size="sm" :value="outData[0][3]"/>
        <span v-else>
          {{outData[0][3]}}
        </span>
      </th>
      <th width="50"></th>
    </tr>
    </thead>
    <tbody>
    <pages-stream_leader-reports-vacation_plan-cell
      :index="index"
      :key="index"
      :readonly="readonly"
      @remove="removeRow"
      v-for="(row,index) in outData"
      v-if="index !== 0"
      v-model="outData[index]"
    />
    <tr>
      <td colspan="5" class="text-right" v-if="!readonly">
        <b-button variant="success" @click="addRow">Добавить</b-button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import PagesStream_leaderReportsVacation_planCell from "~views/pages/stream_leader/reports/vacation_plan/row";

  export default {
    name: "pages-stream_leader-reports-vacation_plan-table",
    components: {PagesStream_leaderReportsVacation_planCell},
    model: {
      prop: 'inData',
      event: 'modelChange'
    },
    props: {
      inData: {
        type: String | Array,
      },
      readonly:{
        type:Boolean,
        default(){
          return false;
        }
      }
    },
    data() {
      let outData = [["", "", "", ""]];
      if (this.inData && typeof this.inData === 'string') {
        const replacementJson = this.inData.replace(/\\"/g, '"');
        outData = JSON.parse(replacementJson);
      }
      return {
        outData: outData,
      }
    },
    watch: {
      inData: {
        handler(val) {
          if (val && typeof val === 'string') {
            this.outData = JSON.parse(val);
          }
        },
        deep: true
      },
      outData: {
        handler(val) {
          this.$emit('modelChange', JSON.stringify(val));
        },
        deep: true
      },
    },
    methods: {
      removeRow(index) {
        this.outData.splice(index, 1);
      },
      addRow() {
        this.outData.push(['', '', '', '', '']);
      }
    }
  }
</script>

<style scoped>

</style>
