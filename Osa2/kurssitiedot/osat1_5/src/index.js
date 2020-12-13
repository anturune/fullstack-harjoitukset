import React from 'react'
import ReactDOM from 'react-dom'
import Course from './components/Course'


//Kaikille kursseille, käydään läpi map:lla
//HUOM! Ei propseja vaan tuodaan suoraan courses
const Courses = ({ courses }) => {
  return (
    <>
      {courses.map(courses =>
        <Course key={courses.id} courses={courses} />
      )}
    </>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    },
    {
      name: 'ATun lisäys',
      id: 3,
      parts: [
        {
          name: 'Lisää tai poista',
          exercises: 9,
          id: 1
        },
        {
          name: 'Keskitien kulkijat',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  return (
    <div>
      <Courses courses={courses} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))