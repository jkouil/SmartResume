import os
from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# 初始化 OpenAI 客户端（推荐 openai >= 1.0.0）
#client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # 确保设置好环境变量
# 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
client = OpenAI(api_key = "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")
@app.route("/analyze", methods=["POST"])
def analyze_resume():
    data = request.get_json()
    resume_text = data.get("resume", "")
    job_text = data.get("job", "")

    # 简洁 prompt 模板（控制 token）
    system_prompt = "You are an AI recruiter assistant. Your job is to compare a candidate's resume to a job description and provide a match score (between 0 and 1) and a short explanation (max 3 sentences)."

    user_prompt = f"""
Resume:
{resume_text}

Job Description:
{job_text}

Respond in JSON format like this:
{{"Score": <float>, "Summary": "<short explanation>"}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # 默认就是最便宜的 GPT-4o mini 版本
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.4,
            max_tokens=150  # 足够输出 score 和 summary
        )

        # 解析模型返回的 JSON 格式
        result_text = response.choices[0].message.content.strip()
        print("[OpenAI] Raw:", result_text)

        import json
        result = json.loads(result_text)

        return jsonify(result)

    except Exception as e:
        print(f"[OpenAI] Error: {e}")
        return jsonify({"score": 0, "summary": "Analysis failed."}), 500


if __name__ == "__main__":
    app.run(port=5000)
