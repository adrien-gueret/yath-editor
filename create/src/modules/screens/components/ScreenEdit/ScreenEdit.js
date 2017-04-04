import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import { editScreenName } from 'Modules/screens/actions';

class ScreenEdit extends React.Component {
    static propTypes = {
        onEditScreenName: PropTypes.func.isRequired,
        screen: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            screenName: this.props.screen.name,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({ screenName: nextProps.screen.name }));
    }

    onChangeHandler = (e) => {
        const screenName = e.target.value;

        this.setState(() => ({ screenName }), () => {
            this.props.onEditScreenName(this.props.screen, screenName);
        });
    };

    render() {
        return (
            <div>
                <input
                    value={ this.state.screenName }
                    onChange={ this.onChangeHandler }
                    type="text"
                />
            </div>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenEdit);