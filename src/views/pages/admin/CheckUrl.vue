<template>
  <div class="animated fadeIn">
    <b-card header="Запрос">
      <b-row>
        <b-col cols="2">URL</b-col>
        <b-col cols="10">
          <b-input-group>
            <b-form-input v-model="url"></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="2">Тип</b-col>
        <b-col cols="10">
          <b-select v-model="type"
                    :options="[{value:'query',text:'Запрос'},{value:'mutation',text:'Мутация'}]"></b-select>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="2"> Запрос</b-col>
        <b-col cols="10">
          <b-textarea v-model="query"></b-textarea>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="2"> Токен</b-col>
        <b-col cols="10">
          <b-input v-model="token"></b-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="12" class="text-center mt-3">
          <b-button :disabled="answer.disabled" @click="test" class="btn-success">Отправить</b-button>
        </b-col>
      </b-row>
    </b-card>
    <div :class="answer.class" v-if="content">
      <b-card-header>
        Ответ ({{answer.type}})
        <b-button class="float-right btn-danger" v-if="content && !answer.disabled" size="sm" @click="clear">Очистить
        </b-button>
      </b-card-header>
      <b-card-body>
        <pre class="border border-secondary p-2">{{content}}</pre>
      </b-card-body>
    </div>
  </div>
</template>

<script>
    import auth from "~plugin/auth";
    import GraphQL from "~plugin/GraphQL";

    export default {
        name: 'eap-v-page-check-url',
        data() {
            return {
                query: '{ me { id email name } }',
                content: '',
                url: (localStorage.getItem('check.url')) ? localStorage.getItem('check.url') : new GraphQL().getUrl(),
                answer: {
                    type: 'Успешно',
                    class: 'card border-success',
                    disabled: null
                },
                token: auth.getToken(),
                type: 'query',}
        },
        methods: {
            isActiveUrl(url) {
                return (url === this.url) ? 'primary' : 'outline-primary'
            },
            clear() {
                this.content = '';
            },
            successMessage: function (content) {
                this.content = content;
                this.answer.class = 'card border-success';
                this.answer.type = 'Успешно';
                this.answer.disabled = null;
            },
            failMessage: function (content) {
                this.content = content;
                this.answer.class = 'card border-danger';
                this.answer.type = 'Ошибка';
                this.answer.disabled = null;
            },
            waitMessage: function (content = 'Отправка...') {
                this.content = content;
                this.answer.class = 'card';
                this.answer.type = 'Отправка';
                this.answer.disabled = 'disabled';
            },
            async test() {
                this.waitMessage();
                try {
                    const res = await new GraphQL(true,this.token).request(this.type, this.query, this.url);
                    if (res.data) {
                        this.successMessage(res.data);
                    } else {
                        this.failMessage(res.errors);
                    }
                } catch (e) {
                    this.failMessage(e);
                    this.content = e;
                    this.answer.class = 'card border-danger';
                    this.answer.type = 'Ошибка';
                    this.answer.disabled = null;
                }
            }
        },
        watch: {
            url: function (newValue, oldValue) {
                localStorage.setItem('check.url', newValue);
            }
        }
    }
</script>
