import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout} from 'antd';
import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Dropdown, Space, Tag} from 'antd';
import {Outlet, Link} from 'react-router-dom';
import {ProProvider, createIntl} from '@ant-design/pro-components';
import {getOfficers} from "../../business/officers";
import icon from "../../../../assets/icon.svg";
import {useRef} from 'react';
import {getProfiles} from "../../business/profiles";
import OfficerCreate from "./OfficerCreate";
import OfficerDetail from "./OfficerDetail";

export const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time = 100) => {
  await waitTimePromise(time);
};

const viVN = {
  tableForm: {
    search: 'Tìm kiếm',
    reset: 'Làm lại',
    submit: 'Đồng ý',
    collapsed: 'Mở rộng',
    expand: 'Thu gọn',
    inputPlaceholder: 'Vui lòng nhập',
    selectPlaceholder: 'Vui lòng chọn',
  },
  alert: {
    clear: 'Xóa',
  },
  tableToolBar: {
    leftPin: 'Ghim sang trái',
    rightPin: 'Ghim sang phải',
    noPin: 'Bỏ ghim',
    leftFixedTitle: 'Cố định sang trái',
    rightFixedTitle: 'Cố định sang phải',
    noFixedTitle: 'Không cố định',
    reset: 'Làm lại',
    columnDisplay: 'Cột hiển thị',
    columnSetting: 'Cài đặt',
    fullScreen: 'Xem toàn màn hình',
    exitFullScreen: 'Thu nhỏ',
    reload: 'Tải lại dữ liệu',
    density: 'Mật độ hiển thị',
    densityDefault: 'Mặc định',
    densityLarger: 'Thấp',
    densityMiddle: 'Trung bình',
    densitySmall: 'Cao',
  },
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
    title: 'Tên',
    dataIndex: 'name',
    fieldProps: {placeholder: "Nhập biển số xe"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập biển số xe'}],
    },
  },
  {
    title: 'Ngày sinh',
    key: 'birthday',
    dataIndex: 'birthday',
    valueType: 'date',
    hideInSearch: true,
    fieldProps: {placeholder: "Chọn cán bộ nhập", format: 'DD/MM/YYYY'},
    formItemProps: {
      rules: [{required: true, message: 'Chọn ngày nhập'}],
    },
  },
  {
    title: 'Phòng',
    dataIndex: 'department',
    hideInSearch: true,
    fieldProps: {placeholder: "Nhập nội dung hồ sơ"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập nội dung hồ sơ'}],
    },
  },
  {
    title: 'Chức vụ',
    dataIndex: 'role',
    hideInSearch: true,
    fieldProps: {placeholder: "Nhập nội dung hồ sơ"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập nội dung hồ sơ'}],
    },
  },
];

function _getOfficers(params, sort, filter) {
  return getOfficers(params, sort, filter)
    .then(officers => {
      console.log('officers', officers);
      return officers
    })
    .then(officers => ({
      data: officers,
      success: true,
      // total: officers.length < params.pageSize ? ((params.current - 1) * params.pageSize + officers.length)
      //   : (params.current * params.pageSize + 1)
    }))
}

const enUSIntl = createIntl('en_US', viVN);

export default () => {
  const values = useContext(ProProvider);
  const actionRef = useRef();
  return (
    <ProProvider.Provider value={{...values, intl: enUSIntl}}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log('params', params);
          console.log('sort', sort);
          console.log('filter', filter);
          sort.id = 'desc';
          await waitTime(100);
          return _getOfficers(params, sort, filter);
        }}
        locale={{ emptyText: 'Không có hồ sơ nào' }}
        // editable={{
        //   type: 'multiple',
        //   onSave: async (rowKey, data, row) => {
        //     console.log(rowKey, data, row);
        //     await waitTime(2000);
        //     // throw "Khong the cap nhat"
        //   },
        // }}
        // columnsState={{
        //   persistenceKey: 'pro-table-singe-demos',
        //   persistenceType: 'localStorage',
        //   defaultValue: {
        //     option: {fixed: 'right', disable: true},
        //   },
        //   onChange(value) {
        //     console.log('value: ', value);
        //   },
        // }}
        rowKey="id"
        search={false}
        options={{
          fullScreen: true,
          setting: {
            listsHeight: 300,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          defaultPageSize: 10, showSizeChanger: true, hideOnSinglePage: true,
          showTotal: (total, range) => `Từ ${range[0]} đến ${range[1]} của ${total} hồ sơ`,
          onChange: (page) => console.log("page", page),
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
        headerTitle="Danh sách cán bộ"
        toolBarRender={() => [
          <OfficerCreate trigger={<Button
            key="button"
            icon={<PlusOutlined/>}
            onClick={() => actionRef.current?.reload()}
            type="primary"
          >
            Thêm mới cán bộ
          </Button>}
                         onFinish={()=>actionRef.current?.reload()}/>,
        ]}
      />
    </ProProvider.Provider>
  );
};
