# 📘 **FullStackOpen – Part 5 Notes & Exercises**

## 🗺️ **Overview**
- **a Login in frontend**
  - **Main concepts:**
    - Conditional Rendering
    - Label elements
    - Local storage
- **b props.children and proptypes**
  - **Main concepts:**
    - Togglable React components
    - props.children
    - useREF hooks
- **c Testing React apps**
- **d End to end testing**

---

## ✅ **Exercises Checklist**

- [x] **Exercise 5.1:** Implement login functionality to the frontend
- [x] **Exercise 5.2:** Make the login 'permanent' by using the local storage. Also, implement a way to log out
- [x] **Exercise 5.3:** Expand application to allow the logged-in user to add new blogs
- [x] **Exercise 5.4:** Implement notifications that inform the user about successful and unsuccessful operations at the top of the page
- [ ] **Exercise 5.5:** Change the creation form to be displayed only when appropriate
- [ ] **Exercise 5.6:** Separate the creation form and all relevant states into its own component
- [ ] **Exercise 5.7:** Add a button to each blog to control whether all of the details about the blog are shown or not
- [ ] **Exercise 5.8:** Implement functionality for the like button.
- [ ] **Exercise 5.9** Ensure when a blog is liked, the name of the user that added the blog is shown in the details
- [ ] **Exercise 5.10** Sort the blog posts by the number of likes
- [ ] **Exercise 5.11** Add the logic for deleting blog posts in the frontend
- [ ] **Exercise 5.12** Add ESlint to the project and fix all the linter errors

---

## 🧑‍💻 **Exercises Log & Notes**

**Exercise 5.1 - implement login functionality to the frontend**

**Concepts Learned**

- The user state stores elements such as the creation form or login details
- The label element improves the form's accessibility. This way, screen readers can read the field's name to the user when the input field is selected and clicking on the label's text automatically focuses on the correct input field.

**Implementation** 
```javascript
<div>
  <label>
    username
    <input
      type="text"
      value={username}
      onChange={({ target }) => setUsername(target.value)}
    />
  </label>
</div>
// ...
```

--- 

**Exercise 5.2: Make the login 'permanent' by using the local storage. Also, implement a way to log out**

**Concepts Learned** 

- We persist details of a logged-in user on the local storage. 
- The user details are saved to `user` state before being sent to blogService.

**Implementation**
```javascript
try {
  const user = await loginService.login({ username, password })
  window.localStorage.setItem(
    'loggedInUser', JSON.stringify(user)
  )
  blogService.setToken(user.token)
  setUser(user)
  setUsername('')
  setPassword('')
  showNotification(`Welcome ${user.name}!`, 'success')
} catch {
  showNotification('Wrong credentials', 'error')
}
```

---

**Exercise 5.3 - Expand application to allow the logged-in user to add new blogs**

**Concepts Learned**

- To ensure the frontend creation forms work with the backend, we must add the token of the logged-in user to the authorization header of the HTTP request.
- The `blogService` module contains a private variable called `token` which can be modified with the `setToken` function setting the token to the Authorization header.
- The event handler responsible for login must be changed to call the above method for a successful login.

**Implementation**
```javascript
const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}
```

---

**Exercise 5.4 - Implement notifications that inform the user about successful and unsuccessful operations at the top of the page**

**Concepts Learned**

- Centralized notification logic improves user experience by providing immediate feedback for both successful and unsuccessful operations.
- By calling `showNotification` in event handlers (login, logout, blog creation), users are informed about the outcome of their actions without manual page refreshes.

**Implementation**
```javascript
const showNotification = (message, type = 'success') => {
  setNotification({ message, type })
  setTimeout(() => {
    setNotification({ message: null, type: null })
  }, 5000)
}
```
```jsx
<Notification message={notification.message} type={notification.type} />
```

---

**Exercise 5.5 - Change the creation form to be displayed only when appropriate**

**Concepts Learned**
- Components are reusable javascript functions that return `jsx` markdown
- States and functions can be passed down from parent components to children components
- To reuse the `ToggleForm` component the code has assumed a tree structure from the parent `App` component i.e

```mermaid
graph TD
    A[App Component] -->|buttonLabel="login"| B[Togglable]
    A -->|buttonLabel="new blog"| D[Togglable]

    %% Togglable children
    B -->|children| C[LoginForm]
    D -->|children| E[BlogForm]

    %% App state and handlers passed to LoginForm
    A -.->|username, password| C
    A -.->|setUsername, setPassword| C
    A -.->|handleLogin| C

    %% App state and handlers passed to BlogForm
    A -.->|title, author, url| E
    A -.->|setTitle, setAuthor, setUrl| E
    A -.->|handleBlogSubmit| E
```

**Implementation**
```javascript
//...
const App = () => {
//..
 return (
      <div>
        //...
          <ToggleForm buttonLabel="Log in to application">
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleLogin={handleLogin}
            />
          </ToggleForm>
      </div>
    )
}
export default App
```