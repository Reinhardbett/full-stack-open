import { useState } from 'react'

// Add a button that once clicked displays a random anecdote

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0); 
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));  
  

  const handleClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length)); 
  }
  
  const newVotes = [...votes];
  
  const maxIndex = newVotes.reduce((maxIdx, curr, idx, array) => 
    curr > array[maxIdx] ? idx : maxIdx, 0);

  const handleVotes = () => {
    newVotes[selected] += 1;
    setVotes(newVotes);
  };



  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <h1>Anecdote of the day</h1>
            </td>
          </tr>
          <tr>
            <td>
              {anecdotes[selected]}
            </td>
          </tr>
          <tr>
            <td>
              <p>has {newVotes[selected]} votes</p>
            </td>
          </tr>
          <tr>
            <td>
              <Button onClick={handleVotes} text="vote"/>
              <Button onClick={handleClick} text="next anecdote"/>
            </td>
          </tr>
          <tr>
            <td>
              <h1>Anecdote with the most votes</h1>
            </td>
          </tr>
          <tr>
            <td>
              {anecdotes[maxIndex]}
            </td>
          </tr>
          <tr>
            <td>
              <p>has {newVotes[maxIndex]} votes</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default App