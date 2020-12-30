import React, { useState, useEffect } from 'react'
import axios from 'axios'


//Maiden renderöimiseen webbisivulle
const RenderCountries = ({ vainFiltteroidytMaat }) => {

  //Tätä ei käytetä tässä ohjelmassa...mahdollista jatkokehitystä varten
  const [filteroidytMaat, setFilteroidytMaat] = useState(vainFiltteroidytMaat)
  //Tällä muuttujalla pidetään yllä klikattua maata
  //Alussa tyhjä, koska halutaan napilla valita mitä maata näytetään
  const [klikattuMaa, setClikattuMaa] = useState('')

  const [currentWeather, setCurrentWeather] = useState([])

  //API Key ja annetaan sovelluksen käynnistyksen yhteydessä
  //Ympäristömuuttujana 
  //set "REACT_APP_API_KEY=10169fa9810f9dcd8d842f36551a9c3b" && npm start
  const api_key = process.env.REACT_APP_API_KEY

  const [url, setUrl] = useState('')


  //Ottaa talteen maan, jota klikattu
  const countryClick = ({ country }) => {
    //Otetaan talteen klikattu maa
    setClikattuMaa(country)
    //Kokeilua varten
    setFilteroidytMaat(country)
    setUrl('http://api.weatherstack.com/current?access_key=' + `${api_key}` + '&query=' + `${country.capital}`)
  }

  //Palautetaan maiden nimet buttoneilla ja näytetään sen maan tiedot
  //jonka buttonia painettu
  return (
    <div>
      <>
        {vainFiltteroidytMaat.map(country => (
          <Button key={country.nativeName} country={country} onClick={() => countryClick({ country })} />
        ))
        }
      </>
      <div>
        <>
          <RenderCountry url={url} key={klikattuMaa.nativeName} countries={klikattuMaa} weather={currentWeather} />
        </>
      </div>
    </div>
  )
}
//Renderöidään Button ja maan nimi buttonin vasemmalle puolelle
const Button = ({ country, onClick }) => {
  return (
    <div>
      <br></br>
      <>{country.name} </>
      <button onClick={onClick}>Show</button>
    </div>
  )
}

//Renderöidään kieli
const RenderLanguage = ({ languages }) => {
  return (
    <div>
      <li>
        {languages}
      </li>
    </div>
  )
}

//Säätiedotuksen renderöinti
const WeatherRender = ({ url }) => {

  const [currentWeather, setCurrentWeather] = useState([])

  const res = axios.get(url)
  const posts = res.data

  const [weather, setWeather] = useState([useEffect(() => {
    axios
      .get(url)
      .then(response => {
        console.log('WeatherRender promise fulfilled')
        setWeather(weather.concat(response.data))
        console.log('Vastauksena tullutdata', response.data)
      })
  }, [])])

  console.log('WeatherRender sää', weather[1])


  return (
    <div>
      <h2>{weather.length}</h2>
    </div>
  )

}
//Yhden maan renderöimiseen
const RenderCountry = ({ countries, weather, url }) => {

  console.log('RenderCountryn url', url)



  //If lause on tarkoitettu tsekkamaan, onko maan vieressä painettu buttonia
  //Tätä if lausetta ei tarvita, kun filteröinnin tuloksena yksi maa FilterCountries
  //Komponentista
  if (countries !== '' && url !== '') {
    console.log('RenderCountryn weather', weather.location)
    const flagUrl = countries.flag
    return (
      <div>
        <h1>{countries.name}</h1>
        <p>Capital: {countries.capital}</p>
        <p>Population: {countries.population}</p>
        <h2>Languages</h2>
        <>
          {countries.languages.map(value => (<RenderLanguage languages={value.name} />))}
        </>
        <img src={flagUrl} width="193" height="130"></img>
        <div>
          <h1>Tähän sää</h1>
          <WeatherRender url={url} />
        </div>
      </div>
    )
  }
  //Jos maan vieressä olevaa buttonia ei ole painettu, lisätään tyhjää
  return (
    <></>
  )
}

//Maiden näyttämiseksi filteröinti
//Key:ksi uniikki arvo
const FilterCountries = ({ countries, howToFilter }) => {

  //Otetaan muuttujaan talten filteröidyt maat
  const filteroidytMaat = countries.filter(country => country.name.toLocaleLowerCase().includes(`${howToFilter}`))
  //If lauseita varten lasketaan filteröityjen maiden määrä
  const count = filteroidytMaat.length

  //Jos filteröityy yli kymmenen maata, pyydetään tarkentamaan hakua
  if (count > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  //Jos alle kymmenen tai enemmän kuin yksi, lähetetään renderöitäväksi
  //maiden listaukseen
  if (count <= 10 && count > 1) {
    return (
      <>
        <RenderCountries vainFiltteroidytMaat={filteroidytMaat} />
      </>
    )
  }

  return (
    <>
      { countries.filter(country => country.name.toLocaleLowerCase().includes(`${howToFilter}`)).map(filteredCountries => (
        <RenderCountry key={filteredCountries.nativeName} countries={filteredCountries} />
      ))
      }
    </>
  )

}

const App = () => {
  //Taulukko maille
  const [countries, setCountries] = useState([])
  //Muuttujia jotka toimivat dynaamisesti change
  const [howToFilter, setHowToFilter] = useState('')

  //Tällä haetaan https://restcountries.eu sivulta kaikki maat
  //EI ole talletettu db.json fileen
  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('Maalistan koko', countries.length, 'countries')



  //Tapahtumankäsittelijää handleNameChange kutsutaan aina kun 
  //syötekomponentissa tapahtuu jotain
  //Tapahtumankäsittelijämetodi saa parametriksi tapahtumaolion event
  const handleFilterChange = (event) => {
    //Tapahtumaolion kenttä target vastaa kontrolloitua input-kenttää.
    //event.target.value viittaa inputin syötekentän arvoon
    console.log(event.target.value.toLowerCase())
    //Muutetaan syöte lower caseksi
    setHowToFilter(event.target.value.toLowerCase())
  }



  return (
    <div>
      <h2>Filter</h2>
      <div>
        filter shown with: <input value={howToFilter} onChange={handleFilterChange} />
      </div>
      <>
        <FilterCountries countries={countries} howToFilter={howToFilter} />
      </>
           ...<div>debugFilterField: {howToFilter}</div>
    </div>
  )
}
export default App

