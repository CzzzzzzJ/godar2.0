const nacosConfig = {
  serverAddr: 'http://121.41.84.201:8929/nacos',  // 恢复完整的服务器地址
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

export const registerService = async () => {
  try {
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
    } catch (error) {
      console.error('Error sending heartbeat:', error);
    }
  }, 5000);
};

export default nacosConfig; 