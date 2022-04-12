import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { InfrastructureStack } from './infrastructure-stack';

export interface InfrastructureStageProps extends StageProps {
    readonly environment: 'Staging' | 'Production';
}

export class InfrastructureStage extends Stage {
    constructor(scope: Construct, id: string, props: InfrastructureStageProps) {
        super(scope, id, props);

        new InfrastructureStack(this, 'Infrastructure', {
            stackName: `Todo-Web-Infrastructure-${props.environment}`,
            terminationProtection: true,
            environment: props.environment
        });
    }
}
