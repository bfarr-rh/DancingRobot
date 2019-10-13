# DancingRobot
An example of ML driving a Robot correlating music and action input.

The project consists of:
mlflow-tracking-operator - the tracking operator to install in OpenShift in order to track runs.
danceui - The Robot Dance UI containing audio, this is based on p5 js.
dancerules - a Decision Manager based API containing rules about the predictions to robot moves.
dance-ml - a MLFlow python based API which enables training of models and running predictions. 
localproxyservice - a local proxy required to run within the same wifi network as robots, based on Quarkus.
dance-translate - a Fuse based service orchestrating single moves such as left, right, up, spin to a series of robot api calls.

