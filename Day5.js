import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from 'express';

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 5, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();

function parseInput(i) {
    /* Separate stacks and moves from the input and separate each stack and move within it */
    const [rawStacks, rawMoves] = i.split("\n\n").map((x) => x.split("\n"));
    /* For each for characters in a line, only keep the character at position 1 */ 
    const parsedStacks = rawStacks.map((line) => [...line].filter((value, index) => index % 4 === 1));

    /* Get the indexes (last line of parsedStacks) */
    const indexes = parsedStacks.pop();
    let inputLength = indexes[indexes.length-1];
    do{parsedStacks[0].unshift(" ")} while(parsedStacks[0].length < inputLength);
    
    const orderedStacks = {};
    for (let line of parsedStacks) {
        for (let i = 0; i < line.length; i++) {
        /* If the element is not a white space */
          if (line[i] !== " ") {
            /* Add line[i] to the stack indexes[i] if it doesn't exist already */
            if (!orderedStacks[indexes[i]]) {
              orderedStacks[indexes[i]] = [];
            }
            /* Add the element (letter) at the beginning of the stack */
            orderedStacks[indexes[i]].unshift(line[i]);
          }
        }
      }

    /* Create moves as an array of object */
    const moves = [];
    for (const move of rawMoves) {
    /* Get the digits inside of each move */
    const match = /move (\d+) from (\d+) to (\d+)/g.exec(move);
    /* Store de digits inside the moves array, making a new object with 3 keys */
    moves.push({
        count: parseInt(match[1]),
        from: parseInt(match[2]),
        to: parseInt(match[3]),
    });
    }
    let result = [orderedStacks, moves, indexes];
  return result
}

/* In this function if more than one crate has to be moved, then each crate is moved individually */
function crateMover9000 (input){
    let [orderedStacks, moves, indexes] = parseInput(input);
    /* For each move */
    for (const move of moves) {
        /* Repeat for the number of items we need to change */
        for (let i = 0; i < move.count; i++) {
          /* Get the item we want to move from the end of the stack  */
          const movedItem = orderedStacks[move.from].pop();
          /* Insert the item we want to move at the end of the other stack */
          orderedStacks[move.to].push(movedItem);
        }
    }
    console.log(
        indexes
          .map((value) => {
            const stack = orderedStacks[value];
            return stack[stack.length - 1];
          })
          .join("")
      );

}

/* In this function if more than one crate has to be moved, then all those crates are moved together */
function crateMover9001(input){
  let [orderedStacks, moves, indexes] = parseInput(input);

  for(let move of moves){
    let movedItems = orderedStacks[move.from].splice(-move.count, move.count);
    orderedStacks[move.to] = orderedStacks[move.to].concat(movedItems);
  }

  console.log(
    indexes
      .map((value) => {
        const stack = orderedStacks[value];
        return stack[stack.length - 1];
      })
      .join("")
  );

}


await client.run([crateMover9000, crateMover9001], true);
