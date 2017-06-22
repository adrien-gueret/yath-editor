import { connect } from 'react-redux'

import ScreenEdit from './ScreenEdit';

import { unsetEditScreen } from 'Modules/app/actions';
import { deleteScreen, editScreenName, editScreenContent } from 'Modules/screens/actions';
import {
    addScreenChoice,
    deleteScreenChoice,
    editScreenChoiceLabel,
    editScreenChoiceTarget
} from 'Modules/screensChoices/actions';

import editScreenSelectors from 'Modules/app/selectors';
import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';
import ScreenChoice from 'Modules/screensChoices/models/ScreenChoice';

const mapStateToProps = (state) => {
    const screenId = editScreenSelectors.get(state);
    const screen = screensSelectors.getById(state, screenId);

    return {
        screen,
        screenChoices: screen ? screensChoicesSelectors.getByIds(state, screen.choicesIds) : [],
        otherScreens: screensSelectors.getAllExceptOne(state, screenId),
    };
};

const mapDispatchToProps = (dispatch) => ({
    onClose() {
        dispatch(unsetEditScreen());
    },
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
    onDeleteScreen(screenId) {
        dispatch(deleteScreen(screenId));
    },
    onDeleteScreenChoice(screenChoiceId) {
        dispatch(deleteScreenChoice(screenChoiceId));
    },
});

const ScreenEditContainer = connect(mapStateToProps, mapDispatchToProps)(ScreenEdit);

export default ScreenEditContainer;