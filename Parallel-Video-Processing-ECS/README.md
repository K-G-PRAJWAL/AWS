
## Parallel-Video-Processing-ECS

AWS Step Functions workflow processes a list of video files that are provided to it as input, launching parallel Amazon ECS tasks, running concurrently on AWS Fargate, to process the files using the [FFmpeg](https://www.ffmpeg.org/) command line tool and convert the video to audio format and upload the resultant output to an S3 bucket.

References:
- https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html
- https://docs.aws.amazon.com/step-functions/latest/dg/connect-ecs.html
- https://docs.aws.amazon.com/AmazonECS/latest/userguide/fargate-task-networking.html