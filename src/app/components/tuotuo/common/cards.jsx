/**
 * Created by AllenFeng on 2017/5/31.
 */
import {imgRequest, imageRequest_2} from '../../../utils/imgUtil'
import {Link, Redirect} from 'react-router-dom';
import {Tooltip, Card, Row, Col} from 'antd';

class Cards extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {imgLoad}=this.props;
        const {projectAvatar, teamAvatar} =this.props.info;
        (projectAvatar || teamAvatar) && imgLoad(projectAvatar || teamAvatar);
    }

    componentWillReceiveProps(nextProps) {
        const {imgLoad, type}=this.props;
        if (this.props.info.projectAvatar != nextProps.info.projectAvatar) {
            nextProps.info.projectAvatar && imgLoad(nextProps.info.projectAvatar);
        }
        if (this.props.info.teamAvatar != nextProps.info.teamAvatar) {
            nextProps.info.teamAvatar && imgLoad(nextProps.info.teamAvatar);
        }
    }

    redirect(uri) {
        const {history}=this.props;
        history.push(uri)
    }

    render() {
        const {isBackIcon = false, info, type} = this.props;
        let isProject = type == "project" ? true : false;
        let defaultBgUrl = isProject ? '/image/card-bg2.png' : '/image/card-bg.png';
        let bgUrl = info.bgUrl || defaultBgUrl;
        return (<Col xs={{span:8}} sm={{span:8}} md={{span:8}} lg={{span:6}}>
            <Card className={classnames({'card ':true,'team-card': !isProject, 'pro-card': isProject})}    style={{backgroundImage: `url(${bgUrl})`}}
                  onClick={isProject && this.redirect.bind(this, `/tuotuo/projectdetail/${info.projectID}`)}>
                <div className="card-mask"></div>
                <div className={classnames({'card-intro': !isProject, 'card-msg': isProject})}>
                    <p className="cardName">{info.projectName || info.teamName}</p>
                    {(info.projectSummary || info.teamSummary) &&
                    <p className="cardSummary">{info.projectSummary || info.teamSummary}</p>}
                </div>
                {isBackIcon && <Row className="card-cont" type="flex" align="middle" justify="center">
                    <Tooltip title="白板" mouseEnterDelay={0.5}>
                        <Col span={7}>
                            <div className="cc cc1" onClick={this.redirect.bind(this, `/tuotuo/whiteboard/${info.teamID}`)}>
                                <i className="iconfont icon-grid-squares"></i>
                            </div>
                        </Col>
                    </Tooltip>
                    {info.roleCode != 'MEMBER'&&<Tooltip title="backlog" mouseEnterDelay={0.5}>
                        <Col span={7}>
                            <div className="cc cc2" onClick={this.redirect.bind(this, `/tuotuo/backlog/${info.teamID}`)}>
                                <i className="iconfont icon-list"></i>
                            </div>
                        </Col>
                    </Tooltip>}
                    <Tooltip title="成员" mouseEnterDelay={0.5}>
                        <Col span={7}>
                            <div className="cc cc3 members" onClick={this.redirect.bind(this, `/tuotuo/teamdetail/${info.teamID}`)}>
                                <i className="iconfont icon-users"></i>
                            </div>
                        </Col>
                    </Tooltip>
                    {info.roleCode == 'MEMBER' &&<Col span={7}></Col>}
                </Row>}
                {info.roleCode == 'OWNER' && <div className="xiabiao">
                    <Tooltip title="拥有者">
                        <i className="iconfont icon-owner"></i>
                    </Tooltip>
                </div>}
            </Card>
        </Col>)


    }
}


export default Cards;