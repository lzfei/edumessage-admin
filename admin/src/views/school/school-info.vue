<style lang="less">
@import "../../styles/common.less";
@import "./school.less";
</style>

<template>
    <div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="university"></Icon>
                    机构详情
                </p>
                <Table :columns="school_col" :data="school_data"></Table>
            </Card>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <Row>
                   <Col span="12" offset="6">
                        <p slot="title">
                            <Icon type="qr-scanner"></Icon>
                            机构logo
                        </p>
                        <Row :gutter="10" class="image-editor">
                            <Col span="14" class="image-editor-con">
                                <div class="cropper">
                                    <img id="cropimg" alt="">
                                </div>
                            </Col>
                            <Col span="10" class="image-editor-con" style="margin-left:10px">
                                <Row type="flex" justify="center" align="middle" class="image-editor-con-preview-con">
                                    <div id="preview">
                                        <img :src="option.cropedImg" alt="" v-if="option.showCropedImage" style="width: 100%;">
                                    </div>
                                </Row>
                                <div class="image-editor-con-btn-con margin-top-10">
                                    <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" id="fileinput1" class="fileinput" />
                                    <label class="filelabel" for="fileinput1" v-if="!isHasLogo"><Icon type="image"></Icon>&nbsp;选择Logo</label>
                                    <label class="filelabel" for="fileinput1" v-if="isHasLogo"><Icon type="image"></Icon>&nbsp;更换Logo</label>
                                    <span><Button @click="handlecrop" type="primary" icon="crop" :disabled="disabled">裁剪上传</Button></span>
                                </div>
                                <Progress :percent="percent" v-if="showProgress"></Progress>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="12" offset="5">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                            <FormItem label="累计培养人次" prop="total">
                                <Input v-model="formValidate.total" placeholder="请输入累计培养人次"></Input>
                            </FormItem>
                            <FormItem label="创办人" prop="egalperson">
                                <Input v-model="formValidate.egalperson" placeholder="请输入创办人姓名"></Input>
                            </FormItem>
                            <FormItem label="机构邮箱" prop="mail">
                                <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
                            </FormItem>
                            <FormItem label="联系方式" prop="phone">
                                <Input v-model="formValidate.phone" placeholder="请输入电话号码"></Input>
                            </FormItem>
                            <FormItem label="工作时间" prop="working_time">
                                <Input v-model="formValidate.working_time" placeholder="请输入工作时间：周一至周六（8:00-18:00）"></Input>
                            </FormItem>
                            <FormItem
                                    v-for="(item, index) in formValidate.items"
                                    v-if="item.status"
                                    :key="index"
                                    :label="'教学科目' + item.index"
                                    :prop="'items.' + index + '.value'"
                                    :rules="{required: true, message: '教学科目' + item.index +' 不能为空', trigger: 'blur'}">
                                <Row>
                                    <Col span="18">
                                        <Input type="text" v-model="item.value" placeholder="输入科目名称，如：英语"></Input>
                                    </Col>
                                    <Col span="4" offset="1">
                                        <Button type="ghost" @click="handleRemove(index)">删除</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Row>
                                    <Col span="12">
                                        <Button type="dashed" long @click="handleAdd" icon="plus-round">添加科目</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="位置" prop="position">
                                <Input v-model="formValidate.position" placeholder="请输入详细地址"></Input>
                            </FormItem>
                            <FormItem label="简介" prop="desc">
                                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入机构简介"></Input>
                            </FormItem>
                            <Row :gutter="10" class="image-editor2">
                                <Col span="14" class="image-editor-con">
                                    <div class="cropper">
                                        <img id="cropimg2" alt="">
                                    </div>
                                </Col>
                                <Col span="10" class="image-editor-con" style="margin-left:10px">
                                    <Row type="flex" justify="center" align="middle" class="image-editor-con-preview-con">
                                        <div id="preview2">
                                        </div>
                                    </Row>
                                    <div class="image-editor-con-btn-con margin-top-10" style="width: 375px;height: 45px">
                                        <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange2" id="fileinput2" class="fileinput" />
                                        <label class="filelabel" for="fileinput2"><Icon type="image"></Icon>&nbsp;选择图片</label>
                                        <span><Button @click="handlecrop2" type="primary" icon="crop" :disabled="disabled2">裁剪上传</Button></span>
                                    </div>
                                    <Progress :percent="percent2" v-if="showProgress2"></Progress>
                                </Col>
                            </Row>
                            <div class="height-160px">
                                <div class="admin-upload-list" v-for="(item, index) in uploadList" :key="item.url">
                                    <template>
                                        <img :src="item">
                                        <div class="admin-upload-list-cover">
                                            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <FormItem style="margin-top:10px">
                                <Button type="primary" @click="handleSubmit('formValidate')" v-if="!isEdit">保存</Button>
                                <Button type="primary" @click="handleSubmit2('formValidate')" v-if="isEdit">编辑保存</Button>
                                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                            </FormItem>
                        </Form>
                     </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import Cropper from 'cropperjs';
