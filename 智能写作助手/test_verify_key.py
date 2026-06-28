import json
import urllib.request
import urllib.error

# 请在此粘贴您的有效API Key
API_KEY = "sk-b2af4751f829411396bed98117d3958b"  # <-- 请替换为您PyCharm中使用的Key

def test_api():
    print("=" * 60)
    print("测试 DeepSeek API")
    print("=" * 60)
    print(f"使用的 API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    
    url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}',
    }
    
    data = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'user', 'content': '你好'}
        ],
        'stream': False,
        'temperature': 0.7,
        'max_tokens': 100,
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode('utf-8'))
            content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
            print(f"\n✓ API调用成功！")
            print(f"响应: {content}")
            return True
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"\n✗ HTTP错误: {e.code}")
        print(f"错误详情: {error_body}")
        return False
    except Exception as e:
        print(f"\n✗ 错误: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api()
    if success:
        print("\n🎉 API Key有效！请确保项目中使用相同的Key")
    else:
        print("\n❌ API Key无效，请检查Key是否正确")