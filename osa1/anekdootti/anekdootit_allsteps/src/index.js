import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  //Luodaan taulukko joka sisältää pelkästään nollia ja on 
  //Saman kokoinen kuin alla oleva anecdotes taulukko
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length))
  //Max index
  const [maxindex, setMaxIndex] = useState(0)

  //Kun painetaan next anecdot buttonia
  //luodaan random numero 1-6 väliltä
  const randomClick = () => {
    const randomNumber = Math.floor(Math.random() * 6)
    setSelected(randomNumber)
  }

  const voteClick = () => {
    //Kopioidaan pistetaulukko uudeksi taulukoksi
    const copyPoints = [...points]
    //Lisätään yksi ääni lisää
    copyPoints[selected] += 1
    //Muutetaan tilaa uudella taulukolla
    setPoints(copyPoints)

    //Tarkastetaan onko uuden äänen saanut maksimiääniä saanut
    //ja otetaan indeksi talteen
    if (copyPoints[selected] === Math.max(...copyPoints)) {
      console.log('Maxin indeksi:', selected)
      setMaxIndex(selected)
    }
  }
  return (
    <div>
      <h2>Ancedote of the day</h2>
      {props.anecdotes[selected]}
      <br></br>
      has {points[selected]} votes
      <br></br>
      <Button onClick={voteClick} text='vote' />
      <Button onClick={randomClick} text='next anecdot' />
      <h2>Anecdote with most votes</h2>
      {props.anecdotes[maxindex]}
      <br></br>
      has {points[maxindex]} votes
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)
const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]
ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'))
