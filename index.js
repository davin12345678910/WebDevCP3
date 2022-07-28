/*
 * Name: Davin Win Kyi
 * Date: April 17th, 2022
 * Section: CSE 154 AH
 * This is the JavaScript code for my poke battle simulator.
 * It gives my website th ebeahvior it needs
 */

// We will need this for JS files in CSE 154
"use strict";

(function() {
  window.addEventListener('load', init);

  /**
   * These are variables that we will be saving
   * for later use
   */

  // These are for the url
  const POKE_INFO_URL = "https://pokeapi.co/api/v2/";
  let pokeObject;

  // This is for the timer
  let firstTimerID;

  // These are to keep track of the info of the current two pokemon
  let firstPokemonChosen;
  let secondPokemonChosen;
  let firstPokemonHP;
  let secondPokemonHP;
  let firstPokemonDamage;
  let secondPokemonDamage;
  let firstPokemonAttack;
  let secondPokemonAttack;
  let firstPokemonAccuracy;
  let secondPokemonAccuracy;

  /**
   * This is the initalization function.
   */
  async function init() {

    // Here you will need to fetch the pokemon data
    let url = POKE_INFO_URL + "pokemon?limit=1126&offset=0";

    // Here you will have the header of the code
    createHeader();

    let startButton = id('start');
    let newPair = id('new-pair');

    startButton.disabled = true;
    newPair.disabled = true;

    // Here you will want to do the rest and fetch the url, and use the info
    await fetch(url)
      .then(handleError)
      .then(res => res.json())
      .then(processData)
      .catch(errorScreen);

    startButton.disabled = false;

    // Here you will want to addEventListeners to the buttons
    startButton.addEventListener('click', startMatch);
    newPair.addEventListener('click', newMatch);
  }

  /**
   * This is to set the javascript object that contains info about all pokemon
   * @param {let} data This is the javascript object that contains the information for all pokemon
   */
  function processData(data) {
    pokeObject = data;
  }

  /**
   * This will create the header of the code
   */
  function createHeader() {
    let buttonSection = document.createElement('section');
    buttonSection.id = "buttons";
    let header = document.createElement('h1');
    header.textContent = "Random Pokemon Match Simulator";

    let startButton = document.createElement('button');
    startButton.textContent = "New Match!";
    startButton.id = "start";

    let newPair = document.createElement('button');
    newPair.textContent = "New Pair!";
    newPair.id = "new-pair";

    id('heading').appendChild(header);
    buttonSection.appendChild(startButton);
    buttonSection.appendChild(newPair);
    id('heading').appendChild(buttonSection);
  }

  /**
   * This allows us to refresh wqhen a new match is to be made
   */
  function newMatch() {
    id('pokemon-chosen').innerHTML = "";
    id('start-battle').innerHTML = "";
    startMatch();
  }

  /**
   * Here we will generate two random pokemon that will be chosen for the match
   */
  function startMatch() {
    const numberOfPokemon = 898;

    let startButton = id('start');
    startButton.disabled = true;

    // This is to give us some random pokemon, out of all that are currently available
    const firstPokemon = Math.floor(Math.random() * numberOfPokemon) + 1;
    const secondPokemon = Math.floor(Math.random() * numberOfPokemon) + 1;

    let pokeArray = pokeObject['results'];

    firstPokemonChosen = pokeArray[parseInt(firstPokemon)];
    secondPokemonChosen = pokeArray[parseInt(secondPokemon)];

    // This is to display the pokemon that were chosen on the screen
    displayPoke(firstPokemonChosen, secondPokemonChosen, firstPokemon + 1, secondPokemon + 1);
  }

  /**
   * This is to display the pokemon that are to be in a match
   * @param {let} firstPokemonC This is the javascript object of the first pokemon
   * @param {let} secondPokemonC This is the javascript object of the second pokemn
   * @param {let} firstPokemon This is the number of the first pokemon
   * @param {let} secondPokemon This is the number of the second pokemon
   */
  function displayPoke(firstPokemonC, secondPokemonC, firstPokemon, secondPokemon) {
    let pokemonChosenSection = id('pokemon-chosen');
    pokemonChosenSection.classList.add('pokemon-chosen');

    // Create two div elements, and then you are going to append them to the pokemonChosenSection
    let firstDiv = document.createElement('div');
    let secondDiv = document.createElement('div');

    // This is the image that will represent the first pokemon
    let firstPokemonImage = createPokeImage(firstPokemon);

    // This will get the name of the first pokemon
    let firstPokemonName = createPokeName(firstPokemonC);

    // Here we will append the information needed for the first pokemon into a div
    firstDiv.appendChild(firstPokemonImage);
    firstDiv.appendChild(firstPokemonName);

    // This will get the image of the second pokemon
    let secondPokemonImage = createPokeImage(secondPokemon);

    // This will get the name of the second pokemon
    let secondPokemonName = createPokeName(secondPokemonC);

    // Here we will append the information needed for the second pokemon
    secondDiv.appendChild(secondPokemonImage);
    secondDiv.appendChild(secondPokemonName);

    // WE will append the two new pokemon
    pokemonChosenSection.appendChild(firstDiv);
    pokemonChosenSection.appendChild(secondDiv);

    // We will disable the new-pair button
    id('new-pair').disabled = false;

    /**
     * Here we will create a start-battle section,
     * where the user can press a button to start the battle
     */
    let startBattleSection = id('start-battle');
    let startMatchButton = document.createElement('button');
    startMatchButton.textContent = "start battle!";
    startBattleSection.appendChild(startMatchButton);
    startMatchButton.addEventListener('click', function() {
      startBattle(firstPokemonC, secondPokemonC, firstPokemon, secondPokemon);
    });
    id('start-battle').classList.add('pokemon-chosen');
  }

  /**
   * This will help us get an image of the current pokemon
   * @param {let} pokemonNumber This will be the pokemon No. that we will try to get an image of
   * @returns {let} an img element that represent the current pokemon
   */
  function createPokeImage(pokemonNumber) {
    const ten = 10;
    const hundred = 100;
    const numberOfPokemon = 898;
    let pokemonImage = document.createElement('img');

    // Here we will create the url of the image
    let pokemonImageURL = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";
    if (pokemonNumber < ten) {
      pokemonImageURL += "00" + pokemonNumber;
    } else if (pokemonNumber < hundred && pokemonNumber >= ten) {
      pokemonImageURL += "0" + pokemonNumber;
    } else if (pokemonNumber <= numberOfPokemon && pokemonNumber >= hundred) {
      pokemonImageURL += pokemonNumber;
    }
    pokemonImageURL += ".png";
    pokemonImage.src = pokemonImageURL;
    return pokemonImage;
  }

  /**
   * This will allow us to get the name of the current pokemon
   * @param {let} pokemonChosen this is the javascript object of the current pokemon
   * @returns {let} the name of the curent pokemon that was chosen
   */
  function createPokeName(pokemonChosen) {
    let pokemonName = document.createElement('p');
    pokemonName.textContent = pokemonChosen.name;
    pokemonName.classList.add('name');
    return pokemonName;
  }

  /**
   * This will allow us to start the battle between the two chosen pokemon
   * @param {let} firstPokemonC This is the object of the first pokemon that was chosen
   * @param {let} secondPokemonC This is the object of the second pokemon that was chosen
   * @param {let} firstPokemon this is the number of the first pokemon chosen
   * @param {let} secondPokemon this is the number of the second pokemon chosen
   */
  async function startBattle(firstPokemonC, secondPokemonC, firstPokemon, secondPokemon) {
    // We will clear the home page
    startBattlePage();

    // Here we will be setting up the battle
    let heading = id('heading');
    let paragraph = document.createElement('p');
    paragraph.classList.add("name");
    paragraph.textContent = "Note: Play on full screen";
    paragraph.id = "note";
    heading.appendChild(paragraph);

    // we will need to have two div elements
    let firstPokemonImage = createPokeImage(firstPokemon);
    firstPokemonImage.id = "first-pokemon-image";
    let secondPokemonImage = createPokeImage(secondPokemon);
    secondPokemonImage.id = "second-pokemon-image";

    // This will allow us to get the hps of the first two pokemon
    await getHPData(firstPokemonC, secondPokemonC);

    // This is to append the pokemon on to the battlefield
    appendPokemonToBattleField(firstPokemonImage, secondPokemonImage);

    // This is to get the loading screen
    loadingScreen();

    // This is to start the simulation
    startSimulation();
  }

  /**
   * This is to start the battlefield page
   */
  function startBattlePage() {
    id('heading').innerHTML = "";
    id('start-battle').innerHTML = "";
    id('pokemon-chosen').innerHTML = "";
    id('body').classList.add('battleField');
  }

  /**
   * This is to load the loading screen
   */
  function loadingScreen() {
    let loadingScreenParagraph = document.createElement('p');
    loadingScreenParagraph.textContent = "LOADING...";
    loadingScreenParagraph.id = "loading-screen";
    id('battle-field').appendChild(loadingScreenParagraph);
  }

  /**
   * This will allow us to start the battle simulation
   */
  function startSimulation() {
    const sixT = 6000;
    const eightT = 8000;
    setTimeout(function() {
      id('loading-screen').remove();
    }, sixT);
    firstTimerID = setInterval(function() {
      attack1();
    }, eightT);
  }

  /**
   * This is to append the pokmeon on to the battlefield
   * @param {let} firstPokemonImage This is the first pokemon's image
   * @param {let} secondPokemonImage This is the second pokemon's image
   */
  function appendPokemonToBattleField(firstPokemonImage, secondPokemonImage) {
    let battleField = id('battle-field');
    let firstDiv = newPokemonDivCreate(firstPokemonImage, 1);
    let secondDiv = newPokemonDivCreate(secondPokemonImage, 2);
    battleField.appendChild(firstDiv);
    battleField.appendChild(secondDiv);
  }

  /**
   * This will give us the div of the first pokemon in the battlefield
   * @param {img} currentPokemonImage This is the img of the first pokemon that will be in div
   * @param {let} number This is the number of the current pokemon
   * @returns {let} a div element with the representation of the first pokemon in the battlefield
   */
  function newPokemonDivCreate(currentPokemonImage, number) {
    let currentDiv = document.createElement('div');

    // This will represent the hp of the first pokemon
    let hpParagraph = document.createElement('p');
    hpParagraph.id = "hp-paragraph-" + number;
    hpParagraph.textContent = "HP ";
    hpParagraph.classList.add('hp');
    let hpSpan = document.createElement('span');
    hpSpan.id = "hp-" + number;
    hpParagraph.appendChild(hpSpan);

    // This will represent the attack of the first pokemon
    let attackParagraph = document.createElement('p');
    attackParagraph.id = "attack-" + number;
    attackParagraph.classList.add('game-text');
    attackParagraph.textContent = "Attack-used: ";

    // This is to add the hp of the pokemon
    if (number === 1) {
      hpSpan.value = firstPokemonHP;
      hpSpan.textContent = firstPokemonHP;
      currentDiv.classList.add('firstPokemon');
      currentDiv.id = "first-pokemon";
    } else {
      hpSpan.value = secondPokemonHP;
      hpSpan.textContent = secondPokemonHP;
      currentDiv.classList.add('secondPokemon');
      currentDiv.id = "second-pokemon";
    }

    // Here we will append the needed information to the pokemon's div
    hpSpan.classList.add('hp');
    currentDiv.appendChild(attackParagraph);
    currentDiv.appendChild(currentPokemonImage);
    currentDiv.appendChild(hpParagraph);
    return currentDiv;
  }

  /**
   * This will help us get hp data
   * @param {let} firstPokemonC This is the javascript object of the first pokemon chosen
   * @param {let} secondPokemonC This is the javascript obkect of the second pokemon chosen
   */
  async function getHPData(firstPokemonC, secondPokemonC) {
    let pokemonOneHPURL = POKE_INFO_URL + "pokemon/" + firstPokemonC.name;
    await fetch(pokemonOneHPURL)
      .then(handleError)
      .then(res => res.json())
      .then(firstHP)
      .catch(errorScreen);

    let pokemonTwoHPURL = POKE_INFO_URL + "pokemon/" + secondPokemonC.name;
    await fetch(pokemonTwoHPURL)
      .then(handleError)
      .then(res => res.json())
      .then(secondHP)
      .catch(errorScreen);
  }

  /**
   * This will help us get the hp data for the first pokemon
   * @param {let} res This will allow us to get the hp
   */
  function firstHP(res) {
    const firstHPFound = parseInt(res['base_experience']);
    firstPokemonHP = firstHPFound;
  }

  /**
   * This will help us get the hp data of the second pokemon
   * @param {let} res this will allow us to get the hp
   */
  function secondHP(res) {
    const secondHPFound = parseInt(res['base_experience']);
    secondPokemonHP = secondHPFound;
  }

  // THIS IS THE ATTACK CODE SECTION

  /**
   * This will simulate the attack of the first pokemon
   */
  async function attack1() {
    const fourT = 4000;
    id('first-pokemon-image').classList.remove('shake');
    let currentHp = parseInt(id('hp-2').value);
    let pokemonOneHPURL = POKE_INFO_URL + "pokemon/" + firstPokemonChosen.name;
    await fetch(pokemonOneHPURL)
      .then(handleError)
      .then(res => res.json())
      .then(firstPokemonMove)
      .catch(errorScreen);
    id('attack-1').textContent = "Attack used: " + firstPokemonAttack;
    let newHP = currentHp - firstPokemonDamage;

    // This will update the hp of the first pokemon
    hpUpdateFirstPokemon(newHP);

    if (newHP > 0) {
      setTimeout(attack2, fourT);
    }
  }

  /**
   * This will allow us to get the move of the first pokemon
   * @param {let} res This is the javascript object that will allow us to get info on moves
   */
  async function firstPokemonMove(res) {
    let chosenMove = res['moves'].length;
    let randomMovePokemonOne = Math.floor(chosenMove * Math.random());

    // Get the name of the move of the first pokemon
    firstPokemonAttack = res['moves'][randomMovePokemonOne]['move']['name'];

    // Now we will be fetching the damage of the move
    let url = res['moves'][randomMovePokemonOne]['move']['url'];
    await fetch(url)
      .then(handleError)
      .then(data => data.json())
      .then(getDamageFirstPokemon)
      .catch(errorScreen);

  }

  /**
   * This will allow us to get the damage of the move of the first pokemon and accuracy
   * @param {let} res This will allow us to get the damage of the move and accuracy
   */
  async function getDamageFirstPokemon(res) {
    firstPokemonDamage = res['power'];
    firstPokemonAccuracy = res['accuracy'];

    if (firstPokemonDamage === null) {
      let pokemonOneHPURL = POKE_INFO_URL + "pokemon/" + firstPokemonChosen.name;
      await fetch(pokemonOneHPURL)
        .then(handleError)
        .then(data => data.json())
        .then(firstPokemonMove)
        .catch(errorScreen);
    }
  }

  /**
   * This is for the second pokemon's attack
   */
  async function attack2() {
    id('second-pokemon-image').classList.remove('shake');
    let pokemonSecondHPURL = POKE_INFO_URL + "pokemon/" + secondPokemonChosen.name;
    await fetch(pokemonSecondHPURL)
      .then(handleError)
      .then(res => res.json())
      .then(secondPokemonMove)
      .catch(errorScreen);
    let currentHp = parseInt(id('hp-1').value);
    id('attack-2').textContent = "Attack used: " + secondPokemonAttack;
    let newHP = currentHp - secondPokemonDamage;

    // This will update the hp of the second pokemon
    hpUpdateSecondPokemon(newHP);
  }

  /**
   * This will update the hp information of the first pokemon
   * @param {let} newHP HP of the first pokemon
   */
  function hpUpdateFirstPokemon(newHP) {
    const twoT = 2000;
    const oneT = 1000;
    let missed = Math.random();
    if (missed <= firstPokemonAccuracy) {

      // If we get to here, then we will say fainted
      if (newHP <= 0) {
        let newMessage = document.createElement('p');
        newMessage.textContent = "FAINTED";
        newMessage.classList.add('fainted');
        id('hp-paragraph-2').parentNode.replaceChild(newMessage, id('hp-paragraph-2'));
        newMessage.id = "hp-paragraph-2";
        clearInterval(firstTimerID);
        setTimeout(function() {
          completedBattleAttack(1);
        }, twoT);
      } else {
        id('second-pokemon-image').classList.add('shake');
        id('hp-2').value = newHP;
        id('hp-2').textContent = newHP;
      }

    // Here we will give a miss message if the pokemon missed
    } else {
      let newMessage = document.createElement('p');
      newMessage.textContent = "MISSSED";
      newMessage.classList.add('missed');
      id('second-pokemon').appendChild(newMessage);
      setTimeout(function() {
        newMessage.remove();
      }, oneT);
    }
  }

  /**
   * Here we will give the updated hp of the second pokemon
   * @param {let} newHP This is the newHP of the pokemon
   */
  function hpUpdateSecondPokemon(newHP) {
    const twoT = 2000;
    const oneT = 1000;
    let missed = Math.random();
    if (missed <= secondPokemonAccuracy) {

      // If we get to here, then we will say fainted
      if (newHP <= 0) {
        let newMessage = document.createElement('p');
        newMessage.textContent = "FAINTED";
        newMessage.classList.add('fainted');
        id('hp-paragraph-1').parentNode.replaceChild(newMessage, id('hp-paragraph-1'));
        newMessage.id = "hp-paragraph-1";
        clearInterval(firstTimerID);
        setTimeout(function() {
          completedBattleAttack(2);
        }, twoT);

      } else {
        id('first-pokemon-image').classList.add('shake');
        id('hp-1').value = newHP;
        id('hp-1').textContent = newHP;
      }

    // This is if the attack missed
    } else {
      let newMessage = document.createElement('p');
      newMessage.textContent = "MISSSED";
      newMessage.classList.add('missed');
      id('first-pokemon').appendChild(newMessage);
      setTimeout(function() {
        newMessage.remove();
      }, oneT);
    }
  }

  /**
   * This will allow us to get information about the current move of pokemon 2
   * @param {let} res This is the javascript object with information about the move
   */
  async function secondPokemonMove(res) {
    let chosenMove = res['moves'].length;
    let randomMovePokemonTwo = Math.floor(chosenMove * Math.random());
    secondPokemonAttack = res['moves'][randomMovePokemonTwo]['move']['name'];
    let url = res['moves'][randomMovePokemonTwo]['move']['url'];
    await fetch(url)
      .then(handleError)
      .then(data => data.json())
      .then(getDamageSecondPokemon)
      .catch(errorScreen);
  }

  /**
   * Here we will get the damage and the accuracy of the move for the 2nd pokemon
   * @param {let} res This is the javascript object that will give us info on the move
   */
  async function getDamageSecondPokemon(res) {
    secondPokemonDamage = res['power'];
    secondPokemonAccuracy = res['accuracy'];

    if (secondPokemonDamage === null) {
      let pokemonSecondHPURL = POKE_INFO_URL + "pokemon/" + secondPokemonChosen.name;
      await fetch(pokemonSecondHPURL)
        .then(handleError)
        .then(data => data.json())
        .then(secondPokemonMove)
        .catch(errorScreen);
    }
  }

  /**
   * This will allow us to complete the battle, and highlight the pokemon that won
   * @param {let} num This is the number of the pokemon first/second
   */
  function completedBattleAttack(num) {

    // We will highlight which pokemon won here
    if (num === 1) {
      id('first-pokemon').classList.add('highlight');
    } else {
      id('second-pokemon').classList.add('highlight');
    }

    // Here we will want to remove the paragraphs
    id('hp-paragraph-1').remove();
    id('hp-paragraph-2').remove();
    id('attack-1').remove();
    id('attack-2').remove();
    id('note').remove();

    // This will allow the user to restart for a new game if they want
    let restartButton = document.createElement('button');
    restartButton.textContent = "New Match";
    id('battle-field').appendChild(restartButton);

    // This will restart when clicked
    restartButton.addEventListener('click', restart);
  }

  /**
   * This will allow us to restart a new match, this is called when the restart button is clicked
   */
  function restart() {

    // We will want to clear the content from all of the sections, and then call init
    id('battle-field').innerHTML = "";
    id('restart-button').innerHTML = "";
    init();
  }

  /**
   * This is where we will give an error message, we will need to fix this up
   */
  function errorScreen() {
    const threeT = 3000;
    let errorMessage = document.createElement('p');
    errorMessage.classList.add('error');
    errorMessage.textContent = "Error Found! Refreshing webpage";
    id('battle-field').innerHTML = "";
    id('pokemon-chosen').innerHTML = "";
    id('error-section').appendChild(errorMessage);

    setTimeout(function() {
      errorMessage.remove();
      init();
    }, threeT);
  }

  /**
   * Here we will check if any errors occured while fetching data
   * @param {let} res This is the javascript object we will be checking for errors
   * @returns {let} the javascript object if valid and an error if not valid
   */
  async function handleError(res) {
    if (!res.ok) {
      throw new Error(await res.json());
    }

    // else you will just return the result
    return res;
  }

  /**
   * This allows you to simplfy the amount of work needed to get an element with an id
   * @param {let} id This is the id of the document that we want to get
   * @returns {let} the element with the passed in id
   */
  function id(id) {
    return document.getElementById(id);
  }
})();
