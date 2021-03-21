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
