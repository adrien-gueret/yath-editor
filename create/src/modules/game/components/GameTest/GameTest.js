import './gameTest.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';

import { finishTestGame } from 'Modules/app/actions';

import { getHtmlGame, getStartGameScript, fetchYathCSS, fetchYathJS } from '../../services';

class GameTest extends React.Component {
    static propTypes = {
        finishTestGame: PropTypes.func.isRequired,
        screens: PropTypes.arrayOf(PropTypes.object),
        screensChoices: PropTypes.object,
        startScreen: PropTypes.object,
    };

    static defaultProps = {
        screens: [],
        screensChoices: {},
        startScreen: null,
    };

    onIframeReady = (iframe) => {
        if (!iframe) {
            return;
        }

        Promise.all([
            fetchYathCSS(),
            fetchYathJS(),
        ]).then((responses) => {
            const [cssContent, jsContent] = responses;

            const yathStyle = document.createElement('style');
            yathStyle.appendChild(document.createTextNode(cssContent));
            iframe.contentDocument.head.appendChild(yathStyle);

            const yathScript = document.createElement('script');
            yathScript.appendChild(document.createTextNode(jsContent));
            iframe.contentDocument.head.appendChild(yathScript);

            iframe.contentDocument.body.innerHTML = getHtmlGame(this.props.screens, this.props.screensChoices);

            const gameContent = getStartGameScript(this.props.startScreen.id);
            const gameScript = document.createElement('script');
            gameScript.appendChild(document.createTextNode(gameContent));

            iframe.contentDocument.body.appendChild(gameScript);
        });
    };

    render() {
        return (
            <section className="gameTest__overlay">
                <div className="gameTest__content">
                    <button className="gameTest__close" onClick={this.props.finishTestGame}>❌</button>
                    <iframe ref={this.onIframeReady} />
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    screens: screensSelectors.getAsArray(state),
    startScreen: screensSelectors.getStart(state),
    screensChoices: screensChoicesSelectors.get(state),
});

const mapDispatchToProps = (dispatch) => ({
    finishTestGame() {
        dispatch(finishTestGame());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(GameTest);