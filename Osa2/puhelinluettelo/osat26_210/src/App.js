import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

//Henkilön renderöimiseen webbisivulle delete napilla
const RenderPersons = ({ person, onClick }) => {

    return (
        <div>
            <br></br>
            <>{person.name} {person.number}</>
            <button key={person.id} onClick={onClick}>Delete</button>
        </div>
    )
}
//Tällä muotoillaan notificaatio henkilön poistamiseen
const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}

//Tällä muotoillaan notificaatio henkilön lisämiseen
const NotificationAdded = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="added">
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    //Muuttujia jotka toimivat dynaamisesti change
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [howToFilter, setHowToFilter] = useState('')
    //Notificaatioille tilat
    const [errorMessage, setErrorMessage] = useState(null)
    const [addedMessage, setAddedMessage] = useState(null)
    
    //Tällä haetaan data db.json filestä ja asetetaan persons
    //taulukkoon. Tietokantakysely viety omaan moduuliin src/services/persons.js
    //Tässä käytetään personServiceä, joka importattu
    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    //console.log('Persons tauluko koko', persons.length)

    //Uuden nimen lisäys ja phonenumeron päivitys
    const addName = (event) => {
        //Estää lomakkeen lähetyksen oletusarvoisen toiminnan, 
        //joka aiheuttaisi mm. sivun uudelleenlatautumisen. 
        event.preventDefault()
        //Muuttuja sitä varten, jos henkilö jo phonebookissa
        let nameOnko = ''
        //Annetaan varoitus, jos nimi on jo lisättynä ja pyydetään hyväksymään päivitys
        for (let i = 0; i < persons.length; i++) {
            console.log('Nimet', persons[i])
            if (persons[i].name === newName) {
                //Otetaan nimi talteen, jotta ei tee uutta lisäystä
                nameOnko = newName
                //Confirmoitava alertti, jolla voidaan päättää päivitetäänkö numero vai ei
                if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                    //Luodaan uusi person object
                    //Huom! ei id:tä, koska annetaan se palvelimen vastuulle luoda
                    const updatePersonObject = {
                        name: newName,
                        number: newNumber,
                    }
                    //Viedään uusi person object db.json fileen eli tietokantaan
                    //Tietokanta post action viety omaan moduuliin src/services/persons.js
                    //Tässä käytetään personServiceä, joka imporattu
                    personService
                        .updatePerson(persons[i].id, updatePersonObject)
                        .then(returnedPerson => {
                            //Päivitetään persons taulukkoa niin ettei vanhaa enää sieltä löydy ja lisätään
                            //päivitetty person
                            setPersons(persons.map(person => person.id !== persons[i].id ? person : returnedPerson))
                            //Tyhjätään setNewName ja number kentät
                            setNewName('')
                            setNewNumber('')
                            console.log('Success!')
                            //Sealimeen 5sec viesti, jos päivitys tietokantaan onnistui
                            setAddedMessage('Person ' + `${updatePersonObject.name}` + ' succefully changed')
                            setTimeout(() => {
                                setAddedMessage(null)
                            }, 5000)
                        })
                         //Selaimeen 5sec viesti, jos päivitys tietokantaan ei onnistunut
                         //Esim. poistaa toisella selaimella henkilön ja samaan aikaan yrittää päivittää
                         //Juuri poistetun henkilön tiedot
                        .catch(error => {
                            setErrorMessage('Information of ' + `${updatePersonObject.name}` + ' has already been removed from server')
                            setTimeout(() => {
                                setErrorMessage(null)
                            }, 5000)
                            console.log('Person update failed')
                        })
                }
            }
        }
        //Jos henkilöä ei ole kannassa, niin luodaan uusi Person
        if (nameOnko === '') {
            console.log('Uuden luominen, koska ei ollut kannassa')
            //Luodaan uusi person object
            //Huom! ei id:tä, koska annetaan se palvelimen vastuulle luoda
            const newPersonObject = {
                name: newName,
                number: newNumber,
            }
            //Viedään uusi person object db.json fileen eli tietokantaan
            //Tietokanta post action viety omaan moduuliin src/services/persons.js
            //Tässä käytetään personServiceä, joka imporattu
            personService
                .create(newPersonObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    //Tyhjätään setNewName ja number kentät
                    setNewName('')
                    setNewNumber('')
                    console.log('addName function', returnedPerson)

                })
            //Viesti onnistuneesta lisäyksestä
            setAddedMessage('Person ' + `${newPersonObject.name}` + ' succesfully added')
            console.log(newPersonObject.name)
            //Lisäyksen viestille timeout eli kauanko näkyvillä
            //Ja asetetaan arvoksi sen jälkeen null
            setTimeout(() => {
                setAddedMessage(null)
            }, 5000)
        }
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

    //Henkilön poistaminen
    const removePerson = ({ filteredPerson }) => {
        if (window.confirm("Delete " + `${filteredPerson.name}` + "?")) {
            personService
                .removePerson(filteredPerson.id)
            console.log('removePerson', filteredPerson.id)
            //Päivitetään lista persons eli poistetaan listalata ne jotka poistetaan myös
            //Tietokannasta
            setPersons(persons.filter(item => item.name !== filteredPerson.name))
            //Asetetaan viesti onnistuneesta poistosta
            setErrorMessage('Person ' + `${filteredPerson.name}` + ' succesfully removed')
            //Poiston viestille timeout eli kauanko näkyvillä
            //Ja asetetaan arvoksi sen jälkeen null
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }
    //console.log('Persons listan koko ', persons.length)


    return (
        <div>
            <h2>Phonebook</h2>
            <div>
                filter shown with: <input value={howToFilter} onChange={handleFilterChange} />
            </div>
            <h2>Add a new</h2>
            <Notification message={errorMessage} />
            <NotificationAdded message={addedMessage} />
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
            <div>
                <>
                    {persons.filter(person => person.name.toLocaleLowerCase().includes(`${howToFilter}`)).map(filteredPerson => (
                        <RenderPersons key={filteredPerson.id} person={filteredPerson} onClick={() => removePerson({ filteredPerson })} />
                    ))
                    }
                </>
            </div>
      ...<div>debugNameField: {newName}</div>
      ...<div>debugFilterField: {howToFilter}</div>
        </div>
    )
}
export default App