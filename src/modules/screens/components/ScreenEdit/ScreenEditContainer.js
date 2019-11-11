import { connect } from 'react-redux'

import {
    addScreenChoice,
    deleteScreenChoice,
    editScreenChoiceLabel,
    editScreenChoiceTarget
} from 'Modules/screensChoices/actions';

import screensChoicesSelectors from 'Modules/screensChoices/selectors';
import ScreenChoice from 'Modules/screensChoices/models/ScreenChoice';

import actions from '../../actions';
import selectors from '../../selectors';

import ScreenEdit from './ScreenEdit';

const mapStateToProps = (state) => {
    const screenId = selectors.editedScreenId.get(state);
    const screen = selectors.list.getById(state, screenId);

    return {
        screen,
        screenChoices: screen ? screensChoicesSelectors.getByIds(state, screen.choicesIds) : [],
        otherScreens: selectors.list.getAllExceptOne(state, screenId),
    };
};

const mapDispatchToProps = (dispatch) => ({
    onClose() {
        dispatch(actions.unsetEditScreen());
    },
    onEditScreenName(screenId, newName) {
        dispatch(actions.editScreenName(screenId, newName));
    },
    onEditScreenContent(screenId, newContent) {
        dispatch(actions.editScreenContent(screenId, newContent));
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
        dispatch(actions.deleteScreen(screenId));
    },
    onDeleteScreenChoice(screenChoiceId) {
        dispatch(deleteScreenChoice(screenChoiceId));
    },
    onSetScreenAsStart(screenId) {
        dispatch(actions.setStartScreen(screenId));
    }
});

const ScreenEditContainer = connect(mapStateToProps, mapDispatchToProps)(ScreenEdit);

export default ScreenEditContainer;