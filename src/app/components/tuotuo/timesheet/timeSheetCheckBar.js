/**
 * Created by WillWang on 2017/7/18.
 */
import {Row, Col, DatePicker} from 'antd';
import moment from 'moment';
import {getQueryParams} from '../../../actions/TimeSheet'

const RangePicker = DatePicker.RangePicker;
class TimeSheetSearchBar extends React.Component {
    state = {
        startTime: +moment().day(1),
        endTime: +moment().day(7),
        teams: [],
        members: [],
        status: [0, 1, 2], //0:待填写  1:已提交  2:已审核
        selectTeams: [],
        selectMembers: [],
        selectStatus: []
    }


    componentDidMount() {
        const {accessToken}=this.props;
        getQueryParams(accessToken).then(params => {
            let members = [];
            _.forEach(params, (team) => {
                _.forEach(team.teamMembers, (teamMember) => {
                    let member = _.find(members, (member) => {
                        return member.userID == teamMember.userID
                    });
                    if (!member) {
                        members.push(teamMember);
                    }
                })
            });
            this.setState({teams: params, members});

        })
    }

    filterMembers = (teams) => {
        let members = [];
        _.forEach(teams, (team) => {
            _.forEach(team.teamMembers, (teamMember) => {
                let member = _.find(members, (member) => {
                    return member.userID == teamMember.userID
                });
                if (!member) {
                    members.push(teamMember);
                }
            })
        });
        return {members}
    };

