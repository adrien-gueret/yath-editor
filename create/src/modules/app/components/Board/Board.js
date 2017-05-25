import './board.less';

import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';

import ScreenEdit from 'Modules/screens/components/ScreenEdit';

class Board extends React.Component {
    static propTypes = {
        screens: PropTypes.array,
    };

    static defaultProps = {
        screens: [],
    };

    constructor(props) {
        super(props);

        this.state = {
            editScreen: null,
        };
    }

    onCloseScreenEditHandler = () => {
        this.setState(() => ({ editScreen: null }));
    };

    componentWillReceiveProps(nextProps) {
        const currentScreensIds = this.props.screens.map(screen => screen.id);
        const newScreen = nextProps.screens.filter(screen => currentScreensIds.indexOf(screen.id) === -1)[0];

        let editScreen = newScreen || null;

        if (!newScreen && this.state.editScreen) {
            editScreen = nextProps.screens.filter(screen => screen.equals(this.state.editScreen))[0];
        }

        if (editScreen) {
            this.setEditScreenHandler(editScreen)();
        }
    }

    setEditScreenHandler = (screen) => {
        return () => { this.setState(() => ({ editScreen: screen })); };
    };

    renderScreen = (screen) => {
        function onDrag(e, data) {
            screen.x = data.x;
            screen.y = data.y;
            // TODO: dispatch Redux action
        }

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
                            onClick={ this.setEditScreenHandler(screen) }
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
                    this.state.editScreen &&
                    <ScreenEdit
                        screen={ this.state.editScreen }
                        onClose={ this.onCloseScreenEditHandler }
                    />
                }
            </section>
        );
    }
}

export default Board;