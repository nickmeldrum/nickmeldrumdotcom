#!/bin/sh
nickmeldrumcomblog_testing_infrastructure_stack_id=$(aws cloudformation describe-stacks --stack-name nickmeldrumcomblog-testing-infrastructure --output text --query Stacks[*].StackId --region us-east-1)
echo $nickmeldrumcomblog_testing_infrastructure_stack_id
#aws cloudformation describe-stacks --stack-name nickmeldrumcomblog-testing-infrastructure --output text --query Stacks[*].StackId --region us-east-1
