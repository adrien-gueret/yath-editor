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

    componentWillReceiveProps(nextProps) {
        const newScreen = nextProps.screens.filter(screen => this.props.screens.indexOf(screen) === -1)[0];

        if (!newScreen) {
            return;
        }

        this.setState(() => ({ editScreen: newScreen }))
    }

    setEditScreenHandler = (screen) => {
        return () => { this.setState(() => ({ editScreen: screen })); };
    };

    renderScreen = (screen) => {
        function onDrag(e, data) {
            screen.x = data.x;
            screen.y = data.y;
        }

        return (
            <Draggable
                key={ screen.getSlug() }
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
                { this.state.editScreen && <ScreenEdit screen={ this.state.editScreen } /> }
            </section>
        );
    }
}

export default Board;