<script lang="ts">
export default {
    props: {
        text: {
            type: String,
            required: true
        }
    }
}
</script>

<template>
    <button>{{ text }}</button>
</template>

<style>
    button{
        border-radius: 20px;
        padding: 10px 20px;
        background-color: #eee;
        border: none;
        cursor: pointer;
    }
    button:hover{
        background-color: #ddd;
    }
</style>