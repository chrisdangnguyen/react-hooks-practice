import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  //useeffect gets run after everything in the component cycle, rendered after and every render cycle
  //useeffect acts like componentDidUpdate: it runs the function after every component update(re-rendered)
  // useeffect takes a 2nd argument, first argument is a function that runs every cycle, the 2nd argument
  // is an array with a dependencies of your function. only when the dependenicies change it will run
  useEffect(() => {
    fetch('https://react-hooks-update-7f5ce.firebaseio.com/ingredients.json')
      .then(response => {
        return response.json()
      })
      .then(responseData => {
        const loadingIngredients = [];
        for (const key in responseData) {
          loadingIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
        }
        // setUserIngredients(loadingIngredients);
      })
  }, []);


  const addIngredientHandler = ingredient => {
    // set new ingredient array. by getting the old array and speading and adding a new element to the ingredient array
    //fecth is a builtin http request. it is defaulted to get, but if provided a 2nd argument pass in object with diffrent method and body
    fetch('https://react-hooks-update-7f5ce.firebaseio.com/ingredients.json', {
      method: 'POST', 
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]); 
    });
  }

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
