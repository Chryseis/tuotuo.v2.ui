/**
 * Created by AllenFeng on 2017/7/12.
 */
import {Modal, Row, Col, Avatar, Icon, Input, Select, InputNumber, Button, Popover, DatePicker} from 'antd';
import echarts from 'echarts';
import {apihost} from '../../../constants/apiConfig'

class TimeSheetChartItem extends React.Component {

    componentDidMount() {
        const {timeSheetTimeInfos, userID}=this.props.userInfo;

        let projects = _.map(timeSheetTimeInfos, (timesheet) => {
            return timesheet.projectName;
        });

        let totalTimes = _.map(timeSheetTimeInfos, (timesheet) => {
            return timesheet.totalTime;
        })

        let option = {
            color: ['#A2C6FF'],
            tooltip: {
                triggerOn: 'none',
            },
            grid: {
                top: 20,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: timeSheetTimeInfos && timeSheetTimeInfos.length > 0 ? projects : [],
                    axisTick: {
                        alignWithLabel: true,
                        lineStyle: {
                            width: 0
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            type: 'solid'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            width: 0
                        }
                    }
                }
            ],
            series: [
                {
                    name: '时间',
                    type: 'bar',
                    label: {
                        normal: {
                            show: timeSheetTimeInfos && timeSheetTimeInfos.length > 0 ? true : false,
                            position: 'top'
                        }
                    },
                    data: timeSheetTimeInfos && timeSheetTimeInfos.length > 0 ? totalTimes : [300],
                    barWidth: '40px',
                    itemStyle: {
                        normal: {
                            opacity: timeSheetTimeInfos && timeSheetTimeInfos.length > 0 ? 1 : 0
                        }
                    }
                }
            ]
        }

        let chart = echarts.init(this.chartDom1);
        chart.setOption(
            option
        )

       this.resize = () => {
            chart && chart.resize();
        }

        window.addEventListener('resize', () => {
            this.resize();
        })
    }

    componentWillUnmount() {
        document.removeEventListener('resize', this.resize);
    }

    render() {
        const {userInfo}=this.props;
        return <Col className="ts-report-item chart" span={12}>
            <Row className="member chart">
                <Col className="left" span={16}><Avatar size="large"
                                                        src={`${apihost}/user/GetUserAvatar?selectUserMail=${userInfo.userName}`}/><span
                    className="name">{userInfo.userName}</span></Col>
                <Col className="right" span={8}><Icon
                    type="clock-circle-o"/><span>{_.sum(_.map(userInfo.timeSheetTimeInfos, (timesheet) => timesheet.totalTime))}</span></Col>
            </Row>
            <Row className="chart-view">
                <div style={{width: '100%', height: '100%'}} ref={dom => this.chartDom1 = dom}></div>
            </Row>
        </Col>
    }
}

export default TimeSheetChartItem;