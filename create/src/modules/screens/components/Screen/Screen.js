import './screen.less';

import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';

class Screen extends React.Component {
    static propTypes = {
        onEdit: PropTypes.func.isRequired,
        moveScreen: PropTypes.func.isRequired,
        resizeScreen: PropTypes.func.isRequired,
        screen: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string,
            x: PropTypes.number,
            y: PropTypes.number,
        }).isRequired,
        hasChoiceWithoutTarget: PropTypes.bool,
    };

    static defaultProps = {
        hasChoiceWithoutTarget: false,
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
        const { screen, hasChoiceWithoutTarget } = this.props;
        const className = `yathScreen ${hasChoiceWithoutTarget ? 'yathScreen--error' : ''}`;

        return (
            <Draggable
                bounds="parent"
                defaultPosition={ screen }
                handle=".yathScreen__name"
                onDrag={ this.dragHandler }
            >
                <div
                    className={className}
                    ref={this.setDomElement}
                    title={hasChoiceWithoutTarget ? 'This screen has some choices without targets' : null}
                >
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