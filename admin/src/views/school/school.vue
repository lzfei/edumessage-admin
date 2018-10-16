<style lang="less">
@import "../../styles/common.less";
@import "./school.less";
</style>

<template>
    <div class="school">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        机构列表
                    </p>
                    <Row>
                        <Button @click="refresh" icon="loop">刷新</Button>
                        <Input placeholder="请输入姓名搜搜..." style="width: 200px" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <Button @click="addClick" icon="android-add-circle">新增</Button>
                        <Modal
                          title="新增机构"
                          v-model="modal.visible"
                          class-name="vertical-center-modal">
                          <Form ref="schoolForm" :model="school" :rules="schoolValidate" :label-width="80">
                            <FormItem label="名称" prop="name">
                              <Input v-model="school.name" placeholder="机构名称"></Input>
                            </FormItem>
                            <FormItem label="擅长科目" prop="good">
                              <Input v-model="school.good" placeholder="擅长科目 如：英语、奥数"></Input>
                            </FormItem>
                            <FormItem label="标签1" prop="tag1">
                              <Input v-model="school.tag1" placeholder="标签 如：门类齐全"></Input>
                            </FormItem>
                            <FormItem label="标签2" prop="tag2">
                              <Input v-model="school.tag2" placeholder="标签 如：师资保障"></Input>
                            </FormItem>
                            <FormItem label="成立年份" prop="founddate">
                              <Input v-model="school.founddate" placeholder="成立年份 如：2005"></Input>
                            </FormItem>
                            <FormItem label="机构类别" prop="category">
                                <CheckboxGroup v-model="school.category">
                                    <Checkbox label="0">综合</Checkbox>
                                    <Checkbox label="1">幼儿</Checkbox>
                                    <Checkbox label="2">小学</Checkbox>
                                    <Checkbox label="3">初中</Checkbox>
                                    <Checkbox label="4">高中</Checkbox>
                                    <Checkbox label="5">美术</Checkbox>
                                    <Checkbox label="6">舞蹈</Checkbox>
                                    <Checkbox label="7">声乐</Checkbox>
                                    <Checkbox label="8">体育</Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                            <FormItem label="坐标" prop="coordinate">
                              <Input v-model="school.coordinate" placeholder="坐标"></Input>
                              <a href="http://lbs.qq.com/tool/getpoint/index.html" target="_blank">获取坐标</a>
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
    </div>
    
</template>

