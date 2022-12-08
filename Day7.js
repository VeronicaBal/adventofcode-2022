/* Today's problem was solved following @tpatel's solution. My (failed) attempt at part 1 is below.*/ 

import { AocClient } from 'advent-of-code-client';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const client = new AocClient({
    year: 2022, // the year of the challenge
    day: 7, // the day of the challenge
    token: process.env.TOKEN // the session cookie from adventofcode.com
  });

const input = await client.getInput();

function createTree(lines) {

    /* Create the outmost folder of the filesystem */
    const tree = {
        name: "/",
        isDirectory: true,
        children: []
    };
    
    let currentNode = tree;
    let currentCommand = null;

    /* Loop through each line and execute command / add files */
    for (let line of lines) {
        if(line[0] === "$"){ //it's a command
            const match = /^\$ (?<command>\w+)(?: (?<arg>.+))?$/.exec(line);
            currentCommand = match.groups.command; //get the current command name
            if (currentCommand === "cd") { // we need to change directory
                const target = match.groups.arg;
                switch (target) {
                  case "/": //go to outmost directory
                    currentNode = tree;
                    break;
                  case "..": //go one node up
                    currentNode = currentNode.parent; 
                    break;
                  default: //find the directory and cd to that dir
                    currentNode = currentNode.children.find(
                      (folder) => folder.isDirectory && folder.name === target
                    );
                }
              }
            } else {
              if (currentCommand === "ls") {
                // Check if it's a file
                const fileMatch = /^(?<size>\d+) (?<name>.+)$/.exec(line);
                if (fileMatch) {
                  const node = {
                    name: fileMatch.groups.name,
                    size: parseInt(fileMatch.groups.size),
                    isDirectory: false,
                    parent: currentNode,
                  };
                  currentNode.children.push(node);
                }
                // Check if it's a directory
                const dirMatch = /^dir (?<name>.+)$/.exec(line);
                if (dirMatch) {
                  const node = {
                    name: dirMatch.groups.name,
                    isDirectory: true,
                    children: [],
                    parent: currentNode,
                  };
                  currentNode.children.push(node);
                }
              }
            }
          }
          return tree;
}

function getSize(node, directoryCallback = () => {}) {
    if (!node.isDirectory) { //if it's a file, we just get the size of the file
      return node.size;
    }
    const directorySize = node.children //if it's a directory we need to get the size of all the children
      .map((child) => getSize(child, directoryCallback))
      .reduce((a, b) => a + b, 0);
  
    directoryCallback(node.name, directorySize); // recursive call for directories
  
    return directorySize;
  }


function part1 (input){
    let lines = input.split("\n");
    let tree = createTree(lines);
    let sumSmallFolder = 0;
    getSize(tree, (name, size) => {
        if (size < 100000) {
          sumSmallFolder += size;
        }
      });
    return sumSmallFolder;
}

function part2 (input){

    const totalSpace = 70000000;
    const requiredSpace = 30000000;

    const lines = input.split("\n");
    const tree = createTree(lines);

    const usedSpace = getSize(tree);

    const availableSpace = totalSpace - usedSpace;
    
    const minimumFolderSize = requiredSpace - availableSpace;

    let folders = [];
    
    getSize(tree, (name, size) => {
        if (size >= minimumFolderSize) {
          folders.push({
            name,
            size,
          });
        }
      });

    folders.sort((a,b) => a.size - b.size);
    return (folders[0].size)
}


await client.run([part1, part2], true);



/* My attempt at Part1 - works for example but not with full input

class Folder {
    constructor(name, parent){
        this.name = name;
        this.files = 0;
        this.children=[];
        this.parent = parent;
    }

    addDir(name){ //add a new directory in Folder
        let newDir = new Folder(name, this.name);
        this.children.push(newDir);
    }
    
    findDir(name) { //find a directory in Folder
      if(this.name === name) {
        return this;
      }  else {
        for (let child of this.children){
            let dir = child.findDir(name); //call the function recursively
            if (dir) { //if node === true (i.e. if node is equal to the value), return the node
              return dir;
            }
        }
        return null;
      }
    }

    addFiles(name, fileSize){ //add file size to folder and to all parent folders
        let refDir = this.findDir(name);
        refDir.files += fileSize;
        if (refDir.parent){
            let parent = this.findDir(refDir.parent);
            if(parent){
                parent.addFiles(parent.name, fileSize)} ;
            }
    }
    
    insertUnderDir(refItem, newItem){ //add a new file or dir under another file
        let refDir = this.findDir(refItem);
        if(!refDir) {
            return null;
        }
        let item = new Folder(newItem, refDir.name);
        refDir.children.push(item)
        return item;
    }

    traverse(fn) {
        fn(this);
        for (let child of this.children){
            child.traverse(fn)
        };
    }

   
} */

/*==============================================================*/

/* function cleanDirectory(input) { 
    let lines = input.split("\n");
    let filesystem = new Folder("/", null);
    let cd = filesystem.cd; //set current directory to outmost level

    for(let line of lines) {   //loop through each line of the terminal output
        line = line.split(" ")
        if(line.includes("dir")){ //create new folder
         cd === "/" ? filesystem.addDir(line[1]): filesystem.insertUnderDir(cd, line[1])
        } else if(line.includes("..")){ //go one level up
            let currFolder = filesystem.findDir(cd);
            cd = currFolder.parent;
        } else if (line.includes("cd")){ //change directory
            cd = line[2];
        } else if (Number(line[0])){ //add filesize
            filesystem.addFiles(cd, Number(line[0]))
        }
    }
    console.log(filesystem)
    let result = 0;
    filesystem.traverse(f => f.files <= 100000 ? result+= f.files : null);
    return result;
} */





