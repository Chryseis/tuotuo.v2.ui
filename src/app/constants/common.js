/**
 * Created by AllenFeng on 2017/5/15.
 */
const codeType = {
    register: 1,
    binduser: 2,
    findback: 3
}

const resCode={
    OK:8200,
    LogicError:8300,
    UserInputValidateError:8400,
    UnAuthenticate:8401,
    UnAuthorize:8402,
    FrontInputValidateError:8403,
    InternalServerError:8500
}

const roleName={
    OWNER:'拥有者',
    MANAGER:'管理者',
    MEMBER:'成员'
}

const sliderName={
    EditProject:'EditProject',
    EditTeam:'EditTeam'
}

const taskState={
    1:'Todo',
    2:'InProgress',
    3:'Done',
    4:'Delete'
}

export {codeType,resCode,roleName,sliderName,taskState}