<style lang="less">
@import "../../styles/common.less";
@import "./teacher.less";
</style>

<template>
    <div class="teacher">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        老师列表
                    </p>
                    <Row>
                        <Button @click="refresh" icon="loop">刷新</Button>
                        <Input placeholder="请输入姓名搜搜..." style="width: 200px" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <Button @click="addClick" icon="android-add-circle">新增</Button>
                        <Modal
                          title="新增老师"
                          v-model="modal.visible"
                          class-name="vertical-center-modal">
                          <Form ref="teacherForm" :model="teacher" :rules="teacherValidate" :label-width="80">
                            <FormItem label="姓名" prop="name">
                              <Input v-model="teacher.name" placeholder="老师姓名"></Input>
                            </FormItem>
                            <FormItem label="擅长科目" prop="good">
                              <Input v-model="teacher.good" placeholder="擅长科目 如：英语、奥数"></Input>
                            </FormItem>
                            <FormItem label="标签1" prop="tag1">
                              <Input v-model="teacher.tag1" placeholder="标签 如：门类齐全"></Input>
                            </FormItem>
                            <FormItem label="标签2" prop="tag2">
                              <Input v-model="teacher.tag2" placeholder="标签 如：师资保障"></Input>
                            </FormItem>
                            <FormItem label="开始教学年份" prop="time">
                              <Input v-model="teacher.time" placeholder="开始教学年份 如：2005"></Input>
                            </FormItem>
                            <FormItem label="机构类别" prop="category">
                                <CheckboxGroup v-model="teacher.category">
                                    <Checkbox label="0">综合</Checkbox>
                                    <Checkbox label="1">文化课老师</Checkbox>
                                    <Checkbox label="2">兴趣班老师</Checkbox>
                                    <Checkbox label="3">素质培养老师</Checkbox>
                                    <Checkbox label="4">家庭教育老师</Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                            <FormItem label="坐标" prop="coordinate">
                              <Input v-model="teacher.coordinate" placeholder="坐标"></Input>
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
import {teacherInfo, getTeacherList, getTeacherCount, updateTeacher, removeTeacher} from "../../service/getData"; 
export default {
  name: "teacher_index",
  data() {
    return {
      addModal: false,
      modal: {
        visible: false
      },
      loading: false,
      index: 1,
      teacher: {
        name: "",
        good: "",
        score: '4.8',
        tag1: "",
        tag2: "",
        time: "",
        category: [],
        coordinate: "",
        coordinates: []
      },
      teacherValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
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
        time: [{ required: true, message: "请输入开始从教年份", trigger: "blur" }],
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
          title: "姓名",
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
          title: "从教年份",
          align: "center",
          key: "time",
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
                      name: "teacher_info",
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
      this.teacher = {
        name: "",
        good: "",
        score: '4.8',
        tag1: "",
        tag2: "",
        time: "",
        category: [],
        coordinate: "",
        coordinates: []
      }
    },
    async getData() {
      let res = await getTeacherList({limit: this.limit, offset: this.offset});
      this.editInlineData = res.data;
    },
    async getTeacherCount() {
       let res = await getTeacherCount();
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
        this.$refs['teacherForm'].resetFields();
        this.getTeacherCount();
        this.getData();
        this.initData();
    },
    async save() {
      let _t = this;
      let userId = Cookies.get('_id');
      this.$refs.teacherForm.validate(async (valid) => {
        if (valid) {
          _t.teacher.coordinates =  _t.teacher.coordinate.split(',').reverse();
          let res = await teacherInfo(_t.teacher);
          if (res.status === 1) {
              _t.modal.visible = false;
              _t.$Message.success("添加成功!");
              _t.getTeacherCount();
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
      this.teacher = $event['row'];
      let arrCoordinate = $event['row']['coordinates'].reverse();
      this.teacher['coordinate'] = arrCoordinate[0] + ',' + arrCoordinate[1];
      this.modal.visible = true;
    },
    async edit() {
      let _t = this;
      this.$refs.teacherForm.validate(async (valid) => {
        if (valid) {
          let res = await updateTeacher(this.teacher);
          if (res.status === 1) {
              _t.modal.visible = false;
              _t.$Message.success("修改成功!");
              _t.getTeacherCount();
              _t.getData();
              _t.initData();
          }else {
              _t.$Message.error(res.message);
          }
        }
      });
    },
    async remove($event) {
      console.log($event);
      let res = await removeTeacher({_id: $event['row']['_id']});
      if(res.status === 1) {
        this.$Message.success(res.message);
        this.getTeacherCount();
        this.getData();
      }
    },
    handleSearch() {},
    handleCancel() {},
    refresh() {
      this.getTeacherCount();
      this.getData();
    },
  },
  created() {
    this.getTeacherCount();
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
