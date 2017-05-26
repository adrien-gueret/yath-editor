import { connect } from 'react-redux'

import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';

import ArrowsBoard from './ArrowsBoard';

const mapStateToProps = (state) => {
    const screens = screensSelectors.getAsArray(state);

    const arrows = screens.reduce((allArrows, screen) => {
        const start = { x: screen.x, y: screen.y };
        const choices = screensChoicesSelectors.getByIds(state, screen.choicesIds);
        const newArrows = choices.map(choice => {
          const targetScreen = screensSelectors.getById(state, choice.targetScreenId);

          if (!targetScreen) {
              return null;
          }

          const end = { x: targetScreen.x, y: targetScreen.y };

          return { start, end };
        });

        return [
            ...allArrows,
            ...newArrows.filter(arrow => !!arrow),
        ];

    }, []);

    console.log(arrows);

    return { arrows };
};

const ArrowsBoardContainer = connect(mapStateToProps)(ArrowsBoard);

export default ArrowsBoardContainer;