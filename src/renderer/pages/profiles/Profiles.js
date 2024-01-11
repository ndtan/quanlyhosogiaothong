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
import ProfileCreate from "./ProfileCreate";

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
      console.log('record', record);
      return index + 1;
    },
  },
  {
    title: 'Biển số xe',
    dataIndex: 'plate',
    ellipsis: true,
    fieldProps: {placeholder: "Nhập biển số xe"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập biển số xe'}],
    },
  },
  {
    title: 'Nội dung hồ sơ',
    dataIndex: 'content',
    // copyable: true,
    ellipsis: true,
    // tip: 'Title',
    hideInSearch: true,
    fieldProps: {placeholder: "Nhập nội dung hồ sơ"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập nội dung hồ sơ'}],
    },
  },
  {
    title: 'Cán bộ nhập',
    dataIndex: 'created_by_id',
    // filters: true,
    // onFilter: true,
    // ellipsis: true,
    valueType: 'select',
    request: (params, props) =>
      getOfficers({}).then((officers) => officers.map((s) => ({label: s.name, value: s.id}))),
    fieldProps: {placeholder: "Chọn cán bộ nhập"},
    formItemProps: {
      rules: [{required: true, message: 'Chọn cán bộ nhập'}],
    },
  },
  {
    title: 'Ngày nhập',
    key: 'created_at',
    dataIndex: 'created_at',
    valueType: 'date',
    // sorter: true,
    hideInSearch: true,
    fieldProps: {placeholder: "Chọn cán bộ nhập"},
    formItemProps: {
      rules: [{required: true, message: 'Chọn ngày nhập'}],
    },
  },
  // {
  //   title: "Ngày nhập",
  //   key: 'created_at',
  //   dataIndex: 'created_at',
  //   valueType: 'dateRange',
  //   render: (_, profiles) => (new Date(profiles.created_at)).toLocaleDateString(),
  //   search: {
  //     transform: (range) => ({
  //       created_at_from: range[0] + ' 00:00:00',
  //       created_at_to: range[1] + ' 23:59:59',
  //     }),
  //   },
  // },
  // {
  //   title: 'option',
  //   valueType: 'option',
  //   key: 'option',
  //   render: (text, record, _, action) => [
  //     <a key="editable"
  //        onClick={() => {
  //          action?.startEditable?.(record.id);
  //        }}
  //     >
  //       Edit
  //     </a>,
  //     // <TableDropdown
  //     //   key="actionGroup"
  //     //   onSelect={() => action?.reload()}
  //     //   menus={[
  //     //     {key: 'copy', name: 'copy'},
  //     //     {key: 'delete', name: 'delete'},
  //     //   ]}
  //     // />,
  //   ],
  // },
];

function _getProfiles(params, sort, filter) {
  return getProfiles(params, sort, filter)
    .then(profiles => {
      console.log('profiles', profiles);
      return profiles
    })
    .then(profiles => profiles.map(p => ({...p, created_at: p.created_at * 1000})))
    .then(profiles => ({
      data: profiles,
      success: true,
      total: profiles.length < params.pageSize ? ((params.current - 1) * params.pageSize + profiles.length)
        : (params.current * params.pageSize + 1)
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
          await waitTime(500);
          return _getProfiles(params, sort, filter);
        }}
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
        search={{
          labelWidth: 'auto',
          searchText: "Tìm kiếm",
          resetText: "Xóa bộ lọc",
          expandText: "Mở rộng"
        }}
        options={{
          fullScreen: true,
          setting: {
            listsHeight: 300,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            console.log('values1', values);
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
        headerTitle="Hồ sơ phương tiện giao thông"
        toolBarRender={() => [
          <ProfileCreate trigger={<Button
            key="button"
            icon={<PlusOutlined/>}
            onClick={() => {
              actionRef.current?.reload();
            }}
            type="primary"
          >
            Thêm mới hồ sơ
          </Button>}/>,
          // <Dropdown
          //   key="menu"
          //   menu={{
          //     items: [
          //       {
          //         label: '1st item',
          //         key: '1',
          //       },
          //       {
          //         label: '2nd item',
          //         key: '1',
          //       },
          //       {
          //         label: '3rd item',
          //         key: '1',
          //       },
          //     ],
          //   }}
          // >
          //   <Button>
          //     <EllipsisOutlined/>
          //   </Button>
          // </Dropdown>,
        ]}
      />
    </ProProvider.Provider>
  );
};
