
import './css/styles.css'
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'
import {fetchCountries} from './fetchCountries.js';

const DEBOUNCE_DELAY = 300

const refs = {
  countryInformation: document.querySelector('.country-info'),
  searchBox: document.querySelector('#search-box'),
   countryList: document.querySelector('.country-list')
 };

refs.searchBox.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY))

function onCountryInput() {
  const name = refs.searchBox.value.trim()
  if (name === '') {
    return (refs.countryList.innerHTML = ''), (refs.countryInformation.innerHTML = '')
  }

  fetchCountries(name)
    .then(countries => {
      refs.countryList.innerHTML = ''
      refs.countryInformation.innerHTML = ''
      if (countries.length === 1) {
        refs.countryList.insertAdjacentHTML('beforeend', makingCountryList(countries))
        refs.countryList.insertAdjacentHTML('beforeend', makingCountryCard(countries))
      } else if (countries.length >= 10) {
        alertTooManyMatches()
      } else {
        refs.countryList.insertAdjacentHTML('beforeend', makingCountryList(countries))
      }
    })
    .catch(alertWrongName)
}

function makingCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
  return markup
}

function makingCountryCard(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('')
  return markup
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name')
}

function alertTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
}

