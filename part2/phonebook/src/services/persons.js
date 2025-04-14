import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

// Create
const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

// Read
const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

// Update
const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}
// Delete
const remove = (id) => axios.delete(`${baseUrl}/${id}`)

export default { create, getAll, update, remove }