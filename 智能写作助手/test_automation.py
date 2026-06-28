from playwright.sync_api import sync_playwright
import json
import time

def test_writing_assistant():
    console_logs = []
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 捕获控制台日志
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: errors.append(str(err)))

        print("=" * 60)
        print("测试开始: 智能写作助手")
        print("=" * 60)

        # 1. 访问页面
        print("\n[1] 访问页面...")
        page.goto('http://localhost:5174/')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)  # 等待 React 渲染

        # 截图
        page.screenshot(path='c:/Users/25714/Desktop/新项目/AI应用开发/智能写作助手/test_screenshots/01_initial.png', full_page=True)
        print("✓ 页面加载成功")

        # 2. 检查主标题
        print("\n[2] 检查主标题...")
        title = page.locator("text=智能写作助手").first
        if title.is_visible():
            print("✓ 主标题显示正常")
        else:
            print("✗ 主标题未找到")

        # 3. 检查输入框
        print("\n[3] 检查输入框...")
        textarea = page.locator("textarea").first
        if textarea.is_visible():
            print("✓ 输入框存在")
            textarea.fill("请续写以下故事：我意外穿越到古代，成为了一名书生...")
            print("✓ 文本输入成功")
        else:
            print("✗ 输入框未找到")

        # 4. 检查写作模式按钮
        print("\n[4] 检查写作模式...")
        modes = ["文章续写", "内容改写", "内容扩展", "内容总结", "邮件撰写", "文案创作"]
        for mode in modes:
            btn = page.locator(f"text={mode}")
            if btn.is_visible():
                print(f"  ✓ {mode} 按钮存在")
            else:
                print(f"  ✗ {mode} 按钮未找到")

        # 5. 点击生成按钮
        print("\n[5] 点击生成按钮...")
        generate_btn = page.locator("text=生成内容").first
        if generate_btn.is_visible():
            print("✓ 生成按钮存在")
            generate_btn.click()
            print("✓ 已点击生成按钮")

            # 等待生成过程
            print("\n[6] 等待生成过程...")
            page.wait_for_timeout(3000)  # 等待3秒

            # 截图生成后状态
            page.screenshot(path='c:/Users/25714/Desktop/新项目/AI应用开发/智能写作助手/test_screenshots/02_after_generate.png', full_page=True)
            print("✓ 已截图生成后状态")

            # 6. 检查输出区域
            print("\n[7] 检查输出区域...")
            output_area = page.locator('[aria-label="AI输出区域"]')
            if output_area.is_visible():
                print("✓ 输出区域存在")

                # 获取输出内容
                content = output_area.inner_text()
                print(f"  输出内容长度: {len(content)} 字符")

                if content and len(content) > 10:
                    print("✓ 输出区域有内容")
                    print(f"  前100字符: {content[:100]}...")
                else:
                    print("⚠ 输出区域内容为空或过短")
            else:
                print("✗ 输出区域未找到")

            # 7. 检查是否有错误
            print("\n[8] 检查错误信息...")
            error_elements = page.locator("text=✗")
            if error_elements.count() > 0:
                for err in error_elements.all():
                    err_text = err.inner_text()
                    print(f"  ⚠ 发现错误: {err_text}")
            else:
                print("  ✓ 无错误提示")

        else:
            print("✗ 生成按钮未找到")

        # 8. 输出控制台日志
        print("\n" + "=" * 60)
        print("控制台日志:")
        print("=" * 60)
        for log in console_logs:
            print(log)

        # 9. 输出页面错误
        if errors:
            print("\n" + "=" * 60)
            print("页面错误:")
            print("=" * 60)
            for err in errors:
                print(f"  ✗ {err}")

        print("\n" + "=" * 60)
        print("测试完成")
        print("=" * 60)

        browser.close()

if __name__ == "__main__":
    test_writing_assistant()
