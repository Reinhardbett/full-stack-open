const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty the server's database before tests are run
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Reinhardt Bett',
        username: 'rBett',
        password: 'Bett'
      }
    })

    await page.goto('http://localhost:5173')
    await page.getByRole('button', {name: 'Log in to application'}).click()
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByLabel('username').fill('rBett')
    await page.getByLabel('password').fill('Bett')

    await page.getByRole('button', { name: 'login'}).click()

    await expect(page.getByText('Reinhardt Bett logged in')).toBeVisible()
  })
})