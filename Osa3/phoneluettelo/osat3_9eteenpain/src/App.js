import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'


//Henkilön filteröimiseen
const Filter = ({ value, onChange }) => {

    return (
        <div>
            filter shown with: <input value={value} onChange={onChange} />
        </div>
    )
}

//Henkilön renderöimiseen webbisivulle delete napilla
const RenderPersons = ({ person, onClick }) => {
    return (
        <div>
            <RenderPerson person={person} onClick={onClick} />
        </div>
    )
}

//Yksittäisen henkilön renderöiminen delete napilla
const RenderPerson = ({ person, onClick }) => {

    return (
        <div>
            <br></br>
            <>{person.name} {person.number}</>
            <button key={person.id} onClick={onClick}>Delete</button>
        </div>
    )
}

//Lomake Person objectin luomiseen phonebookiin
const PersonForm = ({ valueName, onChangeName, valueNumber, onChangeNumber, onSubmit }) => {

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    Name: <input value={valueName} onChange={onChangeName} />
                </div>
                <div>
                    Number: <input value={valueNumber} onChange={onChangeNumber} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
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
    //Person objectien tilan ylläpitämiseen
    const [persons, setPersons] = useState([])
    //Muuttujia/tilat jotka toimivat dynaamisesti change
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [howToFilter, setHowToFilter] = useState('')
    //Notificaatioille tilat
    const [errorMessage, setErrorMessage] = useState(null)
    const [addedMessage, setAddedMessage] = useState(null)

    //Tällä haetaan data db.json filestä ja/tai Mongosta asetetaan persons
    //taulukkoon. Tietokantakysely viety omaan moduuliin src/services/persons.js
    //Tässä käytetään personServiceä, joka importattu
    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    //Uuden nimen lisäys ja phonenumeron päivitys
    const addName = (event) => {
        //Estää lomakkeen lähetyksen oletusarvoisen toiminnan, 
        //joka aiheuttaisi mm. sivun uudelleenlatautumisen. 
        event.preventDefault()

        //Tällä voitaisiin myös tsekata, onko nimi jo olemassa kannassa
        //Palauttaa joko True tai False
        const personName = persons.find(person => {
            console.log(person.name, person.id, typeof person.name, newName, typeof newName, person.name === newName)
            return person.name === newName
        })
        //Jos nimi jo kannassa, niin otetaan indeksinumero talteen
        //Jos ei ole, arvoksi tulee -1
        const indexNumber = persons.findIndex(person => person.name === newName)
        console.log('löydetyn indeksinumero', indexNumber)

        //Jos indexinumero ei ole -1, -1 tarkoittaisi että ei ole kannassa
        if (indexNumber !== -1) {
            //Confirmoitava alertti, jolla voidaan päättää päivitetäänkö numero vai ei
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                //Luodaan uusi person object
                //Huom! ei id:tä, koska annetaan se palvelimen vastuulle luoda
                const updatePersonObject = {
                    name: newName,
                    number: newNumber,
                }
                //Viedään uusi person object db.json fileen eli tietokantaan sama koodi toimmii myös Mongoon
                //Update toiminto moduulissa src/services/persons.js
                //Tässä käytetään personServiceä, joka importattu
                personService
                    .updatePerson(persons[indexNumber].id, updatePersonObject)
                    .then(returnedPerson => {
                        console.log('MIKÄ ARVO TULEE TAKAISIN', returnedPerson.id)
                        //Päivitetään persons taulukkoa niin ettei vanhaa enää sieltä löydy ja lisätään
                        //päivitetty person
                        setPersons(persons.map(person => person.id !== persons[indexNumber].id ? person : returnedPerson))

                        //Tyhjätään setNewName ja number kentät
                        setNewName('')
                        setNewNumber('')
                        console.log('Success!')
                        console.log('TÄMÄ ID PÄIVITETÄÄN', persons[indexNumber].id)
                        console.log('VAIHTUIKO ID VAI ONKO SAMA', returnedPerson.id)
                        console.log('TÄMÄ NUMERO PÄIVITETÄÄN', persons[indexNumber].number)
                        console.log('TÄKSI NUMEROKSI', returnedPerson.number)
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


        //Jos henkilöä ei ole kannassa, niin luodaan uusi Person
        if (indexNumber === -1) {
            console.log('Uuden luominen, koska ei ollut kannassa')

            //Luodaan uusi person object
            //Huom! ei id:tä, koska annetaan se palvelimen vastuulle luoda
            const newPersonObject = {
                name: newName,
                number: newNumber,
            }
            //Viedään uusi person object db.json fileen eli tietokantaan sama koodi toimmii myös Mongoon
            //Post toiminto moduuliissa src/services/persons.js
            //Tässä käytetään personServiceä, joka imporattu
            let onkoErroria = false
            personService
                .create(newPersonObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    //Tyhjätään setNewName ja number kentät
                    setNewName('')
                    setNewNumber('')
                    console.log('addName function', returnedPerson)
                })
                //Otetaan Mongon validaattorin virhe talteen ja tulosteaan frontendiin
                .catch(error => {
                    if (error.name === 'Error') {
                        //Jos päätyy virheeseen, niin muutetaan onkoErroria muuttujaa
                        onkoErroria = true
                        // pääset käsiksi palvelimen palauttamaan virheilmoitusolioon näin
                        //HUOM! Lopussa vielä ".error", koska palvelin palauttaa error olion
                        setErrorMessage(error.response.data.error)
                        //Selaimeen voi palauttaa olion ja siksi tässä jätetty lopusta ".error" pois
                        console.log('VIRHEVIESTI', error.response.data)
                        console.log('VIRHEVIESTI NAME', error.name)
                        console.log('1. ONKO ERRORIA TRUE VAI FALSE', onkoErroria)
                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 5000)
                    }
                })
            console.log('2. ONKO ERRORIA TRUE VAI FALSE', onkoErroria)
            //Jos ei päädy validation erroriin annetaan successfull viesti
            if (onkoErroria===false) {
                //Viesti onnistuneesta lisäyksestä
                setAddedMessage('Person ' + `${newPersonObject.name}` + ' succesfully added')
                console.log(newPersonObject.name)
                //Lisäyksen viestille timeout eli kauanko näkyvillä
                //Ja asetetaan arvoksi sen jälkeen null ettei viestiä näy 5sec jälkeen
                setTimeout(() => {
                    setAddedMessage(null)
                }, 5000)
            }


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
    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={howToFilter} onChange={handleFilterChange} />

            <h2>Add a new</h2>
            <Notification message={errorMessage} />
            <NotificationAdded message={addedMessage} />
            <PersonForm valueName={newName} onChangeName={handleNameChange} valueNumber={newNumber} onChangeNumber={handleNumberChange} onSubmit={addName} />

            <h2>Numbers</h2>
            <>
                {persons.filter(person => person.name.toLocaleLowerCase().includes(`${howToFilter}`)).map(filteredPerson => (
                    <RenderPersons key={filteredPerson.id} person={filteredPerson} onClick={() => removePerson({ filteredPerson })} />
                ))
                }
            </>

      ...<div>debugNameField: {newName}</div>
      ...<div>debugFilterField: {howToFilter}</div>
        </div>

    )
}
export default App