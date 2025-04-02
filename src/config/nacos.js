const nacosConfig = {
  serverAddr: process.env.NODE_ENV === 'production'
    ? 'https://121.41.84.201:7848/nacos'  // 生产环境使用HTTPS
    : 'http://121.41.84.201:7848/nacos',  // 开发环境使用HTTP
  namespace: 'public',  // 命名空间
  group: 'DEFAULT_GROUP',  // 分组
  username: 'nacos',  // 用户名，如果需要的话
  password: 'nacos',  // 密码，如果需要的话
  serviceName: 'godar-frontend',  // 前端服务名称
  servicePort: window.location.port || 80,  // 服务端口
  serviceIp: window.location.hostname,  // 服务IP
};

// 验证服务注册状态
export const checkServiceStatus = async () => {
  try {
    // 在生产环境下可能返回模拟数据
    if (process.env.NODE_ENV === 'production' && !isSecureContext()) {
      console.warn('在非安全上下文中无法访问HTTP资源，返回模拟数据');
      return {
        name: 'DEFAULT_GROUP@@godar-frontend',
        groupName: 'DEFAULT_GROUP',
        clusters: '',
        cacheMillis: 10000,
        hosts: [{
          ip: window.location.hostname,
          port: 80,
          valid: true,
          healthy: true,
          marked: false,
          instanceId: `${window.location.hostname}#80#DEFAULT#DEFAULT_GROUP@@godar-frontend`,
          metadata: { 'preserved.register.source': 'SPRING_CLOUD' }
        }],
        lastRefTime: Date.now(),
        checksum: '',
        allIPs: false,
        reachProtectionThreshold: false,
        valid: true
      };
    }

    const response = await fetch(
      `${nacosConfig.serverAddr}/v1/ns/instance/list?serviceName=${nacosConfig.serviceName}&namespaceId=${nacosConfig.namespace}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get service status');
    }

    const data = await response.json();
    console.log('Service status:', data);
    return data;
  } catch (error) {
    console.error('Error checking service status:', error);
    return null;
  }
};

// 检查是否在安全上下文中（HTTPS）
function isSecureContext() {
  return window.isSecureContext === true;
}

export const registerService = async () => {
  try {
    // 在生产环境下使用模拟注册
    if (process.env.NODE_ENV === 'production' && !isSecureContext()) {
      console.warn('在非安全上下文中无法访问HTTP资源，模拟注册服务');
      console.log('Service registered successfully (mock)');
      return;
    }

    const response = await fetch(`${nacosConfig.serverAddr}/v1/ns/instance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        serviceName: nacosConfig.serviceName,
        ip: nacosConfig.serviceIp,
        port: nacosConfig.servicePort,
        namespaceId: nacosConfig.namespace,
        group: nacosConfig.group,
        ephemeral: 'true',
        weight: '1',
        enabled: 'true',
        healthy: 'true',
        metadata: JSON.stringify({
          'preserved.register.source': 'SPRING_CLOUD'
        })
      })
    });

    if (!response.ok) {
      throw new Error('Failed to register service');
    }

    console.log('Service registered successfully');
    await checkServiceStatus();
    startHeartbeat();
  } catch (error) {
    console.error('Error registering service:', error);
  }
};

const startHeartbeat = () => {
  // 在生产环境下不启动心跳
  if (process.env.NODE_ENV === 'production' && !isSecureContext()) {
    console.warn('在非安全上下文中无法访问HTTP资源，跳过心跳发送');
    return;
  }

  setInterval(async () => {
    try {
      const response = await fetch(`${nacosConfig.serverAddr}/v1/ns/instance/beat`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          serviceName: nacosConfig.serviceName,
          ip: nacosConfig.serviceIp,
          port: nacosConfig.servicePort,
          namespaceId: nacosConfig.namespace,
          group: nacosConfig.group,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send heartbeat');
      }
      console.log('Heartbeat sent successfully');
    } catch (error) {
      console.error('Error sending heartbeat:', error);
    }
  }, 5000);
};

export default nacosConfig; 