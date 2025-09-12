# Exercise 5.1.
## (implement login functionality to the frontend)
- [x] Create login form (username and password)
- [x] If a user is not logged in, only the login form should be visible
    - [x] Save the token returned from a successful login to the application's state user
- [x] If the user is logged-in name of the user and a list of blogs should be shown

- Logging in is done by sending an HTTP POST request to the server address `api/login`.
- The logic is separated into its own module `services/login.js`
- If the login is successful, the form fields are emptied and the server response (token, username, password) are saved to the user state
- If the login fails or running the fucntion loginService.login results in an error, the user is notified.
- The user state is used to conditionally show other elements such as the creation form or login details
- The label element provides descriptions for input fields and help improves the form's accessibility. This way, screen readers can read the field's name to the user when the input field is selected and clicking on the label's text automatically focuses on the correct input field.

--- 

# Exercise 5.2.
## (make the login 'permanent' by using the local storage. Also, implement a way to log out)
- [x] Save the logged in user's details to local storage
- [x] Implement a log out button and flow process
- [x] Ensure the browser does not remember the user details after logging out

- If the browser is refreshed, the user's login information will disappear.
- Local storage is a key-value database in the browser. A value corresponding to a certain key is saved using the method `setItem`
- The value of a key can be found with the method `getItem`
- The key can be removed with `removeItem`
- The storage is origin-specific so each web application has its own storage.
- The values saved to local storage are DOMstrings. Therefore, we cannot save a JavaScript object as it is. The object has to be parsed to JSON first, with the method JSON.stringify.
- Correspondingly, when a JSON object is read from the local storage, it has to be parsed back to JavaScript with `JSON.parse`
- You can also inspect the local storage using the developer tools. On Chrome, go to the Application tab and select Local Storage. On Firefox go to the Storage tab and select Local Storage.
- In our application, we check if the user details of a logged-in user can already be found on the local storage. If they are there the details are saved to the state of the application and to blogService.

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

---

# Exercise 5.3.
## (expand application to allow the logged-in user to add new blogs)
- [x] Store new blog details in a new state
- [x] Add form inputs for blog details
- [x] Send the blog details to the backend

- To ensure the frontend creation forms work with the backend, we must add the token of the logged-in user to the authorization header of the HTTP request.
- The `blogService` module contains a private variable called `token` which can be modified with the `setToken` function setting the token to the Authorization header.
- The event handler responsible for login must be changed to call the above method for a successful login.

---

# Exercise 5.4.
## (implement notifications that inform the user about successful and unsuccessful operations at the top of the page)
- [x] Implement operation notifications at the top of the logged-in user's page
- [x] Implement notifications at the login page
