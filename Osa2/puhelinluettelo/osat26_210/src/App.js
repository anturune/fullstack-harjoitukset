import React, { useState, useEffect } from 'react'
import axios from 'axios'

//Henkilön renderöimiseen webbisivulle
const RenderPersons = ({ persons }) => {
    console.log('Header komponentti', persons.name)
    return (
        <div>
            <p>{persons.name} {persons.number}</p>
        </div>
    )
}
//Henkilöiden näyttämiseksi filteröinti
const FilterPersons = ({ persons, howToFilter }) => {
    console.log('Filter Persons komponentti', howToFilter)
    return (
        <>
            { persons.filter(person => person.name.toLocaleLowerCase().includes(`${howToFilter}`)).map(filteredPersons => (
                <RenderPersons key={filteredPersons.id} persons={filteredPersons} />
            ))
            }
        </>
    )
}


const App = () => {
    const [persons, setPersons] = useState([])
    //Muuttujia jotka toimivat dynaamisesti change
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [howToFilter, setHowToFilter] = useState('')

    //Tällä haetaan data db.json filestä ja asetetaan persons
    //taulukkoon
    useEffect(() => {
        console.log('effect')
        axios
          .get('http://localhost:3001/persons')
          .then(response => {
            console.log('promise fulfilled')
            setPersons(response.data)
          })
      }, [])
    

    const addName = (event) => {
        //Estää lomakkeen lähetyksen oletusarvoisen toiminnan, 
        //joka aiheuttaisi mm. sivun uudelleenlatautumisen. 
        event.preventDefault()
        //Annetaan varoitus, jos nimi on jo lisättynä
        for (let i = 0; i < persons.length; i++) {
            console.log('Nimet', persons[i])
            if (persons[i].name === newName) {
                //Huom erilaiset heittomerkit {newName}:n vuoksi
                return window.alert(`${newName} is already added to phonebook`)
            }
        }
        //Luodaan uusi person object
        const personObject = {
            name: newName,
            number: newNumber,
            id: persons.length + 1
        }
        //Concat komennolla luodaan uusi taulukko eikä muuteta olemassa
        //Olevan taulukon tilaa
        setPersons(persons.concat(personObject))
        //Tyhjää kentät
        setNewName('')
        setNewNumber('')
        console.log('button clicked', event.target)
    }

    //Tapahtumankäsittelijää handleNameChange kutsutaan aina kun 
    //syötekomponentissa tapahtuu jotain
    //Tapahtumankäsittelijämetodi saa parametriksi tapahtumaolion event
    const handleNameChange = (event) => {
        //Tapahtumaolion kenttä target vastaa kontrolloitua input-kenttää.
        //event.target.value viittaa inputin syötekentän arvoon
        console.log(event.target.value)
        setNewName(event.target.value)
    }
    const handleNumberChange = (event) => {
        //Tapahtumaolion kenttä target vastaa kontrolloitua input-kenttää.
        //event.target.value viittaa inputin syötekentän arvoon
        console.log(event.target.value)
        setNewNumber(event.target.value)
    }
    const handleFilterChange = (event) => {
        //Tapahtumaolion kenttä target vastaa kontrolloitua input-kenttää.
        //event.target.value viittaa inputin syötekentän arvoon
        console.log(event.target.value.toLowerCase())
        //Muutetaan syöte lower caseksi
        setHowToFilter(event.target.value.toLowerCase())
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <div>
                filter shown with: <input value={howToFilter} onChange={handleFilterChange} />
            </div>
            <h2>add a new</h2>
            <form onSubmit={addName}>
                <div>
                    Name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    Number: <input value={newNumber} onChange={handleNumberChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>

            <h2>Numbers</h2>
            <>
                <FilterPersons persons={persons} howToFilter={howToFilter} />
            </>
      ...<div>debugNameField: {newName}</div>
      ...<div>debugFilterField: {howToFilter}</div>
        </div>
    )

}
export default App