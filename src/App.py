from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import pikepdf
import itertools
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ENCRYPTED_FOLDER = 'encrypted'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ENCRYPTED_FOLDER, exist_ok=True)

# In-memory file metadata storage
file_log = []

def log_file(filename, status, size_kb):
    file_log.insert(0, {
        'id': str(len(file_log) + 1),
        'name': filename,
        'status': status,
        'uploadTime': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'size': f'{size_kb:.1f} KB'
    })
    if len(file_log) > 50:
        file_log.pop()

@app.route('/encrypt-pdf', methods=['POST'])
def encrypt_pdf():
    try:
        pdf_file = request.files['file']
        password = request.form.get('password')

        filename = secure_filename(pdf_file.filename)
        original_path = os.path.join(UPLOAD_FOLDER, filename)
        encrypted_path = os.path.join(ENCRYPTED_FOLDER, f'encrypted_{filename}')
        pdf_file.save(original_path)

        pdf = pikepdf.Pdf.open(original_path)
        pdf.save(encrypted_path, encryption=pikepdf.Encryption(owner=password, user=password, R=4))

        file_size_kb = os.path.getsize(original_path) / 1024
        log_file(f'encrypted_{filename}', 'encrypted', file_size_kb)

        return send_file(encrypted_path, as_attachment=True, download_name=f'encrypted_{filename}')

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/crack-pdf', methods=['POST'])
def crack_pdf():
    try:
        pdf_file = request.files['file']
        mode = request.form.get('mode')
        filename = secure_filename(pdf_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        pdf_file.save(file_path)

        def try_open(password):
            try:
                with pikepdf.open(file_path, password=password):
                    return True
            except pikepdf.PasswordError:
                return False
            except Exception:
                return False

        file_size_kb = os.path.getsize(file_path) / 1024

        if mode == 'dictionary':
            wordlist = request.form.getlist('wordlist[]')
            for pwd in wordlist:
                if try_open(pwd.strip()):
                    log_file(filename, 'cracked', file_size_kb)
                    return jsonify({'success': True, 'password': pwd})
            log_file(filename, 'encrypted', file_size_kb)
            return jsonify({'success': False, 'message': 'Password not found in wordlist.'})

        elif mode == 'brute':
            charset = request.form.get('charset', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
            length = int(request.form.get('length', '4'))
            max_attempts = 10000000
            attempts = 0
            start_time = time.time()

            for combo in itertools.product(charset, repeat=length):
                attempt = ''.join(combo)
                if try_open(attempt):
                    duration = time.time() - start_time
                    log_file(filename, 'cracked', file_size_kb)
                    return jsonify({'success': True, 'password': attempt, 'time': round(duration, 2)})
                attempts += 1
                if attempts >= max_attempts:
                    break

            log_file(filename, 'encrypted', file_size_kb)
            return jsonify({'success': False, 'message': 'Brute-force failed. Password not found.'})

        else:
            return jsonify({'success': False, 'message': 'Invalid cracking mode.'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/files', methods=['GET'])
def get_files():
    return jsonify(file_log)

@app.route('/clear-files', methods=['DELETE'])
def clear_files():
    try:
        for folder in [UPLOAD_FOLDER, ENCRYPTED_FOLDER]:
            for filename in os.listdir(folder):
                path = os.path.join(folder, filename)
                if os.path.isfile(path):
                    os.remove(path)
        file_log.clear()
        return jsonify({'success': True, 'message': 'All files cleared successfully.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
