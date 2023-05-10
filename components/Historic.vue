<script>

export default {
    props: {
        items: {
            type: Array,
            required: true
        },
    }
}
</script>

<template>
    <div class="list">
        <ul class="flex flex-col gap-1 items-center">
            <li v-for="item in items" :key="item">
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<style>
.list{
    background-color: #eee;
    overflow-y: scroll;
    width: 200px;
    max-height: 100%;
}
</style>
