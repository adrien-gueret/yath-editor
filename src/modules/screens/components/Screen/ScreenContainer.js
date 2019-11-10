import PropTypes from 'proptypes';
import { connect } from 'react-redux'

import Screen from './Screen';

import { moveScreen, resizeScreen } from 'Modules/screens/actions';
import { setEditScreen } from 'Modules/app/actions';

import screensSelectors from 'Modules/screens/selectors';

const propTypes = {
    screenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const screen = screensSelectors.getById(state, ownProps.screenId);

    return {
        ...ownProps,
        screen,
        hasChoiceWithoutTarget: screensSelectors.hasChoiceWithoutTarget(state, ownProps.screenId),
    };
};

const mapDispatchToProps = (dispatch) => ({
    onEdit(screenId) {
        dispatch(setEditScreen(screenId));
    },
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