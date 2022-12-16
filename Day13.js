import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();


const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 13, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

function parseInput(input){
    let pairs = input.split("\n\n").map(p=>{
        let [left, right] = p.split("\n").map((line) => JSON.parse(line));
        return{
            left,
            right
        }})
    return pairs;
}

function checkOrder(left, right, result) {
    const leftIsNumber = typeof left === "number";
    const rightIsNumber = typeof right === "number";

    /* Both are numbers, compare the value */
    if (leftIsNumber && rightIsNumber) {
      if (left < right) {
        result.rightOrder = true;
        return;
      }
      if (left > right) {
        result.rightOrder = false;
        return;
      }
    
    /* Both are arrays */
    } else if (!leftIsNumber && !rightIsNumber) {
      let index = 0;
      while (true) {
        if (index > left.length - 1 && index <= right.length - 1) {
          // left ran out of items, right order
          result.rightOrder = true;
          return;
        } else if (index <= left.length - 1 && index > right.length - 1) {
          // right ran out of items, wrong order
          result.rightOrder = false;
          return;
        } else if (index > left.length - 1 && index > right.length - 1) {
          // both lists ran out of items, compare the intems inside the arrays
          return;
        }
  
        /* Call the function recursively to check the items inside the array */
        checkOrder(left[index], right[index], result);
        // if we have set the variable rightOrder, stop
        if (typeof result.rightOrder !== "undefined") {
          return;
        }

        index++;
      }

    /* Only one of the elements is an array, transform the other one in an arrway
        and call the function again*/
    } else {
      if (leftIsNumber) {
        checkOrder([left], right, result);
      } else {
        checkOrder(left, [right], result);
      }
    }
  }
  

function part1(){
   let pairs = parseInput(input);
   let correctOrderSum = 0; 
    
    for(let i=0; i<pairs.length; i++){
        let pair = pairs[i];
        let result = {};
        checkOrder(pair.left, pair.right, result);
        result.rightOrder ? correctOrderSum+=i+1 : 0;
    }

    return correctOrderSum;
}

function parseInput2(input){
    return input
    .replace(/\n\n/g, "\n")
    .split("\n")
    .map((line) => JSON.parse(line));
}

function part2(){
    let lines = parseInput2(input).concat([[[2]], [[6]]]);
    let strings = lines.sort((a,b) => {
        let result = {};
        checkOrder(a,b,result);
        return result.rightOrder? -1 : 1;
    }).map(x => JSON.stringify(x));

    let position1 = strings.indexOf("[[2]]")+1;
    let position2 = strings.indexOf("[[6]]")+1;

    return position1*position2
}

// part2(input);
await client.run([part1, part2], true);
