# AWS EMR Workshop

1. On AWS open Cloud9 service and create an environment
2. Configure settings:
    a. Create new EC2 instance

    b. t2.micro

    c. Platform: AL2

    d. Create a VPC + Subnet and attach it

3. Create EC2 Key-Pair and upload it to the Cloud9 environment

4. EMR > Create cluster:
    a. Advanced options

    b. emr release: 6.5.0, Services: Hadoop, Spark, Hive, Pig, Jupyter, Tez, Livy

    c. Register for Glue catalog: Hive + Spark

    d. Hardware: 1 master, 2 core - m5.xlarge | Same VPC and subnet created earlier

    e. General settings:

        i. Cluster name

        ii. Logging

        iii. Termination protection

    f. Select the EC2 Key pair created earlier

    g. Create Cluster
5. SSH into the cluster:

    a. Select security group for master node

    b. Add Rule: SSH frpm IP of the Cloud9 EC2 instance

    c. Navigate to Cloud9 terminal and connect to the master node via command: `ssh -i <<key-pair>> hadoop@<<emr-master-public-dns-address>>`
6. Spark ETL:

    a. Create S3 bucket <YOUR-BUCKET> with 3 folders: `input`, `output`, `logs`, `files`

    b. Upload sample datasets into the input folder: [tripdata.csv](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/data/tripdata.csv)

    c. Create a file in the master node: [script1.py](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/scripts/script1.py). Upload this file to `s3://<YOUR-BUCKET>/files/`

    d. Submit the spark job: `spark-submit script1.py s3://<YOUR-BUCKET>/input/ s3://<YOUR-BUCKET>/output/spark/`

    e. Monitor the execution of the jobs via YARN application view on the EMR console under "Application history" tab

    f. Spark UI: Available under "Summary" tab on EMR Console

    g. Create EMR Notebook via console > Create new PySpark notebook and play around with PySpark there

    h. EMR Steps:

        i. Its possible to automate the jobs submission to the cluster and allow the cluster to pick up jobs as steps.

        ii. Create a new file: [script2.py](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/scripts/script2.py) and upload it to `s3://<YOUR-BUCKET>/files/`

        iii. Navigate to EMR Console > "Steps" tab

        iv. Add step > Type: Custom JAR > Name: Custom JAR > JAR location: command-runner.jar > Arguments: `spark-submit s3://<YOUR-BUCKET>/files/spark2.py s3://<YOUR-BUCKET>/input s3://<YOUR-BUCKET>/output`

        v. Add

        vi. Job should successfully complete on the cluster

    i. Its also possible to connect to the instance via Jupyter Notebook using the Master public DNS available on the "Summary" tab

    j. `https://<Master_DNS_IP>:9443`   

    k. Execute PySpark commands on the Jupyter notebook

7. Hive:

    a. Log in to the master node CLI

    b. Enter `hive`

    c. Create external table in hive: `script3.hql`

    d. Run the query via CLI: `SELECT * FROM temptable;`

    e. Perform this as an EMR step:
    
        i. Upload [script3.hql](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/scripts/script3.hql) to `files` folder

        ii. Add step in EMR > Script S3 location: `s3://<YOUR-BUCKET>/files/script4.hql` > Input S3 location: `s3://<YOUR-BUCKET>/input/` > Output S3 location: `s3://<YOUR-BUCKET>/output/hive/`

        iii. Add

8. Pig:
    a. Upload [script4.pig]https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/scripts/script4.pig() to `files` folder

    b. dd EMR step > Script S3 location: `s3://<YOUR-BUCKET>/files/script4.hql` > Input S3 location: `s3://<YOUR-BUCKET>/input/` > Output  `s3://<YOUR-BUCKET>/output/pig/`

    c. Add

9. Auto-Scaling:

    a. In EMR its EMR Managed Scaling

    b. Minimum Capacity Units(lower limit on number of nodes) & Maximum Capacity Units(upper limit on number of nodes)

    c. On-Demand limit(upper limit of allowed nodes)

    d. Scale-up and Scale-down strategy

10. EMR Notebooks = Sagemaker integration:

    a. EMR Console > "Hardware" tab > Select any core node > Open the associted IAM role > Add `AmazonSageMakerFullAccess` policy to that role

    b. Create IAM Role > Service: Sagemaker > Call it `EMR-Sagemaker-Integration-Role`

    c. Copy the role ARN

    d. Open EMR Console > Create Notebook > Select the running cluster > Create notebook > Open it

    e. Click Upload > upload [notebook1.ipynb](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/notebooks/notebook1.ipynb) > Enter the role arn in the notebook's 1st cell.

    f. Execute the cells in the notebook and explore the code for a regression model
11. HUDI:

    a. Apache Hudi is a data management framework used for incremental data processing and pipeline development. 

    b. It provides record-level insert, update, deletes. 

    c. Hudi allows for data to be ingested and updated near-real time 
    d. It persists the metadata of the actions performed to ensure data is consistent and atomic

    e. Execute following commands on master node:

    `hdfs dfs -copyFromLocal /usr/lib/hudi/hudi-spark-bundle.jar hdfs:///user/hadoop/`

    `hdfs dfs -copyFromLocal /usr/lib/spark/external/lib/spark-avro.jar hdfs:///user/hadoop/`

    `hdfs dfs -copyFromLocal /usr/lib/spark/jars/httpclient-4.5.9.jar hdfs:///user/hadoop/`

    f. COW = Copy on Write: [notebook2.ipynb](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/notebooks/notebook2.ipynb)

    g. MOR = Merge on Read: [notebook3.ipynb](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/notebooks/notebook3.ipynb)

    h. Parttitioning = [notebook4.ipynb](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/notebooks/notebook4.ipynb)

12. Orchestrating EMR workflows using Step Functions:

    a. Go to Step Functions console

    b. Create state machine

    c. Use code in [script5.json](https://github.com/K-G-PRAJWAL/AWS/blob/master/AWS%20EMR/Workshop/scripts/script5.json) - This code runs the script2, script3, script4 for pyspark, hive and pig jobs using a workflow to trigger them in a particular sequence.

    d. Trigger state machine:

        i. Click Start Execution

        ii. Use the code in [script6.json]() to trigger the machine > replace the cluster ID with your cluster's ID > replace all the S3 paths > Start execution

    e. Once all steps are green, the workflow has executed successfully


# Additional Reading:

- Apache Spark: https://aws.amazon.com/emr/features/spark/
- Apache HBase: https://aws.amazon.com/emr/features/hbase/
- Apache Hive: https://aws.amazon.com/emr/features/hive/
- Presto: https://aws.amazon.com/emr/features/presto/
- Apache Flink: https://aws.amazon.com/blogs/big-data/use-apache-flink-on-amazon-emr/
- Apache Hudi: https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-hudi.html
