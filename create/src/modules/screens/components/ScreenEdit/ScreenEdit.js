import './screen-edit.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import { editScreenName, editScreenContent } from 'Modules/screens/actions';

class ScreenEdit extends React.Component {
    static propTypes = {
        onEditScreenName: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        screen: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            screenName: this.props.screen.name,
            screenContent: this.props.screen.content,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            screenName: nextProps.screen.name,
            screenContent: nextProps.screen.content,
        }));
    }

    onChangeNameHandler = (e) => {
        const screenName = e.target.value;

        this.setState(() => ({ screenName }), () => {
            this.props.onEditScreenName(this.props.screen, screenName);
        });
    };

    onChangeContentHandler = (e) => {
        const screenContent = e.target.value;

        this.setState(() => ({ screenContent }), () => {
            this.props.onEditScreeContent(this.props.screen, screenContent);
        });
    };

    render() {
        return (
            <section className="screenEdit-overlay">
                <div className="screenEdit-content">
                    <label htmlFor="screenEditName">Screen name:</label>
                    <input
                        id="screenEditName"
                        value={ this.state.screenName }
                        onChange={ this.onChangeNameHandler }
                        type="text"
                    />
                    <label htmlFor="screenEditContent">Screen content:</label>
                    <textarea
                        id="screenEditContent"
                        onChange={ this.onChangeContentHandler }
                        value={ this.state.screenContent }
                    />
                    <br />
                    <button onClick={ this.props.onClose }>Close</button>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  return { ...ownProps };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onEditScreenName(screen, newName) {
            dispatch(editScreenName(screen, newName));
        },
        onEditScreeContent(screen, newContent) {
            dispatch(editScreenContent(screen, newContent));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenEdit);