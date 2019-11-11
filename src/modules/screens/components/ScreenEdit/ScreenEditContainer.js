import { connect } from 'react-redux'

import {
    ScreenChoiceModel,
    actions as screensChoicesActions,
    selectors as screensChoicesSelectors,
} from 'Modules/screensChoices';

import actions from '../../actions';
import selectors from '../../selectors';

import ScreenEdit from './ScreenEdit';

const mapStateToProps = (state) => {
    const screenId = selectors.editedScreenId.get(state);
    const screen = selectors.list.getById(state, screenId);

    return {
        screen,
        screenChoices: screen ? screensChoicesSelectors.list.getByIds(state, screen.choicesIds) : [],
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
        dispatch(screensChoicesActions.addScreenChoice(screenId, new ScreenChoiceModel()));
    },
    onEditScreenChoiceLabel(screenChoiceId, newLabel) {
        dispatch(screensChoicesActions.editScreenChoiceLabel(screenChoiceId, newLabel));
    },
    onEditScreenChoiceTarget(screenChoiceId, newTargetId) {
        dispatch(screensChoicesActions.editScreenChoiceTarget(screenChoiceId, newTargetId));
    },
    onDeleteScreen(screenId) {
        dispatch(actions.deleteScreen(screenId));
    },
    onDeleteScreenChoice(screenChoiceId) {
        dispatch(screensChoicesActions.deleteScreenChoice(screenChoiceId));
    },
    onSetScreenAsStart(screenId) {
        dispatch(actions.setStartScreen(screenId));
    }
});

const ScreenEditContainer = connect(mapStateToProps, mapDispatchToProps)(ScreenEdit);

export default ScreenEditContainer;