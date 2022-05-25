import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff'
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        cell: {
          fontSize: '12px',
          '& .MuiChip-label': {
            fontSize: '12px'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: '12px'
        }
      }
    },
    MuiTimelineItem: {
      styleOverrides: {
        root: {
          minHeight: '48px'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-input': {
            fontSize: '12px'
          },
          '& .MuiSelect-select ~ fieldset': {
            height: '38px'
          },
          '& .MuiSelect-select ~ svg': {
            marginTop: '-2px'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '12px'
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '& p': {
            fontSize: '12px'
          }
        }
      }
    }
  },
  palette: {
    gray: {
      main: '#5F5F5F',
      contrastText: '#fff',
    },
    white: {
      main:'white',
      contrastText: '#fff',
    },
    btnGreen: {
      main: '#77DD77',
      contrastText: '#fff',
    },
    btnSubmit: {
      main: '#009688',
      contrastText: '#fff',
    },
    btnOrange: {
      main: '#FF6961',
      contrastText: '#fff',
    },
    tableHeader: {
      main: '#8CCA9E',
      contrastText: '#00',
    },
    text: {
      white: 'white'
    }
  },
 
})

export default theme