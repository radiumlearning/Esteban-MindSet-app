import { useEffect, useState } from 'react';
import styles from './applications.module.css';
import Modal from './Modal';
import Button from '../Shared/Button';
import { Link, useHistory } from 'react-router-dom';

function Applications() {
  const [showModal, setShowModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [applications, setApplications] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const deleteApplication = (id) => {
    const url = `${process.env.REACT_APP_API}/applications/${id}`;
    fetch(url, {
      method: 'DELETE'
    })
      .then(() => {
        fetch(`${process.env.REACT_APP_API}/applications`)
          .then((response) => {
            if (response.status !== 200) {
              return response.json().then(({ message }) => {
                throw new Error(message);
              });
            }
            return response.json();
          })
          .then((response) => {
            setApplications(response.data);
          })
          .catch((error) => {
            setErrorMessage(error);
          });
      })
      .finally(() => {
        closeModal();
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const preventAndShow = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setIdToDelete(id);
    setShowModal(true);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/applications`)
      .then((response) => {
        if (response.status !== 200) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
        return response.json();
      })
      .then((response) => {
        setApplications(response.data);
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  }, []);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Applications</h2>
      <table className={styles.tableData}>
        <thead className={styles.tableHeader}>
          <tr className={styles.trStyles}>
            <th>Job Description</th>
            <th>Postulant</th>
            <th>Interview</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => {
            return (
              <tr
                onClick={() => history.push(`/applications/form?_id=${application._id}`)}
                key={application._id}
                className={styles.trStyles}
              >
                <td className={styles.tdStyles}>
                  {application.positions ? application.positions.jobDescription : '-'}
                </td>
                <td className={styles.tdStyles}>
                  {application.postulants
                    ? application.postulants.firstName + ' ' + application.postulants.lastName
                    : '-'}
                </td>
                <td className={styles.tdStyles}>
                  {application.interview ? application.interview.date.substr(0, 10) : '-'}
                </td>
                <td className={styles.tdStyles}>{application.result ? application.result : '-'}</td>
                <td className={styles.tdStyles}>
                  <Button
                    name="deleteButton"
                    onClick={(e) => {
                      preventAndShow(e, application._id);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div id="error_message" className={styles.errorMessage}>
        {errorMessage.message}
      </div>
      <Modal
        id={idToDelete}
        function={deleteApplication}
        show={showModal}
        closeModal={closeModal}
      />
      <Link to="/Applications/Form">
        <Button name="addButton" entity="APPLICATION" />
      </Link>
    </section>
  );
}

export default Applications;
