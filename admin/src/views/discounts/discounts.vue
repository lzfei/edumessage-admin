<style lang="less">
@import "../../styles/common.less";
@import "./discounts.less";
</style>

<template>
    <div class="school">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                    限时优惠
                    </p>
                    <Row>
                        <Button @click="refresh" icon="loop">刷新</Button>
                        <Input placeholder="请输入标题搜搜..." style="width: 200px" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <Button @click="addClick" icon="android-add-circle">新增</Button>
                        <Modal
                          title="新增优惠"
                          v-model="modal.visible"
                          class-name="vertical-center-modal">
                          <Form ref="discountsForm" :model="discounts" :rules="discountsValidate" :label-width="80">
                            <FormItem label="标题" prop="title">
                              <Input v-model="discounts.title" placeholder="标题"></Input>
                            </FormItem>
                            <FormItem label="位置" prop="position">
                              <Input v-model="discounts.position" placeholder="位置"></Input>
                            </FormItem>
                            <FormItem label="时间" prop="time">
                              <DatePicker :value="discounts.time" type="daterange" :start-date="new Date()" @on-change="discounts.time=$event" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem label="原价" prop="ori_price">
                              <Input v-model="discounts.ori_price" placeholder="原价"></Input>
                            </FormItem>
                            <FormItem label="折扣价" prop="dis_price">
                              <Input v-model="discounts.dis_price" placeholder="折扣价"></Input>
                            </FormItem>
                            <FormItem label="联系电话" prop="phone">
                              <Input v-model="discounts.phone" placeholder="联系电话"></Input>
                            </FormItem>
                            <FormItem>
                                <div class="image-upload-list" v-for="item in uploadList">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="'http://pb389dexp.bkt.clouddn.com/' + item.response.key">
                                        <div class="image-upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                    </template>
                                </div>
                                <Upload
                                    ref="upload"
                                    :show-upload-list="false"
                                    :default-file-list="defaultList"
                                    :on-success="handleSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-progress="onProgress"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    type="drag"
                                    name="file"
                                    action="//upload-z2.qiniup.com/"
                                    :data="{token: token}"
                                    style="display: inline-block;width:58px;"
                                    >
                                    <div style="width: 58px;height:58px;line-height: 58px;">
                                        <Icon type="camera" size="20"></Icon>
                                    </div>
                                </Upload>
                                <img :src="discounts.image" alt="" v-if="showUploadedImage" style="width: 100%;">
                          </FormItem>
                          </Form>
                          <div slot="footer">
                            <Button type="text" size="large" @click="modalCancel">取消</Button>
                            <Button type="primary" size="large" @click="modalOk">确定</Button>
                        </div>
                      </Modal>
                      <Page :current="currentPage" :total="totalCount" :page-size="limit" simple class="page" @on-change="getNextpage"></Page>
                    </Row>
                    <Row class="margin-top-10 searchable-table-con1">
                        <div class="edittable-table-height-con">
                            <Table border :columns="editInlineColumns" :data="editInlineData"></Table>
                        </div>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal title="View Image" v-model="visible">
            <img :src="discounts.image" v-if="visible" style="width: 100%">
        </Modal>
    </div>
    
</template>

