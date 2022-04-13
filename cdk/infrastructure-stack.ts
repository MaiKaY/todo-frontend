import {
    Stack,
    StackProps,
    aws_s3 as s3,
    aws_s3_deployment as s3Deployment,
    aws_route53 as route53,
    aws_route53_targets as route53targets,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as cloudfrontOrigins,
    aws_certificatemanager as certificatemanager
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface InfrastructureStackProps extends StackProps {
    readonly environment: 'Staging' | 'Production';
}

export class InfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
        super(scope, id, props);

        const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: 'Z3RTWM8AWT41HI',
            zoneName: 'maikay.de'
        });
        const domainName = props.environment === 'Production' ? 'todo.maikay.de' : 'staging-todo.maikay.de';
        const certificate = certificatemanager.Certificate.fromCertificateArn(
            this,
            'Certificate',
            'arn:aws:acm:us-east-1:515422304400:certificate/716224e7-872e-4fc0-b8db-f95a3a255e2b'
        );

        const bucket = new s3.Bucket(this, 'WebsiteBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });

        const distribution = new cloudfront.Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: new cloudfrontOrigins.S3Origin(bucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            },
            errorResponses: [
                {
                    httpStatus: 403,
                    responsePagePath: '/index.html',
                    responseHttpStatus: 200
                }
            ],
            domainNames: [domainName],
            certificate: certificate,
            defaultRootObject: 'index.html'
        });

        new s3Deployment.BucketDeployment(this, 'DeployWebsite', {
            sources: [s3Deployment.Source.asset('./dist')],
            destinationBucket: bucket,
            distribution,
            distributionPaths: ['/*']
        });

        new route53.ARecord(this, 'Record', {
            zone: hostedZone,
            recordName: domainName,
            target: route53.RecordTarget.fromAlias(new route53targets.CloudFrontTarget(distribution))
        });
    }
}
