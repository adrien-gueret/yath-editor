import './screen.less';

import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';

class Screen extends React.Component {
    static propTypes = {
        onEdit: PropTypes.func.isRequired,
        moveScreen: PropTypes.func.isRequired,
        screen: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            x: PropTypes.number,
            y: PropTypes.number,
        }).isRequired,
    };

    dragHandler = (e, data) => {
        this.props.moveScreen(this.props.screen.id, data.x, data.y);
    };

    render() {
        const { screen } = this.props;

        return (
            <Draggable
                bounds={{ left: 0, top: 0 }}
                defaultPosition={ screen }
                handle=".yathScreen__name"
                onDrag={ this.dragHandler }
            >
                <div className="yathScreen">
                    <header className="yathScreen__header">
                        <span className="yathScreen__name">{ screen.name }</span>
                        <span
                            className="yathScreen__editButton"
                            onClick={ this.props.onEdit(screen.id) }
                        >✎</span>
                    </header>
                </div>
            </Draggable>
        );
    }
}

export default Screen;