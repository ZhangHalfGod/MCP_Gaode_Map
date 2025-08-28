const http = require('http');

// 测试配置
const MCP_SERVER_URL = 'http://localhost:3000';

// 发送HTTP请求的辅助函数
function sendRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// 测试capabilities接口
async function testCapabilities() {
  console.log('\n=== 测试capabilities接口 ===');
  try {
    const response = await sendRequest('GET', '/capabilities');
    console.log('状态码:', response.statusCode);
    console.log('响应内容:', JSON.parse(response.body));
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 测试helloWorld工具
async function testHelloWorld() {
  console.log('\n=== 测试helloWorld工具 ===');
  try {
    const response = await sendRequest('POST', '/tools/call', {
      name: 'helloWorld',
      arguments: {
        name: '张三'
      }
    });
    console.log('状态码:', response.statusCode);
    console.log('响应内容:', JSON.parse(response.body));
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 测试getSystemInfo工具
async function testGetSystemInfo() {
  console.log('\n=== 测试getSystemInfo工具 ===');
  try {
    const response = await sendRequest('POST', '/tools/call', {
      name: 'getSystemInfo',
      arguments: {}
    });
    console.log('状态码:', response.statusCode);
    console.log('响应内容:', JSON.parse(response.body));
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 测试generateTaxiLink工具
async function testGenerateTaxiLink() {
  console.log('\n=== 测试generateTaxiLink工具 ===');
  try {
    const response = await sendRequest('POST', '/tools/call', {
      name: 'generateTaxiLink',
      arguments: {
        startName: '广州市越秀区彩虹桥',
        endName: '广州塔（小蛮腰）'
      }
    });
    console.log('状态码:', response.statusCode);
    console.log('响应内容:', JSON.parse(response.body));
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 测试generateBusLink工具
async function testGenerateBusLink() {
  console.log('\n=== 测试generateBusLink工具 ===');
  try {
    const response = await sendRequest('POST', '/tools/call', {
      name: 'generateBusLink',
      arguments: {
        startName: '广州市越秀区彩虹桥',
        endName: '广州塔（小蛮腰）'
      }
    });
    console.log('状态码:', response.statusCode);
    console.log('响应内容:', JSON.parse(response.body));
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 主测试函数
async function runTests() {
  console.log('开始测试MCP服务器...');
  console.log('请确保MCP服务器已经启动 (npm start)');
  
  try {
    // 等待1秒，确保服务器有足够时间启动
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testCapabilities();
    await testHelloWorld();
    await testGetSystemInfo();
    await testGenerateTaxiLink();
    await testGenerateBusLink();
    
    console.log('\n=== 所有测试完成 ===');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  runTests();
}

module.exports = {
  sendRequest,
  testCapabilities,
  testHelloWorld,
  testGetSystemInfo,
  testGenerateTaxiLink,
  testGenerateBusLink
};