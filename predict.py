import os
from joblib import load
from PIL import Image
import numpy as np
import pandas as pd

model = load('model.joblib')
pca = load('pca.joblib')
scaler = load('scaler.joblib')

if __name__ == "__main__":
    save_path = os.path.join("./tmp", 'tmp.jpg')
    uploads_folder = os.path.abspath('tmp')
    output_csv_path = os.path.join(uploads_folder, 'output.csv')
    data = []
    img = Image.open("./tmp/input.jpg").convert('L')
    width, height = img.size
    new_dimension = min(width, height)
    left = (width - new_dimension) / 2
    top = (height - new_dimension) / 2
    right = (width + new_dimension) / 2
    bottom = (height + new_dimension) / 2
    img_cropped = img.crop((left, top, right, bottom))
    img_resized = img_cropped.resize((48, 48), Image.Resampling.LANCZOS)
    img = np.array(img_resized).flatten()
    img_resized.save(save_path)
    data.append(img)
    df = pd.DataFrame(data, columns=[*range(2304)])
    scaled = scaler.transform(df)
    pca_transformed = pca.transform(scaled)
    prediction = model.predict(pca_transformed)
    predictions_df = pd.DataFrame(prediction, columns=['predicted_class'])
    predictions_df.to_csv(output_csv_path, index=False)
