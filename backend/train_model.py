import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

#Load the generated data
df = pd.read_csv("train_data.csv")

# Features (X) vs Target (y)
# X = the factors we use to judge. y = the AgriScore we want to predict.
X = df.drop('agriScore', axis=1)
y = df['agriScore']

#Handling Text Data (Categorical Encoding)

categorical_features = ['existingLoans', 'irrigated', 'soilType', 'cropType']
categorical_transformer = OneHotEncoder(handle_unknown='ignore')

# This "ColumnTransformer" tells the pipeline: 
# "Use the encoder on these 4 columns, but leave the numbers (farmSize, etc.) alone."
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', categorical_transformer, categorical_features)
    ],
    remainder='passthrough'
)

#Assemble the Pipeline
# We combine the "Translator" (preprocessor) and the "Thinker" (Random Forest)
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# The Test (80% training, 20% for self-testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#Train the model
print("Training the AgriScore-Pay Model...")
model_pipeline.fit(X_train, y_train)

#Check performance on the test set
y_pred = model_pipeline.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\n--- Model Performance ---")
print(f"Mean Absolute Error: {mae:.2f} points")
print(f"R2 Score: {r2:.4f}") # Aiming for > 0.85

#Save
joblib.dump(model_pipeline, "agriscore_pipeline.pkl")
print("Done! agriscore_pipeline.pkl is ready ")