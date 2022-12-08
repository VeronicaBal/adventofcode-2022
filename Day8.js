import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 8, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();


function visibleTrees(input){
    let rows = input.split("\n").map(r => r.split(""));
    let visible = 0;
    for(let r=0; r<rows.length; r++){//loop through each row

         for(let c=0; c<rows[r].length; c++){ //loop through each column    

            let currentTree = Number(rows[r][c]);

            /* If it's on the edge, add 1 */ 
            if(c===0 || c===rows[r].length-1 || r===0 || r===rows.length-1){ 
                visible ++;
            } else {

                /* Find adjacent trees */
                let sameRow = rows[r].map(r=> Number(r));
                let sameColumn = rows.map(r => Number(r[c]));      
                let adjacent = {
                    left: sameRow.filter((e, i) => i < c ),
                    right: sameRow.filter((e, i) => i > c),
                    up: sameColumn.filter((e, i) => i < r),
                    down: sameColumn.filter((e, i) => i > r)
                }

                /* If every tree in at least one direction is smaller than the current tree, 
                add one tree to the  visible tree count*/
                if (Object.keys(adjacent).some(d => adjacent[d].every(t => t < currentTree))){
                    visible++;
                } 
            }
         }
    }
    return visible
}


function viewingDistance (input) {
    let rows = input.split("\n").map(r => r.split(""));
    let highest = 0; 

    for(let r=0; r<rows.length; r++){//loop through each row

        for(let c=0; c<rows[r].length; c++){ //loop through each column    

           let currentTree = Number(rows[r][c]);

           /* Only checking trees that are not on the edge (viewingDistance > 0) */ 
           if(c!==0 && c!==rows[r].length-1 && r!==0 && r!==rows.length-1){

                /* Find adjacent trees */
                let sameRow = rows[r].map(r=> Number(r));
                let sameColumn = rows.map(r => Number(r[c]));      
                let adjacent = {
                    left: sameRow.filter((e, i) => i < c ).reverse(), //we want to reverse this because we start counting from right to left
                    right: sameRow.filter((e, i) => i > c),
                    up: sameColumn.filter((e, i) => i < r).reverse(), //we want to reverse this because we start counting from bottom to top
                    down: sameColumn.filter((e, i) => i > r)
                }

                /* Compute visibility for each direction */ 
                let visibilityArr =[];
                for(let direction in adjacent){
                    /* Find the first tree that blocks visibility in this direction */
                    let blockingTreeIndx = adjacent[direction].findIndex(t => t >= currentTree);
                    if(blockingTreeIndx === -1){ //if no tree is blocking visibility in this direction
                        visibilityArr.push(adjacent[direction].length) //the score will be the same as the length of this direction
                    } else {
                        visibilityArr.push(blockingTreeIndx+1); //the visibility is equal to the index of the blocking tree + 1 
                    }
                }
                
                /* Multiply visibility in each direction to get the total visibility score of that tree */
                let visibilityScore = visibilityArr.reduce((acc, s)=> acc*s, 1)

                /* If the visibility of that tree is the highest, replace the highest with current score */
                if (visibilityScore > highest){
                    highest = visibilityScore
                }
            }
        }
    }
    return highest
}





await client.run([visibleTrees, viewingDistance], true);
