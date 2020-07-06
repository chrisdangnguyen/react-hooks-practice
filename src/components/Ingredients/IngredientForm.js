import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  // usestate have to be used in your functional component, useState can be anything object, string, number, etc. doesn't have to be object. always return an array with two elements. 
  // first element is the current state snap shot, second element is function allowing to update the current state
  // do array destructuring 
  //useState cant be used in functions or in if statements. it needs to be on the root of the functional component or root level of other hooks
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');



  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount})

  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={event => {
                // console.log(enteredTitle)
                // console.log(setEnteredTitle(event.target.value))
                setEnteredTitle(event.target.value)
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={event => {
                // console.log(event)
                // console.log(setEnteredAmount(event.target.value))
                setEnteredAmount(event.target.value)}}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
