<template>
    <button class="btn btn-success" @click="goTo">{{title}}</button>
</template>

<script>
    export default {
        name: "g-btn-create",
        props:{
            title:{
                default:'Создать',
                type:String
            },
            to:{
                default:null,
                type:String|Object
            }
        },
        methods:{
            goTo(){
                this.$router.push(this.to)
            }
        }
    }
</script>
