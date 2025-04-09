const Filter = ({ newFilteredName, handleFilteredNameChange }) => {
  return (
    <div>
      filter shown with: <input
        value = {newFilteredName}
        onChange = {handleFilteredNameChange}
      />
    </div>
  );
};

export default Filter;