import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from 'express';

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 9, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();

/* Parse initial input to get the direction and the number of moves for each command (input line) */
let commands = input.split("\n")
    .map((line) => {
        const [letter, number] = line.split(" ");
        return {
          direction: letter,
          totalMoves: parseInt(number),
        };
      });  

/* Legend that defines the movement on x and y axis for each direction */
const moves = {
    R: {
        x: 1,
        y: 0
    },
    L: {
        x: -1,
        y: 0
    },
    U: {
        x: 0,
        y: -1
    },
    D: {
        x: 0,
        y: 1
    }
}

class Knot {
    constructor(x, y){
        this.x = x; //current horizontal position
        this.y = y; //current vertical position
    }
    move(direction) { //takes as an argument the direction in the moves legend
        let currentMove = moves[direction];
        this.x += currentMove.x;
        this.y += currentMove.y;
    }
    follow(knot){ //method to follow head/another knot
        /* Calculate distance from the reference know */
        let distance = Math.max(
            Math.abs(this.x - knot.x),
            Math.abs(this.y - knot.y)
        );

        /* If the two knots are not adjacent or overlapping, move the current knot */
        if (distance > 1){
            let directionX = knot.x - this.x;
            this.x += Math.abs(directionX) === 2 ? directionX / 2 : directionX;
            let directionY = knot.y - this.y;
            this.y += Math.abs(directionY) === 2 ? directionY / 2 : directionY;
        }
    }
}

function markVisited(x, y, visited){
    visited.add(`${x}-${y}`);
}

function part1(input){
    let head = new Knot (0, 0);
    let tail = new Knot (0,0);
    let visited = new Set ();

    /* Mark starting position as visited */
    markVisited(0, 0, visited);

    for(let command of commands){
        for (let i = 0; i < command.totalMoves; i++) {
            head.move(command.direction);
            tail.follow(head);
            markVisited(tail.x, tail.y, visited);
          }
    }
    return visited.size
}


function part2(input){
    /* Create 10 knots */
    let knots = new Array(10).fill(0).map((_) => new Knot(0, 0));
    let visited = new Set();
    
    /* Mark starting position as visited */
    markVisited(0, 0, visited);

    for (const command of commands) {
        for (let i = 0; i < command.totalMoves; i++) {
          // Move the head (first knot) according to the instructions
          knots[0].move(command.direction);
          // Move the rest of the rope
          for (let knot = 1; knot < knots.length; knot++) {
            const point = knots[knot];
            point.follow(knots[knot - 1]);
          }
          // Define the tail as the last knot
          const tail = knots[knots.length - 1];
          markVisited(tail.x, tail.y, visited);
        }
      }
      return visited.size
}

await client.run([part1, part2], true);
