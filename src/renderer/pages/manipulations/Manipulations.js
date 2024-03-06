import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Form, Layout, message} from 'antd';
import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import {ModalForm, ProForm, ProFormSelect, ProFormText, ProTable, TableDropdown, ProCard} from '@ant-design/pro-components';
import {Button, Dropdown, Space, Tag} from 'antd';
import {Outlet, Link} from 'react-router-dom';
import {ProProvider, createIntl} from '@ant-design/pro-components';
import {getOfficers} from "../../business/officers";
import icon from "../../../../assets/icon.svg";
import {useRef} from 'react';
import {createProfile, getProfileByPlate, getProfiles} from "../../business/profiles";
import ManipulateCreate from "./ManipulateCreate";
import {getManipulations} from "../../business/manipulations";

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
    title: 'Biển số xe',
    dataIndex: 'plate',
    ellipsis: true,
    fieldProps: {placeholder: "Nhập biển số xe"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập biển số xe'}],
    },
  },
  {
    title: 'Ngày khai thác',
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
    ellipsis: true,
    // tip: 'Title',
    hideInSearch: true,
    fieldProps: {placeholder: "Nhập lý do khai thác"},
    formItemProps: {
      rules: [{required: true, message: 'Nhập lý do khai thác'}],
    },
  },

  {
    title: 'Tùy chọn',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a key="detail" onClick={() => {}}>Bổ sung</a>,
    ],
  },
];

function _getManipulations(params, sort, filter) {
  return getManipulations(params, sort, filter)
    .then(manipulations => {
      console.log('getManipulations', manipulations);
      return manipulations
    })
    .then(manipulations => ({
      data: manipulations,
      success: true,
      // total: manipulations.length < params.pageSize ? ((params.current - 1) * params.pageSize + manipulations.length)
      //   : (params.current * params.pageSize + 1)
    }));
}

const enUSIntl = createIntl('en_US', viVN);

export default () => {
  const values = useContext(ProProvider);
  const actionRef = useRef();
  const [profile, setProfile] = useState();
  const [modalVisit, setModalVisit] = useState(false);
  const [form] = Form.useForm();
  return (
    <ProProvider.Provider value={{...values, intl: enUSIntl}}>
      <ProCard layout="center" bordered style={{marginBottom: 8}}>
        <ProForm
          title="Khai thác hồ sơ"
          form={form}
          layout={'inline'}
          autoFocusFirstInput
          submitTimeout={2000}
          className={'form-manipulation'}
          submitter={{
            searchConfig: {submitText: 'Khai thác'},
            resetButtonProps: {style: {display: 'none'}},
          }}
          onFinish={async (values) => {
            try {
              console.log('values', values);
              const profile = await getProfileByPlate(values?.plate);
              if (!profile) {
                message.error("Không tìm thấy biển số xe.")
                return false;
              }
              console.log('profile', profile);
              setProfile(profile);
              setModalVisit(true);
            } catch (err) {
              message.error(err.toString());
              return false;
            }
          }}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="plate"
              placeholder="Nhập biển số xe đề nghị khai thác"
              formItemProps={{rules: [{required: true, message: 'Nhập biển số xe đề nghị khai thác'}]}}
            />
          </ProForm.Group>
        </ProForm>
        <ManipulateCreate profile_id={profile?.id} open={modalVisit} requestClose={()=>setModalVisit(false)} />
      </ProCard>

      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log('params', params);
          console.log('sort', sort);
          console.log('filter', filter);
          sort.id = 'desc';
          await waitTime(300);
          return _getManipulations(params, sort, filter);
        }}
        locale={{ emptyText: 'Không có hồ sơ nào' }}
        rowKey="id"
        search={false}
        options={{
          fullScreen: true,
          setting: {
            listsHeight: 300,
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
        headerTitle="Hồ sơ đang khai thác"
        toolBarRender={() => [
          <a key="export" onClick={() => {}}>
            Xuất danh sách
          </a>,
        ]}
      />
    </ProProvider.Provider>
  );
};
