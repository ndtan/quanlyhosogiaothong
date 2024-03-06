import {PlusOutlined} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText, ProTable,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import {getOfficers} from "../../business/officers";
import {ProFormDatePicker} from "@ant-design/pro-form";
import React, {useEffect, useRef, useState} from "react";
import {createProfile, getProfile} from "../../business/profiles";
import ProDescriptions from "@ant-design/pro-descriptions";
import {getManipulationsByProfileId, getManipulationsReturn} from "../../business/manipulations";

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const columns = [
  {
    title: 'STT',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    renderText: (text, record, index, action) => {
      return index + 1;
    },
  },
  {
    title: 'Ngày đề nghị khai thác',
    key: 'manipulated_at',
    dataIndex: 'manipulated_at',
    valueType: 'date',
    // sorter: true,
    hideInSearch: true,
    fieldProps: {placeholder: "Chọn ngày khai thác", format: 'DD/MM/YYYY'},
    formItemProps: {
      rules: [{required: true, message: 'Chọn ngày khai thác'}],
    },
  },
  {
    title: 'Cán bộ đề nghị khai thác',
    dataIndex: 'manipulated_by',
    // filters: true,
    // onFilter: true,
    // ellipsis: true,
    // valueType: 'select',
    // request: (params, props) =>
    //   getOfficers({}).then((officers) => officers.map((s) => ({label: s.name, value: s.id}))),
    fieldProps: {placeholder: "Chọn cán bộ khai thác"},
    formItemProps: {
      rules: [{required: true, message: 'Chọn cán bộ khai thác'}],
    },
  },
  {
    title: 'Lý do khai thác',
    dataIndex: 'action',
    // copyable: true,
    // ellipsis: true,
    // tip: 'Title',
    hideInSearch: true,
    fieldProps: {placeholder: "Nhập lý do khai thác"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập lý do khai thác'}],
    },
    renderText: (text, record) => <>
      {text}<br/>
      {record.text1}
      {record.number1 && <><br/>Tổng số văn kiện: {record.number1}</>}
      {record.place && <><br/>Nơi đến: {record.place}</>}
    </>
  },
  {
    title: 'Ngày bổ sung',
    key: 'return_at',
    dataIndex: 'return_at',
    valueType: 'date',
    // sorter: true,
    hideInSearch: true,
    fieldProps: {placeholder: "Chọn ngày bổ sung", format: 'DD/MM/YYYY'},
    formItemProps: {
      rules: [{required: true, message: 'Chọn ngày bổ sung'}],
    },
  },
  {
    title: 'Cán bộ bổ sung',
    dataIndex: 'return_by',
    fieldProps: {placeholder: "Chọn cán bộ bổ sung"},
    formItemProps: {
      rules: [{required: true, message: 'Chọn cán bộ bổ sung'}],
    },
  },
];

function _getManipulations(profile_id) {
  return getManipulationsByProfileId(profile_id)
    .then(manipulations => {
      console.log('manipulations', manipulations);
      return manipulations
    })
    .then(manipulations => ({
      data: manipulations,
      success: true,
      total: manipulations.length
    }))
}

export default ({profile_id, trigger}) => {
  const actionRef = useRef();
  const [form] = Form.useForm();
  return (
    <ModalForm
      title={null}
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      submitter={{
        searchConfig: {resetText: "Hủy", submitText: "Đóng"},
      }}
      onFinish={async (values) => {
        return true;
      }}
    >
      <ProDescriptions
        actionRef={actionRef}
        title={`Hồ sơ phương tiện`}
        request={async () => {
          return getProfile(profile_id).then(profile => ({success: true, data: profile}))
        }}
        // extra={<Button type="link">Button</Button>}
        column={2}
      >
        <ProDescriptions.Item dataIndex="plate" label="Biển số" valueType="text"/>
        <ProDescriptions.Item dataIndex="content" label="Nội dung hồ sơ" valueType="text" />
        <ProDescriptions.Item dataIndex="created_by" label="Cán bộ nhập hồ sơ" valueType="text" />
        <ProDescriptions.Item dataIndex="created_at" label="Ngày nhập hồ sơ" valueType="date"
                              fieldProps={{format: 'DD/MM/YYYY'}}/>
        {/*<ProDescriptions.Item label="Tùy chọn" valueType="option" style={{marginRight:50}}>*/}
        {/*  /!*<Button*!/*/}
        {/*  /!*  type="primary"*!/*/}
        {/*  /!*  onClick={() => actionRef.current?.reload()}*!/*/}
        {/*  /!*  key="reload"*!/*/}
        {/*  /!*>*!/*/}
        {/*  /!*  Reload*!/*/}
        {/*  /!*</Button>*!/*/}
        {/*  <Button key="rest">Khai thác</Button>*/}
        {/*</ProDescriptions.Item>*/}
      </ProDescriptions>
      <ProTable
        headerTitle="Lịch sử khai thác"
        columns={columns}
        actionRef={actionRef}
        // cardBordered
        className={'profile-detail-manipulations'}
        request={async (params, sort, filter) => {
          console.log('params', params);
          console.log('sort', sort);
          console.log('filter', filter);
          sort.id = 'desc';
          await waitTime(300);
          return _getManipulations(profile_id);
        }}
        rowKey="id"
        search={false}
        options={{
          fullScreen: true,
          setting: {
            listsHeight: 300,
          },
        }}
        locale={{ emptyText: 'Không có lịch sử khai thác nào' }}
        pagination={{
          defaultPageSize: 10, showSizeChanger: true, hideOnSinglePage: true,
          showTotal: (total, range) => `Từ ${range[0]} đến ${range[1]} của ${total} hồ sơ`,
          onChange: (page) => console.log(page),
          locale: {
            items_per_page: "Hồ sơ mỗi trang",
            jump_to: "Nhảy đến",
            jump_to_confirm: "Xác nhận nhảy đến",
            page: "trang",
            prev_page: "trang trước",
            next_page: "trang sau",
            page_size: "kích thước trang"
          }
        }}
        dateFormatter="string"
      />
    </ModalForm>
  );
};
