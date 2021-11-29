import React from 'react';
import styles from './form.module.css';

const Form = ({ inputs, availability, toggleFormDisplay, itemOnEdit, onChange, handleSubmit }) => {
  return (
    <form className={styles.form} onSubmit={(e) => handleSubmit(itemOnEdit, e)}>
      {inputs.map((input) => (
        <input
          key={input.inputName}
          type={input.type}
          name={input.inputName}
          placeholder={input.placeholder}
          value={itemOnEdit[input.inputName]}
          onChange={onChange}
        />
      ))}
      <h3>Availability</h3>
      {availability.map((item, i) => (
        <div className={styles.availabilityForm} key={i}>
          <label key={item.label}>{item.label}</label>
          <input
            key={item.day.inputName}
            type={item.day.type}
            name={item.day.inputName}
            placeholder={item.day.placeholder}
            value={itemOnEdit.availability[item.label].availability}
            onChange={onChange}
            className={styles.availabilityInput}
          />
          <input
            key={item.from.inputName}
            type={item.from.type}
            name={item.from.inputName}
            placeholder={item.from.placeholder}
            value={itemOnEdit.availability[item.label].from}
            onChange={onChange}
            className={styles.availabilityInput}
          />
          <input
            key={item.to.inputName}
            type={item.to.type}
            name={item.to.inputName}
            placeholder={item.to.placeholder}
            value={itemOnEdit.availability[item.label].to}
            onChange={onChange}
            className={styles.availabilityInput}
          />
        </div>
      ))}

      <input type="submit" value="Submit" name="submit"></input>
      <input type="button" value="Cancel" name="cancel" onClick={toggleFormDisplay}></input>
    </form>
  );
};

export default Form;
