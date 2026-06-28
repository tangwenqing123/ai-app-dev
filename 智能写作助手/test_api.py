import os
import sys

# 测试 DeepSeek API 连接
def test_api_connection():
    print("=" * 60)
    print("测试 DeepSeek API 连接")
    print("=" * 60)
    
    # 读取 .env.local 文件
    env_file = "c:/Users/25714/Desktop/新项目/AI应用开发/智能写作助手/.env.local"
    
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                if line.startswith('VITE_DEEPSEEK_API_KEY='):
                    api_key = line.split('=', 1)[1].strip()
                    print(f"\n✓ API Key 找到: {api_key[:10]}...{api_key[-4:]}")
                    print(f"  API Key 长度: {len(api_key)}")
                    break
    else:
        print("\n✗ .env.local 文件不存在")
    
    # 测试 API 调用
    try:
        import urllib.request
        import urllib.error
        import json
        
        api_key = os.environ.get('VITE_DEEPSEEK_API_KEY', '')
        
        if not api_key:
            # 尝试从文件读取
            if os.path.exists(env_file):
                with open(env_file, 'r') as f:
                    for line in f:
                        if line.startswith('VITE_DEEPSEEK_API_KEY='):
                            api_key = line.split('=', 1)[1].strip()
                            break
        
        if not api_key:
            print("\n⚠ 未找到 API Key，尝试直接测试...")
            
        # 测试 API
        url = "https://api.deepseek.com/v1/chat/completions"
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        }
        
        data = {
            'model': 'deepseek-chat',
            'messages': [
                {'role': 'user', 'content': '你好，请回复"测试成功"'}
            ],
            'stream': False,
            'temperature': 0.7,
            'max_tokens': 100,
        }
        
        print("\n正在测试 API 连接...")
        
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                print(f"\n✓ API 调用成功!")
                print(f"  响应内容: {content}")
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"\n✗ API 调用失败: HTTP {e.code}")
            print(f"  错误信息: {error_body[:200]}")
        except Exception as e:
            print(f"\n✗ 连接失败: {str(e)}")
            
    except ImportError:
        print("\n⚠ urllib 模块不可用，跳过 API 测试")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    test_api_connection()
    input("\n按 Enter 键退出...")
