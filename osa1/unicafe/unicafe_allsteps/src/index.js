import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [allVotes, setAllVotes] = useState(0)
  const [average, setAverage] = useState(0)
  const [positiveAverage, setPositiveAverage] = useState(0)

  // annetaan "muuttuja" oneMore kun painetaan nappia
  const goodClick = (oneMore) => {
    oneMore = good + 1
    setGood(oneMore)
    //Yksi ääni lisää
    const oneMoreVote = allVotes + 1
    setAllVotes(oneMoreVote)

    console.log(allVotes)
    console.log(oneMoreVote)
    //Lisätään arvoa yhdellä
    const oneMoreOne = totalValue + 1
    setTotalValue(oneMoreOne)

    //Lasketaan average
    const newAverage = oneMoreOne / oneMoreVote
    setAverage(newAverage)

    //Lasketaan positiivisten average
    const newPositiveAverage = (oneMore / oneMoreVote) * 100
    setPositiveAverage(newPositiveAverage)
  }

  // Toinen tapa, muuttuja funktion sisällä
  const neutralClick = () => {
    const oneMoreNeutral = neutral + 1
    setNeutral(oneMoreNeutral)

    //Yksi ääni lisää
    const oneMoreVote = allVotes + 1
    setAllVotes(oneMoreVote)
    console.log(oneMoreVote)

    //Lasketaan average...voidaan käyttää totalValuea
    //koska neutraalissa tulee summaukseen 0
    const newAverage = totalValue / oneMoreVote
    setAverage(newAverage)

    //Lasketaan positiivisten average
    const newPositiveAverage = (good / oneMoreVote) * 100
    setPositiveAverage(newPositiveAverage)
  }


  const badlClick = (oneMoreBad) => {
    oneMoreBad = bad + 1
    setBad(oneMoreBad)

    //Yksi ääni lisää
    const oneMoreVote = allVotes + 1
    setAllVotes(oneMoreVote)

    //Vähennetään arvoa yhdellä
    const oneLessOne = totalValue - 1
    setTotalValue(oneLessOne)

    //Lasketaan average
    const newAverage = oneLessOne / oneMoreVote
    setAverage(newAverage)

    //Lasketaan positiivisten average
    const newPositiveAverage = (good / oneMoreVote) * 100
    setPositiveAverage(newPositiveAverage)
  }

  //Näillä ajetaan komponentteja
  return (
    <div>
      <h1>give feedback</h1>
      <table>
        <tbody>
          <tr>
            <td align="right"><Button onClick={goodClick} text='good' /></td>
            <td align="left"><Button onClick={neutralClick} text='neutral' /></td>
            <td><Button onClick={badlClick} text='bad' /></td>
          </tr>
        </tbody>
      </table>
      <Statistics goodeja={good}
        neutrals={neutral}
        pahoja={bad}
        all={allVotes}
        keskiarvo={average}
        posAvg={positiveAverage} />
    </div>
  )
}
//HUOM! Tässä ei aaltosulkuja, koska ei renderöi==>en ole varma tästä
//mutta näin toimii kuitenkin
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

//Renderöidään statistiikka
//Width:llä saadaan statistiikan kolumnit
//Yhtä leveäksi
const StatisticLine = (props) => {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td width="100px"> {props.text}</td>
            <td> {props.value}</td>
            <td> {props.rosentti}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

//Siirretään renderöitäväksi StatisticLinelle
const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>statistics</h1>
      <StatisticLine text="good" value={props.goodeja} />
      <StatisticLine text="neutral" value={props.neutrals} />
      <StatisticLine text="bad" value={props.pahoja} />
      <StatisticLine text="all" value={props.all} />
      <StatisticLine text="average" value={props.keskiarvo} />
      <StatisticLine text="positive" value={props.posAvg} rosentti="%" />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)
