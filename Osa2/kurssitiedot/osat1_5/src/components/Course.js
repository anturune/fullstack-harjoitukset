import React from 'react'

//Kurssin tiedot luodaan tällä
//HUOM! Ei propseja vaan tuodaan suoraan courses
const Course = ({ courses }) => {
    console.log(courses.name)
    return (
        <>
            <Header courses={courses} />
            <Content courses={courses} />
            <Total courses={courses} />
        </>
    )
}
//Header luodaan tällä
//HUOM! Ei propseja vaan tuodaan suoraan courses
const Header = ({ courses }) => {
    console.log('Header komponentti', courses.name)
    return (
        <div>
            <h1>{courses.name}</h1>
        </div>
    )
}

//Kurssin kontentti, käydään map:lla kaikki osat läpi
//Ja ohjataan Part komponentille muotoiltavaksi
const Content = ({ courses }) => {
    return (
        <>
            {courses.parts.map(parts =>
                <Part key={parts.id} parts={parts} />
            )}
        </>
    )
}

//Kurssin osasta palautetaan nimi ja harjoitusten määrä
const Part = ({ parts }) => {
    return (
        <p>{parts.name}  {parts.exercises}</p>
    )
}
//Tällä lasketaaan kurssin harjoitusten yhteismäärä
const Total = ({ courses }) => {
    console.log('Tuli Totaliin')
    //Ajetaan mapilla ensin kaikki arvot ja summataan yhteen
    const total = courses.parts.map(parts => parts.exercises).reduce((s, t) => {
        console.log('Näin summautuu', s + t)
        return s + t
    })
    //Palautetaan totalin arvo boldattuna
    return (
        <b> Total of {total} excersises </b>
    )
}

export default Course