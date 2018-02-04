import './board.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import screensSelectors from 'Modules/screens/selectors';
import appSelectors from 'Modules/app/selectors';
import ScreenEdit from 'Modules/screens/components/ScreenEdit';
import Screen from 'Modules/screens/components/Screen';
import ArrowsBoard from '../ArrowsBoard';

class Board extends React.Component {
    static propTypes = {
        moveScreen: PropTypes.func,
        screens: PropTypes.array,
        editScreenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    };

    static defaultProps = {
        moveScreen() {},
        screens: [],
        editScreenId: null,
    };

    render() {
        return (
            <section className="yathBoard">
                {
                    this.props.screens.map(screen =>  (
                        <Screen key={ screen.id } screenId={screen.id} />
                    ))
                }
                { this.props.editScreenId && <ScreenEdit /> }
                <ArrowsBoard />
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    editScreenId: appSelectors.getEditScreenId(state),
    screens: screensSelectors.getAsArray(state),
});

export default connect(mapStateToProps)(Board);