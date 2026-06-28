import os
import json
import urllib.request
import urllib.error

# 模拟前端流式API调用
def test_streaming_api():
    print("=" * 70)
    print("测试前端流式API调用流程")
    print("=" * 70)
    
    # 读取API Key
    api_key = ""
    env_file = "c:/Users/25714/Desktop/新项目/AI应用开发/智能写作助手/.env.local"
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                if line.startswith('VITE_DEEPSEEK_API_KEY='):
                    api_key = line.split('=', 1)[1].strip()
                    break
    
    if not api_key:
        print("✗ 未找到 API Key")
        return
    
    print(f"\n✓ API Key: {api_key[:10]}...{api_key[-4:]}")
    
    # 测试流式调用
    url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
    }
    
    # 构建prompt
    prompt = "请续写以下故事：我意外穿越到古代，成为了一名寒门书生。请以第一人称视角，描写我初到古代时的所见所感。"
    
    data = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': '你是一个专业的写作助手。'},
            {'role': 'user', 'content': prompt}
        ],
        'stream': True,
        'temperature': 0.7,
        'max_tokens': 500,
    }
    
    print(f"\n✓ Prompt长度: {len(prompt)} 字符")
    print(f"\n正在发起流式API请求...")
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            print(f"\n✓ 响应状态: {response.status} {response.reason}")
            print(f"✓ Content-Type: {response.headers.get('Content-Type', '')}")
            
            # 模拟流式读取（像前端一样）
            import codecs
            decoder = codecs.getincrementaldecoder('utf-8')()
            buffer = ""
            full_response = ""
            chunk_count = 0
            
            while True:
                chunk = response.read(1024)
                if not chunk:
                    break
                
                buffer += decoder.decode(chunk, final=False)
                
                # 按行处理
                while '\n' in buffer:
                    line_end = buffer.index('\n')
                    line = buffer[:line_end]
                    buffer = buffer[line_end + 1:]
                    
                    if not line.strip():
                        continue
                    if line.strip() == 'data: [DONE]':
                        print("\n✓ 收到 [DONE] 标记")
                        break
                    if not line.startswith('data: '):
                        continue
                    
                    try:
                        json_str = line[6:]
                        data_chunk = json.loads(json_str)
                        content = data_chunk.get('choices', [{}])[0].get('delta', {}).get('content', '')
                        
                        if content:
                            chunk_count += 1
                            full_response += content
                            print(f"\r收到数据块 #{chunk_count}: {len(full_response)} 字符", end='')
                            
                    except Exception as e:
                        print(f"\n⚠ 解析错误: {str(e)}")
                
                if line.strip() == 'data: [DONE]':
                    break
            
            print(f"\n\n✓ 流式接收完成")
            print(f"✓ 总数据块数: {chunk_count}")
            print(f"✓ 响应总长度: {len(full_response)} 字符")
            
            if full_response:
                print(f"\n✓ 响应内容预览:")
                print("-" * 50)
                print(full_response[:500] + "..." if len(full_response) > 500 else full_response)
                print("-" * 50)
            else:
                print("\n✗ 响应内容为空")
                
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"\n✗ HTTP 错误: {e.code}")
        print(f"  错误详情: {error_body}")
    except urllib.error.URLError as e:
        print(f"\n✗ 网络错误: {str(e)}")
    except Exception as e:
        print(f"\n✗ 未知错误: {str(e)}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 70)

if __name__ == "__main__":
    test_streaming_api()
