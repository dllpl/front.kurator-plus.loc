<template>
  <td class="edit-cell">
    <div ref="input"
         :value="prevValue"
         @input="handleInput"
         @blur="onBlurHandler"
         v-set-cursor-position
         :contenteditable="(!readonly)"
         :class="editCellClass"
         :data-position="position"
         :data-prev-value="prevValue"
         :maxlength="maxLength"
    >
      <slot v-if="value">{{prevValue}}</slot>
      <slot v-else>&nbsp;</slot>
    </div>
  </td>
</template>

<script>
  export default {
    name: "pages-stream_leader-reports-vacation_plan-cellEditable",
    props: {
      value: {
        type: String,
        default: "",
        required: true,
      },
      readonly: {
        type: Boolean,
        default: false
      },
      maxLength: {
        type: Number,
        default: 200
      },
    },
    data() {
      return {
        prevValue: this.value,
        position: 0,
      }
    },
    directives: {
      setCursorPosition: {
        update(e) {
          // console.log(e);
          // e.selectionEnd = Number(e.dataset.position);
        }
      }
    },
    methods: {
      onBlurHandler(e) {
        this.$emit("blur", e);
      },
      handleInput(e) {
        let text = e.target.innerText;
        if (text.length > this.maxLength) {
          e.target.innerText = this.prevValue;
          e.target.position  = this.prevValue.length-1;

          // var range = document.createRange();
          // range.setStart(e.target, 0);
          // range.setEnd(e.target, 1);
          // var sel = window.getSelection();
          // sel.removeAllRanges();
          // sel.addRange(range);

          // console.log(e.target,e.target.innerText.length,e.target.position);
          // e.target.setSelectionRange(e.target.position,e.target.position);

          // window.getSelection().collapse(e.target,e.target.position-1);
          return false;
        }
        this.prevValue = text;
        this.position  = e.target.selectionStart;
        this.$emit("input", this.prevValue);
      },
    },
    computed: {
      editCellClass() {
        return (!this.readonly) ? ['align-self-stretch wrap-block p-2 h-100 d-block border rounded'] : ['wrap-block']
      }
    },
  }
</script>
