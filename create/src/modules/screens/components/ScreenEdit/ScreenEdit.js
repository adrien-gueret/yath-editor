import './screen-edit.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import {
    editScreenName, editScreenContent, addScreenAction, editScreenActionLabel, editScreenActionTarget
} from 'Modules/screens/actions';
import ScreenAction from 'Modules/screens/models/ScreenAction';

class ScreenEdit extends React.Component {
    static propTypes = {
        onAddScreenAction: PropTypes.func.isRequired,
        onEditScreenActionLabel: PropTypes.func.isRequired,
        onEditScreenActionTarget: PropTypes.func.isRequired,
        onEditScreeContent: PropTypes.func.isRequired,
        onEditScreenName: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        otherScreens: PropTypes.arrayOf(PropTypes.object).isRequired,
        screen: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            screenName: this.props.screen.name,
            screenContent: this.props.screen.content,
        };
    }

    addAction = () => {
        this.props.onAddScreenAction(this.props.screen);
    };

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            screenName: nextProps.screen.name,
            screenContent: nextProps.screen.content,
        }));
    }

    getOnChangeActionLabelHandler = (action) => {
        return (e) => {
            const actionLabel = e.target.value;
            this.props.onEditScreenActionLabel(this.props.screen, action, actionLabel);
        };
    };

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

    getOnChangeActionTargetHandler = (action) => {
        return (e) => {
            const targetId = +e.target.value;
            const target = this.props.otherScreens.filter(screen => screen.id === targetId)[0];
            this.props.onEditScreenActionTarget(this.props.screen, action, target);
        };
    };

    renderActionsList() {
        return (
            <table>
                <thead>
                <tr>
                    <th>Label</th>
                    <th>Target screen</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.screen.actions.map(action => (
                        <tr key={ action.id }>
                            <td>
                                <input
                                    autoFocus={ !action.label.length }
                                    value={ action.label }
                                    onChange={ this.getOnChangeActionLabelHandler(action) }
                                    type="text"
                                />
                            </td>
                            <td>
                                <select
                                    onChange={ this.getOnChangeActionTargetHandler(action) }
                                    defaultValue={ action.targetScreen ? action.targetScreen.id : null }
                                >
                                    <option>-- Select a screen --</option>
                                    {
                                        this.props.otherScreens.map(otherScreen => (
                                           <option
                                               key={ otherScreen.id }
                                               value={ otherScreen.id }
                                           >
                                               { otherScreen.name }
                                           </option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        );
    }

    renderNoActions() {
        return <p>This screen has no actions yet.</p>;
    }

    renderActions() {
        if (this.props.screen.actions.length) {
            return this.renderActionsList();
        }

        return this.renderNoActions();
    }

    renderActionsContainer() {
        if (!this.props.otherScreens.length) {
            return null;
        }

        return (
            <div>
                <label>Actions:</label>
                <div>
                    { this.renderActions() }
                    <button onClick={ this.addAction }>Add action</button>
                </div>
            </div>
        );
    }

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
                        autoFocus={ !this.state.screenContent.length }
                        onChange={ this.onChangeContentHandler }
                        value={ this.state.screenContent }
                    />
                    <br />
                    { this.renderActionsContainer() }
                    <button onClick={ this.props.onClose }>Close</button>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        otherScreens: state.screens.filter(screen => !screen.equals(ownProps.screen)),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onEditScreenName(screen, newName) {
            dispatch(editScreenName(screen, newName));
        },
        onEditScreeContent(screen, newContent) {
            dispatch(editScreenContent(screen, newContent));
        },
        onAddScreenAction(screen) {
            dispatch(addScreenAction(screen, new ScreenAction()));
        },
        onEditScreenActionLabel(screen, screenAction, newLabel) {
            dispatch(editScreenActionLabel(screen, screenAction, newLabel));
        },
        onEditScreenActionTarget(screen, screenAction, newTarget) {
            dispatch(editScreenActionTarget(screen, screenAction, newTarget));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenEdit);