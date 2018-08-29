import Aws from 'aws-sdk'
import dnsimple from 'dnsimple'
import getConfig from 'src/config'

let config
let acm

const init = async () => {
  if (acm) return
  config = await getConfig()
  acm = new Aws.ACM({})
}

const getCertificateArn = async () => {
  const certs = await acm
    .listCertificates({
      CertificateStatuses: ['ISSUED', 'EXPIRED'],
    })
    .promise()
  console.log(certs)
  const matchingCerts = await Promise.all(
    certs.CertificateSummaryList.filter(
      c => c.DomainName === config.certificateDomainName,
    ).map(async c =>
      acm
        .describeCertificate({
          CertificateArn: c.CertificateArn,
        })
        .promise(),
    ),
  )
  if (matchingCerts.length !== 1)
    // todo once moved onto prod - this should be 1
    throw new Error(`expected 1 matching cert, got ${matchingCerts.length}`)

  const matchedCert = matchingCerts[0].Certificate

  const twoWeeks = 1000 * 60 * 60 * 24 * 28
  const timeToCheck = new Date(new Date().getTime() + twoWeeks)
  if (timeToCheck > matchedCert.NotAfter) {
    console.log('getting cert from dnsimple...')
    const client = dnsimple({
      accessToken: process.env.DNSIMPLE_TOKEN,
    })

    const dnsimpleCerts = await client.certificates.listCertificates(
      config.dnsimpleAccountId,
      config.dnsimpleDomainName,
    )
    const issuedAndRightDomain = dnsimpleCerts.data.filter(
      c =>
        c.common_name === 'www.nickmeldrum.com' &&
        c.state === 'issued' &&
        new Date(c.expires_on) > new Date(),
    )
    const latestDate = Math.max(
      ...issuedAndRightDomain.map(i => new Date(i.expires_on)),
    )
    const latestIssued = issuedAndRightDomain.find(
      i => Number(new Date(i.expires_on)) === latestDate,
    )
    console.log(latestIssued)
    const downloadedCert = await client.certificates.downloadCertificate(
      config.dnsimpleAccountId,
      config.dnsimpleDomainName,
      latestIssued.id,
    )

    const privateKeyData = await client.certificates.getCertificatePrivateKey(
      config.dnsimpleAccountId,
      config.dnsimpleDomainName,
      latestIssued.id,
    )

    console.log('importing new cert to acm...')
    const importDetails = await acm
      .importCertificate({
        // CertificateArn: matchedCert.CertificateArn, // to overwrite existing cert
        Certificate: downloadedCert.data.server,
        PrivateKey: privateKeyData.data.private_key,
        CertificateChain: downloadedCert.data.chain[0],
      })
      .promise()

    console.log(importDetails)
    return importDetails.CertificateArn
  }
  // valid cert - use it!
  return matchedCert.CertificateArn
}

export default async () => {
  await init()
  console.log('## update stack template with cert arn (updating as necessary) ##')

  const arn = await getCertificateArn()
  console.log(arn)
  return arn
}
