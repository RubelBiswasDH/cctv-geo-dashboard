import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'

// Import Components
import App from './App'

// Import Styles
import './index.css'

// Import MUI Theme
import theme from './styles/theme'

// Import Store
import store from './redux/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <ThemeProvider theme={ theme }>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)