'use strict';
import config from '../../config/default';
import https from 'https';

class Login {
    constructor() {
    }
    // 获取微信用户凭证
    async getOpenId(req, res, next) {
        const form = req.body;
        try {
            let resInfo = null;
            // https.get('https://api.weixin.qq.com/sns/jscode2session?appid=' + config.appid + '&secret=' + config.secret + '&js_code=' + form.code + '&grant_type=authorization_code', function (req, res) {
            https.get('https://www.baidu.com', function (req, res) {
                console.log(res);
                res.on('data', function (data) {
                    console.log(data);
                });
                res.on("end", function () {
                    var buff = Buffer.concat(datas, size);
                    var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring
                    console.log(result);
                })

            });
            res.send({
                status: 1,
                data: resInfo,
                type: 'SUCCESS',
                message: '请求成功'
            })

        } catch (error) {

        }
    }
}

export default new Login();