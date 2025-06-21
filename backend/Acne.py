from flask import Flask, request, jsonify, render_template, redirect, url_for
import cv2
import numpy as np
import os
import pymysql
from werkzeug.utils import secure_filename
import tensorflow as tf
from tensorflow.keras.models import load_model
from datetime import datetime

# 初始化 Flask 應用
app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')

# 設定上傳資料夾
BASE_UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
os.makedirs(BASE_UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = BASE_UPLOAD_FOLDER

# 設定 MySQL 連線
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'MySQL',
    'database': 'acne',
    'charset': 'utf8mb4'
}

# 讀取 AI 模型
try:
    model_path = 'acne_model.h5'
    if not os.path.isfile(model_path):
        raise FileNotFoundError(f"Model file '{model_path}' not found. Please upload the model.")
    model = load_model(model_path)
    print("AI model loaded successfully.")
except Exception as e:
    print(f"Error loading AI model: {e}")
    model = None

# 痘痘嚴重程度對應表
acne_severity = {
    0: "Grade I: Mild acne with comedones.",
    1: "Grade II: Moderate acne with papules.",
    2: "Grade III: Severe acne with pustules.",
    3: "Grade IV: Very severe acne with nodules."
}

# 確認是否允許的圖片類型
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# AI 分析照片
def classify_acne(image_path):
    if model is None:
        return 'AI model not loaded', 'N/A'
    try:
        image = cv2.imread(image_path)
        image = cv2.resize(image, (224, 224)) / 255.0
        image = np.expand_dims(image, axis=0)
        prediction = model.predict(image)
        predicted_class = np.argmax(prediction)
        confidence = np.max(prediction)
        return acne_severity.get(predicted_class, 'Unknown Severity'), f"{confidence:.2f}"
    except Exception as e:
        return f"Error during classification: {e}", 'N/A'

# 確保使用者資料夾存入資料庫
def save_user_folder(username):
    try:
        folder_path = os.path.join(BASE_UPLOAD_FOLDER, username)
        os.makedirs(folder_path, exist_ok=True)  # 建立資料夾（如果不存在）

        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()

        # 檢查 `user_folders` 是否已存在
        cursor.execute("SELECT * FROM user_folders WHERE username = %s", (username,))
        result = cursor.fetchone()

        if result is None:
            sql = "INSERT INTO user_folders (username, folder_path) VALUES (%s, %s)"
            cursor.execute(sql, (username, folder_path))
            connection.commit()

        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Database error: {e}")

# 存入 MySQL
def save_to_database(user_id, filename, face_part, severity, confidence, upload_time):
    try:
        # 確保 confidence 為數值
        confidence_value = 0.00 if confidence in [None, 'N/A'] else float(confidence)

        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()

        sql = """
            INSERT INTO acne_analysis (user_id, filename, face_part, severity, confidence, upload_time)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        # print("Executing SQL:", sql % (user_id, filename, face_part, severity, confidence_value, upload_time))  # ✅ Debug 輸出
        
        cursor.execute(sql, (user_id, filename, face_part, severity, confidence_value, upload_time))
        connection.commit()

        cursor.close()
        connection.close()
        print("✅ Data successfully saved!")  # ✅ 確保 SQL 有執行

        return True
    except Exception as e:
        print(f"Database error: {e}")  # 🔴 紀錄錯誤
        return False

# 首頁
# @app.route('/')
# def home():
#     return render_template('Mainpage/Mainpage.js')

# @app.route('/inform')
# def inform():
#     return render_template('Inform/Inform.js')

# @app.route('/chatbot')
# def chat():
#     return render_template('Chatbot/Chatbot.js')

# @app.route('/')
# def home():
#     return render_template('App.js')

# React 路由處理（首頁和 SPA 子路由）
@app.route('/')
@app.route('/Chatbot')
@app.route('/Inform')
@app.route('/AnalysisResult')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit', methods=['POST'])
def submit():
    severity = request.form.get('severity')
    return jsonify({
        'severity': severity,
        'skincare_advice': "Use mild cleansers and non-comedogenic moisturizers.",
        'diet_advice': "Focus on low-GI foods and fiber-rich vegetables.",
        'lifestyle_advice': "Maintain regular sleep and reduce stress."
    })

# 上傳與分析圖片（存入使用者資料夾）
@app.route('/upload', methods=['POST'])
def upload():
    user_id = request.form.get('user_id', 'anonymous')
    user_id = secure_filename(user_id)

    save_user_folder(user_id)

    user_folder = os.path.join(app.config['UPLOAD_FOLDER'], user_id)
    face_parts = ['left', 'middle', 'right']
    results = []
    upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for face_part in face_parts:
        file = request.files.get(face_part)
        if not file or not allowed_file(file.filename):
            return jsonify({'error': f'Invalid or missing file for {face_part}'}), 400

        filename = f"{user_id}_{face_part}.jpg"
        file_path = os.path.join(user_folder, filename)
        file.save(file_path)

        severity, confidence = classify_acne(file_path) ##AI模型
        save_to_database(user_id, filename, face_part, severity, confidence, upload_time)

        results.append({
            'face_part': face_part,
            'filename': filename,
            'severity': severity,
            'confidence': confidence,
            'upload_time': upload_time
        })

    print("✅ Upload success, returning JSON response.")
    
    # 🔹 只回傳 JSON，讓前端處理跳轉
    return jsonify({"success": True, "user_id": user_id})

@app.route('/result')
def result():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    connection = pymysql.connect(**DB_CONFIG)
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT * FROM acne_analysis WHERE user_id = %s ORDER BY upload_time DESC", (user_id,))
    results = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify({"results": results})

from flask import send_from_directory

@app.route('/uploads/<user_id>/<filename>')
def uploaded_file(user_id, filename):
    """ 提供 `uploads/user_id/` 內的圖片 """
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], user_id), filename)

#檢查user_id是否有重複
@app.route('/check-user-id', methods=['GET'])
def check_user_id():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400

    try:
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        cursor.execute("SELECT 1 FROM user_folders WHERE username = %s", (user_id,))
        exists = cursor.fetchone() is not None
        cursor.close()
        connection.close()
        return jsonify({'exists': exists})
    except Exception as e:
        print(f"Database error in check_user_id: {e}")
        return jsonify({'error': 'Server error'}), 500

# 啟動伺服器
if __name__ == '__main__':
    print("Starting server. Ensure TensorFlow and MySQL are properly configured.")
    app.run(debug=True, host='0.0.0.0')
