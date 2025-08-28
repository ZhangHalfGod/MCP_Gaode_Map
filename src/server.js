const express = require('express');
const bodyParser = require('body-parser');

// 创建Express应用
const app = express();
app.use(bodyParser.json());

// 配置静态文件服务
app.use(express.static(__dirname));

// 定义MCP服务名称和版本
const MCP_SERVICE_NAME = 'mcp-gaode-agent';
const MCP_SERVICE_VERSION = '1.0.0';

// 定义工具函数
function helloWorld(params) {
  const { name } = params;
  return { message: `Hello, ${name}! This is MCP Gaode Agent.` };
}

function getSystemInfo() {
  return {
    name: MCP_SERVICE_NAME,
    version: MCP_SERVICE_VERSION,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    capabilities: 
    {
      tools: ['helloWorld', 'getSystemInfo', 'generateTaxiLink', 'generateBusLink']
    }
  };
}

// 生成打车链接
function generateTaxiLink(params) {
  // 默认使用Address.md中提供的坐标
  const startLat = params.startLat || 23.1265;
  const startLng = params.startLng || 113.2578;
  const endLat = params.endLat || 23.1141;
  const endLng = params.endLng || 113.3255;
  const startName = params.startName || '广州市越秀区彩虹桥';
  const endName = params.endName || '广州塔（小蛮腰）';
  
  // 高德地图打车schema
  const taxiLink = `amapuri://openFeature?featureName=taxi&sourceApplication=出行助手&startLat=${startLat}&startLon=${startLng}&startName=${encodeURIComponent(startName)}&destLat=${endLat}&destLon=${endLng}&destName=${encodeURIComponent(endName)}`;
  
  return {
    success: true,
    taxiLink: taxiLink,
    startAddress: startName,
    endAddress: endName,
    coordinates: {
      start: { lat: startLat, lng: startLng },
      end: { lat: endLat, lng: endLng }
    }
  };
}

// 生成公交链接
function generateBusLink(params) {
  // 默认使用Address.md中提供的坐标
  const startLat = params.startLat || 23.1265;
  const startLng = params.startLng || 113.2578;
  const endLat = params.endLat || 23.1141;
  const endLng = params.endLng || 113.3255;
  const startName = params.startName || '广州市越秀区彩虹桥';
  const endName = params.endName || '广州塔（小蛮腰）';
  
  // 高德地图公交导航schema
  const busLink = `amapuri://route/plan?sourceApplication=出行助手&slat=${startLat}&slon=${startLng}&sname=${encodeURIComponent(startName)}&dlat=${endLat}&dlon=${endLng}&dname=${encodeURIComponent(endName)}&dev=0&t=1`;
  
  return {
    success: true,
    busLink: busLink,
    startAddress: startName,
    endAddress: endName,
    coordinates: {
      start: { lat: startLat, lng: startLng },
      end: { lat: endLat, lng: endLng }
    }
  };
}

// 创建工具映射表
const tools = {
  helloWorld,
  getSystemInfo,
  generateTaxiLink,
  generateBusLink
};

// 实现MCP协议的capabilities接口
app.get('/capabilities', (req, res) => {
  res.json({
    name: MCP_SERVICE_NAME,
    version: MCP_SERVICE_VERSION,
    capabilities: {
      resources: {},
      tools: {
        helloWorld: {
          description: 'Say hello to someone',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the person to greet'
              }
            },
            required: ['name']
          }
        },
        getSystemInfo: {
          description: 'Get system information about this MCP server',
          parameters: {}
        },
        generateTaxiLink: {
          description: 'Generate taxi link for Gaode Maps',
          parameters: {
            type: 'object',
            properties: {
              startLat: {
                type: 'number',
                description: 'Start location latitude'
              },
              startLng: {
                type: 'number',
                description: 'Start location longitude'
              },
              endLat: {
                type: 'number',
                description: 'End location latitude'
              },
              endLng: {
                type: 'number',
                description: 'End location longitude'
              },
              startName: {
                type: 'string',
                description: 'Start location name'
              },
              endName: {
                type: 'string',
                description: 'End location name'
              }
            },
            required: []
          }
        },
        generateBusLink: {
          description: 'Generate bus navigation link for Gaode Maps',
          parameters: {
            type: 'object',
            properties: {
              startLat: {
                type: 'number',
                description: 'Start location latitude'
              },
              startLng: {
                type: 'number',
                description: 'Start location longitude'
              },
              endLat: {
                type: 'number',
                description: 'End location latitude'
              },
              endLng: {
                type: 'number',
                description: 'End location longitude'
              },
              startName: {
                type: 'string',
                description: 'Start location name'
              },
              endName: {
                type: 'string',
                description: 'End location name'
              }
            },
            required: []
          }
        }
      }
    }
  });
});

// 实现MCP协议的tools/call接口
app.post('/tools/call', async (req, res) => {
  const { name, arguments: args } = req.body;
  
  try {
    // 检查工具是否存在
    if (!tools[name]) {
      throw new Error(`Tool ${name} not found`);
    }
    
    // 调用工具函数
    const result = await tools[name](args || {});
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    res.json({
      success: false,
      error: {
        code: -32603,
        message: error.message || 'Internal error'
      }
    });
  }
});

// 根路径响应 - 出行助手界面
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
  console.log(`Capabilities: http://localhost:${PORT}/capabilities`);
  console.log(`Tools endpoint: http://localhost:${PORT}/tools/call`);
});