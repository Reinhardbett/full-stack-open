const Header = (props) => <h1>{props.course}</h1>

const Content = ({ parts }) => (
<div>
    <ul>
    {parts.map((part) => 
        <li key={part.id}>
        {part.name} {part.exercises}
        </li>
    )}
    </ul>
</div>
)

const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, parts) => sum + parts.exercises, 0)
    return (
        <div>
            <p>total of { totalExercises } exercises</p>
        </div>
    );
};

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    );
};

export default Course;