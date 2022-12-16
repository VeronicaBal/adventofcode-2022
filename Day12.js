import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 12, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();


function findStart(maze){
    let x = maze.map(r => r.findIndex(e => e==="S"));
    let y = x.findIndex(i => i!== -1);
    x = x.filter(i => i !== -1)[0];
    let startingPoint = {
       y,
       x
    }
    return startingPoint;
}

function findEnd(maze){
    let x = maze.map(r => r.findIndex(e => e==="E"));
    let y = x.findIndex(i => i!== -1);
    x = x.filter(i => i !== -1)[0];
    let endPoint =  {
        y,
        x
    }
    return endPoint;
}

/* Transform letters to numbers from 0 to 25 */
function transformLetters(maze){
    for(let i=0; i< maze.length; i++){
        let line = maze[i];
        for(let j=0; j<line.length; j++){
            let letter = line[j];
            if(letter === "S"){
                maze[i][j] = 0;
            } else if (letter === "E"){
                maze[i][j] = 25;
            } else {
                maze[i][j] =  letter.charCodeAt(0)-97;
            }
        }
    }
    return maze
}

  /* Transform each point into a unique value */
  function pointToInt(x, y) {
    return y * 1e3 + x; //1000 is a constant, it can be changed for another number
  }
  /* Gets back the point coordinates based on the unique ID */
  function intToPoint(int) {
    return {
      y: Math.floor(int / 1e3),
      x: int % 1e3,
    };
  }
  
  function getNeighbors(x, y, maze) {
    const res = [];
    if (y + 1 < maze.length && maze[y + 1][x] <= maze[y][x] + 1) {
      res.push(pointToInt(x, y + 1));
    }
    if (y - 1 >= 0 && maze[y - 1][x] <= maze[y][x] + 1) {
      res.push(pointToInt(x, y - 1));
    }
    if (x + 1 < maze[y].length && maze[y][x + 1] <= maze[y][x] + 1) {
      res.push(pointToInt(x + 1, y));
    }
    if (x - 1 >= 0 && maze[y][x - 1] <= maze[y][x] + 1) {
      res.push(pointToInt(x - 1, y));
    }
    return res;
  }
  
  /* Function to find the shortest path between two points, see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm */
  function dijkstra(maze, start, end) {
    const dist = {};
    const prev = {};
    let queue = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const id = pointToInt(x, y);
        dist[id] = Infinity;
        // prev[pointToInt(x, y)] = undefined; -- In JS this is automatically undefined
        queue.push(id);
      }
    }
    dist[pointToInt(start.x, start.y)] = 0;
  
    while (queue.length) {
      let u = null; 
      for (const current of queue) {
        if (u === null || dist[current] < dist[u]) {
          u = current;
        }
      }
      /* If we find the end, we exit the loop */
      if (u === pointToInt(end.x, end.y)) {
        break;
      }
      queue = queue.filter((x) => x !== u);
  
      const point = intToPoint(u);
      const neighbors = getNeighbors(point.x, point.y, maze);
      for (const v of neighbors) {
        if (queue.includes(v)) {
          const alt = dist[u] + 1;
          if (alt < dist[v]) {
            dist[v] = alt;
            prev[v] = u;
          }
        }
      }
    }
    return {
      dist,
      prev,
    };
  }
  
  function part1() {
    let maze = input.split(`\n`).map(e => e.split(""));
    let start = findStart(maze);
    let end = findEnd(maze);
    maze = transformLetters(maze);
    const data = dijkstra(maze, start, end);
    const distance = data.dist[pointToInt(end.x, end.y)];
    return distance;
  }

  /* We need to reverse the condition to get the neighbors because we are going backwards */
  function getNeighbors2(x, y, maze) {
    const res = [];
    if (y + 1 < maze.length && maze[y + 1][x] >= maze[y][x] - 1) {
      res.push(pointToInt(x, y + 1));
    }
    if (y - 1 >= 0 && maze[y - 1][x] >= maze[y][x] - 1) {
      res.push(pointToInt(x, y - 1));
    }
    if (x + 1 < maze[y].length && maze[y][x + 1] >= maze[y][x] - 1) {
      res.push(pointToInt(x + 1, y));
    }
    if (x - 1 >= 0 && maze[y][x - 1] >= maze[y][x] - 1) {
      res.push(pointToInt(x - 1, y));
    }
    return res;
  }
  
  function dijkstra2(maze, start, end) {
    const dist = {};
    const prev = {};
    let queue = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const id = pointToInt(x, y);
        dist[id] = Infinity;
        // prev[pointToInt(x, y)] = ;
        queue.push(id);
      }
    }
    dist[pointToInt(start.x, start.y)] = 0;
  
    while (queue.length) {
      let u = null;
      for (const current of queue) {
        if (u === null || dist[current] < dist[u]) {
          u = current;
        }
      }
      let point = intToPoint(u);

      if(maze[point.y][point.x] === 0){
        return dist[u]
      }

      queue = queue.filter((x) => x !== u);
  
      const neighbors = getNeighbors2(point.x, point.y, maze);
      for (const v of neighbors) {
        if (queue.includes(v)) {
          const alt = dist[u] + 1;
          if (alt < dist[v]) {
            dist[v] = alt;
            prev[v] = u;
          }
        }
      }
    };
  }
  

  function part2() {
    let maze = input.split(`\n`).map(e => e.split(""));
    let end = findEnd(maze);
    maze = transformLetters(maze);
    const distance = dijkstra2(maze, end);
    return distance;
  }

  await client.run([part1, part2], true);
