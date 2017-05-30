import { PropTypes } from 'react';
import { connect } from 'react-redux'

import Screen from './Screen';

import { moveScreen, resizeScreen } from 'Modules/screens/actions';

import screensSelectors from 'Modules/screens/selectors';

const propTypes = {
    onEdit: PropTypes.func.isRequired,
    screenId: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const screen = screensSelectors.getById(state, ownProps.screenId);

    return { ...ownProps, screen };
};

const mapDispatchToProps = (dispatch) => ({
    moveScreen(screenId, newX, newY) {
        dispatch(moveScreen(screenId, newX, newY));
    },
    resizeScreen(screenId, newWidth, newHeight) {
        dispatch(resizeScreen(screenId, newWidth, newHeight));
    },
});

const ScreenContainer = connect(mapStateToProps, mapDispatchToProps)(Screen);
ScreenContainer.propTypes = propTypes;

export default ScreenContainer;