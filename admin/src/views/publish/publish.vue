<style lang="less">
@import "../../styles/common.less";
</style>

<template>
    <div class="school">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list-outline"></Icon>
                        话题列表
                    </p>
                    <Row>
                        <Button @click="refresh" icon="loop">刷新</Button>
                        <Input placeholder="请输入信息搜搜..." style="width: 200px" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <Button @click="addClick" icon="android-add-circle">新增</Button>
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
import {getPublishList, getPublishCount, updatePublish, removePublish} from "../../service/getData"; 
export default {
  name: "publish_index",
  data() {
    return {
      editInlineColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: "标题",
          align: "center",
          key: "main",
          width: 250,
          editable: true
        },
        {
          title: "简述",
          align: "center",
          key: "des",
          editable: true
        },
        {
          title: "发布时间",
          align: "center",
          key: "date",
          editable: true,
          width: 100,
        },
        {
          title: "发布人",
          align: "center",
          key: "user_name",
          editable: true,
          width: 100,
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
        }
      ],
      editInlineData: [],
      currentPage: 1,
      totalCount:0,
      limit: 5,
      offset: 0
    };
  },
  computed: {},
  methods: {
    async getData() {
      let res = await getPublishList({limit: this.limit, offset: this.offset});
      this.editInlineData = res.data;
    },
    async getPublishCount() {
       let res = await getPublishCount();
       this.totalCount = res['count'];
    },
   
    getNextpage (page) {
      this.currentPage = page;
      this.offset = (this.currentPage -1) * this.limit;
      this.getData();
    },
    
    async remove($event) {
      let res = await removePublish({_id: $event['row']['_id']});
      if(res.status === 1) {
        this.$Message.success(res.message);
        this.getPublishCount();
        this.getData();
      }
    },
    handleSearch() {},
    handleCancel() {},
    addClick () {},
    refresh() {
      this.getPublishCount();
      this.getData();
    }
  },
  created() {
    this.getPublishCount();
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