import './cropper.min.css';
import * as qiniu from 'qiniu-js';
import util from '../../libs/util';
import { base64 } from 'js-base64';
import { getSchoolInfo, uploadLogo, addSchoolDetail, getSchoolDetail, updateSchoolDetail } from "../../service/getData";
export default {
  name: "school_info",
  data() {
    return {
       _id: '',
      showInfo: false,
      school_col: [
        {
          title: "ID",
          key: "_id",
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          align: "center"
        },
        {
          title: "擅长",
          key: "good",
          align: "center"
        },
        {
          title: "注册时间",
          key: "time",
          align: "center"
        },
        {
          title: "状态",
          key: "state",
          align: "center"
        }
      ],
      school_data: [],
      cropper: {},
      cropper2: {},
      option: {
        showCropedImage: false,
        cropedImg: ''
      },
      option2: {
        showCropedImage: false,
        cropedImg: ''
      },
      showProgress: false,
      percent: 0,
      showProgress2: false,
      percent2: 0,
      isHasLogo: false,
      disabled: true,
      disabled2: true,
      uploadList: [],
      // 表单
      isEdit: false,
      index: 1,
      formValidate: {
        _id: '',
        egalperson:'',
        mail: '',
        phone: '',
        position: '',
        desc: '',
        items: [
            {
                value: '',
                index: 1,
                status: 1
            }
        ],
        total: '',
        working_time: ''
        },
        ruleValidate: {
            total: [
                { required: true, message: '请填写累计培养人次', trigger: 'blur' }
            ],
            egalperson: [
                { required: true, message: '请填写创办人', trigger: 'blur' }
            ],
            phone: [
                { required: true, message: '请填写联系方式', trigger: 'blur' }
            ],
            mail: [
                { required: true, message: '请填写邮箱', trigger: 'blur' },
                { type: 'email', message: '请填写正确的邮箱', trigger: 'blur' }
            ],
            position: [
                { required: true, message: '请填写机构地址', trigger: 'blur' }
            ],
            working_time: [
                { required: true, message: '请填写工作时间', trigger: 'blur' }
            ],
            desc: [
                { required: true, message: '请填写机构简介', trigger: 'blur' },
                { type: 'string', min: 20, message: '不能少于20个字', trigger: 'blur' }
            ]
        }
           
    };
  },
  methods: {
    async init() {
      this._id = this.$route.params._id.toString();
      let school = await getSchoolInfo({ _id: this._id });
      this.school_data = [school["data"]];
      this.option.cropedImg = school['data']['logo'];
      this.option.showCropedImage = true;
      if(this.option.cropedImg) {
          this.isHasLogo = true;
      }
    },
    initData () {
        this.formValidate = {
                egalperson:'',
                mail: '',
                phone: '',
                position: '',
                desc: '',
                items: [
                    {
                        value: '',
                        index: 1,
                        status: 1
                    }
                ],
                image: [],
                total: '',
                working_time: ''
            }
    },
    async getSchoolDetail() {
        let res = await getSchoolDetail({ school_id: this._id });
        if(res['data']) {
            this.isEdit = true;
            this.formValidate = res['data'];
            this.uploadList = res['data']['image'];
        }else {
            this.isEdit = false
            this.initData();
        }
    },
    async handlecrop () {
        let _t = this;
        this.showProgress = true;
        let file = this.cropper.getCroppedCanvas().toDataURL();
        this.option.cropedImg = file;
        this.option.showCropedImage = true;
        let time = setInterval(() => {
            this.percent += 5;
        },100);
        let pic = file.split(',')[1];
        let fileType = file.split(',')[0].split('/')[1].split(';')[0]
        let uuid = util.uuid();
        let url = 'https://upload-z2.qiniup.com/putb64/-1/key' + Base64.encode(uuid + '.' + fileType);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = async function () {
            if (xhr.readyState === 4) {
                clearInterval(time);
                _t.percent2 = 100;
                _t.$Message.success('上传成功');
                let dateObj = JSON.parse(xhr.responseText);
                let imgUrl = 'https://qiniu.edumessage.xyz/' + dateObj.key;
                let res = await uploadLogo({_id: _t._id, logo: imgUrl});
                if (res.status === 1) {
                    clearInterval(time);
                    _t.percent = 100;
                    _t.$Message.success(res.message);
                }
            }
        };
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Authorization', 'UpToken ' + localStorage.getItem('uploadToken'));
        xhr.send(pic); 
    },
    handleChange (e) {
        this.disabled = false;
        this.showProgress = false;
        this.percent = 0;
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            this.cropper.replace(reader.result);
            reader.onload = null;
        };
        reader.readAsDataURL(file);
    },
    async handlecrop2 () {
        let _t = this;
        if(this.uploadList.length > 4) {
            this.$Message.error('最多只能上传5张图片');
            return;
        }
        this.showProgress2 = true;
        let time = setInterval(() => {
            this.percent2 += 5;
        },100);
        let file = this.cropper2.getCroppedCanvas().toDataURL();
        this.dealImage (file, function (base) {
            _t.option2.cropedImg = base;
            let file = base;
            let pic = file.split(',')[1];
            let fileType = file.split(',')[0].split('/')[1].split(';')[0]
            let uuid = util.uuid();
            let url = 'https://upload-z2.qiniup.com/putb64/-1/key' + Base64.encode(uuid + '.' + fileType);
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    clearInterval(time);
                    _t.percent2 = 100;
                    _t.$Message.success('上传成功');
                    let dateObj = JSON.parse(xhr.responseText);
                    let imgUrl = 'https://qiniu.edumessage.xyz/' + dateObj.key;
                    _t.uploadList.push(imgUrl);
                    _t.option2.showCropedImage = true;
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('Authorization', 'UpToken ' + localStorage.getItem('uploadToken'));
            xhr.send(pic);
        })
        
    },
    dealImage(file, callback){
        let img = new Image();    
        img.src = file;
        img.onload = function(){    
            //默认按比例压缩    
            let w = this.width,
                h = this.height; 
            let quality = 0.6; // 默认图片质量为0.6   
                
            //生成canvas    
            let canvas = document.createElement('canvas');    
            let ctx = canvas.getContext('2d');    
                
            // 创建属性节点    
            canvas.setAttribute("width", w);    
            canvas.setAttribute("height", h);  
                    
            ctx.drawImage(this, 0, 0, w, h);    
            // quality值越小，所绘制出的图像越模糊    
            let base64 = canvas.toDataURL('image/jpeg', quality);    
            // 回调函数返回base64的值    
            callback(base64);    
        };    
    },
    handleChange2 (e) {
        this.disabled2 = false;
        this.showProgress2 = false;
        this.percent2 = 0;
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            this.cropper2.replace(reader.result);
            reader.onload = null;
        };
        reader.readAsDataURL(file);
    },
    handleAdd () {
        this.index++;
        this.formValidate.items.push({
            value: '',
            index: this.index,
            status: 1
        });
    },
    handleRemove (index) {
        this.formValidate.items[index].status = 0;
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    async handleSubmit(formValidate) {
        let _t = this;
      this.$refs[formValidate].validate(async (valid) => {
        if (valid) {
            _t.formValidate['school_id'] = _t._id;
            _t.formValidate['image'] = _t.uploadList;
          let res = await addSchoolDetail(_t.formValidate);
          if (res.status === 1) {
              _t.$Message.success("添加成功!");
              this.isEdit = true;
          }else {
              _t.$Message.error(res.message);
          }
        } else {
          
        }
      });
    },
    async handleSubmit2(formValidate) {
        let _t = this;
      this.$refs[formValidate].validate(async (valid) => {
        if (valid) {
            _t.formValidate['school_id'] = _t._id;
            _t.formValidate['image'] = _t.uploadList;
          let res = await updateSchoolDetail(this.formValidate);
          if (res.status === 1) {
              _t.$Message.success("编辑成功!");
          }else {
              _t.$Message.error(res.message);
          }
        } else {
          
        }
      });
    },
    handleRemove(index) {
        this.uploadList.splice(index, 1);
    }
  },
  mounted() {
    let img = document.getElementById('cropimg');
    this.cropper = new Cropper(img, {
        dragMode: 'move',
        preview: '#preview',
        restore: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        toggleDragModeOnDblclick: false
    });
    let img2 = document.getElementById('cropimg2');
    this.cropper2 = new Cropper(img2, {
        dragMode: 'move',
        preview: '#preview2',
        restore: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        toggleDragModeOnDblclick: false
    });
  },
  activated() {
    this.init();
    this.getSchoolDetail();
  }
};
</script>
