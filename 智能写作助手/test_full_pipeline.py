import os
import json
import urllib.request
import urllib.error

def test_full_streaming_pipeline():
    """测试完整的流式API调用流程，模拟前端代码行为"""
    print("=" * 70)
    print("测试完整流式API调用流程")
    print("=" * 70)
    
    api_key = ""
    print(f"✓ 使用API Key: {api_key[:10]}...{api_key[-4:]}")
    
    url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
    }
    
    # 使用与前端相同的prompt构建方式
    input_text = "请续写以下故事：我意外穿越到古代，成为了一名寒门书生。"
    
    data = {
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': '你是一个专业的写作助手。'},
            {'role': 'user', 'content': input_text}
        ],
        'stream': True,
        'temperature': 0.7,
        'max_tokens': 500,
    }
    
    print(f"\n✓ 请求数据准备完成")
    print(f"  Prompt长度: {len(input_text)}")
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
            
            # 模拟前端的流式读取逻辑
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
                print("\n" + "-" * 50)
                return True
            else:
                print("\n✗ 响应内容为空")
                return False
                
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"\n✗ HTTP 错误: {e.code}")
        print(f"  错误详情: {error_body}")
        return False
    except Exception as e:
        print(f"\n✗ 错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "=" * 70)

if __name__ == "__main__":
    success = test_full_streaming_pipeline()
    if success:
        print("\n🎉 API测试成功！问题可能在前端代码中")
    else:
        print("\n❌ API测试失败！问题在API端")