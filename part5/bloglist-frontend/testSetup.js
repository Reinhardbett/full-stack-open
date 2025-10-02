import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react' // Helps render components
import '@testing-library/jest-dom/vitest' // Simulate browser

// After each test, reset jsdom
afterEach(() => {
    cleanup()
})