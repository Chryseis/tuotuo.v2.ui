/**
 * Created by Administrator on 2017/8/27.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import classnames from 'classnames';
import Notice from './Notice';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition'
import './index.less';

let seed = 0;
const now = Date.now();

function getUuid() {
    return `rcNotification_${now}_${seed++}`;
}

class Notification extends Component {
    static propTypes = {
        prefixCls: PropTypes.string,
        transitionName: PropTypes.string,
        animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        style: PropTypes.object,
    };

    static defaultProps = {
        prefixCls: 'rc-notification',
        animation: 'haha',
        style: {
            top: 65,
            left: '50%',
        },
        handleEnter(elem) {
            elem.style.top = '0px'
        },

        handleEntering(elem){
            elem.style.top = '100px'
        },
        handleEntered(elem){
            elem.style.top = '100px'
        },
        handleExit(elem) {
            elem.style.top = '100px'
        },
        handleExiting (elem) {
            elem.style.top = '200px'
        }
    };

    state = {
        notices: [],
    };

    getTransitionName() {
        const props = this.props;
        let transitionName = props.transitionName;
        if (!transitionName && props.animation) {
            transitionName = `${props.animation}`;
        }
        return transitionName;
    }

    add = (notice) => {
        const key = notice.key = notice.key || getUuid();
        this.setState(previousState => {
            const notices = previousState.notices;
            if (!notices.filter(v => v.key === key).length) {
                return {
                    notices: notices.concat(notice),
                };
            }
        });
    }

    remove = (key) => {
        this.setState(previousState => {
            return {
                notices: previousState.notices.filter(notice => notice.key !== key),
            };
        });
    }

    handleEnter = (elem) => {
        elem.style.top = '10px'
    }

    handleEntering = (elem) => {
        elem.style.top = '100px'
    }

    handleEntered = (elem) => {
        elem.style.top = '100px'
    }

    handleExit = (elem) => {
        elem.style.top = '100px'
    }

    handleExiting = (elem) => {
        elem.style.top = '190px'
    }

    render() {
        const props = this.props;
        const noticeNodes = this.state.notices.map((notice) => {
            const onClose = createChainedFunction(this.remove.bind(this, notice.key), notice.onClose);
            return (<Notice
                prefixCls={props.prefixCls}
                {...notice}
                onClose={onClose}
            >
                {notice.content}
            </Notice>);
        });
        const className = {
            [props.prefixCls]: 1,
            [props.className]: !!props.className,
        };
        return (
            <div className={classnames(className)} style={props.style}>
                <TransitionGroup component="span">
                    {
                        this.state.notices.map((notice) => {
                            const onClose = createChainedFunction(this.remove.bind(this, notice.key), notice.onClose);
                            return (<CSSTransition
                                in={false}
                                timeout={notice.duration * 1000}
                                onEnter={this.props.handleEnter}
                                onEntering={this.props.handleEntering}
                                onEntered={this.props.handleEntered}
                                onExit={this.props.handleExit}
                                onExiting={this.props.handleExiting}
                                classNames={this.getTransitionName()}
                                key={notice.key}
                            >
                                <Notice
                                    prefixCls={props.prefixCls}
                                    {...notice}
                                    onClose={onClose}
                                >
                                    {notice.content}
                                </Notice></CSSTransition>);
                        })
                    }
                </TransitionGroup>
            </div>
        );
    }
}

Notification.newInstance = function newNotificationInstance(properties) {
    const {getContainer, ...props} = properties || {};
    let div;
    if (getContainer) {
        div = getContainer();
    } else {
        div = document.createElement('div');
        document.body.appendChild(div);
    }
    const notification = ReactDOM.render(<Notification {...props} />, div);
    return {
        notice(noticeProps) {
            notification.add(noticeProps);
        },
        removeNotice(key) {
            notification.remove(key);
        },
        component: notification,
        destroy() {
            ReactDOM.unmountComponentAtNode(div);
            if (!getContainer) {
                document.body.removeChild(div);
            }
        },
    };
};

export default Notification;