<script>
import Cookies from "js-cookie";
import * as qiniu from 'qiniu-js';
import util from '../../libs/util';
import { base64 } from 'js-base64';
import {
  addDiscounts,
  getDiscountsList,
  getDiscountsCount,
  updateDiscounts,
  removeDiscounts
} from "../../service/getData";
export default {
  name: "school_index",
  data() {
    return {
      addModal: false,
      modal: {
        visible: false
      },
      loading: false,
      discounts: {
        title: "",
        position: "",
        time: "",
        ori_price: "",
        dis_price: "",
        phone: "",
        image: ""
      },
      discountsValidate: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            type: "string",
            max: 20,
            message: "不能超过20个字符",
            trigger: "blur"
          }
        ],
        position: [{ required: true, message: "请输入位置", trigger: "blur" }],
        ori_price: [{ required: true, message: "请输入原价", trigger: "blur" }],
        dis_price: [
          { required: true, message: "请输入折扣价", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }]
      },
      editInlineColumns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "标题",
          align: "center",
          key: "title",
          width: 180,
          editable: true
        },
        {
          title: "位置",
          align: "center",
          key: "position",
          editable: true
        },
        {
          title: "时间",
          align: "center",
          key: "time",
          editable: true,
          width: 200
        },
        {
          title: "原价",
          align: "center",
          key: "ori_price",
          editable: true,
          width: 100
        },
        {
          title: "现价",
          align: "center",
          key: "dis_price",
          width: 70
        },
        {
          title: "联系方式",
          align: "center",
          key: "phone",
          editable: true,
          width: 120
        },
        {
          title: "操作",
          align: "center",
          width: 190,
          key: "handle",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editClick(params);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      editInlineData: [],
      currentPage: 1,
      totalCount: 0,
      limit: 5,
      offset: 0,
      isEdit: false,
      file: null,
      loadingStatus: false,
      showProgress: false,
      percent: 0,
      showUploadedImage: false,
      token: localStorage.getItem('uploadToken'),
      defaultList: [],
      uploadList: [],
      visible: false
    };
  },
  computed: {},
  methods: {
    initData() {
      this.discounts = {
        title: "",
        position: "",
        time: "",
        ori_price: "",
        dis_price: "",
        phone: "",
        image: ""
      };
    },
    async getData() {
      let res = await getDiscountsList({ limit: this.limit, offset: this.offset });
      this.editInlineData = res.data;
    },
    async getDiscountsCount() {
      let res = await getDiscountsCount();
      this.totalCount = res["count"];
    },
    addClick() {
      this.isEdit = false;
      this.modal.visible = true;
    },
    modalOk() {
      if (!this.isEdit) {
        this.save();
      } else {
        this.edit();
      }
    },
    modalCancel() {
      this.modal.visible = false;
      //清空form规则检查
      this.$refs["discountsForm"].resetFields();
      this.getDiscountsCount();
      this.getData();
    },
    async save() {
      let _t = this;
      let userId = Cookies.get("_id");
      this.$refs.discountsForm.validate(async valid => {
        if (valid) {
          let res = await addDiscounts(_t.discounts);
          if (res.status === 1) {
            _t.modal.visible = false;
            _t.$Message.success("添加成功!");
            _t.getDiscountsCount();
            _t.getData();
            _t.initData();
          } else {
            _t.$Message.error(res.message);
          }
        }
      });
    },
    cancel() {
      _t.initData();
    },
    getNextpage(page) {
      this.currentPage = page;
      this.offset = (this.currentPage - 1) * this.limit;
      this.getData();
    },
    editClick($event) {
      this.isEdit = true;
      this.discounts = $event['row'];
      this.discounts.time = $event['row']['time'].split(',');
      this.defaultList.push({
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'response': {'key': this.discounts.image.split('.com/')[1]}
                    });
      this.modal.visible = true;
    },
    async edit() {
      let _t = this;
      this.$refs.discountsForm.validate(async valid => {
        if (valid) {
          let res = await updateDiscounts(this.discounts);
          if (res.status === 1) {
            _t.modal.visible = false;
            _t.$Message.success("修改成功!");
            _t.getDiscountsCount();
            _t.getData();
            _t.initData();
          } else {
            _t.$Message.error(res.message);
          }
        }
      });
    },
    async remove($event) {
      let res = await removeDiscounts({ _id: $event["row"]["_id"] });
      if (res.status === 1) {
        this.$Message.success(res.message);
        this.getDiscountsCount();
        this.getData();
      }
    },
    refresh() {
      this.getDiscountsCount();
      this.getData();
    },
    handleSearch() {},
    handleCancel() {},
    handleSuccess(res, file) {
        let imgUrl = 'http://pb389dexp.bkt.clouddn.com/' + res.key;
        this.discounts.image = imgUrl;
    },
    onProgress(event, file, fileList) {

    },
    handleFormatError() {
      this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请选择 jpg、jpeg、png.'
      });
    },
    handleMaxSize() {
      this.$Notice.warning({
          title: '文件超出规定大小',
          desc: '文件  ' + file.name + '太大，不能超过2M.'
      });
    },
    handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleView (name) {
        this.visible = true;
    },
  },
  created() {
    this.getDiscountsCount();
    this.getData();
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList;
  }
};
</script>

<style>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ivu-modal {
  top: 0;
}
.page {
  display: inline-block;
  float: right;
}
</style>
