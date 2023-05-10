<script lang="ts">
import Game from "../utils/game";

export default {
  data() {
    return {
      renderComponent: true,
      board: [] as number[],
      currentPlayer: 0,
      game: new Game(),
      end: false,
      tie: false,
      historic: [] as string[],
      IA: false,
    };
  },
  methods: {
    async forceRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    startGame() {
      this.game.initBoard();
      this.board = this.game.getBoard();
      this.currentPlayer = this.game.getCurrentPlayer();
      this.end = false;
      this.historic = [];
      console.log(this.board);
    },
    startGameWithIa() {
      this.game.initBoard();
      this.game.startIa();
      this.IA = true;
      this.board = this.game.getBoard();
      this.currentPlayer = this.game.getCurrentPlayer();
      this.end = false;
      this.historic = [];
      console.log(this.board);
    },
    resetGame() {
      this.game.reset();
      this.board = this.game.getBoard();
      this.currentPlayer = 0;
      this.end = false;
      this.tie = false;
      this.historic = [];
      this.IA = false;
    },
    play(pos: number) {
      if (!this.end) {
        let column = pos % 7;
        this.game.play(column);

        this.board = this.game.getBoard();

        this.end = this.game.isGameOver();

        if (!this.end) {
          this.currentPlayer = this.game.getCurrentPlayer();
        }

        if (this.IA && this.currentPlayer == 2 && !this.end) {
          this.game.playIA();
          this.currentPlayer = this.game.getCurrentPlayer();
          this.board = this.game.getBoard();
          this.end = this.game.isGameOver();
        }
        this.historic = this.game.getHistoric();
        if (this.game.boardFull()) {
          this.tie = true;
        }
      }
    },
  },
};
</script>

<template>
  <h1 class="">Connect Four</h1>
  <h3 v-if="currentPlayer !== 0 && end == false">
    Player {{ currentPlayer }} is your Turn
  </h3>
  <h3 v-if="end">Player {{ currentPlayer }} won</h3>
  <h3 v-if="tie">Tie</h3>
  <div class="flex flex-row gap-5 max-h-[440px]">
    <Board
      v-if="renderComponent && board.length > 0"
      :board="board"
      :fnEvent="play"
      :end="end"
    />
    <Historic :items="historic" v-if="historic.length > 0" />
  </div>
  <div class="flex flex-row gap-6">
    <Button v-if="currentPlayer == 0" text="Start" @click="startGame()" />
    <Button
      v-if="currentPlayer == 0"
      text="Play with IA"
      @click="startGameWithIa()"
    />
    <Button v-if="end" text="Reset" @click="resetGame()" />
  </div>
</template>

<style></style>
