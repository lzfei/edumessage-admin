'use strict';

import PublishModel from '../../model/admin/publish';
import formidable from 'formidable';
import moment from 'moment';

class Publish {
    constructor() {
    }

    // 添加发表内容
    async publish(req, res, next) {
        const form = req.body;
        form['date'] = moment().format('YYYY-MM-DD HH:mm');
        if (form['source'] === 1) {
            form['user_des'] = '微信用户'
        }else {
            form['user_des'] = '平台用户'
        }
        try {
            const newPublish = new PublishModel(form);
            await PublishModel.create(newPublish);
            res.send({
                status: 1,
                type: 'SUCCESS',
                message: '添加成功'
            })

        } catch (error) {

        }
    }

    // 获取发布列表
    async getPublishList(req, res, next) {
        try {
            const { limit = 5, offset = 0 } = req.body;
            let list = await PublishModel.find().skip(Number(offset)).limit(Number(limit)).sort({ 'date': -1 });
            res.send({
                status: 1,
                data: list,
                type: 'SUCCESS',
                message: '请求成功'
            })

        } catch (error) {

        }
    }

    // 根据id获取发布详细信息
    async getPublishDetail(req, res, next) {
        const form = req.body;
        try {
            let response = await PublishModel.findOne({ _id: form._id });
            res.send({
                status: 1,
                type: 'SUCCESS',
                data: response,
                message: '请求成功'
            })
        } catch (error) {
            console.log(error);
        }
    }

    // 获取hot发布列表
    async getHotPublishList(req, res, next) {
        try {
            const { limit = 2, offset = 0, category = 0 } = req.body;
            let list = await PublishModel.find({ category: category}).skip(Number(offset)).limit(Number(limit)).sort({ 'answer_count': -1 });
            res.send({
                status: 1,
                data: list,
                type: 'SUCCESS',
                message: '请求成功'
            })

        } catch (error) {

        }
    }
}

export default new Publish();