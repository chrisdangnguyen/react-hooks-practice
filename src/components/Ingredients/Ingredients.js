// import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';

// import IngredientForm from './IngredientForm';
// import IngredientList from './IngredientList';
// import Search from './Search';
// import ErrorModal from '../UI/ErrorModal';
// import useHttp from '../../hooks/http'


// //useReducer will need to be done outside of the function. because the reducer function won't be recreated everytime the component is
// // re-rendering because the reducer function is decoupled from whats happening inside of Component. similar to redux reducer but has no connection with redux library
// const ingredientReducer = (currentIngredients, action) => {
//   switch (action.type) {
//     case 'SET':
//       return action.ingredients; // return a new list of ingredients which is an array of ignredients replacing the old one 
//     case 'ADD':
//       return [...currentIngredients, action.ingredient]; //copying the old ingredient and merging it with the new ingredient
//     case 'DELETE':
//       return currentIngredients.filter(ing => ing.id !== action.id);
//     default: //should not get to this case typically because the reducer should return all cases
//       throw new Error('Should not get there')
//   }
// }


// const Ingredients = () => {

//   //need to initalise the reducer. takes the reducer function and an optional second argument which is the starting state. this case just an empty array
//   // dispatching function the action 
//   // when working with useReducer, React will re-render the component whenever your reducer returns the new state
//   //if you depend on the older state or need to update new state based on some other new state on some other state object then we can useReducer
//   const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
//   const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp();
//   // const [userIngredients, setUserIngredients] = useState([]);
//   // const [isLoading, setIsLoading] = useState(false);
//   // const [error, setError] = useState()

//   //useeffect gets run after everything in the component cycle, rendered after and every render cycle
//   //useeffect acts like componentDidUpdate: it runs the function after every component update(re-rendered)
//   // useeffect takes a 2nd argument, first argument is a function that runs every cycle, the 2nd argument
//   // is an array with a dependencies of your function. only when the dependenicies change it will run
//   // with an empty array and no external dependencies it will then run only once after the first render

//   useEffect(() => {
//     if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
//       dispatch({type: 'DELETE', id: reqExtra });
//     } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
//       dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra }})
//     }
//   }, [data, reqExtra, reqIdentifier, isLoading, error]);


//   const filteredIngredientsHandler = useCallback(filteredIngredients => {
//     dispatch({ type: 'SET', ingredients: filteredIngredients })
//     // setUserIngredients(filteredIngredients)
//   }, []);


//   const addIngredientHandler = useCallback(ingredient => {
//     sendRequest('https://react-hooks-update-7f5ce.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD_INGREDIENT');
//     // setIsLoading(true);
//     // dispatchHttp({type: 'SEND'})
//     // // set new ingredient array. by getting the old array and speading and adding a new element to the ingredient array
//     // //fecth is a builtin http request. it is defaulted to get, but if provided a 2nd argument pass in object with diffrent method and body
//     // fetch('https://react-hooks-update-7f5ce.firebaseio.com/ingredients.json', {
//     //   method: 'POST', 
//     //   body: JSON.stringify(ingredient),
//     //   headers: {'Content-Type': 'application/json'}
//     // }).then(response => {
//     //   // setIsLoading(false);
//     //   dispatchHttp({type: 'RESPONSE'})
//     //   return response.json();
//     // }).then(responseData => {
//     //   // setUserIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]); 
//     //   dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient }})
//     // });
//   },[sendRequest]);


//   const removeIngredientHandler = useCallback(ingredientId => {
//     // setIsLoading(true);
//     // dispatchHttp({ type: 'SEND' })
//     sendRequest(`https://react-hooks-update-7f5ce.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE', null, ingredientId, 'REMOVE_INGREDIENT')
//   }, [sendRequest]);


//   // const clearError = useCallback(() => {
//     // setError(null);
//     // dispatchHttp({type: 'CLEAR'})
//   // }, []);

//   const ingredientList = useMemo(() => {
//     return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
//   }, [userIngredients, removeIngredientHandler])

//   return (
//     <div className="App">
//       {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
//       <IngredientForm 
//         onAddIngredient={addIngredientHandler}
//         loading={isLoading}/>

//       <section>
//         <Search onLoadIngredients={filteredIngredientsHandler} />
//         {ingredientList}
//       </section>
//     </div>
//   );
// }

// export default Ingredients;

import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifer,
    clear
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra }
      });
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-update-7f5ce.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(
    ingredientId => {
      sendRequest(
        `https://react-hooks-update-7f5ce.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;