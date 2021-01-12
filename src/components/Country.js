import React from 'react'
import PropTypes from 'prop-types'

function Country({location}) {
    return (
        <div>
            {location.state}
        </div>
    )
}

Country.propTypes = {

}

export default Country

