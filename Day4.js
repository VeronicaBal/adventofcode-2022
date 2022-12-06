import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from 'express';

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 4, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();


function assignmentContained (input) {
let elvesPairs = input.split(`\n`);
let containedSum = 0;
for (let pair of elvesPairs) {
    /* Separate each input line to get the assignments of each pair */
    let assignments = pair.split(",");
    /* Assign each assignment to a variable and separate the start and end of each assignment */
    let assingmentElf1 = assignments[0].split("-");
    let assingmentElf2 = assignments[1].split("-");
    /* Check if assignments overlap and add to counter*/
    if ((Number(assingmentElf1[0]) <= Number(assingmentElf2[0]) && Number(assingmentElf1[1]) >= Number(assingmentElf2[1]))
        || (Number(assingmentElf2[0]) <= Number(assingmentElf1[0]) && Number(assingmentElf2[1]) >= Number(assingmentElf1[1]))) {
            containedSum ++;
     }
}
return containedSum;
}

await client.run([assignmentContained], true);

