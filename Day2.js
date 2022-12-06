import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from 'express';

const client = new AocClient({
  year: 2022, // the year of the challenge
  day: 2, // the day of the challenge
  token: process.env.TOKEN // the session cookie from adventofcode.com
});

const input = await client.getInput();

/* This object represents the points assigned to each move */ 
const pointLegend = {rock:1, paper:2, scissors:3};
/* This object contains key-value pairs of opponent moves correspondance */
const opponentsLegend = {A: "rock", B: "paper", C: "scissors"};
/* This object contains the move that will lead to a victory based on the opponent move */
const winningMoves = {rock:"paper", paper:"scissors", scissors:"rock"}
/* Get each game (line of the input)*/
let game = input.split("\n");
game = game.map(element => element.split(" "));

function rockPaperScissor(input) {
    /* This object contains key-value pairs of player moves correspondance */
    const myMoveLegend = {X:"rock", Y:"paper", Z:"scissors"};
    let points = 0;

    for (let round of game){
        let myMove = myMoveLegend[round[1]];
        let opponentsMove = opponentsLegend[round[0]];
        /*Add points corresponding to my move*/
        points += pointLegend[myMove];
    
        /*If my move is the winning move based on the opponents move, add 6 points
        else, if it is a draw, add 3 points*/
        if(winningMoves[opponentsMove] === myMove){
            points += 6;
        } else if(opponentsMove === myMove){
            points += 3;
        }
    }
    return points;
}

/* In this function we assume that the second column represents the outcome of the round */
function partTwo(input) {
 let points = 0;
 for (let round of game){
    let outcome = round[1];
    let opponentsMove = opponentsLegend[round[0]];

    if (outcome === "Y") {
        /* It's a draw, we add 3 points + same move as opponent */ 
        points += 3;
        points += pointLegend[opponentsMove];
    } else if (outcome === "Z"){
        /* We win, add 6 points + winning move */
        points += 6;
        let winningMove = winningMoves[opponentsMove];
        points += pointLegend[winningMove];
    } else if (outcome === "X"){
        /* We lose, add points of losing move (not same as opponent and not winning) */ 
        let possibleMoves = Object.keys(pointLegend);
        let myMove = possibleMoves.filter(m => m !== opponentsMove && m !== winningMoves[opponentsMove]);
        points += pointLegend[myMove];
    }
 }
 return points;
}


 await client.run([rockPaperScissor], true);
