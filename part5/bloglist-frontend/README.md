# Exercise 5.1.
- [x] Create login form (username and password)
- [x] If a user is not logged in, only the login form should be visible
    - [x] Save the token returned from a successful login to the application's state user
- [x] If the user is logged-in name of the user and a list of blogs should be shown
# Exercise 5.2.
- [x] Save the logged in user's details to local storage
- [x] Implement a log out button and flow process
- [x] Ensure the browser does not remember the user details after logging out
**Snippet:**
```jsx
const handleLogin = async (event) => {
  // ...existing code...
  window.localStorage.setItem('loggedInUser', JSON.stringify(user))
  // ...existing code...
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedInUser')
  setUser(null)
  showNotification('Logged out successfully.', 'success')
}
```
# Exercise 5.3.
- [x] Store new blog details in a new state
- [x] Add form inputs for blog details
- [x] Send the blog details to the backend

# Exercise 5.4.
- [x] Implement operation notifications at the top of the logged-in user's page
- [x] Implement notifications at the login page
