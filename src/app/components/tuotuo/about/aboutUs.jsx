import {Dropdown, Menu, Icon, Row, Col} from 'antd'

class AboutUs extends React.Component{
    render() {
        return (
            <div className="aboutUs page-cont">
                <div className="au-hd">
                    <p className="au-title">关于我们</p>
                    <div className="au-title-subLine"></div>
                    <p className="au-intro">我们致力于让工作简便，有序，统一。我们认同并遵守敏捷宣言，工作及管理全程采用敏捷开发模式（Scrum）。我们成立5年多来，凭借敏捷开发模式创造了不菲的工作成绩和独特的公司文化。敏捷团队在更公开透明，更平等的环境下，藉由团队成员自身的高素质和成员间的高度信任，不断创造着新纪录，我们也为此颇为骄傲。</p>
                </div>
                <div className="au-bd">
                    <p className="au-title">团队成员</p>
                    <div className="au-title-subLine"></div>
                    <Row type="flex" justify="center">
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/304.jpg" alt=""/>
                                <p className="memberName">沈罗熠</p>
                                <p className="memberJob">CEO</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/bell.jpg" alt=""/>
                                <p className="memberName">刘健</p>
                                <p className="memberJob">高级软件工程师</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/bennet.jpg" alt=""/>
                                <p className="memberName">王道斌</p>
                                <p className="memberJob">高级.net工程师</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/allen.jpg" alt=""/>
                                <p className="memberName">冯轶俊</p>
                                <p className="memberJob">高级.net工程师/前端</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/loome.jpg" alt=""/>
                                <p className="memberName">周翔</p>
                                <p className="memberJob">产品/UI/UED</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/emily.jpg" alt=""/>
                                <p className="memberName">叶洪</p>
                                <p className="memberJob">产品</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/will.jpg" alt=""/>
                                <p className="memberName">汪浩</p>
                                <p className="memberJob">前端工程师</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/carrie.jpg" alt=""/>
                                <p className="memberName">CarrieYao</p>
                                <p className="memberJob">交互/视觉设计师</p>
                            </div>
                        </Col>
                        <Col className="memberIntro" span={5}>
                            <div>
                                <img className="memberPic" src="/image/developer/carol.jpg" alt=""/>
                                <p className="memberName">CarolXu</p>
                                <p className="memberJob">测试工程师</p>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="au-ft">
                    <p className="au-title">特别鸣谢</p>
                    <div className="au-title-subLine"></div>
                    <Row className="thankMembers" type="flex" justify="center">
                        <Col span={2}>骆姜斌</Col>
                        <Col span={2}>冯璇</Col>
                        <Col span={2}>刘君伟</Col>
                        <Col span={2}>邵鹏</Col>
                        <Col span={2}>姚剑钊</Col>
                    </Row>
                </div>
                <img className="mintCodeLog" src="/image/mintcodelogo.png" alt=""/>
            </div>
        )
    }

}

export default AboutUs;