import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from './app/store'
import App from './App'
import '@testing-library/jest-dom'

test('renders the app without crashing', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    )
})

test('renders the navigation header', () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
})
