import './board.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import screensSelectors from 'Modules/screens/selectors';
import ScreenEdit from 'Modules/screens/components/ScreenEdit';
import Screen from 'Modules/screens/components/Screen';
import ArrowsBoard from '../ArrowsBoard';

class Board extends React.Component {
    static propTypes = {
        moveScreen: PropTypes.func,
        screens: PropTypes.array,
    };

    static defaultProps = {
        moveScreen() {},
        screens: [],
    };

    constructor(props) {
        super(props);

        this.state = {
            editScreenId: null,
        };
    }

    onCloseScreenEditHandler = () => {
        this.setState(() => ({ editScreenId: null }));
    };

    componentWillReceiveProps(nextProps) {
        const currentScreensIds = this.props.screens.map(screen => screen.id);
        const newScreensIds = nextProps.screens.map(screen => screen.id);
        const newScreen = nextProps.screens.filter(screen => currentScreensIds.indexOf(screen.id) === -1)[0];

        const editScreenId = newScreen ? newScreen.id : this.state.editScreenId;

        if (editScreenId && newScreensIds.indexOf(editScreenId) >= 0) {
            this.setEditScreenHandler(editScreenId)();
        }
    }

    setEditScreenHandler = (editScreenId) => {
        return () => { this.setState(() => ({ editScreenId })); };
    };

    render() {
        return (
            <section className="yathBoard">
                {
                    this.props.screens.map(screen =>  (
                        <Screen onEdit={ this.setEditScreenHandler } key={ screen.id } screenId={screen.id} />
                    ))
                }
                {
                    this.state.editScreenId &&
                    <ScreenEdit
                        screenId={ this.state.editScreenId }
                        onClose={ this.onCloseScreenEditHandler }
                    />
                }
                <ArrowsBoard />
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    screens: screensSelectors.getAsArray(state),
});

export default connect(mapStateToProps)(Board);