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


/* The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.


The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 
In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

        [Z]
        [N]
    [C] [D]
    [M] [P]
 1   2   3
Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

        [Z]
        [N]
[M]     [D]
[C]     [P]
 1   2   3
Finally, one crate is moved from stack 1 to stack 2:

        [Z]
        [N]
        [D]
[C] [M] [P]
 1   2   3
The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

After the rearrangement procedure completes, what crate ends up on top of each stack?

 */

function parseInput(i) {
    //Separate stacks and moves from the input and separate each stack and move within it
    const [rawStacks, rawMoves] = i.split("\n\n").map((x) => x.split("\n"));
    //For each for characters in a line, only keep the character at position 1
    const parsedStacks = rawStacks.map((line) => [...line].filter((value, index) => index % 4 === 1));

    //Get the indexes (last line of parsedStacks)
    const indexes = parsedStacks.pop();
    let inputLength = indexes[indexes.length-1];
    do{parsedStacks[0].unshift(" ")} while(parsedStacks[0].length < inputLength);
    
    const orderedStacks = {};
    for (let line of parsedStacks) {
        for (let i = 0; i < line.length; i++) {
        //If the element is not a white space
          if (line[i] !== " ") {
            // Add line[i] to the stack indexes[i] if it doesn't exist already
            if (!orderedStacks[indexes[i]]) {
              orderedStacks[indexes[i]] = [];
            }
            //Add the element (letter) at the beginning of the stack
            orderedStacks[indexes[i]].unshift(line[i]);
          }
        }
      }

    //Create moves as an array of object
    const moves = [];
    for (const move of rawMoves) {
    //Get the digits inside of each move
    const match = /move (\d+) from (\d+) to (\d+)/g.exec(move);
    //Store de digits inside the moves array, making a new object with 3 keys
    moves.push({
        count: parseInt(match[1]),
        from: parseInt(match[2]),
        to: parseInt(match[3]),
    });
    }
    let result = [orderedStacks, moves, indexes];
  return result
}

function supplyStacks (input){
    let [orderedStacks, moves, indexes] = parseInput(input);
    //For each move
    for (const move of moves) {
        //Repeat for the number of items we need to change
        for (let i = 0; i < move.count; i++) {
          //Get the item we want to move from the end of the stack  
          const movedItem = orderedStacks[move.from].pop();
          //Insert the item we want to move at the end of the other stack
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

/* As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.

Again considering the example above, the crates begin in the same configuration:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
Moving a single crate from stack 2 to stack 1 behaves the same as before:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 
However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:

        [D]
        [N]
    [C] [Z]
    [M] [P]
 1   2   3
Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

        [D]
        [N]
[C]     [Z]
[M]     [P]
 1   2   3
Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

        [D]
        [N]
        [Z]
[M] [C] [P]
 1   2   3
In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack? */

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


await client.run([supplyStacks, crateMover9001], true);
