import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import * as path from 'path'
import * as synced_folder from '@pulumi/synced-folder'

const stackConfig = new pulumi.Config()

const targetDomain = stackConfig.require('targetDomain')
const pathToWebsiteContents = stackConfig.get('pathToWebsiteContents') ?? '../dist'
const includeWWW = stackConfig.getBoolean('includeWWW') ?? true
const certificateArnFromConfig = stackConfig.get('certificateArn')
const priceClass = stackConfig.get('priceClass') ?? 'PriceClass_100'
const ttlSeconds = stackConfig.getNumber('cacheTtlSeconds') ?? 600

const webRoot = path.resolve(process.cwd(), pathToWebsiteContents)
const safeSlug = targetDomain.replace(/\./g, '-')

const eastRegion = new aws.Provider('us-east-1', {
  region: 'us-east-1',
})

const contentBucket = new aws.s3.BucketV2('content', {
  bucket: `${safeSlug}-site`,
})

const ownershipControls = new aws.s3.BucketOwnershipControls('content-ownership', {
  bucket: contentBucket.id,
  rule: {
    objectOwnership: 'BucketOwnerEnforced',
  },
})

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock('content-public-access', {
  bucket: contentBucket.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
})

const oac = new aws.cloudfront.OriginAccessControl('content-oac', {
  name: `${safeSlug}-oac`,
  originAccessControlOriginType: 's3',
  signingBehavior: 'always',
  signingProtocol: 'sigv4',
})

new synced_folder.S3BucketFolder(
  'site-files',
  {
    path: webRoot,
    bucketName: contentBucket.bucket,
    acl: 'private',
  },
  { dependsOn: [ownershipControls, publicAccessBlock] },
)

function getDomainParts(domain: string): { subdomain: string; parentZoneName: string } {
  const parts = domain.split('.')
  if (parts.length < 2) {
    throw new Error(`Invalid targetDomain "${domain}" — use an apex host like example.com`)
  }
  if (parts.length === 2) {
    return { subdomain: '', parentZoneName: `${domain}.` }
  }
  const subdomain = parts[0]!
  parts.shift()
  return { subdomain, parentZoneName: `${parts.join('.')}.` }
}

function resolveHostedZoneId(): pulumi.Output<string> {
  const { parentZoneName } = getDomainParts(targetDomain)
  if (pulumi.runtime.isDryRun()) {
    return pulumi.output('Z0000000000000')
  }
  return pulumi.output(
    aws.route53.getZone({ name: parentZoneName, privateZone: false }, { async: true }).then((z) => z.zoneId),
  )
}

const hostedZoneId = resolveHostedZoneId()

let certificateArn: pulumi.Input<string>

if (certificateArnFromConfig) {
  certificateArn = certificateArnFromConfig
} else {
  const certificate = new aws.acm.Certificate(
    'cloudfront-cert',
    {
      domainName: targetDomain,
      subjectAlternativeNames: includeWWW ? [`www.${targetDomain}`] : [],
      validationMethod: 'DNS',
    },
    { provider: eastRegion },
  )

  const validationTtl = 600

  const certValidation0 = new aws.route53.Record(`${safeSlug}-cert-dns-0`, {
    allowOverwrite: true,
    name: certificate.domainValidationOptions.apply((opts) => opts[0]!.resourceRecordName),
    records: certificate.domainValidationOptions.apply((opts) => [opts[0]!.resourceRecordValue]),
    ttl: validationTtl,
    type: certificate.domainValidationOptions.apply((opts) => opts[0]!.resourceRecordType),
    zoneId: hostedZoneId,
  })

  let certValidation1: aws.route53.Record | undefined
  if (includeWWW) {
    certValidation1 = new aws.route53.Record(`${safeSlug}-cert-dns-1`, {
      allowOverwrite: true,
      name: certificate.domainValidationOptions.apply((opts) => opts[1]!.resourceRecordName),
      records: certificate.domainValidationOptions.apply((opts) => [opts[1]!.resourceRecordValue]),
      ttl: validationTtl,
      type: certificate.domainValidationOptions.apply((opts) => opts[1]!.resourceRecordType),
      zoneId: hostedZoneId,
    })
  }

  const validationFqdns = includeWWW
    ? pulumi.all([certValidation0.fqdn, certValidation1!.fqdn])
    : pulumi.all([certValidation0.fqdn])

  const validated = new aws.acm.CertificateValidation(
    'cloudfront-cert-validated',
    {
      certificateArn: certificate.arn,
      validationRecordFqdns: validationFqdns,
    },
    { provider: eastRegion },
  )

  certificateArn = validated.certificateArn
}

const aliases = includeWWW ? [targetDomain, `www.${targetDomain}`] : [targetDomain]

const cdn = new aws.cloudfront.Distribution('cdn', {
  enabled: true,
  aliases,
  defaultRootObject: 'index.html',
  origins: [
    {
      domainName: contentBucket.bucketRegionalDomainName,
      originId: contentBucket.arn,
      originAccessControlId: oac.id,
    },
  ],
  defaultCacheBehavior: {
    targetOriginId: contentBucket.arn,
    viewerProtocolPolicy: 'redirect-to-https',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
    cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
    forwardedValues: {
      cookies: { forward: 'none' },
      queryString: false,
    },
    minTtl: 0,
    defaultTtl: ttlSeconds,
    maxTtl: ttlSeconds,
  },
  priceClass,
  customErrorResponses: [
    { errorCode: 403, responseCode: 200, responsePagePath: '/index.html' },
    { errorCode: 404, responseCode: 200, responsePagePath: '/index.html' },
  ],
  restrictions: {
    geoRestriction: {
      restrictionType: 'none',
    },
  },
  viewerCertificate: {
    acmCertificateArn: certificateArn,
    sslSupportMethod: 'sni-only',
    minimumProtocolVersion: 'TLSv1.2_2021',
  },
})

new aws.s3.BucketPolicy('content-policy', {
  bucket: contentBucket.id,
  policy: pulumi.all([contentBucket.arn, cdn.arn]).apply(([bucketArn, distArn]) =>
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'AllowCloudFrontRead',
          Effect: 'Allow',
          Principal: { Service: 'cloudfront.amazonaws.com' },
          Action: ['s3:GetObject'],
          Resource: [`${bucketArn}/*`],
          Condition: {
            StringEquals: {
              'AWS:SourceArn': distArn,
            },
          },
        },
      ],
    }),
  ),
})

function apexAliasRecord(name: string, distribution: aws.cloudfront.Distribution): void {
  const { subdomain } = getDomainParts(targetDomain)
  new aws.route53.Record(name, {
    name: subdomain === '' ? '' : subdomain,
    zoneId: hostedZoneId,
    type: aws.route53.RecordType.A,
    aliases: [
      {
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: false,
      },
    ],
  })
}

function wwwAliasRecord(distribution: aws.cloudfront.Distribution): void {
  new aws.route53.Record(`${safeSlug}-www-alias`, {
    name: 'www',
    zoneId: hostedZoneId,
    type: aws.route53.RecordType.A,
    aliases: [
      {
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: false,
      },
    ],
  })
}

apexAliasRecord(`${safeSlug}-apex`, cdn)

if (includeWWW) {
  wwwAliasRecord(cdn)
}

export const bucketName = contentBucket.bucket
export const cloudFrontDomain = cdn.domainName
export const siteUrl = `https://${targetDomain}/`
export const distributionId = cdn.id
