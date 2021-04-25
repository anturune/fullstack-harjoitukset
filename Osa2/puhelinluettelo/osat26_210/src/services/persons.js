import axios from 'axios'
//Tässä lisätään api URL:iin, koska backend on luotu sellaisena
//Backend löytyy työaseman polusta C:\Users\astur\Documents\Fullstack\HarjoituksetBackEndOsaKolme
//const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = 'http://localhost:3001/persons'

//Haetaan kaikki henkilöoliot ja palautetaan taulukkona
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

//Luodaan uusi persons objecti
const create = newPersonObject => {
    const request = axios.post(baseUrl, newPersonObject)
    return request.then(response => response.data)
}

//Poistetaan persons objecti
const removePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
}

//Päivitetään persons objectia
const updatePerson = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

//Exportataan kaikki muualle käyttöön
export default {
    getAll, 
    create, 
    removePerson, 
    updatePerson
}