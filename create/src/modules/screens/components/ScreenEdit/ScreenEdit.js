import React, { PropTypes } from 'react';

const propTypes = {
    screen: PropTypes.object.isRequired,
};

function ScreenEdit({ screen }) {
    return (
        <div>{ JSON.stringify(screen) }</div>
    );
}

ScreenEdit.propTypes = propTypes;

export default ScreenEdit;