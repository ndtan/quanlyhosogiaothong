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
import {ProFormDatePicker, ProFormDigit} from "@ant-design/pro-form";
import React, {useEffect, useRef, useState} from "react";
import {createProfile, getProfile} from "../../business/profiles";
import ProDescriptions from "@ant-design/pro-descriptions";
import {getPlace, getPlaces} from "../../business/places";
import {removeVietnameseCharacter} from "../../util";
import {createManipulation} from "../../business/manipulations";

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let _places;

export default ({profile_id, trigger, open, requestClose, onSuccess}) => {
  const actionRef = useRef();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState();
  return (
    <ModalForm
      title={null}
      open={trigger ? undefined : open}
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => requestClose?.(),
      }}
      submitTimeout={2000}
      submitter={{
        searchConfig: {resetText: "Hủy", submitText: "Khai thác"},
      }}
      onOpenChange={(visible) => {
        if (visible) {
          getProfile(profile_id).then(profile => {
            console.log('profile', profile);
            setProfile(profile);
          });
        }
      }}
      onValuesChange={(changeValues) => {
        console.log(changeValues);
        if (changeValues.action) form.resetFields(["text1", "number1", "province_id"]);
      }}
      onFinish={async (values) => {
        try {
          console.log('values', values);
          const info = await createManipulation(profile_id, values);
          console.log('info', info);
          if (info) {
            message.success("Đã lưu thông tin khai thác hồ sơ");
            onSuccess?.();
            return true;
          } else {
            message.error("Không thể khai thác hồ sơ");
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
        title={`Hồ sơ phương tiện: ${profile?.plate}`}
        params={profile_id}
        request={async (profile_id) => {
          return getProfile(profile_id).then(profile => ({success: true, data: profile}))
        }}
        // extra={<Button type="link">Button</Button>}
        column={2}
      >
        <ProDescriptions.Item dataIndex="plate" label="Biển số" valueType="text"/>
        <ProDescriptions.Item dataIndex="content" label="Nội dung hồ sơ" valueType="text"/>
        <ProDescriptions.Item dataIndex="created_by" label="Cán bộ nhập hồ sơ" valueType="text"/>
        <ProDescriptions.Item dataIndex="created_at" label="Ngày nhập hồ sơ" valueType="date"
                              fieldProps={{format: 'DD/MM/YYYY'}}/>
      </ProDescriptions>
      <h4>Thông tin khai thác</h4>
      <ProForm.Group>
        <ProFormSelect
          request={async () => getOfficers({}).then(officers => officers.map(o => ({value: o.id, label: o.name})))}
          width="md"
          name="manipulated_by_id"
          label="Cán bộ khai thác"
          placeholder="Chọn cán bộ khai thác"
          formItemProps={{
            rules: [{required: true, message: 'Chọn cán bộ khai thác'}],
          }}
        />
        <ProFormSelect
          options={[
            {value: 'Cấp đổi', label: 'Cấp đổi'},
            {value: 'Thu hồi', label: 'Thu hồi'},
            {value: 'Chuyển gốc', label: 'Chuyển gốc'},
            {value: 'Đổi biển', label: 'Đổi biển'},
            {value: 'Chỉ đạo cấp trên', label: 'Chỉ đạo cấp trên'},
            {value: 'Có thông báo QĐ tịch thu', label: 'Có thông báo QĐ tịch thu'},
            {value: 'Hết niên hạn, hỏng...', label: 'Hết niên hạn, hỏng...'},
          ]}
          width="md"
          name="action"
          label="Lý do khai thác"
          placeholder="Chọn lý do khai thác"
          formItemProps={{
            rules: [{required: true, message: 'Chọn lý do khai thác'}],
          }}
        />
        <ProForm.Item noStyle shouldUpdate>
          {(form) => {
            const action = form.getFieldValue('action');
            let options = [];
            if (action === 'Cấp đổi') {
              options = [
                {value: 'Mất chứng nhận đăng ký xe', label: 'Mất chứng nhận đăng ký xe'},
                {value: 'Mất biển số xe', label: 'Mất biển số xe'},
                {value: 'Đổi biển vàng sang biển trắng', label: 'Đổi biển vàng sang biển trắng'},
                {value: 'Đổi biển 4 số sang 5 số', label: 'Đổi biển 4 số sang 5 số'},
                {value: 'Đổi màu sơn', label: 'Đổi màu sơn'},
                {value: 'Xe cải tạo', label: 'Xe cải tạo'},
              ]
            } else if (action === 'Thu hồi') {
              options = [
                {value: 'Chuyển quyền sở hữu', label: 'Chuyển quyền sở hữu'},
                {value: 'Xe trộm cắp', label: 'Xe trộm cắp'},
              ]
            } else {
              return null;
            }
            return (
              <ProFormSelect
                options={options}
                width="md"
                name="text1"
                label="Nội dung"
                placeholder="Chọn nội dung"
                formItemProps={{
                  rules: [{required: true, message: 'Chọn nội dung'}],
                }}
              />
            );
          }}
        </ProForm.Item>
      </ProForm.Group>
      <ProForm.Group>
        <ProForm.Item noStyle shouldUpdate>
          {(form) => {
            const action = form.getFieldValue('action');
            if (action === 'Chuyển gốc') {
              return <ProFormDigit
                label="Tổng số văn kiện"
                name="number1"
                width="md"
                min={1}
                formItemProps={{rules: [{required: true, message: 'Nhập tổng số văn kiện'}]}}
              />
            }
          }}
        </ProForm.Item>
        <ProForm.Item noStyle shouldUpdate>
          {(form) => {
            const action = form.getFieldValue('action');
            if (action === 'Thu hồi' || action === 'Chuyển gốc' || action === 'Hết niên hạn, hỏng...') {
              return <ProFormSelect
                name="place_id"
                label={action === 'Thu hồi' ? "Nơi đến" : action === 'Chuyển gốc' ? "Nơi chuyển gốc" : "Nơi cấp"}
                mode={'single'}
                width="md"
                showSearch={true}
                optionFilterProp="children"
                filterOption={(inputValue, option) => {
                  alert("Hello");
                  console.log('inputValue', inputValue);
                  console.log('option', option);
                }}
                debounceTime={300}
                notFoundContent={"Không có địa điểm nào"}
                request={async ({keyWords = ''}) => {
                  console.log('keyWords', keyWords);
                  const lcKeywords = removeVietnameseCharacter(keyWords);
                  const places = _places ? _places : await getPlaces();
                  _places = places;
                  const filterPlaces = places
                    .map(p => ({value: p.id, label: p.name, title: removeVietnameseCharacter(p.name)}));
                    // .filter(({value, label}) => {
                    //   const lcLabel = removeVietnameseCharacter(label);
                    //   console.log('lcKeywords', lcKeywords);
                    //   console.log('lcLabel', lcLabel);
                    //   return lcLabel.includes(lcKeywords);
                    // });
                  return filterPlaces;
                }}
                formItemProps={{
                  rules: [{
                    required: true,
                    message: action === 'Thu hồi' ? "Chọn nơi đến" : action === 'Chuyển gốc' ? "Chọn nơi chuyển gốc" : "Chọn nơi cấp"
                  }]
                }}
              />
            }
          }}
        </ProForm.Item>
      </ProForm.Group>
    </ModalForm>
  );
};
