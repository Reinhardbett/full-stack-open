import { useState } from 'react';

const Header = () => <h1>give feedback</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Content = () => <h1>statistics</h1>

const StatisticLine = (props) => <p> {props.text} {props.value}</p>

const Statistics = ( props ) => {
  if ( props.good + props.neutral + props.bad === 0 ) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <StatisticLine text="good" value={props.good}/>
      <StatisticLine text="neutral" value={props.neutral}/>
      <StatisticLine text="bad" value={props.bad}/>
      <StatisticLine text="all" value={props.good + props.neutral + props.bad}/>
      <StatisticLine text="average" value={(props.good + props.neutral + props.bad)/3}/>
      <StatisticLine text="positive" value={(props.good + props.neutral)/(props.good + props.neutral + props.bad) * 100 + ' %'}/>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }
  return (
    <div>
      <Header />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Content />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App