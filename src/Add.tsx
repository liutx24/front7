import React from 'react'
import { Modal, Form, Input, message } from 'antd';
//import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormComponentProps } from 'antd/lib/form/Form';

interface ItemData {
    id?: number | undefined;
    dockPn?: string | undefined;
    dockDescription?: number | undefined;
    compatibilityPn?: string | undefined;
    compDescription?: string | undefined,
    footNoteId?: string | undefined,
    footNoteText?: string | undefined
}


// 接口约束
interface IProps extends FormComponentProps {

    // record: ItemData,
    record: ItemData,
    title: string
    visible: boolean,
    // onOk
    onOk: () => void,
    // onCancel
    onCancel: () => void,

    //form: WrappedFormUtils;
}

class Add extends React.Component<IProps> {

    /**
     * 添加修改
     */
    handleOk = (e: any): void => {
        const { form } = this.props
        form.validateFields((err: any, values: ItemData) => {
            if (!err) {
                fetch('http://localhost:8081/updateinsert', {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then((response: any) => {
                    if (response.status !== 200) {
                        message.error(response.message || response.statusText);
                        return
                    } else {
                        this.props.onOk();
                    }

                }).catch((err: any) => message.error("网络异常"));
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { record } = this.props;
        return (
            <div>
                <Modal
                    title={this.props.title}
                    maskClosable={false}
                    visible={this.props.visible}
                    destroyOnClose={true}
                    onOk={this.handleOk}
                    onCancel={() => this.props.onCancel()}
                >


                    <Form className="login-form" layout="vertical">
                        <Form.Item label="Dock PN">
                            {getFieldDecorator('dockPn', {
                                initialValue: record.dockPn ? record.dockPn : "",
                                rules: [{ required: true, message: 'Please input Dock PN!' }],
                            })(
                                <Input placeholder="Please input Dock PN" />
                            )}
                        </Form.Item>
                        <Form.Item label="Compatibility PN">
                            {getFieldDecorator('compatibilityPn', {
                                initialValue: record.compatibilityPn,
                                rules: [{ required: true, message: 'Please input Compatibility PN!' }],
                            })(
                                <Input placeholder="Please input Compatibility PN" />
                            )}
                        </Form.Item>

                        <Form.Item label="Footnote ID">
                            {getFieldDecorator('footNoteId', {
                                initialValue: record.footNoteId,
                                rules: [{ required: false }],
                            })(
                                <Input placeholder="Please input Footnote ID" />
                            )}
                        </Form.Item>

                        {getFieldDecorator('id', {
                            initialValue: record.id
                        })(
                            <Input type="hidden" />
                        )}
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create<IProps>()(Add);