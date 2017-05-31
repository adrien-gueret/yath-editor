import './screen.less';

import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';

class Screen extends React.Component {
    static propTypes = {
        onEdit: PropTypes.func.isRequired,
        moveScreen: PropTypes.func.isRequired,
        resizeScreen: PropTypes.func.isRequired,
        screen: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            x: PropTypes.number,
            y: PropTypes.number,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.domElement = null;
    }

    componentDidMount() {
        this.resizeScreen();
    }

    componentDidUpdate(prevProps) {
       if(prevProps.screen.name !== this.props.screen.name) {
           this.resizeScreen();
       }
    }

    dragHandler = (e, data) => {
        this.props.moveScreen(this.props.screen.id, data.x, data.y);
    };

    resizeScreen() {
        if (this.domElement) {
            const style = window.getComputedStyle(this.domElement);
            this.props.resizeScreen(this.props.screen.id, style.width, style.height);
        }
    }

    setDomElement = (domElement) => {
      this.domElement = domElement;
    };

    render() {
        const { screen } = this.props;

        return (
            <Draggable
                bounds="parent"
                defaultPosition={ screen }
                handle=".yathScreen__name"
                onDrag={ this.dragHandler }
            >
                <div className="yathScreen" ref={this.setDomElement}>
                    <header className="yathScreen__header">
                        <span className="yathScreen__name">{ screen.name }</span>
                        <span
                            className="yathScreen__editButton"
                            onClick={ this.props.onEdit(screen.id) }
                        >✏️</span>
                    </header>
                </div>
            </Draggable>
        );
    }
}

export default Screen;