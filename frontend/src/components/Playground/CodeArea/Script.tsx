import { Button } from '@mantine/core'
import React, { ChangeEvent, useContext, useState } from 'react'
import { getWorker, useWorker } from "../../../worker/workerAPI"
import classes from './Script.module.css'
import { compare } from '../../../utils/compare'
import TextArea from './TextArea'
import { TerminalContext } from 'react-terminal'
import Terminal from './Terminal'

const wasmWorker = getWorker()

function Script() {
  const { setBufferedContent } = useContext(TerminalContext)
  const [textAreaValue, setTextAreaValue] = useState(example)

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => setTextAreaValue(e.target.value)

  const handleRunCode = () => {
    useWorker(wasmWorker, textAreaValue, (data: any) => {
      setBufferedContent((prev: any) => (
        <>
          {prev && <>{prev}<br /></>}<span>{data}</span>
        </>
      ))
    })
  }


  return (
    <div className={classes.script}>
      <div className={classes.textAndTerm}>
        <TextArea value={textAreaValue} handleTextArea={handleTextArea} />
        <div className={classes.scriptTerminal}>
          <Terminal
            prompt={''}
            enableInput={false}
          />
        </div>
      </div>
      <Button size="sm" className={classes.runScriptBtn} onClick={handleRunCode}>Run</Button>
    </div>
  )
}

export default React.memo(Script, compare)

const example = `// Variable bindings
let int = 42
let float = 3.14
let str = "Cixac"
let bool = true
let nil = null
let arr = [1, 2, 3, 4, 5]
let obj = {"name": "Alice", "age": 30, true: "boolean key", 42: "integer key"}

// Const declaration
const PI = 3.14159

// Arithmetic expressions
let result = (int * float) / 2 - 3
print("result: " + result)

// Functions and closures
let adder = fn(x) { 
    fn(y) { x + y }
}
let addFive = adder(5)
print("addFive(10): " + addFive(5))

// Conditional expressions
let compareToTen = fn(x) {
    if (x > 10) {
        return "greater than ten"
    } else if (x == 10) {
        return "equal to ten"
    } else {
        return "less than ten"
    }
}
print("compareToTen(20): " + compareToTen(20))
print("")

// Loops
for (let i = 0; i < 5; i++) {
    if (i % 2 == 0) {
        continue
    }
    print("for loop i: " + i)
    if (i >= 3) {
        break
    }
}
print("")

let i = 0
while (i < 3) {
    print("while loop i: " + i)
    i += 1
}
print("")

// For-in loops
for (index, value in arr) {
    print("for-in arr: arr[" + index + "] = " + value)
}
print("")

for (key, value in obj) {
    print("for-in obj: " + key + " -> " + value)
}
print("")

for (index, char in str) {
    print("for-in str: str[" + index + "] = " + char)
}
print("")

// Recursion
let fibonacci = fn(n) {
    if (n <= 1) { return n }
    fibonacci(n - 1) + fibonacci(n - 2)
}
print("")

// String operations
print("str[0] + str[2]: " + str[0] + str[2])
print("str.capitalize(): " + str.capitalize())
print("str.lower(): " + str.lower())
print("str.upper(): " + str.upper())
print("str.split('X'): " + str.split("X"))
print("")

// Array operations
print("arr.first(): " + arr.first())
print("arr.last(): " + arr.last())
print("arr.rest(): " + arr.rest())
print("arr.push(6)")
arr.push(6)
print("arr.pushleft(0)")
arr.pushleft(0)
print("arr.pop(): " + arr.pop())
print("arr.popleft(): " + arr.popleft())
print("arr.slice(1, 4): " + arr.slice(1, 4))
print("arr.contains(3): " + arr.contains(3))
print("arr.index(4): " + arr.index(4))
print("")

// Object operations
print("obj.clear()")
obj.clear()
print("obj.set('key', 'value')")
obj.set("key", "value")
print("obj.set('key2', 'value2')")
obj.set("key2", "value2")
print("obj.get('key'): " + obj.get("key"))
print("obj.keys(): " + obj.keys())
print("obj.values(): " + obj.values())
print("obj.delete('key')")
obj.delete("key")
print("obj.contains('key'): " + obj.contains("key"))
print("")

// Built-in functions
print("len(str): " + len(str))
print("len(arr): " + len(arr))
print("len(obj): " + len(obj))
print("")

// Higher-order function
let applyFunc = fn(x, y, func) { func(x, y) }
let subtract = fn(a, b) { a - b }
print("applyFunc(10, 5, subtract): " + applyFunc(10, 5, subtract))
print("")

// Multi-line comment
/*
This is a multi-line comment
demonstrating the syntax in Cixac
*/

// Print the Fibonacci sequence up to the 10th number
print("Fibonacci sequence:")
for (let i = 0; i < 10; i++) {
    print("fibonacci(" + i + "): " + fibonacci(i))
}`
