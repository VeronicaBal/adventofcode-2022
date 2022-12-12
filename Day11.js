import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 11, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();
  
/* Function to compute the operation from the operation line of the input */
function getOperationFunction(operation) {
    return function (old) {
      const string = operation.replace(/old/, old);
      return eval(string);
    };
  }

  /* Function to parse the input */
  function getMonkeys(input){
    /* Each monkey is a part of input divided by two line breaks */
    let monkeys = input.split("\n\n")
        .map((lines, monkeyId) => {

            const items = lines //get the array of items
            .match(/Starting items(?:[:,] (\d+))+/g)[0]
            .split(": ")[1]
            .split(", ")
            .map(Number);

            //get the operation
            const operation = lines.match(/= ([^\n]+)/)[1];
    
            //the number we have to divide the item by
            const divisibleBy = parseInt(lines.match(/divisible by (\d+)/)[1]);
            
            const whenTrueSendTo = parseInt(
            lines.match(/If true: throw to monkey (\d)/)[1]
            );

            const whenFalseSendTo = parseInt(
            lines.match(/If false: throw to monkey (\d)/)[1]
            );
    
            /* We return an object for each monkey */
            return {
            id: monkeyId,
            totalInspectedObjects: 0,
            items,
            divisibleBy,
            operation: getOperationFunction(operation),
            sendTo: (item) =>
                item % divisibleBy === 0 ? whenTrueSendTo : whenFalseSendTo,
            };
        });
       return(monkeys);
    };

    function part1(input){
        let monkeys = getMonkeys(input);
        /* Repeat for 20 rounds */
        for(let i=0; i<20; i++){
            for (let monkey of monkeys) {
                let items = monkey.items;
                /* Get one item at a time from the array and 
                repeat the loop while there are still items left */ 
                while (items.length){
                    let item = items.shift();
                    /* Add one to the inspected objects of that monkey */
                    monkey.totalInspectedObjects++;
                    /* Compute the operation for that item */ 
                    item = monkey.operation(item);
                    /* Divide the item worry by three after the operation is computed*/
                    item = Math.floor(item/3);
                    /* Call the sendTo function and add the item to the respective monkey */
                    const destination = monkey.sendTo(item);
                    monkeys[destination].items.push(item)
                }
            }
        }
        /* Make an array out of all of the totalInspectedObjects */
        const activity = monkeys.map(m => m.totalInspectedObjects);
        /* Sort descending */
        activity.sort((a,b) => b-a);
        /* Return the first and second monkeys with most activity multiplied */
        return (activity[0] * activity [1]);
    }

    function part2 (input) {
        let monkeys = getMonkeys(input);
        /* To avoid getting infinite results, we divide each item by all the "divisibleBy" multiplied with each other */
        const divider = monkeys.map((m) => m.divisibleBy).reduce((a, b) => a * b, 1);
         /* Repeat for 10000 rounds */
         for(let i=0; i<10000; i++){
            for (let monkey of monkeys) {
                let items = monkey.items;
                /* Get one item at a time from the array and 
                repeat the loop while there are still items left */ 
                while (items.length){
                    let item = items.shift();
                    /* Add one to the inspected objects of that monkey */
                    monkey.totalInspectedObjects++;
                    /* Compute the operation for that item */ 
                    item = monkey.operation(item);
                    /* Instead of dividing by three, we divide by our divider on line 96 */
                    item = item % divider;
                    /* Call the sendTo function and add the item to the respective monkey */
                    const destination = monkey.sendTo(item);
                    monkeys[destination].items.push(item)
                }
            }
        }
        /* Make an array out of all of the totalInspectedObjects */
        const activity = monkeys.map(m => m.totalInspectedObjects);
        /* Sort descending */
        activity.sort((a,b) => b-a);
        /* Return the first and second monkeys with most activity multiplied */
        return (activity[0] * activity [1]);

    }

    await client.run([part1, part2], true);
