from flask import Flask, render_template, jsonify, request
import requests
from preprocess import extract_sudoku
from extract_numbers import extract_number
import os

application = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@application.route('/upload_image', methods=['POST'])
def upload_image():
    if request.method == 'POST':
        if 'file' not in request.files:
            return ("Error", 400)
        
        file = request.files['file']
        if file.filename == '':
            return ("No selected file", 400)
        
        if file:
            filename = file.filename
            file_path = os.path.join(application.config['UPLOAD_FOLDER'], filename)
            board = extract_sudoku(file_path)
            grid = extract_number(board)
            # print(grid, type(grid))
        
        return(jsonify(grid.tolist()), 200)

@application.route('/')
def homepage():
    return render_template('index.html')

if __name__ == "__main__":
    application.run(host='127.0.0.1', port=5000, debug=True)