# Dance ML project

This project provides several APIs 
1. Train models for linear regression
2. Predict values based on input
3. Ability to save and retrieve models

The project is currently limited in its ability to have concurrent access as only a single model is held in memory that is used to run predictions

The key logic within the service is based on MLFlow, results are sent to the tracking server if available.

Links
https://blog.openshift.com/openshift-commons-briefing-introduction-to-mlflow-on-openshift-mani-parkhe-databricks-and-zak-hassan-red-hat/
https://mlflow.org
https://github.com/mlflow
https://github.com/mlflow/mlflow/pull/932
https://github.com/zmhassan/mlflow-tracking-operator
https://www.mlflow.org/docs/latest/tracking.html

