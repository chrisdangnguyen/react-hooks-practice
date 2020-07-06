import React, { useState, useEffect, useCallback, useReducer, Component } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal'


//useReducer will need to be done outside of the function. because the reducer function won't be recreated everytime the component is
// re-rendering because the reducer function is decoupled from whats happening inside of Component. similar to redux reducer but has no connection with redux library
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients; // return a new list of ingredients which is an array of ignredients replacing the old one 
    case 'ADD':
      return [...currentIngredients, action.ingredient]; //copying the old ingredient and merging it with the new ingredient
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default: //should not get to this case typically because the reducer should return all cases
      throw new Error('Should not get there')
  }
}


const Ingredients = () => {
  //need to initalise the reducer. takes the reducer function and an optional second argument which is the starting state. this case just an empty array
  // dispatching function the action 
  // when working with useReducer, React will re-render the component whenever your reducer returns the new state
  //if you depend on the older state or need to update new state based on some other new state on some other state object then we can useReducer
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  // const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState()

  //useeffect gets run after everything in the component cycle, rendered after and every render cycle
  //useeffect acts like componentDidUpdate: it runs the function after every component update(re-rendered)
  // useeffect takes a 2nd argument, first argument is a function that runs every cycle, the 2nd argument
  // is an array with a dependencies of your function. only when the dependenicies change it will run
  // with an empty array and no external dependencies it will then run only once after the first render

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
    // setUserIngredients(filteredIngredients)
  }, []);


  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    // set new ingredient array. by getting the old array and speading and adding a new element to the ingredient array
    //fecth is a builtin http request. it is defaulted to get, but if provided a 2nd argument pass in object with diffrent method and body
    fetch('https://react-hooks-update-7f5ce.firebaseio.com/ingredients.json', {
      method: 'POST', 
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]); 
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient }})
    });
  }


  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-7f5ce.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      // setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
      dispatch({type: 'DELETE', id: ingredientId})
    }).catch(error => {
      setError(error.message)
      setIsLoading(false)
    });
  }


  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
