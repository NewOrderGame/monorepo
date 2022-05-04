#!/usr/bin/env node
import { StaticSite } from './static-site';
import { App, Stack, StackProps } from 'aws-cdk-lib';

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
