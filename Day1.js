import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from 'express';

const client = new AocClient({
  year: 2022, // the year of the challenge
  day: 1, // the day of the challenge
  token: process.env.TOKEN // the session cookie from adventofcode.com
});

const input = await client.getInput();

/* Find Elf carrying the most calories 
and return the sum of the calories carried by this elf */
function countCalories(input){
    let itemList = input.split("\n")
    let highest = 0;
    let currentSum = 0;
for(let element of itemList){
    /* Keep adding the numbers to the current sum until you find a white space.
     Once you do find a white space, compare it with the highest sum. */
    if (element.trim()){
        currentSum += Number(element.trim());
    } else {
        /*If the current sum is higher than the highest sum, 
        replace the value of highest. */
        if (currentSum > highest){
            highest = currentSum;
        }
        /*  Reset the current sum */
        currentSum = 0;
    }
}
return highest;
}

/* Find the top three elves carrying the most calories 
end return the sum of the calories carried by these elves */
function topThreeSum (input) {
    let itemList = input.split("\n");
    let sums = [];
    let currentSum = 0;
    for(let i=0; i<itemList.length; i++){
        let element = itemList[i];
        /* Keep adding the numbers to the current sum until you find a white space.
        Once you do find a white space, push the current sum to the array of sums and reset the current sum at 0*/
        if (element.trim()){
            currentSum += Number(element.trim());
        } else {
            sums.push(currentSum)
            currentSum = 0;
        }
        /* If we are at the last item of the array, then push the current sum */
        if(i === itemList.length-1){
            sums.push(currentSum)
        }
    }

    let topThree = sums.sort((a,b) => {return b-a}).splice(0,3);
    let topThreeSum = topThree.reduce((a, c) => a + c,0);
    return topThreeSum
}


await client.run([countCalories, topThreeSum], true);

