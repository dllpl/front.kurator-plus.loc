<template>
  <tr @blur="finishEditCell">
    <td valign="top">
      <b-input class="" v-if="!readonly"
               placeholder="мм.дд"
               style="width: 50px;"
               size="sm" v-mask="['##.##']"
               v-model="row[0]"
               @blur="finishEditCell"
      />
      <div v-else>
        {{row[0]}}
      </div>
    </td>
    <pages-stream_leader-reports-vacation_plan-cell-editable :readonly="readonly" @input="handleInput1" :value="row[1]"/>
    <pages-stream_leader-reports-vacation_plan-cell-editable :readonly="readonly" @input="handleInput2" :value="row[2]"/>
    <pages-stream_leader-reports-vacation_plan-cell-editable :readonly="readonly" @input="handleInput3" :value="row[3]"/>
    <td class="text-center align-middle" v-if="!readonly">
      <b-button variant="danger" size="sm" @click="$emit('remove',index)">
        <i class="fa fa-trash" style="cursor: pointer"/>
      </b-button>
    </td>
  </tr>
</template>

<script>
  import Editor from '@ckeditor/ckeditor5-build-inline';
  import PagesStream_leaderReportsVacation_planCellEditable
    from "~views/pages/stream_leader/reports/vacation_plan/cellEditable";

  export default {
    name: "pages-stream_leader-reports-vacation_plan-cell",
    model: {
      prop: 'inRow',
      event: 'modelChange'
    },
    props: ['inRow', 'index', 'editMode', 'readonly'],
    components: {PagesStream_leaderReportsVacation_planCellEditable, Editor},
    data() {
      return {
        row: this.inRow,
        editor: Editor,
        editCell: null,
        editorConfig: {
          resize_enabled: true,
          toolbar: {
            items: ['bold', 'italic', 'link', '|', 'undo', 'redo', '|', 'bulletedList', 'numberedList']
          }
        }
      }
    },
    watch: {
      editable: {
        handler: function () {
          this.$emit('modelChange', this.row);
        },
        deep: true
      }
    },
    methods: {
      finishEditCell() {
        this.editCell = null;
        this.$emit('modelChange', this.row);
      },
      getCellData(index) {
        return this.row[index] ? this.row[index] : '';
      },
      handleInput(index,e) {
        this.$emit('modelChange', this.row);
        this.row[index] = e;
        this.$emit('modelChange', this.row);
      },
      handleInput1(e) {
        this.handleInput(1,e);
      },
      handleInput2(e) {
        this.handleInput(2,e);
      },
      handleInput3(e) {
        this.handleInput(3,e);
      },
    },
    computed: {
      editCellClass() {
        return (!this.readonly) ? ['align-self-stretch wrap-block p-2 h-100 border rounded'] : []
      }
    }
  }
</script>

<style lang="scss">
  .table {
    td.edit-cell {
      position: relative;
      div.wrap-block {
        display: block;
        position: relative;
        word-break: keep-all;
        max-width: 180px;
        overflow: hidden;
        height: 100%;
      }
    }
  }
</style>
