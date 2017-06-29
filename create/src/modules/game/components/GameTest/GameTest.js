import './gameTest.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux'

import screensSelectors from 'Modules/screens/selectors';
import screensChoicesSelectors from 'Modules/screensChoices/selectors';

import { finishTestGame } from 'Modules/app/actions';

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
        const linkStyle = document.createElement('link');
        linkStyle.setAttribute('rel', 'stylesheet');
        linkStyle.setAttribute('href', 'https://rawgit.com/adrien-gueret/yath/master/yath.css');
        iframe.contentDocument.head.appendChild(linkStyle);

        const iframeContent = this.props.screens.map(screen => screen.toHTML(this.props.screensChoices)).join('');
        iframe.contentDocument.body.innerHTML = iframeContent;

        const myGame = new window.yath.Game(null, null, iframe.contentDocument.body);
        myGame.goToScreen(this.props.startScreen.id);
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