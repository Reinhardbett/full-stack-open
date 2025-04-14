import { useState, useEffect } from 'react';
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";


const App = () => {
  // Store the form inputs aside mock data
  const [persons, setPersons] = useState([]); 

  // Control the form inputs
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilteredName, setNewFilteredName] = useState('');
  const [filteredPersons, setFilteredPersons] = useState(persons);

  // fetch data from json server
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // Add new names to persons array
  const addName = (event, id = null) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    }

    // Prevent user from adding names that exist
    const isRedundant = persons.some((person) => person.name === newName);
    const existingPerson = persons.find((person) => person.name === newName);

    if (isRedundant) {
      window.confirm(`${newName} is already added to phonebook replace the old number with a new one?`)
      personService
        .update(existingPerson.id, personObject)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id === existingPerson.id ? updatedPerson : person))
        })
    } else {
      personService
        .create(personObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
        });      
    };
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          alert(`${name} has already been removed from server.`)
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  };

  // Filter names based on user input
  useEffect(() => {
    const filteredPersons = persons.filter(person => {
      return (
        // check if person.name exists or typeError
        person.name && person.name.toLowerCase().includes(newFilteredName.toLowerCase())
      );
    });
    setFilteredPersons(filteredPersons);
  }, [newFilteredName, persons]);

  const handleFilteredNameChange = (event) => {
    setNewFilteredName(event.target.value)
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        newFilteredName={newFilteredName}
        handleFilteredNameChange={handleFilteredNameChange}
      />
      <h2>Add a new</h2>
      <PersonForm 
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={filteredPersons}
        onDelete={deletePerson}
      />
    </div>
  );
};

export default App;
