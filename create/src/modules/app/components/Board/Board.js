import './board.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import Draggable from 'react-draggable';

import { moveScreen } from 'Modules/screens/actions';

import screensSelectors from 'Modules/screens/selectors';
import ScreenEdit from 'Modules/screens/components/ScreenEdit';
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
        const newScreen = nextProps.screens.filter(screen => currentScreensIds.indexOf(screen.id) === -1)[0];

        const editScreenId = newScreen ? newScreen.id : this.state.editScreenId;

        if (editScreenId) {
            this.setEditScreenHandler(editScreenId)();
        }
    }

    setEditScreenHandler = (editScreenId) => {
        return () => { this.setState(() => ({ editScreenId })); };
    };

    renderScreen = (screen) => {
        const onDrag = (e, data) => {
            this.props.moveScreen(screen.id, data.x, data.y);
        };

        return (
            <Draggable
                key={ screen.id }
                defaultPosition={ screen }
                handle=".yathBoard__screenName"
                onDrag={ onDrag }
            >
                <div className="yathBoard__screen">
                    <header className="yathBoard__screenHeader">
                        <span className="yathBoard__screenName">{ screen.name }</span>
                        <span
                            className="yathBoard__screenEditButton"
                            onClick={ this.setEditScreenHandler(screen.id) }
                        >✎</span>
                    </header>
                </div>
            </Draggable>
        );
    };

    render() {
        return (
            <section className="yathBoard">
                { this.props.screens.map(this.renderScreen) }
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

const mapDispatchToProps = (dispatch) => ({
    moveScreen(screenId, newX, newY) {
        dispatch(moveScreen(screenId, newX, newY));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);