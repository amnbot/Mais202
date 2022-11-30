import os
from flask import Flask, request, Response, render_template, redirect, url_for
from flask_cors import CORS
from flask_ngrok import run_with_ngrok
from io import BytesIO
import base64
from binascii import a2b_base64
from werkzeug.utils import secure_filename

import torch
from torch import nn
import torchvision.transforms as transforms
import torch.nn.functional as F
import numpy as np

UPLOAD_FOLDER = 'app/static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__, template_folder='templates')
CORS(app)
run_with_ngrok(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

idx_to_label = [
    "angry",
    "crying",
    "embarassed",
    "happy",
    "pleased",
    "sad",
    "shock"
    ]

import torch
import torchvision
import torchvision.datasets as datasets # For importing dataset
import torch.utils.data as data

model = torch.jit.load('model_scripted_3.pt')
model.eval()

from PIL import Image, ImageEnhance, ImageGrab
# transform class to make images sharper
class Sharpie(object):
    def __init__(self,factor):
        self.factor = factor

    def __call__(self, x):
        enhancer = ImageEnhance.Sharpness(x)
        img = enhancer.enhance(self.factor)
        return img

# Image preprocessing
from torchvision import transforms

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.Grayscale(3),
    transforms.Lambda(lambda x: torchvision.transforms.functional.adjust_contrast(x, 2)),
    transforms.Lambda(lambda x: torchvision.transforms.functional.adjust_contrast(x, 2)),
    transforms.Lambda(lambda x: torchvision.transforms.functional.adjust_gamma(x, 2)),
    Sharpie(factor = 2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]), # These values seem to be a sort of "convention" (found in docs and other projects)
])

device = 'cuda' if torch.cuda.is_available() else 'cpu' # Device to send data and model to

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Predict route
@app.route("/predict", methods=["POST"])
def predict():
    if request.method == "POST":
        f = request.files['file']
        if f.filename == '':
            return 400
        if f and not allowed_file(f.filename):
            return 400
        filename = secure_filename(f.filename)
        print(filename)
        full_filename = os.path.join(app.config['UPLOAD_FOLDER'], filename).replace('\\', '/')
        f.save(full_filename)
        input_image = Image.open(full_filename)
        input_tensor = preprocess(input_image)
        input_batch = input_tensor.unsqueeze(0)
        input_batch = input_batch.to(device)

        with torch.no_grad():
            output = model(input_batch)

        return render_template('index.html', prediction=idx_to_label[int(output[0].argmax())], image=filename)
    else: return 400

@app.route("/")
def home():
    return render_template('index.html', prediction="", image="")

@app.route('/paint', methods=['GET', 'POST'])
def paint():
    if request.method == 'GET':
        return render_template("paint.html", prediction="")
    if request.method == 'POST':
        filename = request.form['save_fname']
        data = request.form['save_cdata']
        canvas_image = request.form['save_image']
        full_filename = os.path.join(app.config['UPLOAD_FOLDER'], filename).replace('\\', '/')
        # print(filename)
        # img = Image.open(BytesIO(base64.b64decode(canvas_image)))
        # print(canvas_image)
        params,data_img = canvas_image.split(',', 1)
        params = params[5:]
        params = params.split(';')
        img_64 = base64.b64decode(data_img)
        # with open('testfile2.png', 'wb') as fh:
        #     fh.write(img_64)
        img_file = BytesIO(img_64)
        img = Image.open(img_file)
        # canvas_image.save(full_filename)
        input_tensor = preprocess(img)
        input_batch = input_tensor.unsqueeze(0)
        input_batch = input_batch.to(device)
        with torch.no_grad():
            output = model(input_batch)
        prediction=idx_to_label[int(output[0].argmax())]
        print(prediction)
        return prediction
        

@app.route("/about")
def about():
    return render_template('about.html')

if __name__ == "__main__":
    app.run()