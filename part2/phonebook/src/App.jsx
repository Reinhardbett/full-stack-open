import { useState, useEffect } from 'react';
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";


const App = () => {
  // Store the form inputs aside mock data
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567', id: 1},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]); 

  // Control the form inputs
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilteredName, setNewFilteredName] = useState('');
  const [filteredPersons, setFilteredPersons] = useState(persons);

  // Add new names to persons array
  const addName = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    // Prevent user from adding names that exist
    const isRedundant = persons.some((person) => person.name === newName);

    if (isRedundant) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  };

  // Filter names based on user input
  useEffect(() => {
    const filteredPersons = persons.filter(person => 
      person.name.toLowerCase().includes(newFilteredName.toLowerCase())
    );
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
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        filteredPersons={filteredPersons}
      />
    </div>
  );
};

export default App;
