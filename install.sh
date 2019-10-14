# Setup the mlflow Operator
#
oc create -f mlflow-tracking-operator/deploy/service_account.yaml
# Setup RBAC
oc create -f mlflow-tracking-operator/deploy/role.yaml
oc create -f mlflow-tracking-operator/deploy/role_binding.yaml
# Setup the CRD
oc create -f mlflow-tracking-operator/deploy/crds/ai_v1alpha1_trackingserver_crd.yaml
# Deploy the app-operator
oc create -f mlflow-tracking-operator/deploy/operator.yaml
#
oc create -f mlflow-tracking-operator/deploy/crds/ai_v1alpha1_trackingserver_cr.yaml
#
# Once done, expose the route so the mlflow tracking ui can be displayed
#oc expose svc/mlflow-tracking-operator
#route.route.openshift.io/mlflow-tracking-operator exposed

##################################################################
# Install the ML Flow service to train models and provide prediction
#oc new-app python~https://github.com/bfarr-rh/DancingRobot.git#master --context-dir=dance-ml
#oc expose svc/dancingrobot

###############################################################
# Install the Rules in Java (and Quarkus for comparison

# To build the image on OpenShift
#oc new-app quay.io/quarkus/ubi-quarkus-native-s2i:19.2.0.1~https://github.com/bfarr-rh/DancingRobot.git#master --context-dir=dance-rules --name=dance-rules-native
#oc logs -f bc/dance-rules-native

# To create the route
#oc expose svc/dance-rules-native

# Get the route URL
#export URL="http://$(oc get route | grep dance-rules-native | awk '{print $2}')"
#echo $URL

#If you want to build it locally use the build based on quarkus native chained builds
#https://quarkus.io/guides/openshift-s2i-guide

# To build the image on OpenShift
#oc new-app registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift~https://github.com/bfarr-rh/DancingRobot.git#master --context-dir=dance-rules --name=dance-rules
#oc logs -f bc/dance-rules

# To create the route
#oc expose svc/dance-rules

# Get the route URL
#export URL="http://$(oc get route | grep dance-rules | awk '{print $2}')"

oc create -f <your registry secret>.yaml -n quarkus-demo

oc secrets link builder <your registry pull secret>
Import the openjdk/openjdk-11-rhel8 image stream
oc import-image openjdk/openjdk-11-rhel8 --from=registry.redhat.io/openjdk/openjdk-11-rhel8 --confirm -n quarkus-demo
create an app using:
oc new-app --name quarkus-jvm-demo \
	--image-stream openjdk-11-rhel8 \
	--build-env=ARTIFACT_COPY_ARGS="-p -r lib/ *-runner.jar" \
	--env=JAVA_OPTIONS="-Dquarkus.http.host=0.0.0.0" \
	--env=JAVA_APP_JAR="getting-started-1.0-SNAPSHOT-runner.jar" \
	https://github.com/rafaeltuelho/quarkus-demo.git
##################################################################

# UI
oc create configmap danceui-config \
    --from-literal APP_NAME="My Gitea Instance" \
    --from-literal RUN_MODE=prod \
    --from-literal INSTALL_LOCK=true
# oc new-app nodeshift/centos7-s2i-nodejs:latest~https://github.com/bfarr-rh/DancingRobot.git#master --context-dir=dance-ui --name=danceui
# oc expose svc/danceui
# oc logs -f bc/danceui

##################################################################
# The dance translate service 
oc create -f <your registry secret>.yaml 
oc secrets link builder <your registry pull secret>

./dance-translate/mvn clean install
oc new-build --name=dance-translate  registry.redhat.io/openjdk/openjdk-8-rhel8 --binary=true
oc start-build dance-translate --from-dir=./dance-translate/target --follow
oc new-app dance-translate
oc logs -f bc/dance-translate
oc expose svc/dance-translate


#oc new-app registry.redhat.io/fuse7/fuse-java-openshift~https://github.com/bfarr-rh/DancingRobot.git#master --context-dir=dance-translate --name=dance-translate


