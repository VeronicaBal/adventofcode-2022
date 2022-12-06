import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from 'express';

const client = new AocClient({
  year: 2022, // the year of the challenge
  day: 3, // the day of the challenge
  token: process.env.TOKEN // the session cookie from adventofcode.com
});

const input = await client.getInput();

let rucksacks = input.split(`\n`);

/* Find the only item type (letter) that both compartments of a rucksack (halves of a line)
have in common. Return the sum of the points of all common type scores */
function prioritySum (input) {
    let sum = 0;
    for(let rucksack of rucksacks){
        /* Divide compartments, convert to array, and assign them to variables */
        let compartment1Items =  rucksack.slice(0, rucksack.length/2).split("");
        let compartment2Items = rucksack.slice(rucksack.length/2, rucksack.length).split("");
        /* Find the commontype, i.e. the first (and only) character contained in both rucksacks */
        let commonType = compartment1Items.find(i=> compartment2Items.includes(i))
        /* If the commontype is a lowercase letter, add a point from 1-26, else start counting at 27 */ 
        if (commonType.toLowerCase() === commonType){
            sum += (commonType.charCodeAt(0)-96);
        } else {
            sum += (commonType.toLowerCase().charCodeAt(0)-70);
        }
    }
    return sum
}

/* Find the group common type within each group of 3 elves. 
Return the sum of all the points of the group common types. */
function groupPriortySum (input) {
    let sum = 0;

    /* Loop through the input lines increasing the value by 3 (number of elves per group) */ 
    for(let i=0; i<rucksacks.length; i+=3){

        /* Define the group as the next 3 elves starting at the current index */
        let group = rucksacks.slice(i, i+3).map(e => e.split(""));

        /* Find the group common type, which is the first letter of the first elf of the group
        that is also included in the second and third elves */
        let commonType = group[0].find(t => group[1].includes(t) && group[2].includes(t));

        /* If the commontype is a lowercase letter, add a point from 1-26, else start counting at 27 */ 
        if (commonType.toLowerCase() === commonType){
            sum += (commonType.charCodeAt(0)-96);
        } else {
            sum += (commonType.toLowerCase().charCodeAt(0)-70);
        }        
    }
    return sum
}

await client.run([prioritySum], true);
