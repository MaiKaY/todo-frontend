import { Stack, StackProps, SecretValue, aws_ssm as ssm, pipelines } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { InfrastructureStage } from './infrastructure-stage';

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const gitHubToken = ssm.StringParameter.valueForStringParameter(this, '/GITHUB/ACCESS_TOKEN');

        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            pipelineName: 'Todo-Web-Pipeline',
            synth: new pipelines.CodeBuildStep('SynthStep', {
                input: pipelines.CodePipelineSource.gitHub('MaiKaY/todo-frontend', 'main', {
                    authentication: SecretValue.plainText(gitHubToken)
                }),
                installCommands: ['npm install -g aws-cdk'],
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            }),
            dockerEnabledForSelfMutation: true,
            dockerEnabledForSynth: true
        });

        const productionInfrastructure = new InfrastructureStage(this, 'Production', {
            environment: 'Production'
        });
        pipeline.addStage(productionInfrastructure);

        // const stagingInfrastructure = new InfrastructureStage(this, 'Staging', {
        //     environment: 'Staging'
        // });
        // pipeline.addStage(stagingInfrastructure);
        //
        // const productionInfrastructure = new InfrastructureStage(this, 'Production', {
        //     environment: 'Production'
        // });
        // pipeline.addStage(productionInfrastructure, {
        //     pre: [new pipelines.ManualApprovalStep('Approve')]
        // });
    }
}
