/**
 * Created by AllenFeng on 2017/4/12.
 */
const juyueConfig={
    client_id:'Test',
    repsonse_type:'code',
    authorizePath:'http://192.168.1.32:8081/cas/oauth2.0/authorize',
    redirect_uri:`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/thirdBind?agent=juyue`,
    inner_redirect_uri:`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/thirdBind?agent=juyue`
}

const qqConfig={
    appID:'1106387768',
    appKey:'LXHIpofufh09ClWA',
    repsonse_type:'code',
    authorizePath:'https://graph.qq.com/oauth2.0/authorize',
    redirect_uri:encodeURI(`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/thirdBind?agent=qq`),
    inner_redirect_uri:encodeURI(`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/tuotuo/UserCenter?agent=qq`),
}

export {juyueConfig,qqConfig}