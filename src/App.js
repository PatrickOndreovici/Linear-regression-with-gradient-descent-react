import React, { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import './App.css'
import { getRandomInt, hypothesis, map_range } from './utils'

function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const width = 500,
  height = 500,
  numberOfTrainingSets = 10,
  learningRate = 0.003

let thetaZero = 0,
  thetaOne = 0

const learn = (alpha, data) => {
  console.log(thetaZero, thetaOne)
  let thetaZeroSum = 0
  let thetaOneSum = 0
  for (let i = 0; i < numberOfTrainingSets; ++i) {
    thetaZeroSum += hypothesis(thetaOne, thetaZero, data[i].x) - data[i].y
    thetaOneSum +=
      (hypothesis(thetaOne, thetaZero, data[i].x) - data[i].y) * data[i].x
  }
  thetaZero = thetaZero - (alpha / numberOfTrainingSets) * thetaZeroSum
  thetaOne = thetaOne - (alpha / numberOfTrainingSets) * thetaOneSum
}

function App() {
  const [trainingSet, setTrainingSet] = useState([])
  const [numberOfIterations, setNumberOfIterations] = useState(0)

  useInterval(() => {
    // Your custom logic here
    if (trainingSet.length > 0) {
      learn(learningRate, trainingSet)
      setNumberOfIterations(numberOfIterations + 1)
    }
  }, 0.001)

  useEffect(() => {
    const data = []
    for (let i = 0; i < numberOfTrainingSets; ++i) {
      data.push({
        x: map_range(getRandomInt(50, width - 50), 0, width, 0, 1),
        y: map_range(getRandomInt(50, height - 50), 0, height, 1, 0),
      })
    }
    setTrainingSet(data)
  }, [])

  return (
    <div className='App'>
      <svg width={width} height={height}>
        <rect width='100%' height='100%' fill='green' />
        <line
          x1='0'
          y1={
            500 - map_range(hypothesis(thetaOne, thetaZero, 0), 0, 1, 0, width)
          }
          x2={width}
          y2={
            500 - map_range(hypothesis(thetaOne, thetaZero, 1), 0, 1, 0, width)
          }
          stroke='black'
        ></line>
        {trainingSet.map((data, index) => (
          <circle
            key={index}
            cx={map_range(data.x, 0, 1, 0, width)}
            cy={map_range(data.y, 1, 0, 0, height)}
            fill='red'
            r='4'
          />
        ))}
      </svg>
    </div>
  )
}

export default App