<script>
import Cookies from 'js-cookie';
import {basicInfo, getSchoolList, getSchoolCount, updateSchool, removeSchool} from "../../service/getData"; 
export default {
  name: "school_index",
  data() {
    return {
      addModal: false,
      modal: {
        visible: false
      },
      loading: false,
      index: 1,
      school: {
        name: "",
        good: "",
        score: '4.8',
        tag1: "",
        tag2: "",
        founddate: "",
        category: [],
        coordinate: "",
        coordinates: []
      },
      schoolValidate: {
        name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        good: [
          { required: true, message: "请输入擅长科目", trigger: "blur" },
          {
            type: "string",
            max: 20,
            message: "不能超过20个字符",
            trigger: "blur"
          }
        ],
        tag1: [{ required: true, message: "请输入标签1", trigger: "blur" }],
        tag2: [{ required: true, message: "请输入标签2", trigger: "blur" }],
        founddate: [{ required: true, message: "请输入出版年份", trigger: "blur" }],
        category: [{ required: true, type: 'array', min: 1, message: "请选择类型", trigger: "blur" }],
        _coordinate: [{ required: true,  message: "请输入坐标", trigger: "blur" }]
      },
      editInlineColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: "名称",
          align: "center",
          key: "name",
          width: 250,
          editable: true
        },
        {
          title: "擅长",
          align: "center",
          key: "good",
          editable: true
        },
        {
          title: "标签1",
          align: "center",
          key: "tag1",
          editable: true,
          width: 100,
        },
        {
          title: "标签2",
          align: "center",
          key: "tag2",
          editable: true,
          width: 100,
        },
        {
          title: "评分",
          align: "center",
          key: "score",
          width: 70,
        },
        {
          title: "成立年份",
          align: "center",
          key: "founddate",
          editable: true,
          width: 90,
        },
        {
          title: "操作",
          align: "center",
          width: 190,
          key: "handle",
          render: (h, params) => {
              return h('div', [
                  h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                          click: () => {
                              this.editClick(params)
                          }
                      }
                  }, '修改'),
                  h('Button', {
                      props: {
                          type: 'error',
                          size: 'small'
                      },
                      on: {
                          click: () => {
                              this.remove(params)
                          }
                      }
                  }, '删除')
              ]);
          }
        },
        {
          title: "详情",
          width: 70,
          key: "show_more",
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small"
                },
                on: {
                  click: () => {
                    let argu = { _id: params.row._id };
                    this.$router.push({
                      name: "school_info",
                      params: argu
                    });
                  }
                }
              },
              "详情"
            );
          }
        }
      ],
      editInlineData: [],
      currentPage: 1,
      totalCount:0,
      limit: 5,
      offset: 0,
      isEdit: false
    };
  },
  computed: {},
  methods: {
    initData () {
      this.school = {
        name: "",
        good: "",
        score: '4.8',
        tag1: "",
        tag2: "",
        founddate: "",
        category: [],
        coordinate: "",
        coordinates: []
      }
    },
    async getData() {
      let res = await getSchoolList({limit: this.limit, offset: this.offset});
      this.editInlineData = res.data;
    },
    async getSchoolCount() {
       let res = await getSchoolCount();
       this.totalCount = res['count'];
    },
    addClick () {
      this.isEdit = false;
      this.modal.visible = true;
    },
    modalOk() {
      if (!this.isEdit) {
        this.save();
      }else {
        this.edit();
      }
    },
    modalCancel() {
        this.modal.visible = false;
        //清空form规则检查
        this.$refs['schoolForm'].resetFields();
        this.getSchoolCount();
        this.getData();
        this.initData();
    },
    async save() {
      let _t = this;
      let userId = Cookies.get('_id');
      this.$refs.schoolForm.validate(async (valid) => {
        if (valid) {
          _t.school.coordinates =  _t.school.coordinate.split(',').reverse();
          let res = await basicInfo(_t.school);
          if (res.status === 1) {
              _t.modal.visible = false;
              _t.$Message.success("添加成功!");
              _t.getSchoolCount();
              _t.getData();
              _t.initData();
          }else {
              _t.$Message.error(res.message);
          }
        }
      });
    },
    cancel() {
      _t.initData();
    },
    getNextpage (page) {
      this.currentPage = page;
      this.offset = (this.currentPage -1) * this.limit;
      this.getData();
    },
    editClick($event) {
      this.isEdit = true;
      this.school = $event['row'];
      let arrCoordinate = $event['row']['coordinates'].reverse();
      this.school['coordinate'] = arrCoordinate[0] + ',' + arrCoordinate[1];
      this.modal.visible = true;
    },
    async edit() {
      let _t = this;
      this.$refs.schoolForm.validate(async (valid) => {
        if (valid) {
          let res = await updateSchool(this.school);
          if (res.status === 1) {
              _t.modal.visible = false;
              _t.$Message.success("修改成功!");
              _t.getSchoolCount();
              _t.getData();
              _t.initData();
          }else {
              _t.$Message.error(res.message);
          }
        }
      });
    },
    async remove($event) {
      let res = await removeSchool({_id: $event['row']['_id']});
      if(res.status === 1) {
        this.$Message.success(res.message);
        this.getSchoolCount();
        this.getData();
      }
    },
    refresh() {
      this.getSchoolCount();
      this.getData();
    },
    handleSearch() {},
    handleCancel() {}
  },
  created() {
    this.getSchoolCount();
    this.getData();
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
