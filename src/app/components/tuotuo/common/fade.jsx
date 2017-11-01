/**
 * Created by AllenFeng on 2017/7/19.
 */
import {TransitionGroup, CSSTransition}  from 'react-transition-group';

const Fade = props => (
    <TransitionGroup component={props.component || 'div'} appear>
        <CSSTransition
            classNames={props.className || 'transitionWrapper'}
            timeout={props.timeout || 1500}
            in={true}
        >
            <div>{React.cloneElement(props.children, {...props})}</div>
        </CSSTransition>
    </TransitionGroup>
)

export default Fade;