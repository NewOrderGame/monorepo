#!/usr/bin/env node
import { StaticSite } from './static-site';
import { App, Stack, StackProps } from 'aws-cdk-lib';

/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk synth -c domain=mystaticsite.com -c subdomain=www'
 * Or add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mystaticsite.com",
 *     "subdomain": "www",
 *     "accountId": "1234567891",
 *   }
 * }
 **/
export class LandingPageStack extends Stack {
  constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);

    const domainName = this.node.tryGetContext('domain');
    const siteSubDomain = this.node.tryGetContext('subdomain');

    new StaticSite(this, 'StaticSite', {
      domainName,
      siteSubDomain
    });
  }
}
