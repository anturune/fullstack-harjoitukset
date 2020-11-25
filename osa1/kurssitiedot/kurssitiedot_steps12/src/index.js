import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <>
      <Header Kurssi course={course} />
      <Content Kurssin osa1 part1={part1} exercises1={exercises1} />
      <Content Kurssin osa2 part2={part2} exercises2={exercises2} />
      <Content Kurssin osa3 part3={part3} exercises3={exercises3} />
      <Total Number of exercises total={exercises1 + exercises2 + exercises3} />
     
    </>
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part Kurssin osa11 part11={props.part1} exercises11={props.exercises1} />
      <Part Kurssin osa21 part21={props.part2} exercises21={props.exercises2} />
      <Part Kurssin osa31 part31={props.part3} exercises31={props.exercises3} />
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.part11} {props.exercises11}
        {props.part21} {props.exercises21}
        {props.part31} {props.exercises31}
      </p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.total}</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
