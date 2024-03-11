import {ModalForm, ProForm, ProFormSelect} from '@ant-design/pro-components';
import {Form, message} from 'antd';
import {getOfficers} from "../../business/officers";
import {ProFormDatePicker} from "@ant-design/pro-form";
import React, {useRef} from "react";
import ProDescriptions from "@ant-design/pro-descriptions";
import {getManipulationByProfileIdForReturn, returnProfile} from "../../business/manipulations";

export default ({profile_id, trigger, open, requestClose, onSuccess}) => {
  const actionRef = useRef();
  const [form] = Form.useForm();
  return (
    <ModalForm
      title={null}
      open={open}
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => requestClose?.(),
      }}
      submitTimeout={2000}
      submitter={{
        searchConfig: {resetText: "Hủy", submitText: "Bổ sung"},
      }}
      onFinish={async (values) => {
        try {
          console.log('values', values);
          const info = await returnProfile(profile_id, values.return_by_id, values.return_at);
          console.log('info', info);
          if (info) {
            message.success("Đã bổ sung hồ sơ");
            onSuccess?.();
            requestClose?.();
            return true;
          } else {
            message.error("Không thể bổ sung hồ sơ");
            return false;
          }
        } catch (error) {
          message.error(error.toString());
          return false;
        }
      }}
    >
      <ProDescriptions
        actionRef={actionRef}
        title={`Bổ sung hồ sơ`}
        params={profile_id}
        request={async (profile_id) => {
          return getManipulationByProfileIdForReturn(profile_id).then(manipulation => ({success: true, data: manipulation}))
        }}
        column={2}
      >
        <ProDescriptions.Item dataIndex="plate" label="Biển số" valueType="text"/>
        <ProDescriptions.Item dataIndex="manipulated_at" label="Ngày khai thác" valueType="date"
                              fieldProps={{format: 'DD/MM/YYYY HH:mm'}}/>
        <ProDescriptions.Item dataIndex="manipulated_by" label="Cán bộ đề nghị khai thác" valueType="text"/>
        <ProDescriptions.Item dataIndex="action" label="Lý do khai thác" valueType="text"/>

      </ProDescriptions>
      <h4>Thông tin bổ sung</h4>
      <ProForm.Group>
        <ProFormSelect
          request={async () => getOfficers({}).then(officers => officers.map(o => ({value: o.id, label: o.name})))}
          width="md"
          name="return_by_id"
          label="Cán bộ khai thác bổ sung"
          placeholder="Chọn cán bộ khai thác bổ sung"
          formItemProps={{
            rules: [{required: true, message: 'Chọn cán bộ khai thác bổ sung'}],
          }}
        />
        <ProFormDatePicker
          width="md"
          name="return_at"
          label="Ngày bổ sung"
          placeholder="Chọn ngày bổ sung"
          formItemProps={{
            rules: [{required: true, message: 'Chọn ngày bổ sung'}],
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
