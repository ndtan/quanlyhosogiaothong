import {PlusOutlined} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import {getOfficers} from "../../business/officers";
import {ProFormDatePicker} from "@ant-design/pro-form";
import React, {useEffect, useRef, useState} from "react";
import {createProfile, getProfile} from "../../business/profiles";
import ProDescriptions from "@ant-design/pro-descriptions";

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default ({profile_id, trigger}) => {
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState();
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
        searchConfig: {resetText: "Hủy", submitText: "Khai thác"},
        render: (props, dom) => <>
          <Button key="manipulate" type="primary">Khai thác</Button>
        </>
      }}
      onOpenChange={(visible) => {
        if (visible) {
          getProfile(profile_id).then(profile => {
            console.log('profile', profile);
            setProfile(profile);
          });
        }
      }}
      onFinish={async (values) => {
        return true;
      }}
    >
      <ProDescriptions
        actionRef={actionRef}
        title={`Hồ sơ phương tiện: ${profile?.plate}`}
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
    </ModalForm>
  );
};