    render() {
        const {query, i18n} = this.props;
        return <div className="ts-search-bar">
            <Row className="ts-search-item">
                <Col span={2} className="search-tag date"><span>{i18n.timeRange}</span></Col>
                <Col span={22} className="search-wrapper">
                    <div className="date-range"><i
                        className="iconfont icon-calendar"/><span>{moment(this.state.startTime).format('MM-DD')}
                        {` ${i18n.to} `} {moment(this.state.endTime).format('MM-DD')}</span>
                        <RangePicker
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                opacity: 0,
                                width: '100%',
                                height: '100%'
                            }}
                            defaultValue={[moment(this.state.startTime), moment(this.state.endTime)]}
                            format={'YYYY-MM-DD'}
                            onChange={(dates) => {
                                query(+dates[0], +dates[1], _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID), this.state.selectStatus);
                                this.setState({
                                    startTime: +dates[0],
                                    endTime: +dates[1]
                                });
                            }}
                            allowClear={false}
                        />
                    </div>
                </Col>
            </Row>
            <Row className="ts-search-item">
                <Col span={2} className="search-tag"><span>{i18n.team}</span></Col>
                <div className="search-wrapper all clearfix">
                    <div className={classnames({'search-item': true, 'active': this.state.selectTeams.length === 0})}
                         onClick={() => {
                             query(this.state.startTime, this.state.endTime);
                             let filterTeam = this.filterMembers(this.state.teams);
                             this.setState({
                                 selectTeams: [],
                                 selectMembers: [],
                                 selectProjects: [],
                                 members: filterTeam.members,
                                 projects: filterTeam.projects
                             });

                         }}
                    >
                        <span>{i18n.all}</span>
                    </div>
                </div>
                <Col span={20} className="search-wrapper">
                    {this.state.teams && _.map(this.state.teams, (team, i) => {
                        if (_.find(this.state.selectTeams, {'teamID': team.teamID})) {
                            return <div
                                key={i}
                                className="search-item active"
                                span={1}
                                onClick={() => {
                                    this.setState((prevState) => {
                                        _.remove(prevState.selectTeams, (item) => {
                                            return item.teamID == team.teamID
                                        });
                                        let filterTeam = this.filterMembers(prevState.selectTeams.length > 0 ? prevState.selectTeams : prevState.teams);
                                        query(this.state.startTime, this.state.endTime, _.map(prevState.selectTeams, team => team.teamID));
                                        return {
                                            selectTeams: prevState.selectTeams,
                                            selectMembers: [],
                                            members: filterTeam.members,
                                        }
                                    });
                                }
                                }><span>{team.teamName}</span></div>
                        } else {
                            return <div key={i} className="search-item" span={1} onClick={
                                () => {
                                    this.setState((prevState) => {
                                        prevState.selectTeams.push(team);
                                        let filterTeam = this.filterMembers(prevState.selectTeams);
                                        query(this.state.startTime, this.state.endTime, _.map(prevState.selectTeams, team => team.teamID));
                                        return {
                                            selectTeams: prevState.selectTeams,
                                            selectMembers: [],
                                            members: filterTeam.members,
                                        }
                                    });
                                }
                            }><span>{team.teamName}</span></div>
                        }
                    })}
                </Col>
            </Row>

            <Row className="ts-search-item">
                <Col span={2} className="search-tag"><span>{i18n.member}</span></Col>
                <div className="search-wrapper all clearfix">
                    <div className={classnames({'search-item': true, 'active': this.state.selectMembers.length === 0})}
                         onClick={() => {
                             query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID));
                             this.setState({
                                 selectMembers: [],
                             });
                         }}><span>{i18n.all}</span>
                    </div>
                </div>
                <Col span={20} className="search-wrapper">
                    {this.state.members && _.map(this.state.members, (member, i) => {
                        if (_.find(this.state.selectMembers, {'userID': member.userID})) {
                            return <div className="search-item active" span={1}
                                        key={i} onClick={() => {
                                this.setState((prevState) => {
                                    _.remove(prevState.selectMembers, (item) => {
                                        return item.userID == member.userID
                                    });
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(prevState.selectMembers, member => member.userID));
                                    return {
                                        selectMembers: prevState.selectMembers,
                                    }
                                });

                            }}><span>{member.userName}</span></div>
                        } else {
                            return <div className="search-item" span={1}
                                        key={i} onClick={() => {
                                this.setState((prevState) => {
                                    prevState.selectMembers.push(member);
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(prevState.selectMembers, member => member.userID));
                                    return {
                                        selectMembers: prevState.selectMembers,
                                    }
                                });
                            }}><span>{member.userName}</span></div>
                        }
                    })}
                </Col>
            </Row>

            <Row className="ts-search-item">
                <Col span={2} className="search-tag"><span>全部状态</span></Col>
                <div span={1} className="search-wrapper all clearfix">
                    <div className={classnames({'search-item': true, 'active': this.state.selectStatus.length === 0})}
                         onClick={() => {
                             query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID));
                             this.setState({
                                 selectStatus: [],
                             });
                         }}><span>{i18n.all}</span>
                    </div>
                </div>
                <Col span={20} className="search-wrapper">

                    {_.map(this.state.status, (status, i) => {
                        if (_.indexOf(this.state.selectStatus, status) != -1) {
                            return <div key={i} className="search-item active" span={1} onClick={() => {
                                this.setState((prevState) => {
                                    _.remove(prevState.selectStatus, (item) => {
                                        return item == status
                                    });
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID), prevState.selectStatus);
                                    return {selectStatus: prevState.selectStatus}
                                });
                            }}>
                                <span>{status == 0 ? i18n.uncommit : status == 1 ? i18n.commit : status == 2 ? i18n.approved : ''}</span>
                            </div>
                        } else {
                            return <div key={i} className="search-item" span={1} onClick={() => {
                                this.setState((prevState) => {
                                    prevState.selectStatus.push(status);
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID), prevState.selectStatus);
                                    return {selectStatus: prevState.selectStatus};
                                });

                            }
                            }>
                                <span>{status == 0 ? i18n.uncommit : status == 1 ? i18n.commit : status == 2 ? i18n.approved : ''}</span>
                            </div>
                        }
                    })}
                </Col>
            </Row>
        </div>
    }
}

export default TimeSheetSearchBar;