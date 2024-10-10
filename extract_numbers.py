import numpy as np
import cv2
import numpy as np
from keras.models import load_model
import os

# Load the saved model

loaded_model = load_model('./model/model_final.keras')
print("Loaded saved model from disk.")

# evaluate loaded model on test data
def identify_number(image, i, j):
    image_resize = cv2.resize(image, (28,28))    # For plt.imshow
    image_resize_2 = image_resize.reshape(1,28,28,1)    # For input to model.predict_classes
    # cv2.imwrite(f'./processed/img_{i}_{j}.png', image_resize)
    loaded_model_pred = np.argmax(loaded_model.predict(image_resize_2), axis=-1)

    return loaded_model_pred

def extract_number(sudoku):
    sudoku = cv2.resize(sudoku, (450,450))

    # split sudoku
    grid = np.zeros([9,9])
    for i in range(9):
        for j in range(9):
            image = sudoku[i*50:(i+1)*50,j*50:(j+1)*50]

            if image.sum() > 100000:
                grid[i][j] = identify_number(image, i, j)
            else:
                grid[i][j] = 0
    return grid.astype(int)

