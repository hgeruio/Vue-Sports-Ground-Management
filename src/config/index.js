/**
 * ���������ļ�
 * ����ҵ����Ŀ������������
 * ��������
 * ���Ի���
 * ���ϻ���
 */

//��ǰ����
const env = import.meta.env.MOOE || 'prod'

const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: ''
  }
}

export default {
  env,
  mock: true,
  ...EnvConfig[env]
}