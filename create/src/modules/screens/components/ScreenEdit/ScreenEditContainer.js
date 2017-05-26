import { PropTypes } from 'react';
import { connect } from 'react-redux'

import ScreenEdit from './ScreenEdit';

import { editScreenName, editScreenContent } from 'Modules/screens/actions';
import { addScreenChoice, editScreenChoiceLabel, editScreenChoiceTarget } from 'Modules/screensChoices/actions';

import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';
import ScreenChoice from 'Modules/screensChoices/models/ScreenChoice';

const propTypes = {
    onClose: PropTypes.func.isRequired,
    screenId: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const screen = screensSelectors.getById(state, ownProps.screenId);

    return {
        ...ownProps,
        screen,
        screenChoices: screen ? screensChoicesSelectors.getByIds(state, screen.choicesIds) : [],
        otherScreens: screensSelectors.getAllExceptOne(state, ownProps.screenId),
    };
};

const mapDispatchToProps = (dispatch) => ({
    onEditScreenName(screenId, newName) {
        dispatch(editScreenName(screenId, newName));
    },
    onEditScreenContent(screenId, newContent) {
        dispatch(editScreenContent(screenId, newContent));
    },
    onAddScreenChoice(screenId) {
        dispatch(addScreenChoice(screenId, new ScreenChoice()));
    },
    onEditScreenChoiceLabel(screenChoiceId, newLabel) {
        dispatch(editScreenChoiceLabel(screenChoiceId, newLabel));
    },
    onEditScreenChoiceTarget(screenChoiceId, newTargetId) {
        dispatch(editScreenChoiceTarget(screenChoiceId, newTargetId));
    },
});

const ScreenEditContainer = connect(mapStateToProps, mapDispatchToProps)(ScreenEdit);
ScreenEditContainer.propTypes = propTypes;

export default ScreenEditContainer;