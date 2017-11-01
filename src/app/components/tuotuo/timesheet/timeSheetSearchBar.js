/**
 * Created by AllenFeng on 2017/7/11.
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
        projects: [],
        selectTeams: [],
        selectMembers: [],
        selectProjects: []
    }

    componentDidMount() {
        const {accessToken}=this.props;
        getQueryParams(accessToken).then(params => {
            let members = [];
            let projects = [];
            _.forEach(params, (team) => {
                _.forEach(team.teamMembers, (teamMember) => {
                    let member = _.find(members, (member) => {
                        return member.userID == teamMember.userID
                    })
                    if (!member) {
                        members.push(teamMember);
                        _.forEach(teamMember.userProjects, (userProject) => {
                            let project = _.find(projects, (project) => {
                                return project.projectID == userProject.projectID
                            })

                            if (!project) {
                                projects.push(userProject)
                            }
                        })
                    }
                })
            })
            this.setState({teams: params, members, projects});
        })
    }

    filterMembers = (teams) => {
        let members = [];
        let projects = [];
        _.forEach(teams, (team) => {
            _.forEach(team.teamMembers, (teamMember) => {
                let member = _.find(members, (member) => {
                    return member.userID == teamMember.userID
                })
                if (!member) {
                    members.push(teamMember)
                    _.forEach(teamMember.userProjects, (userProject) => {
                        let project = _.find(projects, (project) => {
                            return project.projectID == userProject.projectID
                        })

                        if (!project) {
                            projects.push(userProject)
                        }
                    })
                }
            })
        })
        return {members, projects}
    }

    filterProjects = (members) => {
        let projects = [];
        _.forEach(members, (member) => {
            _.forEach(member.userProjects, (userProject) => {
                let project = _.find(projects, (project) => {
                    return project.projectID == userProject.projectID
                })

                if (!project) {
                    projects.push(userProject)
                }
            })
        })
        return {projects}
    }

    render() {
        const {query, i18n}=this.props;
        return <div className="ts-search-bar">
            <Row className="ts-search-item">
                <Col span={2} className="search-tag date"><span>{i18n.timeRange}</span></Col>
                <Col span={22} className="search-wrapper">
                    <div className="date-range"><i
                        className="iconfont icon-calendar"/><span>{moment(this.state.startTime).format('MM-DD')}
                        {` ${i18n.to} `}{moment(this.state.endTime).format('MM-DD')}</span>
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
                                query(+dates[0], +dates[1], _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID), _.map(this.state.selectProjects, project => project.projectID))
                                this.setState({
                                    startTime: +dates[0],
                                    endTime: +dates[1]
                                })
                            }}
                            allowClear={false}

                        />
                    </div>
                </Col>
            </Row>
            <Row className="ts-search-item">
                <Col span={2} className="search-tag"><span>{i18n.team}</span></Col>
                <div className="search-wrapper all clearfix">
                    <div
                        className={classnames({'search-item': true, 'active': this.state.selectTeams.length === 0})}
                        onClick={() => {
                            let filterTeam = this.filterMembers(this.state.teams);
                            query(this.state.startTime, this.state.endTime);
                            this.setState({
                                selectTeams: [],
                                selectMembers: [],
                                selectProjects: [],
                                members: filterTeam.members,
                                projects: filterTeam.projects
                            })
                        }}><span>{i18n.all}</span>
                    </div>
                </div>
                <Col span={20} className="search-wrapper">
                    {this.state.teams && _.map(this.state.teams, (team, i) => {
                        if (_.find(this.state.selectTeams, {'teamID': team.teamID})) {
                            return <div key={i} className="search-item active" onClick={
                                () => {
                                    this.setState((prevState) => {
                                        _.remove(prevState.selectTeams, (item) => {
                                            return item.teamID == team.teamID
                                        })
                                        let filterTeam = this.filterMembers(prevState.selectTeams.length > 0 ? prevState.selectTeams : prevState.teams);
                                        query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID))
                                        return {
                                            selectTeams: prevState.selectTeams,
                                            selectMembers: [],
                                            selectProjects: [],
                                            members: filterTeam.members,
                                            projects: filterTeam.projects
                                        }
                                    })
                                }
                            }><span>{team.teamName}</span></div>
                        } else {
                            return <div key={i} className="search-item" onClick={
                                () => {
                                    this.setState((prevState) => {
                                        prevState.selectTeams.push(team);
                                        let filterTeam = this.filterMembers(prevState.selectTeams);
                                        query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID))
                                        return {
                                            selectTeams: prevState.selectTeams,
                                            selectMembers: [],
                                            selectProjects: [],
                                            members: filterTeam.members,
                                            projects: filterTeam.projects
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
                    <div
                        className={classnames({'search-item': true, 'active': this.state.selectMembers.length === 0})}
                        onClick={() => {
                            let filterMember = this.filterProjects(this.state.members);
                            query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID))
                            this.setState({
                                selectMembers: [],
                                selectProjects: [],
                                projects: filterMember.projects
                            })
                        }}>
                        <span>{i18n.all}</span>
                    </div>
                </div>
                <Col span={20} className="search-wrapper">
                    {this.state.members && _.map(this.state.members, (member, i) => {
                        if (_.find(this.state.selectMembers, {'userID': member.userID})) {
                            return <div className="search-item active"
                                        key={i} onClick={() => {
                                this.setState((prevState) => {
                                    _.remove(prevState.selectMembers, (item) => {
                                        return item.userID == member.userID
                                    })
                                    let filterMember = this.filterProjects(prevState.selectMembers.length > 0 ? prevState.selectMembers : prevState.members);
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(prevState.selectMembers, member => member.userID))
                                    return {
                                        selectMembers: prevState.selectMembers,
                                        selectProjects: [],
                                        projects: filterMember.projects
                                    }
                                })
                            }}><span>{member.userName}</span></div>
                        } else {
                            return <div className="search-item"
                                        key={i} onClick={() => {
                                this.setState((prevState) => {
                                    prevState.selectMembers.push(member);
                                    let filterMember = this.filterProjects(prevState.selectMembers);
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(prevState.selectMembers, member => member.userID))
                                    return {
                                        selectMembers: prevState.selectMembers,
                                        selectProjects: [],
                                        projects: filterMember.projects
                                    }
                                })
                            }}><span>{member.userName}</span></div>
                        }
                    })}
                </Col>
            </Row>
            <Row className="ts-search-item">
                <Col span={2} className="search-tag"><span>{i18n.project}</span></Col>
                <div className="search-wrapper all clearfix">
                    <div
                        className={classnames({'search-item': true, 'active': this.state.selectProjects.length === 0})}
                        onClick={() => {
                            query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID))
                            this.setState({
                                selectProjects: []
                            })
                        }}>
                        <span>{i18n.all}</span>
                    </div>
                </div>
                <Col span={20} className="search-wrapper">
                    {this.state.projects && _.map(this.state.projects, (project, i) => {
                        if (_.find(this.state.selectProjects, {'projectID': project.projectID})) {
                            return <div className="search-item active"
                                        key={i} onClick={() => {
                                this.setState((prevState) => {
                                    _.remove(prevState.selectProjects, (item) => {
                                        return item.projectID == project.projectID;
                                    })
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID), _.map(prevState.selectProjects, project => project.projectID));
                                    return {
                                        selectProjects: prevState.selectProjects,
                                    }
                                })
                            }}><span>{project.projectName}</span></div>
                        }
                        else {
                            return <div className="search-item"
                                        key={i} onClick={() => {
                                this.setState((prevState) => {
                                    prevState.selectProjects.push(project);
                                    query(this.state.startTime, this.state.endTime, _.map(this.state.selectTeams, team => team.teamID), _.map(this.state.selectMembers, member => member.userID), _.map(prevState.selectProjects, project => project.projectID));
                                    return {
                                        selectProjects: prevState.selectProjects
                                    }
                                })
                            }}><span>{project.projectName}</span></div>
                        }
                    })}
                </Col>
            </Row>
        </div>
    }
}

export default TimeSheetSearchBar;