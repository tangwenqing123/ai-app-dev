import { useEffect, useState } from 'react';

export function EnvTest() {
  const [envLoaded, setEnvLoaded] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState('');
  const [apiKeyLength, setApiKeyLength] = useState(0);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    console.log('[ENV TEST] VITE_DEEPSEEK_API_KEY loaded:', apiKey ? 'Yes' : 'No');
    console.log('[ENV TEST] API Key length:', apiKey?.length || 0);
    console.log('[ENV TEST] API Key:', apiKey);
    
    setEnvLoaded(true);
    setApiKeyStatus(apiKey ? '✓ 已加载' : '✗ 未加载');
    setApiKeyLength(apiKey?.length || 0);
  }, []);

  if (!envLoaded) {
    return <div>加载中...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-dark-card border border-dark-border rounded-lg p-4 z-50 text-sm">
      <h4 className="font-bold mb-2">环境变量测试</h4>
      <p>API Key: {apiKeyStatus}</p>
      <p>长度: {apiKeyLength} 字符</p>
    </div>
  );
}