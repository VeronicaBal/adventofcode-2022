import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from 'express';

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 6, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();

function findStartOfPacket (input) {
    for(let i=4; i<input.length; i++){
        //Get the 4 characters ending at index i
        let subStr = (input.slice(i-4, i));
        //Convert the string to an array
        let arr = subStr.split("");
        //If at least one of the character is found before its current index, the loop will not run
        if(!arr.some((v, i) => arr.indexOf(v) < i)){
            //Return the index of the last element
            return i;
        };
    }
}

//Same function but checking for 14 unique characters
function findStartOfMessage (input) {
    for(let i=14; i<input.length; i++){
        let subStr = (input.slice(i-14, i));
        let arr = subStr.split("");
        if(!arr.some((v, i) => arr.indexOf(v) < i)){
            console.log(i) 
            return i;
        };
    }
}

await client.run([findStartOfPacket, findStartOfMessage], true);
