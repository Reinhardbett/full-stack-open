const Header = (props) => {
  return ( 
    <h1>{props.course}</h1>
  );
}

const Content = (props) => {
  return (  
    <>
      <p> {props.parts[0].name} {props.parts[0].exercises1} </p>
      <p> {props.parts[1].name} {props.parts[1].exercises2} </p>
      <p> {props.parts[2].name} {props.parts[2].exercises3} </p>
    </>
  );
} 

const Total = (props) => {
  return (  
    <p>Number of exercises {props.parts[0].exercises1 + props.parts[1].exercises2 + props.parts[2].exercises3}</p>
  );
}


function App() {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises1: 10
      },
      {
        name: 'Using props to pass data',
        exercises2: 7
      },
      {
        name: 'State of a component',
        exercises3: 14
      }
    ]
}

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default App
