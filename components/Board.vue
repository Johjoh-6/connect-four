<script>
export default {
    props: {
        board: {
            type: Array,
            required: true
        },
        fnEvent: {
            type: Function,
            required: true
        },
        end:{
            type: Boolean,
            required: true
        }
    }
}

</script>

<template>
    <div class="game_board">
            <div v-for="(cell, index) in board" class="cell" :key="index" @click="fnEvent(index)" :class="{'red-bg': cell === 1, 'yellow-bg': cell === 2}">
            </div>
        </div>
</template>

<style>
 .game_board{
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 0.5rem;
        width: 500px;
        background-color: #eee;
        padding: 10px;
        border-radius: 15px;
        background-color: blue;
    }
    .cell{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        font-weight: bold;
        border: 1px solid black;
        cursor: pointer;
        border-radius: 50%;
        aspect-ratio: 1/1;
        background-color: white;
    }
    .red-bg {
        background-color: red;
    }

    .yellow-bg {
        background-color: yellow;
    }

    </style>