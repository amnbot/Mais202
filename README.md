# **Character Mood Classifier**
## **MAIS 202 Final Project**

## The project

When starting out, artists often find themselves struggling to properly convey their character's emotions. This project's purpose is to serve as a tool for begginer artists looking to make their emotions more captivating.

## The dataset

The [dataset](https://www.kaggle.com/datasets/mertkkl/manga-facial-expressions) initially consists of 462 images distributed in the following manner:

- Pleased (38)
- Angry (54)
- Crying (56)
- Sad (57)
- Embarrassed (67)
- Happy (87)
- Shock/Surprised (103)

I added my own screenshots to the datasets, bumping it up to a total of 680 images distributed in the following manner:

- Pleased (80)
- Angry (86)
- Crying (82)
- Sad (81)
- Embarrassed (92)
- Happy (142)
- Shock/Surprised (117)

## The model

I used a pretrained ResNet-50, which I then finetuned with my custom dataset. I used Cross-Entropy loss as my loss function.

## Results

It was expected that the accuracy would not be satisfying given the size of the dataset. After multiple modifications, the model achieved 57.89% for both precision and recall. Below is the resulting confusion matrix for the testing dataset, which consists of 57 images.

- 0: angry
- 1: crying
- 2: embarassed
- 3: happy
- 4: pleased
- 5: sad
- 6: shock

        # Classes (rows)
        # Predictions (columns):
         0  1  2  3  4  5  6
        [5, 1, 0, 0, 0, 0, 0],
        [1, 3, 1, 1, 0, 1, 2],
        [0, 1, 3, 0, 0, 2, 0],
        [1, 1, 2, 4, 0, 0, 0],
        [0, 0, 0, 2, 5, 1, 1],
        [1, 1, 0, 0, 0, 5, 0],
        [0, 2, 2, 0, 0, 0, 8]]


Full-model loss VS Last layer loss
![Full-model loss VS Last layer loss](/code/results/last_layer_vs_full_model_loss.png)

## The web application

The model is deployed in a Flask web application (not deployed on the Internet). The user uploads an image file and clicks on upload. The model makes the prediction and the result is displayed.