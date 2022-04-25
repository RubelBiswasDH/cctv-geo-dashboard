import React from 'react'
import PropTypes from 'prop-types'

// Import Components
import { Card, CardContent, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material'

class StyledTable extends React.PureComponent {
  render() {
    const { rows, headers } = this.props
    return (
      <Card elevation={ 4 } sx={{ height: '100%' }}>
          <CardContent>
              <Table padding='none' size='small'>
                {
                  headers?.length > 0 &&
                  <TableHead>
                    <TableRow>
                      {
                        headers.map((header, index) => 
                          <TableCell key={ `header-${header+index}` } sx={{ ...tableHeaderStyles, textAlign: `${index === 1 ? 'right' : ''}` }}>{ header }</TableCell>
                        )
                      }
                    </TableRow>
                  </TableHead>
                }
                  <TableBody>   
                    {
                      rows?.length > 0 && rows.map((row, index) =>
                        <TableRow key={ `row-${index + row.label}` } >
                            <TableCell key={ `row-${ row.label + index }` } >{ row.label }</TableCell>
                            <TableCell key={ `row-${ row.value + index }` } sx={{ textAlign: 'right' }}>{ row.value }</TableCell>
                        </TableRow>
                      )
                    }
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    )
  }
}

// JSS Styles
const tableHeaderStyles = {
  fontWeight: 600
}

// PropTypes
StyledTable.propTypes = {
    rows: PropTypes.array,
    headers: PropTypes.array
}

StyledTable.defaultProps = {
    rows: [],
    headers: []
}

export default StyledTable