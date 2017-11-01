/**
 * Created by AllenFeng on 2017/6/22.
 */
import moment from 'moment';

class ReleaseDropDown extends React.Component {
    render() {
        const {release,changeSprint,selectCurrentSprint,newRelease}=this.props;
        return <div className="Popups backlogdrop">
            <div className="p-cont sprint-List-select">
                <ul className="sprint-List">
                    {release && release.length > 0 && release.map((item, i) => {
                        return <li className="sprint-list-li" key={i}>
                                <span className="sprint-title" title={item.releaseInfo.releaseName}>{item.releaseInfo.releaseName}</span>
                            <ul>
                                {item.sprintInfoList && item.sprintInfoList.length > 0 && item.sprintInfoList.map((sprint, j) => {
                                    return <li className={classnames({'tran': true, 'active': sprint.selected})}
                                               key={j} onClick={()=>{changeSprint({releaseName:item.releaseInfo.releaseName,...sprint});selectCurrentSprint(sprint.ID)}}>
                                        <span className="sprint-v" title="release2 - sprint3">{`${item.releaseInfo.releaseName} - sprint${sprint.no}`}</span>
                                        <span className="sprint-date">{moment(sprint.startTimestamp).format('YYYY/MM/DD') + '-' + moment(sprint.endTimestamp).format('YYYY/MM/DD')}</span>
                                        <i className={classnames({
                                            'sprint-check': true,
                                            'iconfont': true,
                                            'icon-check-circle': sprint.state == 1,
                                            'icon-circle': sprint.state == 0
                                        })}/>
                                    </li>
                                })}
                            </ul>
                        </li>
                    })}
                </ul>
            </div>
            <p className="sprint-List-ft">
                <a className="ctl-sprint-btn" onClick={newRelease}><i className="iconfont icon-settings"/>管理迭代</a>
            </p>
        </div>
    }
}

export default ReleaseDropDown;