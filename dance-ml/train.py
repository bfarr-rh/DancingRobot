# The data set used in this example is from http://archive.ics.uci.edu/ml/datasets/Wine+Quality
# P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis.
# Modeling wine preferences by data mining from physicochemical properties. In Decision Support Systems, Elsevier, 47(4):547-553, 2009.

import os
import warnings
import sys

import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.linear_model import ElasticNet
from io import StringIO

import mlflow
import mlflow.sklearn
import tornado.ioloop
import tornado.web
from tornado import websocket, web, ioloop
import json, os



class IndexHandler(web.RequestHandler):
	'''Handle requests on / '''
	def get(self):
		self.render("index.html")

class LoadModelHandler(web.RequestHandler):
    def set_default_headers(self):
        print ("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    def post(self, *args):
        global lr 
        global loadedModelName
        experimentName = self.get_query_argument("experimentName")
        print("Loading model :" + experimentName)
        lr = mlflow.sklearn.load_model(experimentName)
        loadedModelName = experimentName
        self.write("OK");
        self.finish()

class SaveModelHandler(web.RequestHandler):
    def set_default_headers(self):
        print ("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    def post(self, *args):
        global lr 
        global loadedModelName
        mlflow.sklearn.save_model(lr, loadedModelName, serialization_format=mlflow.sklearn.SERIALIZATION_FORMAT_CLOUDPICKLE)
        self.write("OK");
        self.finish()

class ApiPredictHandler(web.RequestHandler):
    def set_default_headers(self):
        print ("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    def post(self, *args):
        '''data = json.loads(self.request.body)'''
        data = self.request.body.decode("utf-8")
        experimentName = self.get_query_argument("experimentName")
        prediction = predict(data,experimentName)
        print(prediction)
        self.write(str(prediction));
        self.finish()

class ApiTrainHandler(web.RequestHandler):
    def set_default_headers(self):
        print ("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    def post(self, *args):
        '''data = json.loads(self.request.body)'''
         # Read the wine-quality csv file (make sure you're running this from the root of MLflow!)
        '''uploaded_csv_file = self.request.files['file'][0]'''
        '''data = uploaded_csv_file.read_all()'''
        data = pd.read_csv(StringIO(self.request.body.decode("utf-8")))
        print(data)
        '''wine_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio-dance.csv")'''
        '''data = pd.read_csv(wine_path)'''
        experimentName = self.get_query_argument("experimentName")
        print("Experiment Name : " + experimentName)
        train_data(data, experimentName);
        self.finish()

def make_app():
    return tornado.web.Application([
        (r"/", IndexHandler),
        (r'/predict', ApiPredictHandler),
         (r'/train', ApiTrainHandler),
         (r'/savemodel', SaveModelHandler),
         (r'/loadmodel', LoadModelHandler)
    ])

def predict(values, experimentName):
    global lr 
    global loadedModelName
    test_values = pd.read_csv(StringIO(values), header=None)
    prediction = lr.predict(test_values)

    return prediction

def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2



def train_data(data, experimentName):
    warnings.filterwarnings("ignore")
    np.random.seed(40)

    # Split the data into training and test sets. (0.75, 0.25) split.
    train, test = train_test_split(data)

    # The predicted column is "quality" which is a scalar from [3, 9]
    train_x = train.drop(["quality"], axis=1)
    test_x = test.drop(["quality"], axis=1)
    train_y = train[["quality"]]
    test_y = test[["quality"]]

    alpha = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
    l1_ratio = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0

    with mlflow.start_run():
        global lr 
        global loadedModelName
        lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)
        lr.fit(train_x, train_y)

        predicted_qualities = lr.predict(test_x)

        (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)

        print("Elasticnet model (alpha=%f, l1_ratio=%f):" % (alpha, l1_ratio))
        print("  RMSE: %s" % rmse)
        print("  MAE: %s" % mae)
        print("  R2: %s" % r2)

        mlflow.log_param("alpha", alpha)
        mlflow.log_param("l1_ratio", l1_ratio)
        mlflow.log_metric("rmse", rmse)
        mlflow.log_metric("r2", r2)
        mlflow.log_metric("mae", mae)

        mlflow.sklearn.log_model(lr, experimentName)
       
        loadedModelName = experimentName

if __name__ == "__main__":
    global lr 
    global loadedModelName
    loadedModelName = ''
    app = make_app()
    app.listen(8080)
    for item, value in os.environ.items():
        print('{}: {}'.format(item, value))

    tornado.ioloop.IOLoop.current().start()

