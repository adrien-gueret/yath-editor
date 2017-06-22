import './screen-edit.less';

import React, { PropTypes } from 'react';

class ScreenEdit extends React.Component {
    static propTypes = {
        onAddScreenChoice: PropTypes.func.isRequired,
        onDeleteScreenChoice: PropTypes.func.isRequired,
        onDeleteScreen: PropTypes.func.isRequired,
        onEditScreenChoiceLabel: PropTypes.func.isRequired,
        onEditScreenChoiceTarget: PropTypes.func.isRequired,
        onEditScreenContent: PropTypes.func.isRequired,
        onEditScreenName: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        otherScreens: PropTypes.arrayOf(PropTypes.object).isRequired,
        screen: PropTypes.object.isRequired,
        screenChoices: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            screenName: this.props.screen.name,
            screenContent: this.props.screen.content,
        };
    }

    addChoice = () => {
        this.props.onAddScreenChoice(this.props.screen.id);
    };

    componentWillReceiveProps(nextProps) {
        this.setState(() => ({
            screenName: nextProps.screen.name,
            screenContent: nextProps.screen.content,
        }));
    }

    getOnChangeChoiceLabelHandler = (choiceId) => {
        return (e) => {
            const label = e.target.value;
            this.props.onEditScreenChoiceLabel(choiceId, label);
        };
    };

    getOnDeleteChoiceHandler = (choiceId) => {
        return () => {
            if (!confirm('Do you really want to delete this choice?')) {
                return;
            }

            this.props.onDeleteScreenChoice(choiceId);
        };
    };

    onChangeNameHandler = (e) => {
        const screenName = e.target.value;

        this.setState(() => ({ screenName }), () => {
            this.props.onEditScreenName(this.props.screen.id, screenName);
        });
    };

    onChangeContentHandler = (e) => {
        const screenContent = e.target.value;

        this.setState(() => ({ screenContent }), () => {
            this.props.onEditScreenContent(this.props.screen.id, screenContent);
        });
    };

    getOnChangeChoiceTargetHandler = (choiceId) => {
        return (e) => {
            const targetId = e.target.value;
            this.props.onEditScreenChoiceTarget(choiceId, targetId);
        };
    };

    onDeleteHandler = () => {
        if (!confirm('Do you really want to delete this screen?')) {
            return;
        }

        this.props.screen.choicesIds.forEach(choiceId => this.props.onDeleteScreenChoice(choiceId));
        this.props.onDeleteScreen(this.props.screen.id);
        this.props.onClose();
    };

    renderChoicesList() {
        return (
            <table>
                <thead>
                <tr>
                    <th>Label</th>
                    <th>Target screen</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.screenChoices.map(choice => (
                        <tr key={ choice.id }>
                            <td>
                                <input
                                    autoFocus={ !choice.label.length }
                                    value={ choice.label }
                                    onChange={ this.getOnChangeChoiceLabelHandler(choice.id) }
                                    type="text"
                                />
                            </td>
                            <td>
                                <select
                                    onChange={ this.getOnChangeChoiceTargetHandler(choice.id) }
                                    defaultValue={ choice.targetScreenId || null }
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
                            <td>
                                <button
                                    onClick={ this.getOnDeleteChoiceHandler(choice.id) }
                                    title="Delete this choice"
                                >💣</button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        );
    }

    renderNoChoices() {
        return <p>This screen has no choices yet.</p>;
    }

    renderChoices() {
        if (this.props.screenChoices.length) {
            return this.renderChoicesList();
        }

        return this.renderNoChoices();
    }

    renderChoicesContainer() {
        if (!this.props.otherScreens.length) {
            return null;
        }

        return (
            <div>
                <label>Choices:</label>
                <div>
                    { this.renderChoices() }
                    <button
                        onClick={ this.addChoice }
                        title="Add choice"
                        className="screenEdit__addChoice"
                    >🏃</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <section className="screenEdit__overlay">
                <div className="screenEdit__content">
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
                    { this.renderChoicesContainer() }

                    <footer className="screenEdit__footer">
                        <button
                            onClick={ this.onDeleteHandler }
                            title="Delete screen"
                            className="screenEdit__delete"
                        >💣</button>
                        <button
                            onClick={ this.props.onClose }
                            title="Submit"
                            className="screenEdit__submit"
                        >✔️</button>
                    </footer>
                </div>
            </section>
        );
    }
}

export default ScreenEdit;