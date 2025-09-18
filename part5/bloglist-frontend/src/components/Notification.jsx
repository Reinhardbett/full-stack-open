const Notification = ({ message, type }) => {
    
  if (!message) return null

  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: '#eee',
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
  }

  return <div style={style}>{ message }</div>
}

export default Notification