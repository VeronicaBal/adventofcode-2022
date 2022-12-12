import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 10, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();


/* Parse input to extract program information */
let program = input.split(`\n`)
    .map((line) => {
        const input = line.split(" ");
        const res = {};
        res.op = input[0];
        if (res.op === "addx") {
        res.value = parseInt(input[1]);
        }
        return res;
    });
        
class CPU {
    constructor(program) {
        this.program = program;
        this.currentLine = 0;
        this.cycle = 0;
        this.wait = 0;
        this.registers = {
            X: 1,
        };
    }

    runCycle(){
        if(this.currentLine >= this.program.length) {
            return false;
        }
        /* We always want to add a cycle */
        this.cycle ++;
         
        let line = this.program[this.currentLine];

        switch (line.op) {
            case "noop":
              // Do nothing here
              this.currentLine++;
              break;
      
            case "addx":
              if (this.wait === 0) {
                this.wait = 1;
              } else {
                this.wait--;
                if (this.wait === 0) {
                  this.registers.X += line.value;
                  this.currentLine++;
                }
              }
              break;
            }
            return true;
    }
}


function part1 (program) {
  let cpu = new CPU(program);
  let sum = 0;
  while (true) {
    if (!cpu.runCycle()) {
        break;
      }
    if(cpu.cycle%40 === 20) {
        sum += cpu.cycle * cpu.registers.X;
    }
  }
  return sum
}

class CRT {
    constructor(width = 40, height = 6){
        this.width = width;
        this.height = height; 
        this.currentIndex = 0;

        this.content = new Array (this.height)
            .fill(0)
            .map((_) => new Array(this.width).fill(" "))
    }

    runCycle(spritePosition){
        const x = this.currentIndex % this.width;
        const y = Math.floor(this.currentIndex / this.width);
        
        if (y >= this.height){
            return;
        }
        if (Math.abs(x-spritePosition) < 2){
            this.content[y][x] = "#";
        } else {
            this.content[y][x] = ".";
        }
        this.currentIndex++;
    }

    printScreen(){
        console.log(this.content.map((line) => line.join("")).join("\n"));
    }
}

function part2 () {
   let cpu = new CPU(program);
   let crt = new CRT();
   while (true) {
    crt.runCycle(cpu.registers.X);
    if(!cpu.runCycle()){
        break;
    }
   }
   crt.printScreen();
}



await client.run([part1, part2], true);
