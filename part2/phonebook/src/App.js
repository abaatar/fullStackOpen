import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import personService from "./services/persons";

const Filter = ({ searchName, handleSearchName }) => (
  <div>
    filter shown with{" "}
    <input value={searchName} onChange={handleSearchName}></input>
  </div>
);

const PersonForm = ({
  handleSubmit,
  newName,
  handleNewName,
  newNumber,
  handleNewNumber,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleNewName} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNewNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Person = ({ person, deletePerson }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person)}>delete</button>
  </div>
);

const Persons = ({ personsToShow, deletePerson }) => (
  <div>
    {personsToShow.map((person) => (
      <Person key={person.id} person={person} deletePerson={deletePerson} />
    ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  });

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].name === newName) {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          // replace
          personService
            .update(persons[i].id, {
              ...persons[i],
              number: newNumber,
            })
            .then((returnedPerson) => {
              setPersons(
                persons.map((p) =>
                  p.id !== persons[i].id ? p : returnedPerson
                )
              );

              setNewName("");
              setNewNumber("");
              setNotification({
                message: `Updated ${returnedPerson.name}`,
                isError: false,
              });
              setTimeout(() => {
                setNotification({
                  message: null,
                  isError: false,
                });
              }, 3000);
            })
            .catch((error) => {
              setPersons(persons.filter((p) => p.name !== newName));
              setNewName("");
              setNewNumber("");
              setNotification({
                message: `Information of ${newName} has already been removed from server`,
                isError: true,
              });
              setTimeout(() => {
                setNotification({
                  message: null,
                  isError: false,
                });
              }, 3000);
            });
          return;
        } else return;
      }
    }

    personService
      .create({
        name: newName,
        number: newNumber,
      })
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotification({
          message: `Added ${returnedPerson.name}`,
          isError: false,
        });
        setTimeout(() => {
          setNotification({
            message: null,
            isError: false,
          });
        }, 3000);
      });
  };

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deletePerson(person.id);
      setPersons(persons.filter((p) => p.id !== person.id));
      setNotification({
        message: `Deleted ${person.name}`,
        isError: false,
      });
      setTimeout(() => {
        setNotification({
          message: null,
          isError: false,
        });
      }, 3000);
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notification.message}
        isError={notification.isError}
      />

      <Filter searchName={searchName} handleSearchName={handleSearchName} />

      <h3>add a new</h3>

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
