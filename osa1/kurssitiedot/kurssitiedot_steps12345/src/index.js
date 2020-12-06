import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  console.log(course.name);
  console.log(course.parts[0].exercises);


  return (
    <>
      <Header course={course} />
      <Content partsit={course} />
      <Total total={course} />
    </>
  )
}

const Header = (props) => {
  console.log(props.course.name)
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Content = (props) => {
  console.log(props.partsit.parts[0].name)

  return (
    <div>
      <Part Kurssin osa11 part11={props.partsit.parts[0].name} exercises11={props.partsit.parts[0].exercises} />
      <Part Kurssin osa21 part21={props.partsit.parts[1].name} exercises21={props.partsit.parts[1].exercises} />
      <Part Kurssin osa31 part31={props.partsit.parts[2].name} exercises31={props.partsit.parts[2].exercises} />
    </div>
  )
}

const Part = (props) => {
  console.log(props.part11)
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
  console.log(props.total.parts[0].exercises)
  return (
    <div>
      <p>Number of exercises {props.total.parts[0].exercises + props.total.parts[1].exercises + props.total.parts[2].exercises}</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
