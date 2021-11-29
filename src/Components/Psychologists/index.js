import styles from './psychologists.module.css';
import { useState, useEffect } from 'react';
import List from './List';
import Form from './Form';
import Modal from './Modal';
import AvailabilityTable from './AvailabilityTable';
import { PSYCHOLOGIST_FORM, PSYCHOLOGIST_AVAILABILITY } from './utils/psychologist-inputs-utils';

const itemOnEditInitialState = {
  address: '',
  availability: {
    monday: {
      availability: false,
      from: 1200,
      to: 1200
    },
    tuesday: {
      availability: false,
      from: 1200,
      to: 1200
    },
    wednesday: {
      availability: false,
      from: 1200,
      to: 1200
    },
    thursday: {
      availability: false,
      from: 1200,
      to: 1200
    },
    friday: {
      availability: false,
      from: 1200,
      to: 1200
    },
    sunday: {
      availability: false,
      from: 1200,
      to: 1200
    },
    saturday: {
      availability: false,
      from: 1200,
      to: 1200
    }
  },
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  phone: '',
  username: ''
};

function Psychologists() {
  const [psychologists, setPsychologist] = useState([]);
  const [toggleForm, setToggleForm] = useState(false);
  const [itemOnEdit, setItemOnEdit] = useState(itemOnEditInitialState);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [psychologistAvailability, setPsychologistAvailability] = useState({});

  useEffect(() => {
    getPsychologists();
  }, []);

  const getPsychologists = () => {
    fetch(`${process.env.REACT_APP_API}/psychologists`)
      .then((response) => response.json())
      .then((response) => {
        setPsychologist(response.data);
      });
  };

  const toggleFormDisplay = () => {
    setToggleForm(!toggleForm);
    setItemOnEdit(itemOnEditInitialState);
  };

  const toggleModal = (e, psychologist) => {
    if (!showModal) {
      e.stopPropagation();
      setPsychologistAvailability(psychologist.availability);
      setShowModal(!showModal);
    } else {
      setShowModal(!showModal);
    }
  };

  const handleEdit = (psychologist) => {
    toggleFormDisplay();
    setItemOnEdit(psychologist);
    setIsEditing(true);
  };

  const onChange = (e) => {
    if (e.target.name.match(/^(firstName|lastName|username|password|email|address)$/)) {
      setItemOnEdit({
        ...itemOnEdit,
        [e.target.name]: e.target.value
      });
    } else {
      const keys = e.target.name.split('.');
      setItemOnEdit({
        ...itemOnEdit,
        availability: {
          ...itemOnEdit.availability,
          [keys[0]]: {
            ...itemOnEdit.availability[keys[0]],
            [keys[1]]: e.target.value
          }
        }
      });
    }
  };

  const handleSubmit = (item, e) => {
    e.preventDefault();

    // format values before sending to server as input set value type to string
    const formattedAvailability = Object.keys(item.availability).reduce(
      (attrs, day) => ({
        ...attrs,
        [day]: Object.keys(item.availability[day]).reduce(
          (attrs, key) => ({
            ...attrs,
            [key]:
              key === 'availability'
                ? item.availability[day][key] === 'true'
                : parseInt(item.availability[day][key])
          }),
          {}
        )
      }),
      {}
    );

    let url;
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...item, availability: formattedAvailability })
    };

    if (isEditing) {
      console.log('yes');
      options.method = 'PUT';
      url = `${process.env.REACT_APP_API}/psychologists/${item._id}`;
    } else {
      console.log('no');
      options.method = 'POST';
      url = `${process.env.REACT_APP_API}/psychologists`;
    }

    fetch(url, options)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then(() => {
        getPsychologists();
        setToggleForm(!toggleForm);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsEditing(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const url = `${process.env.REACT_APP_API}/psychologists/${id}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status !== 204) {
          return res.json().then((message) => {
            throw new Error(message);
          });
        }
        getPsychologists();
      })
      .catch((error) => error);
  };

  return (
    <section className={styles.container}>
      <h2>Psychologists</h2>
      <div className={styles.formContainer}>
        {toggleForm ? (
          <Form
            inputs={PSYCHOLOGIST_FORM}
            availability={PSYCHOLOGIST_AVAILABILITY}
            toggleFormDisplay={toggleFormDisplay}
            itemOnEdit={itemOnEdit}
            onChange={onChange}
            handleSubmit={handleSubmit}
          />
        ) : (
          <List
            psychologists={psychologists}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            toggleFormDisplay={toggleFormDisplay}
            toggleModal={toggleModal}
          />
        )}
        {showModal && (
          <Modal toggleModal={toggleModal} title="Availability">
            <AvailabilityTable availability={psychologistAvailability} />
          </Modal>
        )}
      </div>
    </section>
  );
}

export default Psychologists;
